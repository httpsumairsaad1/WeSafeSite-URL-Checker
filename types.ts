export enum Severity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  INFO = 'Info'
}

export interface Vulnerability {
  id: string;
  type: string;
  name: string;
  description: string;
  severity: Severity;
  path: string;
  status: 'Open' | 'Patched' | 'Ignored';
  detectedAt: string;
  suggestedPatch?: string; // Code snippet
}

export interface AgentLog {
  id: string;
  agentName: 'Recon' | 'Scanner' | 'Patcher' | 'Memory';
  stage?: 'Finding Target' | 'Finding Flaw' | 'Remediation' | 'Improvement';
  message: string;
  timestamp: Date;
  status: 'info' | 'success' | 'warning' | 'error';
  details?: string;
}

export interface Website {
  id: string;
  url: string;
  lastScan: string;
  score: number;
  status: 'Secure' | 'At Risk' | 'Critical';
}

export interface ScanStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  patched: number;
}

// New Types for Agent Backend
export type SecurityCheckType = 
  | 'SQL_INJECTION'
  | 'XSS'
  | 'SECURITY_HEADERS'
  | 'HTTPS_CONFIG'
  | 'RATE_LIMITING'
  | 'AUTH_WEAKNESS'
  | 'PATH_TRAVERSAL'
  | 'CSRF'            // New
  | 'SSRF'            // New
  | 'IDOR'            // New
  | 'OPEN_REDIRECT'   // New
  | 'DEPENDENCY_VULN'; // New

export interface ScanSession {
  id: string;
  targetUrl: string;
  startTime: number;
  endTime?: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
  logs: AgentLog[];
  vulnerabilities: Vulnerability[];
  progress: number; // 0-100
}
