
import React, { useState, useEffect } from 'react';
import { AgentVisualizer } from '../components/AgentVisualizer';
import { 
  Shield, Zap, Search, Lock, ArrowRight, CheckCircle2, 
  Globe, Server, Settings, Cpu, FileText, ScanSearch
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 3000); // 3 seconds per step to allow reading
    return () => clearInterval(interval);
  }, []);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/login?mode=signup');
  };

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
            <Shield className="w-6 h-6" />
            <span>WeSafeSite</span>
          </div>
          <div className="flex gap-4">
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
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
         {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-primary text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Autonomous Security Agents v2.0 Live
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Sees Everything. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                Fixes Everything.
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Don't just find vulnerabilities—fix them before attackers strike. 
              Our multi-agent AI team continuously maps, tests, and patches your web applications 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <button onClick={handleGetStarted} className="flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-slate-950 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-emerald-500/20">
                    Start Free Scan <ArrowRight className="w-5 h-5" />
               </button>
               <button onClick={handleSignIn} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all border border-slate-700">
                    View Demo
               </button>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-500 pt-4">
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
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl blur opacity-20"></div>
            <AgentVisualizer />
          </div>
        </div>
      </section>

      {/* WORKFLOW PIPELINE ANIMATION SECTION */}
      <section className="py-24 bg-slate-900/30 border-t border-b border-slate-800 relative overflow-hidden">
        {/* Subtle grid bg for this section */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
             <h2 className="text-3xl font-bold mb-4">How It Works: The Autonomous Pipeline</h2>
             <p className="text-slate-400">Watch how our agents process your security posture in real-time.</p>
          </div>

          <div className="relative max-w-6xl mx-auto py-12">
            
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
                        w-20 h-20 rounded-2xl flex items-center justify-center border-2 mb-6 bg-slate-950 relative z-20 transition-colors duration-500
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
                      
                      <Icon className={`w-8 h-8 ${isActive ? step.color : isPast ? 'text-slate-500' : 'text-slate-700'} transition-colors duration-300`} />
                      
                      {/* Node Connection Pulse (The Spinner) */}
                      {isActive && (
                        <div className="absolute -inset-2 border border-dashed border-white/20 rounded-2xl animate-[spin_10s_linear_infinite]" />
                      )}
                    </motion.div>

                    {/* Text Content */}
                    <div className="text-center space-y-2 absolute top-28 w-40">
                      <h3 className={`font-bold text-sm transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-600'}`}>
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
                                <span className="text-xs text-primary/80 font-mono bg-primary/5 px-2 py-1 rounded border border-primary/10">
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
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-950 relative border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">The A-Team for Your Security</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Traditional scanners just report problems. WeSafeSite's autonomous agents work together to solve them.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
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

       {/* Footer */}
       <footer className="bg-slate-950 border-t border-slate-900 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
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
    <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);
