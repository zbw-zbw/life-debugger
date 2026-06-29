import { NextRequest } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { generateBugReport } from '@/lib/mockGenerator';
import { BugReport } from '@/types/bug';

// Input validation helper
function sanitizeInput(input: string): string {
  // Remove potential prompt injection attempts
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\b(system|assistant|user)\s*:/gi, '')
    .replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f]/g, '')
    .trim();
}

// Mock fallback response
function createMockStream(mockData: BugReport): ReadableStream {
  const encoder = new TextEncoder();
  const jsonStr = JSON.stringify(mockData);
  // Simulate streaming by sending chunks
  const chunks = jsonStr.match(/.{1,20}/g) || [jsonStr];

  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        const data = JSON.stringify({ choices: [{ delta: { content: chunk } }] });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        await new Promise(r => setTimeout(r, 80));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
}

export async function POST(request: NextRequest) {
  let description = '';
  try {
    const body = await request.json();
    description = sanitizeInput(body.description || '');
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validate input
  if (!description) {
    return new Response(
      JSON.stringify({ error: 'Description is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (description.length < 10) {
    return new Response(
      JSON.stringify({ error: 'Description too short (minimum 10 characters)' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (description.length > 2000) {
    return new Response(
      JSON.stringify({ error: 'Description too long (maximum 2000 characters)' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

  // If no API key, return mock data with a demo mode header
  if (!apiKey || apiKey === 'sk-xxxxx') {
    const mockReport = generateBugReport(description);
    const stream = createMockStream(mockReport);
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Demo-Mode': 'true',
      },
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: description },
        ],
        temperature: 0.8,
        max_tokens: 2000,
        stream: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('DeepSeek API error:', response.status, errorText);
      // Fallback to mock on API error
      const mockReport = generateBugReport(description);
      const stream = createMockStream(mockReport);
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Demo-Mode': 'true',
        },
      });
    }

    if (!response.body) {
      return new Response(
        JSON.stringify({ error: 'Empty response from AI engine' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Transform the SSE stream
    const reader = response.body.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data:')) continue;

              const dataStr = trimmed.slice(5).trim();
              if (dataStr === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              try {
                const data = JSON.parse(dataStr);
                const content = data.choices?.[0]?.delta?.content;
                if (content !== undefined) {
                  const forward = JSON.stringify({ choices: [{ delta: { content } }] });
                  controller.enqueue(encoder.encode(`data: ${forward}\n\n`));
                }
              } catch {
                // Skip malformed JSON lines
                continue;
              }
            }
          }
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API call error:', error);
    // Fallback to mock on network error
    const mockReport = generateBugReport(description);
    const stream = createMockStream(mockReport);
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Demo-Mode': 'true',
      },
    });
  }
}
