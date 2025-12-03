import React, { useState, useEffect } from 'react';
import { AgentLog, Vulnerability } from '../types';
import { ShieldAlert, CheckCircle, Shield, Activity, Search, Globe, ArrowRight, Loader2, FileText, Cpu, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AgentVisualizer } from './AgentVisualizer';
import { agentSystem } from '../services/agentSystem';
import { useNavigate } from 'react-router-dom';

const MOCK_DATA = [
  { name: 'Mon', threats: 4 },
  { name: 'Tue', threats: 3 },
  { name: 'Wed', threats: 7 },
  { name: 'Thu', threats: 2 },
  { name: 'Fri', threats: 5 },
  { name: 'Sat', threats: 1 },
  { name: 'Sun', threats: 0 },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string; sub: string }> = ({ title, value, icon: Icon, color, sub }) => (
  <div className="bg-surface border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    <p className="text-xs text-slate-500">{sub}</p>
  </div>
);

export const Dashboard: React.FC<{ onNavigate?: (page: string) => void }> = () => {
  const navigate = useNavigate();
  const [targetUrl, setTargetUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [activeLogs, setActiveLogs] = useState<AgentLog[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [vulnerabilitiesFound, setVulnerabilitiesFound] = useState<Vulnerability[]>([]);
  const [scanComplete, setScanComplete] = useState(false);
  
  const activeModules = agentSystem.getCheckList();

  // Subscribe to Agent System updates
  useEffect(() => {
    const unsubscribe = agentSystem.subscribe((log, progress, vulns) => {
        setActiveLogs(prev => [...prev, log]);
        setScanProgress(progress);
        setVulnerabilitiesFound(vulns);
        
        if (progress === 100) {
            setIsScanning(false);
            setScanComplete(true);
        }
    });
    return unsubscribe;
  }, []);

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;
    
    setIsScanning(true);
    setScanComplete(false);
    setActiveLogs([]); // Clear previous logs
    setScanProgress(0);
    agentSystem.startMission(targetUrl);
  };

  const handleViewReport = () => {
    navigate('/scan');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Mission Control</h1>
          <p className="text-slate-400 mt-1">Deploy autonomous agents to secure your assets.</p>
        </div>
      </div>

      {/* Target Acquisition Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Target Acquisition
            </h2>
            <p className="text-slate-400 mb-6 text-sm">
                Enter a URL to dispatch the multi-agent team. Agents will map, find flaws, and remediate vulnerabilities autonomously.
            </p>
            
            <form onSubmit={handleStartScan} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                        type="url" 
                        placeholder="https://example.com"
                        className="w-full bg-black/30 border border-slate-600 rounded-lg py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        required
                        disabled={isScanning}
                    />
                </div>
                <button 
                    type="submit"
                    disabled={isScanning}
                    className="bg-primary hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                >
                    {isScanning ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Deploying...
                        </>
                    ) : (
                        <>
                            Deploy Agents <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            {/* Active Modules Display */}
            {!scanComplete && !isScanning && (
                <div className="mt-6 border-t border-slate-700/50 pt-4">
                    <p className="text-xs text-slate-500 font-mono uppercase mb-2 flex items-center gap-2">
                        <Cpu className="w-3 h-3" /> Active Security Modules ({activeModules.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {activeModules.map((m, i) => (
                            <span key={i} className="text-[10px] bg-slate-950 border border-slate-700 text-slate-400 px-2 py-1 rounded-full hover:border-slate-500 hover:text-slate-200 transition-colors cursor-default">
                                {m.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {scanComplete && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500 rounded-full text-slate-950">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-bold">Mission Complete</p>
                                <p className="text-sm text-slate-400">
                                    {vulnerabilitiesFound.length} vulnerabilities detected and analyzed.
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={handleViewReport}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/10 transition-colors"
                        >
                            <FileText className="w-4 h-4" /> View Remediation Report
                        </button>
                    </div>
                </div>
            )}
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
             <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Agent Feed */}
        <div className="lg:col-span-2">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Live Agent Operations
            </h3>
            <AgentVisualizer logs={activeLogs} targetUrl={targetUrl} />
        </div>

        {/* Stats Column */}
        <div className="space-y-6">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Threat Landscape
            </h3>
            
            <StatCard 
                title="Security Score" 
                value={vulnerabilitiesFound.length > 0 ? String(Math.max(0, 100 - (vulnerabilitiesFound.length * 15))) : "100"} 
                icon={Shield} 
                color={vulnerabilitiesFound.length > 0 ? "text-red-500" : "text-emerald-500"}
                sub="Real-time Assessment"
            />
            
            <StatCard 
                title="Active Threats" 
                value={String(vulnerabilitiesFound.length)} 
                icon={ShieldAlert} 
                color="text-amber-500" 
                sub={`${vulnerabilitiesFound.filter(v => v.severity === 'Critical').length} Critical Issues`}
            />

            <div className="bg-surface border border-slate-800 p-6 rounded-xl">
                <p className="text-slate-400 text-sm font-medium mb-4">Threat Trends (7 Days)</p>
                <div className="h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_DATA}>
                            <defs>
                                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#ef4444' }}
                            />
                            <Area type="monotone" dataKey="threats" stroke="#ef4444" fillOpacity={1} fill="url(#colorThreats)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
