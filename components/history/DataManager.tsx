'use client';

import { useRef, useState, useCallback } from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Toast, { ToastData } from '@/components/ui/Toast';
import { useToastId } from '@/hooks/useToastId';
import { DownloadIcon, UploadIcon } from '@/components/ui/Icon';
import type { BugStoreData } from '@/hooks/useBugStore';

interface DataManagerProps {
  data: BugStoreData;
  onImport: (data: BugStoreData) => void;
}

export default function DataManager({ data, onImport }: DataManagerProps) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [importTarget, setImportTarget] = useState<BugStoreData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextToastId = useToastId();

  const showToast = useCallback((type: ToastData['type'], message: string) => {
    setToast({ id: nextToastId(), type, message });
  }, [nextToastId]);

  const handleExport = () => {
    try {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `life-debugger-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('success', '数据已导出');
    } catch {
      showToast('error', '导出失败');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!parsed.bugs || !Array.isArray(parsed.bugs)) {
          showToast('error', '文件格式不正确：缺少 bugs 数组');
          return;
        }
        setImportTarget(parsed as BugStoreData);
      } catch {
        showToast('error', '文件解析失败，请确保是有效的 JSON');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmImport = () => {
    if (!importTarget) return;
    onImport(importTarget);
    showToast('success', '数据导入成功');
    setImportTarget(null);
  };

  return (
    <>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      <ConfirmDialog
        open={importTarget !== null}
        title="确认导入"
        message="导入将覆盖当前所有数据。确定要继续吗？"
        confirmLabel="覆盖导入"
        cancelLabel="取消"
        variant="danger"
        onConfirm={confirmImport}
        onCancel={() => setImportTarget(null)}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={handleExport}
          className="btn-primary inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-mono text-xs transition-all duration-200 hover:border-[var(--green)] hover:text-[var(--green)]"
          title="导出数据"
        >
          <DownloadIcon size={14} />
          <span>导出</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-mono text-xs transition-all duration-200 hover:border-[var(--blue)] hover:text-[var(--blue)]"
          title="导入数据"
        >
          <UploadIcon size={14} />
          <span>导入</span>
        </button>
      </div>
    </>
  );
}
