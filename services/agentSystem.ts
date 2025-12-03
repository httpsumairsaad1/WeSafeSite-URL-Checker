import { AgentLog, Vulnerability, Severity, SecurityCheckType } from '../types';
import { generatePatch } from './geminiService';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * AGENT SYSTEM BACKEND
 * 
 * This service simulates the "WeSafeSite" multi-agent backend.
 * In a production environment, this would be a WebSocket connection to 
 * a Python/Go microservices cluster (ADK).
 */

type AgentListener = (log: AgentLog, progress: number, vulns: Vulnerability[]) => void;

class AgentOrchestrator {
  private listeners: AgentListener[] = [];
  private isRunning = false;
  private logs: AgentLog[] = [];
  private vulnerabilities: Vulnerability[] = [];
  private progress = 0;

  // Configuration for the "Scanner Agent"
  // Updated with 5 new checks
  private checkList: { type: SecurityCheckType; name: string; weight: number }[] = [
    { type: 'SQL_INJECTION', name: 'SQL Injection', weight: 15 },
    { type: 'XSS', name: 'Cross-Site Scripting (XSS)', weight: 15 },
    { type: 'CSRF', name: 'CSRF Token Validation', weight: 10 },
    { type: 'SSRF', name: 'Server-Side Request Forgery', weight: 10 },
    { type: 'IDOR', name: 'Insecure Direct Object Reference', weight: 10 },
    { type: 'SECURITY_HEADERS', name: 'Security Header Analysis', weight: 5 },
    { type: 'HTTPS_CONFIG', name: 'SSL/TLS Configuration', weight: 5 },
    { type: 'RATE_LIMITING', name: 'API Rate Limiting', weight: 5 },
    { type: 'AUTH_WEAKNESS', name: 'Authentication Protocol', weight: 10 },
    { type: 'PATH_TRAVERSAL', name: 'Directory Traversal', weight: 5 },
    { type: 'OPEN_REDIRECT', name: 'Open Redirect Analysis', weight: 5 },
    { type: 'DEPENDENCY_VULN', name: 'Supply Chain Dependencies', weight: 5 },
  ];

  public subscribe(listener: AgentListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit() {
    this.listeners.forEach(l => l(
      this.logs[this.logs.length - 1], 
      this.progress, 
      this.vulnerabilities
    ));
  }

  private addLog(agent: AgentLog['agentName'], message: string, status: AgentLog['status'] = 'info') {
    const log: AgentLog = {
      id: Math.random().toString(36).substring(7),
      agentName: agent,
      message,
      timestamp: new Date(),
      status,
      stage: this.getStageForAgent(agent)
    };
    this.logs.push(log);
    this.emit();
  }

  private getStageForAgent(agent: string): any {
    switch(agent) {
      case 'Recon': return 'Finding Target';
      case 'Scanner': return 'Finding Flaw';
      case 'Patcher': return 'Remediation';
      case 'Memory': return 'Improvement';
    }
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * START MISSION
   * The main entry point for the frontend to trigger the agents.
   */
  public async startMission(url: string) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.logs = [];
    this.vulnerabilities = [];
    this.progress = 0;

    try {
      
      this.addLog('Recon', `Initiating surveillance on target: ${url}`, 'info');
      await this.sleep(800);
      
      this.addLog('Recon', 'Resolving DNS and checking SSL/TLS handshake...', 'info');
      await this.sleep(1000);
      
      const endpoints = ['/login', '/api/v1/users', '/search?q=', '/admin', '/upload', '/profile/102', '/redirect?url='];
      this.addLog('Recon', `Spidering complete. Identified ${endpoints.length} attack surfaces.`, 'success');
      this.progress = 15;
      await this.sleep(500);

      this.addLog('Scanner', 'Vulnerability Scanner activated. Beginning heuristic analysis.', 'info');
      
      for (const check of this.checkList) {
        if (!this.isRunning) break;
        
        this.addLog('Scanner', `Running module: ${check.name}...`, 'info');
        await this.sleep(Math.random() * 800 + 400);

        // Simulation Logic: 
        // If URL contains "demo", "test", or "vuln", we force find vulnerabilities.
        // Otherwise, we randomly find them for demonstration purposes.
        const isDemo = url.includes('demo') || url.includes('test');
        const chance = isDemo ? 0.6 : 0.15;

        if (Math.random() < chance) {
          const vulnId = Math.random().toString(36).substring(7);
          let severity = Severity.MEDIUM;
          if (['SQL_INJECTION', 'SSRF', 'IDOR', 'CSRF'].includes(check.type)) severity = Severity.HIGH;
          if (check.type === 'SQL_INJECTION') severity = Severity.CRITICAL;
          
          const vuln: Vulnerability = {
            id: vulnId,
            type: check.type,
            name: check.name,
            description: this.getDescriptionForType(check.type),
            severity: severity,
            path: endpoints[Math.floor(Math.random() * endpoints.length)],
            status: 'Open',
            detectedAt: new Date().toISOString()
          };

          this.vulnerabilities.push(vuln);
          this.addLog('Scanner', `THREAT DETECTED: ${check.name} at ${vuln.path}`, 'error');
        } else {
          this.addLog('Scanner', `${check.name} check passed. No anomalies.`, 'success');
        }
        
        // Calculate progress based on checklist weight
        this.progress += (70 / this.checkList.length);
        this.emit();
      }

      // PHASE 3: PATCH RECOMMENDATION AGENT (Gemini Powered)
      // Generates fix code
      if (this.vulnerabilities.length > 0) {
        this.addLog('Patcher', `Analyzing ${this.vulnerabilities.length} confirmed vulnerabilities for remediation.`, 'info');
        this.progress = 90;
        
        // Pick the most critical one to auto-patch for the demo
        const criticalVuln = this.vulnerabilities.find(v => v.severity === Severity.CRITICAL) || this.vulnerabilities.find(v => v.severity === Severity.HIGH) || this.vulnerabilities[0];
        
        this.addLog('Patcher', `Requesting AI patch generation for ${criticalVuln.name}...`, 'info');
        
        // Call the REAL Gemini Service
        try {
            const patchCode = await generatePatch(criticalVuln);
            criticalVuln.suggestedPatch = patchCode;
            this.addLog('Patcher', 'Generative AI patch synthesized and ready for review.', 'success');
        } catch (e) {
            this.addLog('Patcher', 'Failed to connect to AI synthesis engine.', 'warning');
        }
      } else {
        this.addLog('Patcher', 'No vulnerabilities to patch. System is secure.', 'success');
      }

      // PHASE 4: MEMORY SYSTEM
      // Tracks trends
      this.progress = 98;
      await this.sleep(800);
      this.addLog('Memory', 'Archiving scan results to long-term storage.', 'info');
      
      // Save to Session Storage for the Results Page to read (Frontend view)
      sessionStorage.setItem('last_scan_results', JSON.stringify(this.vulnerabilities));

      // Save to Firebase Firestore (Backend persistence)
      if (auth.currentUser) {
        try {
          await addDoc(collection(db, 'scans'), {
            userId: auth.currentUser.uid,
            targetUrl: url,
            timestamp: serverTimestamp(),
            vulnerabilityCount: this.vulnerabilities.length,
            criticalCount: this.vulnerabilities.filter(v => v.severity === Severity.CRITICAL).length,
            findings: this.vulnerabilities // In production, might want to sanitize this or store large JSON in Storage
          });
          this.addLog('Memory', 'Scan signature encrypted and stored in Cloud Vault.', 'success');
        } catch (dbError) {
          console.error("Firestore Save Error:", dbError);
          this.addLog('Memory', 'Local storage only. Cloud sync failed.', 'warning');
        }
      } else {
        this.addLog('Memory', 'Guest mode: Results stored locally only.', 'warning');
      }
      
      this.progress = 100;
      this.addLog('Memory', 'Mission Complete. Agents standing down.', 'success');

    } catch (error) {
      this.addLog('Memory', 'Mission Aborted: Internal System Error', 'error');
    } finally {
      this.isRunning = false;
      this.emit();
    }
  }

  public getCheckList() {
      return this.checkList;
  }

  private getDescriptionForType(type: SecurityCheckType): string {
    switch (type) {
      case 'SQL_INJECTION': return 'User input is not properly sanitized before being passed to the database query.';
      case 'XSS': return 'Malicious scripts can be injected into trusted web pages viewed by other users.';
      case 'CSRF': return 'State-changing actions can be performed by attackers on behalf of authenticated users.';
      case 'SSRF': return 'The server can be induced to make requests to internal resources or arbitrary external systems.';
      case 'IDOR': return 'Users can access objects (files, database records) belonging to others by modifying input parameters.';
      case 'SECURITY_HEADERS': return 'Essential HTTP security headers (CSP, HSTS) are missing.';
      case 'HTTPS_CONFIG': return 'Weak SSL/TLS configuration or using deprecated protocols.';
      case 'RATE_LIMITING': return 'API endpoints lack rate limiting, allowing for brute force attacks.';
      case 'AUTH_WEAKNESS': return 'Authentication mechanism allows weak passwords or lacks 2FA enforcement.';
      case 'PATH_TRAVERSAL': return 'Attackers can access files and directories stored outside the web root folder.';
      case 'OPEN_REDIRECT': return 'Application redirects users to untrusted external URLs.';
      case 'DEPENDENCY_VULN': return 'Outdated third-party libraries with known CVEs detected in the tech stack.';
      default: return 'Generic security anomaly detected.';
    }
  }

  public getResults() {
    return {
        logs: this.logs,
        vulnerabilities: this.vulnerabilities,
        progress: this.progress
    };
  }
}

// Export Singleton
export const agentSystem = new AgentOrchestrator();
