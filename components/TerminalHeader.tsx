import React, { useState } from 'react';
import { Terminal, X, Minimize2, Maximize2, Search, Cpu } from 'lucide-react';

const TerminalHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-slate-900 border border-slate-700 p-2 rounded-md cursor-pointer hover:bg-slate-800 transition-colors z-50 shadow-lg"
      >
        <Terminal className="w-5 h-5 text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border-b border-slate-800 font-mono text-xs sm:text-sm text-slate-400 shadow-md">
      {/* Window Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-200">termux-session -- guardrails-init</span>
        </div>
        <div className="flex items-center gap-3">
          <Minimize2 className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setIsOpen(false)} />
          <Maximize2 className="w-3 h-3 cursor-pointer hover:text-white" />
          <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setIsOpen(false)} />
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="p-4 space-y-1 overflow-x-auto">
        <div className="flex">
            <span className="text-emerald-500 mr-2">➜</span>
            <span className="text-blue-400">~</span>
            <span className="ml-2 text-slate-300">cat AI_GUARDRAILS.txt</span>
        </div>
        <div className="pl-4 border-l-2 border-slate-800 ml-1 mt-2 space-y-1 text-slate-500">
            <p>Docs:       <span className="text-slate-400 underline decoration-slate-700">https://doc.termux.com</span></p>
            <p>Community:  <span className="text-slate-400 underline decoration-slate-700">https://community.termux.com</span></p>
            <p className="mt-2 text-yellow-600/80"># Loading system governance modules...</p>
            <p className="text-emerald-600/80"># [OK] Faction 1: Core Creators loaded.</p>
            <p className="text-emerald-600/80"># [OK] Faction 2: Enterprise Configurers loaded.</p>
            <p className="text-emerald-600/80"># [OK] Faction 3: Regulatory Oversight loaded.</p>
        </div>
        <div className="flex mt-2 animate-pulse">
            <span className="text-emerald-500 mr-2">➜</span>
            <span className="text-blue-400">~</span>
            <span className="ml-2 text-slate-100">_</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalHeader;