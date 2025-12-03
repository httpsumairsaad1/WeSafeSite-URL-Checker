import React, { useState, useEffect } from 'react';
import { Vulnerability, Severity } from '../types';
import { AlertTriangle, ChevronDown, ChevronUp, Check, X, Code, RefreshCw, Trash2, ArrowLeft, Printer, Shield, Globe, Calendar, FileText } from 'lucide-react';
import { generatePatch } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

const MOCK_VULNS: Vulnerability[] = [
  {
    id: '1',
    type: 'SQL Injection',
    name: 'Example: SQL Injection in Search',
    description: 'User input in the search query parameter is directly concatenated into a SQL query without sanitization.',
    severity: Severity.CRITICAL,
    path: '/api/v1/products/search',
    status: 'Open',
    detectedAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'XSS',
    name: 'Example: Reflected XSS',
    description: 'The search term is reflected back to the user in the DOM without proper escaping.',
    severity: Severity.HIGH,
    path: '/search?q=',
    status: 'Open',
    detectedAt: new Date().toISOString(),
  }
];

const SeverityBadge: React.FC<{ severity: Severity; printMode?: boolean }> = ({ severity, printMode }) => {
  const colors = {
    [Severity.CRITICAL]: 'bg-red-500/10 text-red-500 border-red-500/20',
    [Severity.HIGH]: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    [Severity.MEDIUM]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [Severity.LOW]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    [Severity.INFO]: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };
  
  const printColors = {
    [Severity.CRITICAL]: 'text-red-700 border-red-700 bg-red-100',
    [Severity.HIGH]: 'text-orange-700 border-orange-700 bg-orange-100',
    [Severity.MEDIUM]: 'text-yellow-700 border-yellow-700 bg-yellow-100',
    [Severity.LOW]: 'text-blue-700 border-blue-700 bg-blue-100',
    [Severity.INFO]: 'text-slate-700 border-slate-700 bg-slate-100',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold border ${printMode ? printColors[severity] : colors[severity]}`}>
      {severity}
    </span>
  );
};

const VulnerabilityItem: React.FC<{ vuln: Vulnerability }> = ({ vuln }) => {
  const [expanded, setExpanded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [patch, setPatch] = useState<string | null>(vuln.suggestedPatch || null);

  const handleGeneratePatch = async () => {
    setGenerating(true);
    const code = await generatePatch(vuln);
    setPatch(code);
    setGenerating(false);
  };

  return (
    <div className="bg-surface border border-slate-800 rounded-lg overflow-hidden transition-all hover:border-slate-600 no-print">
      <div 
        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer bg-slate-900/50 gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4 overflow-hidden">
          <div className={`p-2 rounded-full mt-1 sm:mt-0 flex-shrink-0 ${vuln.severity === Severity.CRITICAL ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-slate-200 truncate pr-2">{vuln.name}</h4>
            <div className="flex flex-wrap gap-2 items-center mt-1">
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono whitespace-nowrap">{vuln.type}</span>
                <span className="text-xs text-slate-500 font-mono flex items-center gap-1 truncate max-w-[200px] sm:max-w-xs">
                    <span className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0"></span>
                    {vuln.path}
                </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <SeverityBadge severity={vuln.severity} />
          {expanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <p className="text-slate-400 mb-4 text-sm leading-relaxed">{vuln.description}</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <button 
              onClick={(e) => { e.stopPropagation(); handleGeneratePatch(); }}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-emerald-600 text-slate-900 font-bold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10"
            >
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Code className="w-4 h-4" />}
              {patch ? 'Regenerate Patch' : 'Generate Fix with AI'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-sm transition-colors">
              <X className="w-4 h-4" /> Ignore Issue
            </button>
          </div>

          {patch && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 border border-slate-800 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-2 bg-slate-900 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-500 uppercase flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    Gemini Agent Suggestion
                </span>
                <button 
                    onClick={() => alert("Patch applied to simulated backend.")}
                    className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded transition-colors flex items-center gap-1">
                    <Check className="w-3 h-3" /> Apply Fix
                </button>
              </div>
              <pre className="bg-black p-4 overflow-x-auto">
                <code className="text-sm font-mono text-blue-300 block min-w-full">{patch}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ScanResults: React.FC = () => {
  const navigate = useNavigate();
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('last_scan_results');
    if (stored) {
      try {
        setVulnerabilities(JSON.parse(stored));
      } catch (e) {
        setVulnerabilities(MOCK_VULNS);
      }
    } else {
        setVulnerabilities(MOCK_VULNS);
    }
    setLoading(false);
  }, []);

  const handleClear = () => {
      sessionStorage.removeItem('last_scan_results');
      setVulnerabilities([]);
  };

  const handlePrint = () => {
      window.print();
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading scan data...</div>;

  const criticalCount = vulnerabilities.filter(v => v.severity === Severity.CRITICAL).length;
  const highCount = vulnerabilities.filter(v => v.severity === Severity.HIGH).length;

  return (
    <>
    {/* SCREEN VIEW */}
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in no-print">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <button onClick={() => navigate('/dashboard')} className="p-1 rounded-full hover:bg-slate-800 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-400" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Latest Scan Results</h1>
            </div>
            <p className="text-slate-400 ml-8 text-sm md:text-base">
                {vulnerabilities.length > 0 
                    ? `Found ${vulnerabilities.length} issues requiring attention.` 
                    : "System scan completed. No issues found."}
            </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button 
                onClick={handlePrint}
                className="flex-1 md:flex-none justify-center bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors border border-slate-700"
            >
                <Printer className="w-4 h-4" /> Download Report
            </button>
            <button 
                onClick={handleClear}
                className="flex-1 md:flex-none justify-center text-slate-500 hover:text-red-400 transition-colors flex items-center gap-2 text-sm px-4 py-2"
            >
                <Trash2 className="w-4 h-4" /> Clear
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {vulnerabilities.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl">
                <div className="inline-flex p-4 rounded-full bg-slate-900 mb-4">
                    <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">All Clear</h3>
                <p className="text-slate-400 mb-6">Your system appears to be secure based on the latest agent scan.</p>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="text-primary hover:text-emerald-400 font-bold"
                >
                    Start New Scan
                </button>
            </div>
        ) : (
            vulnerabilities.map(v => (
              <VulnerabilityItem key={v.id} vuln={v} />
            ))
        )}
      </div>
    </div>

    {/* PRINT/PDF VIEW (Hidden on Screen) */}
    <div className="hidden print:block p-8 bg-white text-black max-w-[210mm] mx-auto">
        {/* Report Header */}
        <div className="flex justify-between items-end border-b-2 border-slate-800 pb-6 mb-8">
            <div className="flex items-center gap-3">
                <Shield className="w-10 h-10 text-emerald-600" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">WeSafeSite</h1>
                    <p className="text-sm text-slate-500">Autonomous Security Remediation Report</p>
                </div>
            </div>
            <div className="text-right text-sm text-slate-500">
                <div className="flex items-center justify-end gap-2 mb-1">
                    <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString()}
                </div>
                <div className="flex items-center justify-end gap-2">
                    <Globe className="w-4 h-4" /> Target: Automated Scan
                </div>
            </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-700 mb-4 border-l-4 border-emerald-500 pl-3">Executive Summary</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-slate-100 rounded border border-slate-200 text-center">
                    <div className="text-2xl font-bold text-slate-900">{vulnerabilities.length}</div>
                    <div className="text-xs uppercase text-slate-500 font-bold">Total Issues</div>
                </div>
                <div className="p-4 bg-red-50 rounded border border-red-100 text-center">
                    <div className="text-2xl font-bold text-red-700">{criticalCount}</div>
                    <div className="text-xs uppercase text-red-600 font-bold">Critical</div>
                </div>
                <div className="p-4 bg-orange-50 rounded border border-orange-100 text-center">
                    <div className="text-2xl font-bold text-orange-700">{highCount}</div>
                    <div className="text-xs uppercase text-orange-600 font-bold">High</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded border border-emerald-100 text-center">
                    <div className="text-2xl font-bold text-emerald-700">100%</div>
                    <div className="text-xs uppercase text-emerald-600 font-bold">Auto-Analyzed</div>
                </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed text-justify">
                This report was generated autonomously by the WeSafeSite multi-agent system. 
                The agents identified {vulnerabilities.length} potential security vulnerabilities. 
                Immediate action is recommended for Critical and High severity items. 
                AI-generated patches are available in the digital dashboard for rapid remediation.
            </p>
        </div>

        {/* Detailed Findings */}
        <div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-700 mb-4 border-l-4 border-blue-500 pl-3">Detailed Findings</h2>
            
            <table className="w-full text-left text-sm border-collapse">
                <thead>
                    <tr className="border-b-2 border-slate-800 text-slate-600">
                        <th className="py-2 w-24">Severity</th>
                        <th className="py-2">Vulnerability Name</th>
                        <th className="py-2">Location</th>
                        <th className="py-2">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {vulnerabilities.map((v, i) => (
                        <React.Fragment key={v.id}>
                            <tr className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                                <td className="py-3 pr-4 align-top">
                                    <SeverityBadge severity={v.severity} printMode />
                                </td>
                                <td className="py-3 pr-4 align-top font-bold text-slate-800">
                                    {v.name}
                                </td>
                                <td className="py-3 pr-4 align-top font-mono text-xs text-slate-600 break-all">
                                    {v.path}
                                </td>
                                <td className="py-3 align-top text-xs uppercase text-slate-500">
                                    {v.type}
                                </td>
                            </tr>
                            {/* Description Row */}
                            <tr className="border-b border-slate-300">
                                <td colSpan={4} className="py-2 pb-4 pl-0 text-slate-600 text-xs italic">
                                    <span className="font-bold text-slate-700 not-italic">Impact Analysis: </span>
                                    {v.description}
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-slate-300 pt-6 text-center text-xs text-slate-400">
            <p>Generated by WeSafeSite Autonomous Security • Confidential Document</p>
        </div>
    </div>
    </>
  );
};
