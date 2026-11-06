import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LuCheck,
  LuInfo,
  LuTriangleAlert,
  LuX
} from 'react-icons/lu';

const Toast = () => {
  const { toast, setToast } = useApp();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        background: 'var(--bg-surface-elevated)',
        border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.4)' : isError ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        color: 'var(--text-primary)',
        fontSize: 13,
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      {isSuccess && <LuCheck size={16} style={{ color: 'var(--accent-emerald)' }} />}
      {isError && <LuTriangleAlert size={16} style={{ color: 'var(--accent-rose)' }} />}
      {!isSuccess && !isError && <LuInfo size={16} style={{ color: 'var(--accent-cyan)' }} />}
      
      <span style={{ fontWeight: 500 }}>{toast.message}</span>

      <button
        onClick={() => setToast(null)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 6
        }}
      >
        <LuX size={14} />
      </button>
    </div>
  );
};

export default Toast;

