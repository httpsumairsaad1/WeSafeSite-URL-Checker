
import React, { useState, useEffect } from 'react';
import { AgentVisualizer } from '../components/AgentVisualizer';
import { 
  Shield, Zap, Search, Lock, ArrowRight, CheckCircle2, 
  Globe, Server, Settings, Cpu, FileText, ScanSearch,
  Database, Code, Network, AlertTriangle, X, Linkedin, Instagram, Palette, Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentLog } from '../types';

const PIPELINE_STEPS = [
  { 
    id: 0, 
    icon: Globe, 
    title: "Target Input", 
    desc: "User provides URL endpoint for analysis",
    color: "text-blue-400",
    dataStream: "01001011001010010110101010110010100100110101010101001011001",
    dataColor: "text-blue-500/50"
  },
  { 
    id: 1, 
    icon: Server, 
    title: "Intel Fetch", 
    desc: "Recon agent maps site architecture",
    color: "text-indigo-400",
    dataStream: "GET_HEAD_POST_200_OK_404_ERR_DNS_RESOLVE_PORT_80_443_OPEN",
    dataColor: "text-indigo-500/50"
  },
  { 
    id: 2, 
    icon: Settings, 
    title: "Config Check", 
    desc: " Analyzing environment & headers",
    color: "text-purple-400",
    dataStream: "ENV_VAR_CHECK_SSL_TLS_1.3_HSTS_X_FRAME_CSP_POLICY_VALID",
    dataColor: "text-purple-500/50"
  },
  { 
    id: 3, 
    icon: Cpu, 
    title: "Agentic AI", 
    desc: "Core logic determines attack vectors",
    color: "text-emerald-400",
    dataStream: "AI_MODEL_INIT_PROMPT_GEN_CONTEXT_LOAD_VULN_PREDICT_SCORE_98",
    dataColor: "text-emerald-500/50"
  },
  { 
    id: 4, 
    icon: ScanSearch, 
    title: "Deep Scan", 
    desc: "Verifying specific vulnerabilities",
    color: "text-orange-400",
    dataStream: "SQL_INJECT_TEST_XSS_PAYLOAD_EXEC_AUTH_BYPASS_ATTEMPT_FAIL",
    dataColor: "text-orange-500/50"
  },
  { 
    id: 5, 
    icon: FileText, 
    title: "Remediation", 
    desc: "Generating & explaining fixes",
    color: "text-teal-400",
    dataStream: "PATCH_GEN_SUCCESS_APPLY_FIX_CODE_REWRITE_SECURE_COMMIT_GIT",
    dataColor: "text-teal-500/50"
  }
];

const THREAT_KNOWLEDGE = [
  {
    icon: Database,
    title: "SQL Injection (SQLi)",
    simple: "Like tricking a guard into giving you the keys to the file cabinet by asking a confusing question.",
    tech: "Insertion of malicious SQL queries via input data from the client to the application."
  },
  {
    icon: Code,
    title: "Cross-Site Scripting (XSS)",
    simple: "Leaving a digital sticky note on a website that forces everyone who reads it to do something dangerous.",
    tech: "Injecting malicious client-side scripts into web pages viewed by other users."
  },
  {
    icon: Network,
    title: "Man-in-the-Middle (MitM)",
    simple: "A secret listener eavesdropping on a private conversation and relaying messages between two people.",
    tech: "Attacker secretly intercepts and relays communications between two parties who believe they are communicating directly."
  },
  {
    icon: AlertTriangle,
    title: "Zero-Day Exploit",
    simple: "Breaking in through a secret door that the builder of the house doesn't even know exists yet.",
    tech: "Cyberattack that occurs on the same day a weakness is discovered in software, before a fix is released."
  }
];

const AboutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">About WeSafeSite</h2>
                                <p className="text-sm text-slate-400">Architecting the future of autonomous defense.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-mono uppercase text-emerald-500 font-bold mb-2">Our Vision</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        To democratize enterprise-grade cybersecurity. We believe that powerful, autonomous protection should be accessible to every developer, ensuring a safer internet for everyone.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-mono uppercase text-blue-500 font-bold mb-2">Our Mission</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Building a swarm of intelligent agents that don't just detect threats, but understand and fix them—closing the gap between vulnerability discovery and remediation.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 p-[2px] mb-4">
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                        <Code className="w-10 h-10 text-slate-400" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white">Umair Saad</h3>
                                <p className="text-xs text-emerald-400 font-mono mb-4">Lead Architect & Developer</p>
                                
                                <div className="flex gap-3">
                                    <a 
                                        href="https://www.linkedin.com/in/umair-saad-mob-app-dev/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 bg-slate-900 rounded-lg border border-slate-700 hover:border-blue-500 hover:text-blue-400 text-slate-400 transition-all"
                                        title="LinkedIn"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                    <a 
                                        href="https://www.instagram.com/umairsaad_" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 bg-slate-900 rounded-lg border border-slate-700 hover:border-pink-500 hover:text-pink-400 text-slate-400 transition-all"
                                        title="Instagram"
                                    >
                                        <Instagram className="w-4 h-4" />
                                    </a>
                                    <a 
                                        href="https://www.behance.net/umairsaad2" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 bg-slate-900 rounded-lg border border-slate-700 hover:border-blue-400 hover:text-blue-400 text-slate-400 transition-all"
                                        title="Behance"
                                    >
                                        <Palette className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 text-center">
                            <p className="text-xs text-slate-500">
                                "Security is not a product, but a process."
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [demoLogs, setDemoLogs] = useState<AgentLog[]>([]);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Horizontal Pipeline Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 3000); // 3 seconds per step to allow reading
    return () => clearInterval(interval);
  }, []);

  // Hero Section Agent Simulation Loop
  useEffect(() => {
    const sequence = [
        { agent: 'Recon', msg: 'Initializing scan on demo-target.com...', status: 'info' },
        { agent: 'Recon', msg: 'Map complete: 14 endpoints found.', status: 'success' },
        { agent: 'Scanner', msg: 'Testing for SQL Injection...', status: 'info' },
        { agent: 'Scanner', msg: 'CRITICAL: SQLi found at /login', status: 'error' },
        { agent: 'Patcher', msg: 'Analysing vulnerability context...', status: 'warning' },
        { agent: 'Patcher', msg: 'Drafting secure code fix...', status: 'info' },
        { agent: 'Patcher', msg: 'Patch verified and ready.', status: 'success' },
        { agent: 'Memory', msg: 'Scan signature stored to database.', status: 'info' },
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
        setDemoLogs(prev => {
            // Reset if we have too many logs to keep it clean, or at end of sequence
            if (currentIndex >= sequence.length) {
                currentIndex = 0;
                return []; 
            }

            const step = sequence[currentIndex];
            const newLog: AgentLog = {
                id: Math.random().toString(),
                agentName: step.agent as any,
                message: step.msg,
                status: step.status as any,
                timestamp: new Date()
            };
            
            currentIndex++;
            return [...prev, newLog];
        });
    }, 1200); // Speed of chat updates

    return () => clearInterval(interval);
  }, []);

  const handleSignIn = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    navigate('/login?mode=signup');
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
            <Shield className="w-6 h-6" />
            <span>WeSafeSite</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
             <button 
                onClick={() => setIsAboutOpen(true)}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
             >
                About
             </button>
             <button 
                onClick={handleSignIn}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
                Sign In
            </button>
            <button 
                onClick={handleGetStarted}
                className="bg-white text-slate-950 px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors"
            >
                Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-300 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
             {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="md:hidden bg-slate-950 border-b border-slate-800 overflow-hidden"
                >
                    <div className="flex flex-col p-6 space-y-4">
                        <button onClick={() => { setIsAboutOpen(true); setIsMobileMenuOpen(false); }} className="text-left text-slate-300 py-2">About</button>
                        <button onClick={handleSignIn} className="text-left text-slate-300 py-2">Sign In</button>
                        <button onClick={handleGetStarted} className="bg-white text-slate-950 px-4 py-3 rounded-lg font-bold text-center">Get Started</button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden px-4 md:px-0">
         {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/20 blur-[80px] md:blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-primary text-xs md:text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Autonomous Security Agents v2.0 Live
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Sees Everything. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                Fixes Everything.
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
              Don't just find vulnerabilities—fix them before attackers strike. 
              Our multi-agent AI team continuously maps, tests, and patches your web applications 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <button onClick={handleGetStarted} className="flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-slate-950 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-emerald-500/20 w-full sm:w-auto">
                    Start Free Scan <ArrowRight className="w-5 h-5" />
               </button>
               <button onClick={handleSignIn} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all border border-slate-700 w-full sm:w-auto">
                    View Demo
               </button>
            </div>
            
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-slate-500 pt-4">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-400" /> No code required
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-400" /> 5-min setup
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-400" /> SOC2 Compliant
                </div>
            </div>
          </div>

          {/* Hero Visualizer */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200 mt-8 lg:mt-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl blur opacity-20"></div>
            <AgentVisualizer logs={demoLogs} targetUrl="demo-target.com" />
          </div>
        </div>
      </section>

      {/* WORKFLOW PIPELINE ANIMATION SECTION */}
      <section className="py-16 md:py-24 bg-slate-900/30 border-t border-b border-slate-800 relative overflow-hidden">
        {/* Subtle grid bg for this section */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12 md:mb-20">
             <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works: The Autonomous Pipeline</h2>
             <p className="text-slate-400">Watch how our agents process your security posture in real-time.</p>
          </div>

          {/* Scrollable Container for Mobile */}
          <div className="overflow-x-auto pb-8 -mx-6 px-6 md:overflow-visible md:pb-0 md:px-0 scrollbar-hide">
            <div className="relative min-w-[800px] md:min-w-0 max-w-6xl mx-auto py-12">
                
                {/* 1. Background Track (Faint Binary) */}
                <div className="absolute top-[40px] left-0 w-full h-1 bg-slate-800/50 rounded-full flex overflow-hidden">
                    <div className="w-full text-[10px] text-slate-700 font-mono tracking-widest whitespace-nowrap opacity-20 select-none">
                        01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
                    </div>
                </div>

                {/* 2. Active Data Stream (The "Edge Line") */}
                <div 
                    className="absolute top-[32px] left-0 h-5 overflow-hidden transition-all duration-700 ease-in-out"
                    style={{ width: `${(activeStep / (PIPELINE_STEPS.length - 1)) * 100}%` }}
                >
                    {/* The flowing data effect */}
                    <motion.div 
                        className={`h-full flex items-center whitespace-nowrap font-mono text-[10px] font-bold tracking-widest ${PIPELINE_STEPS[activeStep].dataColor}`}
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    >
                        {/* Repeat string to ensure seamless loop */}
                        {Array(20).fill(PIPELINE_STEPS[activeStep].dataStream).join(' -- ')}
                    </motion.div>
                    
                    {/* Glow overlay for the line */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-current opacity-20"></div>
                </div>

                {/* 3. The Nodes */}
                <div className="relative flex justify-between items-start z-10 w-full">
                {PIPELINE_STEPS.map((step, index) => {
                    const isActive = index === activeStep;
                    const isPast = index < activeStep;
                    const Icon = step.icon;

                    return (
                    <div key={step.id} className="flex flex-col items-center group cursor-default relative" style={{ width: '14%' }}>
                        {/* Node Circle */}
                        <motion.div 
                        className={`
                            w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border-2 mb-6 bg-slate-950 relative z-20 transition-colors duration-500
                            ${isActive ? `border-${step.color.split('-')[1]}-500 shadow-[0_0_30px_rgba(var(--tw-shadow-color),0.3)]` : isPast ? 'border-slate-700 text-slate-500' : 'border-slate-800 text-slate-700'}
                        `}
                        animate={{
                            scale: isActive ? 1.1 : 1,
                            y: isActive ? -5 : 0,
                            borderColor: isActive ? '#10b981' : isPast ? '#334155' : '#1e293b' // Fallback colors handled by class, this helps framer
                        }}
                        >
                        {/* Active Pulse Background */}
                        {isActive && (
                            <div className={`absolute inset-0 rounded-2xl bg-${step.color.split('-')[1]}-500/10 animate-pulse`} />
                        )}
                        
                        <Icon className={`w-6 h-6 md:w-8 md:h-8 ${isActive ? step.color : isPast ? 'text-slate-500' : 'text-slate-700'} transition-colors duration-300`} />
                        
                        {/* Node Connection Pulse (The Spinner) */}
                        {isActive && (
                            <div className="absolute -inset-2 border border-dashed border-white/20 rounded-2xl animate-[spin_10s_linear_infinite]" />
                        )}
                        </motion.div>

                        {/* Text Content */}
                        <div className="text-center space-y-2 absolute top-24 md:top-28 w-32 md:w-40">
                        <h3 className={`font-bold text-xs md:text-sm transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-600'}`}>
                            {step.title}
                        </h3>
                        
                        {/* Description Animation */}
                        <div className="h-12 relative"> 
                            <AnimatePresence mode='wait'>
                                {isActive && (
                                <motion.div 
                                    key={`desc-${step.id}`}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute inset-0 flex justify-center"
                                >
                                    <span className="text-[10px] md:text-xs text-primary/80 font-mono bg-primary/5 px-2 py-1 rounded border border-primary/10">
                                        {step.desc}
                                    </span>
                                </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-slate-950 relative border-t border-slate-900 px-4 md:px-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">The A-Team for Your Security</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Traditional scanners just report problems. WeSafeSite's autonomous agents work together to solve them.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <FeatureCard 
                    icon={Search} 
                    title="Recon Agent" 
                    desc="Continuously maps your attack surface, identifying new endpoints and assets instantly."
                />
                <FeatureCard 
                    icon={Zap} 
                    title="Vulnerability Scanner" 
                    desc="Executes non-destructive exploits to validate weaknesses like SQLi, XSS, and CSRF."
                />
                <FeatureCard 
                    icon={Lock} 
                    title="Patch Recommendation" 
                    desc="Powered by Gemini, this agent writes secure code patches tailored to your specific codebase."
                />
            </div>
        </div>
      </section>

      {/* NEW SECTION: Know Your Enemy */}
      <section className="py-16 md:py-24 bg-slate-900 border-t border-slate-800 relative px-4 md:px-0">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
           <div className="mb-12 md:mb-16 text-center">
             <span className="text-emerald-500 font-mono text-sm tracking-wider uppercase">Education Hub</span>
             <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">Know Your Enemy</h2>
             <p className="text-slate-400 max-w-2xl mx-auto">
               Cyber threats are evolving. We translate complex attack vectors into language everyone can understand.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {THREAT_KNOWLEDGE.map((item, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all group">
                   <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="p-3 bg-slate-900 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
                        <item.icon className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div className="flex-1 w-full">
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <div className="flex flex-col gap-4 mt-4">
                           {/* Simple View */}
                           <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                              <p className="text-xs font-mono text-blue-400 uppercase mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> In Plain English
                              </p>
                              <p className="text-sm text-slate-300">{item.simple}</p>
                           </div>
                           
                           {/* Tech View */}
                           <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                              <p className="text-xs font-mono text-purple-400 uppercase mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Technical Specs
                              </p>
                              <p className="text-sm text-slate-400 font-mono text-xs">{item.tech}</p>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

       {/* Footer */}
       <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 md:px-0">
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm text-center md:text-left gap-4">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold text-slate-400">WeSafeSite</span>
                </div>
                <div>
                    &copy; 2024 WeSafeSite Security Inc. All rights reserved.
                </div>
            </div>
       </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: any, title: string, desc: string }> = ({ icon: Icon, title, desc }) => (
    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);
