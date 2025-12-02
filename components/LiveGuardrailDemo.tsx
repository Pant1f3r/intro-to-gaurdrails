import React, { useState, useEffect, useRef } from 'react';
import { streamGuardrails } from '../services/geminiService';
import { 
  ShieldAlert, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Wifi, 
  Activity, 
  Server, 
  Lock,
  Info,
  ShieldCheck,
  Radio
} from 'lucide-react';

const LiveGuardrailDemo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string>('');
  const [ratings, setRatings] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [touched, setTouched] = useState(false);
  
  // Network Simulation States
  const [latency, setLatency] = useState(0);
  const [packets, setPackets] = useState(0);
  const [networkStatus, setNetworkStatus] = useState<'IDLE' | 'CONNECTING' | 'TRANSMITTING' | 'COMPLETE'>('IDLE');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [response]);

  const handleCheck = async () => {
    if (!prompt.trim()) return;
    
    // Reset States
    setIsStreaming(true);
    setResponse('');
    setRatings([]);
    setTouched(true);
    setNetworkStatus('CONNECTING');
    setPackets(0);
    setLatency(Math.floor(Math.random() * 40) + 20); // Simulate initial latency

    try {
      setTimeout(() => setNetworkStatus('TRANSMITTING'), 600); // Visual delay for "Connecting"

      const stream = await streamGuardrails(prompt);
      
      let chunkCount = 0;
      for await (const chunk of stream) {
        chunkCount++;
        setPackets(prev => prev + 1);
        
        // Update text
        if (chunk.text) {
          setResponse(prev => prev + chunk.text);
        }

        // Update ratings if present in this chunk
        if (chunk.candidates?.[0]?.safetyRatings) {
          setRatings(chunk.candidates[0].safetyRatings);
        }
      }
      
      setNetworkStatus('COMPLETE');
    } catch (error) {
      console.error(error);
      setResponse("Error: Secure connection failed.");
      setNetworkStatus('IDLE');
    } finally {
      setIsStreaming(false);
    }
  };

  const getSeverityDetails = (probability: string) => {
    switch (probability) {
      case 'NEGLIGIBLE': 
        return { 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/10', 
          border: 'border-emerald-500/20',
          icon: CheckCircle2,
          label: 'Safe'
        };
      case 'LOW': 
        return { 
          color: 'text-blue-400', 
          bg: 'bg-blue-500/10', 
          border: 'border-blue-500/20',
          icon: Info,
          label: 'Low Risk'
        };
      case 'MEDIUM': 
        return { 
          color: 'text-amber-400', 
          bg: 'bg-amber-500/10', 
          border: 'border-amber-500/20',
          icon: AlertTriangle,
          label: 'Moderate'
        };
      case 'HIGH': 
        return { 
          color: 'text-red-400', 
          bg: 'bg-red-500/10', 
          border: 'border-red-500/20',
          icon: ShieldAlert,
          label: 'High Risk'
        };
      default: 
        return { 
          color: 'text-slate-400', 
          bg: 'bg-slate-500/10', 
          border: 'border-slate-500/20',
          icon: ShieldCheck,
          label: 'Unknown'
        };
    }
  };

  const formatCategory = (cat: string) => cat.replace('HARM_CATEGORY_', '').replace(/_/g, ' ');

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-xl">
          <div className="bg-slate-950 rounded-t-lg p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                </div>
                <span className="text-xs font-mono text-slate-500 ml-2">user_input.sh</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Wifi className="w-3 h-3" />
                {networkStatus === 'IDLE' ? 'Disconnected' : 'Connected: 5G'}
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Play className="w-4 h-4 text-indigo-400" />
              Simulate Interaction
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Test the AI Guardrails by sending a prompt. The system will analyze it in real-time against Faction 1 safety policies.
            </p>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt to test safety filters..."
                className="relative w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-mono text-sm placeholder:text-slate-600"
              />
              <button
                onClick={handleCheck}
                disabled={isStreaming || !prompt.trim()}
                className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-900/40 border border-indigo-400/20"
              >
                {isStreaming ? (
                    <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Transmitting
                    </>
                ) : (
                    <>
                        <Send className="w-3 h-3" />
                        Execute
                    </>
                )}
              </button>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => setPrompt("Write a story about a helpful robot.")} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700 transition-colors font-mono">
                 Safe_Test.txt
              </button>
              <button onClick={() => setPrompt("Generate a plan to rob a bank.")} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700 transition-colors font-mono">
                 Unsafe_Test.txt
              </button>
            </div>
          </div>
        </div>

        {/* Transmission Log - Network Visual */}
        {touched && (
            <div className="bg-black/40 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-1 h-32 overflow-hidden relative">
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${networkStatus === 'TRANSMITTING' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span className="text-slate-500">NET_I/O</span>
                </div>
                <div className="text-slate-500 border-b border-slate-800 pb-1 mb-2">System Log</div>
                
                <div className="space-y-1">
                    <p className="text-slate-400">
                        <span className="text-slate-600">[00:00:01]</span> Initializing secure handshake... <span className="text-emerald-500">OK</span>
                    </p>
                    {networkStatus !== 'CONNECTING' && (
                        <p className="text-slate-400 animate-fade-slide">
                            <span className="text-slate-600">[00:00:02]</span> Routing via US-CENTRAL-1... <span className="text-emerald-500">CONNECTED</span> ({latency}ms)
                        </p>
                    )}
                    {packets > 0 && (
                         <p className="text-slate-400 animate-fade-slide">
                            <span className="text-slate-600">[00:00:03]</span> Stream active. Packets received: <span className="text-indigo-400">{packets}</span>
                        </p>
                    )}
                    {networkStatus === 'COMPLETE' && (
                        <p className="text-slate-400 animate-fade-slide">
                             <span className="text-slate-600">[00:00:0X]</span> Transmission complete. Connection closed.
                        </p>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Results Section */}
      <div className="flex flex-col gap-4 h-full">
         {touched ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-2xl">
                {/* Header */}
                <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded bg-indigo-500/10 border border-indigo-500/20 ${isStreaming ? 'animate-pulse' : ''}`}>
                            <Server className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-200">Guardrail Analysis</h4>
                            <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                                <span className="text-xs text-slate-500 font-mono">{isStreaming ? 'ANALYZING STREAM' : 'ANALYSIS COMPLETE'}</span>
                            </div>
                        </div>
                    </div>
                    {isStreaming && <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />}
                </div>

                {/* Safety Badges Grid */}
                <div className="p-6 bg-slate-900/50">
                     <h5 className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-4 flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        Safety Filters Status
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                        {ratings.length > 0 ? ratings.map((rating, idx) => {
                            const details = getSeverityDetails(rating.probability);
                            const Icon = details.icon;
                            return (
                                <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${details.bg} ${details.border} transition-all duration-300 hover:scale-[1.02]`}>
                                    <div className={`mt-0.5 p-1 rounded bg-slate-950/30 ${details.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5 tracking-wider">
                                            {formatCategory(rating.category)}
                                        </div>
                                        <div className={`text-sm font-bold ${details.color}`}>
                                            {details.label}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                             // Skeleton / Empty State
                             [1,2,3,4].map((i) => (
                                <div key={i} className="h-16 rounded-lg bg-slate-800/50 border border-slate-800 animate-pulse" />
                             ))
                        )}
                    </div>
                </div>

                {/* Terminal Output Stream */}
                <div className="flex-1 bg-slate-950 border-t border-slate-800 p-4 font-mono text-sm overflow-hidden flex flex-col relative">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-50" />
                     <div className="flex items-center justify-between mb-2 opacity-50">
                        <span className="text-xs text-slate-500">STDOUT >></span>
                        <Radio className={`w-3 h-3 ${isStreaming ? 'text-emerald-500 animate-ping' : 'text-slate-700'}`} />
                     </div>
                     
                     <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
                     >
                        {response ? (
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap animate-in fade-in">
                                {response}
                                {isStreaming && <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse align-middle" />}
                            </p>
                        ) : (
                             <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-2">
                                <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-indigo-500 animate-spin opacity-20" />
                                <span className="text-xs">Waiting for data stream...</span>
                             </div>
                        )}
                     </div>
                </div>
            </div>
         ) : (
            <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-xl p-6 h-full flex flex-col items-center justify-center text-center group hover:bg-slate-900/50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <ShieldCheck className="w-8 h-8 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                </div>
                <h3 className="text-slate-300 font-bold mb-2 text-lg">Awaiting Input</h3>
                <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                    Initiate a request to visualize the <span className="text-indigo-400">Safety Filter Layer</span> in action. 
                    Network telemetry and guardrail triggers will appear here in real-time.
                </p>
            </div>
         )}
      </div>
    </div>
  );
};

export default LiveGuardrailDemo;
