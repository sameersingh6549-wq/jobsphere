import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: {
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.4)',
      color: '#34D399',
      icon: <CheckCircle2 size={20} color="#34D399" />,
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.4)',
      color: '#F87171',
      icon: <AlertCircle size={20} color="#F87171" />,
    },
    info: {
      bg: 'rgba(99, 102, 241, 0.15)',
      border: 'rgba(99, 102, 241, 0.4)',
      color: '#818CF8',
      icon: <Info size={20} color="#818CF8" />,
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1.25rem',
        background: current.bg,
        border: `1px solid ${current.border}`,
        borderRadius: '12px',
        backdropFilter: 'blur(12px)',
        color: current.color,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        maxWidth: '400px',
      }}
    >
      {current.icon}
      <span style={{ fontSize: '0.9rem', fontWeight: 500, flexGrow: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: current.color,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
