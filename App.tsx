import React, { useState } from 'react';
import { Faction, AppMode } from './types';
import { Shield, Building, Scale, Lock, Users, AlertTriangle, Play, LayoutGrid, FileText } from 'lucide-react';
import TerminalHeader from './components/TerminalHeader';
import FactionVisualizer from './components/FactionVisualizer';
import SummaryTable from './components/SummaryTable';
import LiveGuardrailDemo from './components/LiveGuardrailDemo';

// Static Data from the prompt
const FACTIONS_DATA: Faction[] = [
  {
    id: 'F1',
    name: 'The AI Developer',
    role: 'Core Creators',
    layer: 'Foundation',
    description: 'The entity building the model sets the baseline physics of the AI world. These are immutable rules that prevent the model from generating illegal or extremely harmful content at the source.',
    color: 'indigo',
    bgGradient: 'from-indigo-500 via-purple-500 to-blue-500',
    icon: Shield,
    policies: [
      {
        title: 'Acceptable Use Policies (AUPs)',
        description: 'Fundamental rules of engagement for the platform.',
        icon: FileText
      },
      {
        title: 'Content Filters',
        description: 'Automated classifiers that block content categories.',
        icon: Lock,
        subItems: ['Illegal Content (Exploitation, Terrorism)', 'Harmful Content (Hate Speech, Self-Harm)', 'Security (Malware generation, PII)']
      }
    ]
  },
  {
    id: 'F2',
    name: 'Customers & Organizations',
    role: 'The Configurers',
    layer: 'Deployment',
    description: 'Businesses and enterprises deploying the AI add a second layer of rules tailored to their industry, brand voice, and specific risk tolerance.',
    color: 'emerald',
    bgGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    icon: Building,
    policies: [
      {
        title: 'Custom Guardrails',
        description: 'Policies configured via APIs (e.g., Azure, Bedrock).',
        icon: LayoutGrid
      },
      {
        title: 'Process-Based Rules',
        description: 'Industry-specific constraints.',
        subItems: ['Strict PII policies for Banks', 'Brand safety for Advertisers'],
        icon: Users
      },
      {
        title: 'Human Review',
        description: 'Mandatory human-in-the-loop steps for sensitive outputs.',
        icon: Users
      }
    ]
  },
  {
    id: 'F3',
    name: 'Governments & Policymakers',
    role: 'The Regulators',
    layer: 'Oversight',
    description: 'The final, encompassing layer that defines the legal boundaries within which both creators and deployers must operate.',
    color: 'amber',
    bgGradient: 'from-amber-500 via-orange-500 to-red-500',
    icon: Scale,
    policies: [
      {
        title: 'Legal Frameworks',
        description: 'Major legislation defining AI boundaries.',
        subItems: ['EU AI Act', 'GDPR', 'HIPAA'],
        icon: Scale
      },
      {
        title: 'Mandates',
        description: 'Enforced requirements for operation.',
        subItems: ['Transparency disclosures', 'Due Process for moderation', 'Risk Mitigation standards'],
        icon: AlertTriangle
      }
    ]
  }
];

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.VISUALIZER);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <TerminalHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Intro Hero */}
        <div className="mb-12 text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 pb-2">
                AI Guardrails Ecosystem
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Understanding the multi-layered defense system governing Artificial Intelligence behavior, from core code to international law.
            </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex gap-1">
                <button 
                    onClick={() => setMode(AppMode.VISUALIZER)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === AppMode.VISUALIZER ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <LayoutGrid className="w-4 h-4" />
                    Explorer
                </button>
                <button 
                    onClick={() => setMode(AppMode.LIVE_DEMO)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === AppMode.LIVE_DEMO ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Play className="w-4 h-4" />
                    Live Demo
                </button>
                <button 
                    onClick={() => setMode(AppMode.SUMMARY)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === AppMode.SUMMARY ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <FileText className="w-4 h-4" />
                    Summary
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {mode === AppMode.VISUALIZER && (
                <FactionVisualizer factions={FACTIONS_DATA} />
            )}

            {mode === AppMode.LIVE_DEMO && (
                <LiveGuardrailDemo />
            )}

            {mode === AppMode.SUMMARY && (
                <div className="max-w-4xl mx-auto">
                    <SummaryTable factions={FACTIONS_DATA} />
                    <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                        <h4 className="font-bold text-slate-200 mb-2">Key Takeaway</h4>
                        <p className="text-slate-400 leading-relaxed">
                            Safety is not a single switch. It is a collaborative responsibility distributed across the 
                            <span className="text-indigo-400 font-bold"> creators</span> who build the models, the 
                            <span className="text-emerald-400 font-bold"> organizations</span> that deploy them, and the 
                            <span className="text-amber-400 font-bold"> governments</span> that regulate them.
                        </p>
                    </div>
                </div>
            )}
        </div>

      </main>

        <footer className="border-t border-slate-900 mt-20 py-8 text-center text-slate-600 text-sm">
            <p>© {new Date().getFullYear()} AI Guardrails Visualization</p>
            <p className="mt-1 opacity-50">Based on standard AI Governance Frameworks</p>
        </footer>
    </div>
  );
};

export default App;