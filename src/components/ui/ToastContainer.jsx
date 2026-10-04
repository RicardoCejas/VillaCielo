import React from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, Sparkles, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useApp();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md text-sm ${
              toast.type === 'success'
                ? 'bg-[#173b32]/95 text-white border-moss/30'
                : 'bg-white/95 text-ink border-line'
            }`}
          >
            <span className="mt-0.5 shrink-0">
              {toast.type === 'success' ? (
                <Sparkles className="w-5 h-5 text-sun animate-pulse" />
              ) : (
                <Info className="w-5 h-5 text-moss" />
              )}
            </span>
            <div className="flex-1 pr-1">
              <strong className="block font-semibold text-xs leading-snug">
                {toast.title}
              </strong>
              {toast.message && (
                <p className="text-[11px] opacity-85 mt-0.5 leading-tight">
                  {toast.message}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
