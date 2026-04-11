import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, User } from 'lucide-react';

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am Sahay, your academic counselor. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    const currentHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input, history: currentHistory })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to get response.');

      setMessages(prev => [...prev, { sender: 'bot', text: data.response || data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: "I'm having a bit of trouble connecting to my brain. Try again in a second!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-28 right-8 bg-slate-900/80 backdrop-blur-xl w-[400px] h-[600px] rounded-3xl shadow-2xl border border-white/10 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-5 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Bot size={20} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Sahay AI</h2>
            <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-widest">Counselor Online</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <X size={20} className="text-slate-400 hover:text-white" />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-2 h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
                {msg.sender === 'user' ? <User size={14} className="text-indigo-400" /> : <Bot size={14} className="text-emerald-400" />}
              </div>
              <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800 rounded-2xl px-4 py-2.5">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-5 bg-white/5 border-t border-white/5">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={isLoading ? "Thinking..." : "Type your query..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-slate-800/50 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="absolute right-2 p-2 text-emerald-400 hover:text-emerald-300 disabled:text-slate-600 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;