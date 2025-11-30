import React, { useState } from 'react';
import { checkGuardrails } from '../services/geminiService';
import { ShieldAlert, Send, Loader2, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

const LiveGuardrailDemo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleCheck = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResponse(null);
    setRatings([]);
    setTouched(true);

    const result = await checkGuardrails(prompt);
    
    setResponse(result.text);
    setRatings(result.safetyRatings || []);
    setIsLoading(false);
  };

  const getRatingColor = (probability: string) => {
    switch (probability) {
      case 'NEGLIGIBLE': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'LOW': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'MEDIUM': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'HIGH': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Play className="w-5 h-5 text-indigo-400" />
            Simulate User Prompt
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Enter a prompt to see how "Faction 1" (AI Developer) automated filters analyze content in real-time.
            <br/><span className="text-xs text-slate-500 italic">Powered by Gemini API Safety Filters.</span>
          </p>

          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., How do I break into a car? (Try something risky to see filters active)"
              className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
            />
            <button
              onClick={handleCheck}
              disabled={isLoading || !prompt.trim()}
              className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Run Check
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => setPrompt("Write a poem about cyber security.")} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 transition-colors">
               Safe: "Poem about security"
            </button>
            <button onClick={() => setPrompt("Explain how to make a dangerous chemical.")} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 transition-colors">
               Risky: "Dangerous chemicals"
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex flex-col gap-4">
         {touched ? (
            <div className={`bg-slate-900 border ${isLoading ? 'border-slate-800' : 'border-indigo-500/30'} rounded-xl p-6 h-full flex flex-col transition-all duration-300 relative overflow-hidden`}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <p className="text-sm font-mono">Analyzing content safety layers...</p>
                    </div>
                ) : (
                    <>
                         <div className="mb-6">
                            <h4 className="text-sm uppercase tracking-wider font-bold text-slate-500 mb-3 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" />
                                Automated Safety Analysis
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {ratings.length > 0 ? ratings.map((rating, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg border flex items-center justify-between ${getRatingColor(rating.probability)}`}>
                                        <span className="text-xs font-bold truncate max-w-[120px] capitalize">{rating.category.replace('HARM_CATEGORY_', '').toLowerCase().replace('_', ' ')}</span>
                                        <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded">{rating.probability}</span>
                                    </div>
                                )) : (
                                    <div className="col-span-2 text-slate-400 text-sm italic p-2 border border-dashed border-slate-700 rounded">
                                        No specific safety flags returned. Content appears benign.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-y-auto max-h-[300px]">
                            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">Model Output</h4>
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                                {response}
                            </p>
                        </div>
                    </>
                )}
            </div>
         ) : (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-6 h-full flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-12 h-12 text-slate-700 mb-4" />
                <h3 className="text-slate-400 font-bold mb-2">Ready for Inspection</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                    Content passed here is evaluated against Faction 1's core content filters before generation.
                </p>
            </div>
         )}
      </div>
    </div>
  );
};

export default LiveGuardrailDemo;