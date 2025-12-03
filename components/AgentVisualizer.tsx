import React, { useEffect, useRef } from 'react';
import { AgentLog } from '../types';
import { Terminal, Shield, Search, Zap, Database, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AGENTS = [
  { name: 'Recon', icon: Search, color: 'text-blue-400', desc: 'Finding the Target' },
  { name: 'Scanner', icon: Shield, color: 'text-emerald-400', desc: 'Finding the Flaw' },
  { name: 'Patcher', icon: Zap, color: 'text-yellow-400', desc: 'Autonomous Remediation' },
  { name: 'Memory', icon: Database, color: 'text-purple-400', desc: 'Pattern Improvement' },
];

interface AgentVisualizerProps {
  logs?: AgentLog[];
  targetUrl?: string;
}

export const AgentVisualizer: React.FC<AgentVisualizerProps> = ({ logs = [], targetUrl = "Waiting for input..." }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Determine active agent based on the latest log
  const lastLog = logs[logs.length - 1];
  const activeAgentIndex = lastLog 
    ? AGENTS.findIndex(a => a.name === lastLog.agentName)
    : -1;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto md:h-[420px]">
      {/* Left: Agent Pipeline */}
      <div className="w-full md:w-1/3 bg-slate-950 p-4 md:p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col">
        <h3 className="text-xs font-mono text-slate-400 mb-4 md:mb-6 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4" /> Operations Pipeline
        </h3>
        
        <div className="flex-1 space-y-4 md:space-y-6 relative mb-4 md:mb-0">
             {/* Connector Line */}
            <div className="absolute left-5 top-4 bottom-8 w-0.5 bg-slate-800 z-0 hidden md:block"></div>

            {AGENTS.map((agent, idx) => {
                const isActive = idx === activeAgentIndex;
                const isPast = activeAgentIndex > -1 && idx < activeAgentIndex;
                const Icon = agent.icon;
                
                return (
                <div key={agent.name} className="relative z-10 flex items-center space-x-4">
                    <div className={`
                        p-2 rounded-lg transition-all duration-300 border flex-shrink-0
                        ${isActive ? `bg-slate-800 border-${agent.color.split('-')[1]}-500 shadow-lg shadow-${agent.color.split('-')[1]}-500/20` : 'bg-slate-900 border-slate-800'}
                        ${isPast ? 'opacity-50' : 'opacity-100'}
                    `}>
                        <Icon className={`w-5 h-5 ${isActive ? agent.color : 'text-slate-600'}`} />
                    </div>
                    <div>
                        <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>{agent.desc}</div>
                        <div className="text-xs text-slate-600 font-mono hidden sm:block">{agent.name} Agent</div>
                    </div>
                </div>
                );
            })}
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-800">
             <div className="flex items-center space-x-2 text-xs text-emerald-500">
                <div className={`w-2 h-2 bg-emerald-500 rounded-full ${activeAgentIndex > -1 ? 'animate-pulse' : 'opacity-20'}`}></div>
                <span className="font-mono truncate max-w-[200px]">{targetUrl || "IDLE"}</span>
             </div>
        </div>
      </div>

      {/* Right: Terminal Output */}
      <div className="w-full md:w-2/3 bg-black p-4 md:p-6 font-mono text-sm relative flex flex-col h-[300px] md:h-auto">
        <div className="h-8 flex items-center justify-between border-b border-slate-800 pb-2 mb-4 shrink-0">
            <div className="flex items-center text-slate-500">
                <Terminal className="w-4 h-4 mr-2" />
                <span className="text-xs">agent_execution_log.sh</span>
            </div>
            <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar" ref={logContainerRef}>
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 text-xs md:text-sm"
              >
                <span className="text-slate-700 shrink-0 select-none hidden sm:inline">
                    {log.timestamp.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                </span>
                
                <div className="flex-1 font-mono break-all">
                    <span className={`uppercase font-bold mr-2
                        ${log.agentName === 'Recon' ? 'text-blue-500' : ''}
                        ${log.agentName === 'Scanner' ? 'text-emerald-500' : ''}
                        ${log.agentName === 'Patcher' ? 'text-yellow-500' : ''}
                        ${log.agentName === 'Memory' ? 'text-purple-500' : ''}
                    `}>
                        {log.agentName}:
                    </span>
                    <span className={`
                        ${log.status === 'error' ? 'text-red-400 font-bold' : ''}
                        ${log.status === 'success' ? 'text-emerald-400' : 'text-slate-300'}
                        ${log.status === 'warning' ? 'text-amber-400' : ''}
                    `}>
                        {log.message}
                    </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
              <div className="text-slate-600 italic">
                System Standby. Awaiting Mission Coordinates...
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
