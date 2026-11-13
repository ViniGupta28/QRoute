/**
 * ToastNotification - Global overlay toast UI for Q-Route.
 * Renders a stack of soft, animated toasts at the bottom of the screen.
 */
import React from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ICONS = {
  success: <CheckCircle size={16} color="#059669" />,
  error: <AlertCircle size={16} color="#DC2626" />,
  info: <Info size={16} color="#2563EB" />,
};

const COLORS = {
  success: { bg: "#F0FDF4", border: "#BBF7D0", text: "#166534" },
  error:   { bg: "#FEF2F2", border: "#FECACA", text: "#991B1B" },
  info:    { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" },
};

export default function ToastNotification({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "90px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "calc(100% - 32px)",
      maxWidth: "420px",
      pointerEvents: "none",
    }}>
      {toasts.map(toast => {
        const c = COLORS[toast.type] || COLORS.success;
        return (
          <div
            key={toast.id}
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: "14px",
              padding: "11px 14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              animation: "slideUpToast 0.3s ease",
              pointerEvents: "auto",
            }}
          >
            {ICONS[toast.type] || ICONS.success}
            <span style={{ flex: 1, fontSize: "13px", fontWeight: "600", color: c.text }}>
              {toast.message}
            </span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: c.text, opacity: 0.6 }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
