import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImagePreviewModalProps {
  isOpen: boolean;
  src: string | null;
  title?: string;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  src,
  title = 'Image Preview',
  onClose,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && src && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 select-none">
          {/* Dark backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl p-3 sm:p-4 shadow-2xl z-10 overflow-hidden flex flex-col items-center justify-center"
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between px-3 py-2 border-b border-zinc-900 mb-2">
              <span className="text-xs font-bold text-zinc-300 tracking-wide uppercase">
                {title}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                aria-label="Close image preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image Preview Container */}
            <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-black/60 p-2">
              <img
                src={src}
                alt={title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition duration-300 hover:scale-[1.01]"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImagePreviewModal;
