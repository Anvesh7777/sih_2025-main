import React from 'react';
import { MessageSquareText } from 'lucide-react';

function ChatIcon({ onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 z-50 ${
        isOpen 
        ? 'bg-slate-700 text-white rotate-90' 
        : 'bg-emerald-500 text-slate-900 shadow-emerald-500/20'
      }`}
      aria-label="Open counseling assistant"
    >
      <MessageSquareText size={28} />
      {!isOpen && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
        </span>
      )}
    </button>
  );
}

export default ChatIcon;