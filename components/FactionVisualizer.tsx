import React, { useState } from 'react';
import { Faction } from '../types';
import { Shield, ChevronRight, Lock, Eye, Gavel, FileText, Server, Users } from 'lucide-react';

interface FactionVisualizerProps {
  factions: Faction[];
}

const FactionVisualizer: React.FC<FactionVisualizerProps> = ({ factions }) => {
  const [activeFactionId, setActiveFactionId] = useState<string>(factions[0].id);

  const activeFaction = factions.find(f => f.id === activeFactionId) || factions[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
      {/* Left: Layer Navigation */}
      <div className="lg:w-1/3 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-200 mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Security Layers
        </h2>
        {factions.map((faction) => {
            const isActive = faction.id === activeFactionId;
            const Icon = faction.icon;
            
            return (
                <button
                    key={faction.id}
                    onClick={() => setActiveFactionId(faction.id)}
                    className={`
                        relative group overflow-hidden rounded-xl p-6 text-left transition-all duration-300 border
                        ${isActive 
                            ? `border-${faction.color}-500 bg-slate-800/80 shadow-[0_0_20px_rgba(0,0,0,0.3)] scale-[1.02]` 
                            : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-600'
                        }
                    `}
                >
                    <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${faction.bgGradient} transition-opacity duration-500 ${isActive ? 'opacity-20' : ''}`} />
                    
                    <div className="relative z-10 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg bg-slate-950/50 border border-slate-700 ${isActive ? `text-${faction.color}-400` : 'text-slate-500'}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isActive ? `text-${faction.color}-400` : 'text-slate-500'}`}>
                                    {faction.layer} Layer
                                </p>
                                <h3 className={`text-lg font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                    {faction.name}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">
                                    {faction.role}
                                </p>
                            </div>
                        </div>
                        {isActive && <ChevronRight className={`w-5 h-5 text-${faction.color}-400 animate-pulse`} />}
                    </div>
                </button>
            );
        })}
      </div>

      {/* Right: Details Pane */}
      <div className="lg:w-2/3 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 relative overflow-hidden flex flex-col">
        {/* Background decorative elements */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-${activeFaction.color}-500/10 blur-[100px] rounded-full pointer-events-none transition-colors duration-700`} />
        
        <div className="relative z-10 animate-fade-slide" key={activeFaction.id}>
            <div className="flex items-center gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold bg-${activeFaction.color}-500/10 text-${activeFaction.color}-400 border border-${activeFaction.color}-500/20`}>
                    ID: {activeFaction.id}
                </span>
                <span className="text-slate-500 text-sm font-mono">
                    STATUS: ACTIVE
                </span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
                {activeFaction.role}
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-2xl">
                {activeFaction.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                {activeFaction.policies.map((policy, idx) => (
                    <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            {policy.icon && <policy.icon className={`w-5 h-5 text-${activeFaction.color}-400`} />}
                            <h4 className="text-slate-200 font-bold">{policy.title}</h4>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">
                            {policy.description}
                        </p>
                        {policy.subItems && (
                            <ul className="space-y-2">
                                {policy.subItems.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                                        <div className={`w-1 h-1 rounded-full mt-1.5 bg-${activeFaction.color}-500`} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default FactionVisualizer;