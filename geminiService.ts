import { GoogleGenAI } from "@google/genai";
import { Vulnerability } from "../types";

// Initialize Gemini
// Note: API_KEY is expected to be in the environment variables
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Pre-written fallbacks for demo stability when API is unreachable
const getFallbackPatch = (vuln: Vulnerability): string => {
  const commonPatches: Record<string, string> = {
    'SQL_INJECTION': `// SECURE CODE PATTERN: Parameterized Queries
// Vulnerability: ${vuln.name}
// Fix: Use prepared statements to prevent SQL Injection.

// BAD: const query = "SELECT * FROM users WHERE id = " + req.query.id;

// GOOD (Node.js / pg):
const query = 'SELECT * FROM users WHERE id = $1';
const values = [req.query.id];

try {
  const res = await client.query(query, values);
  return res.rows[0];
} catch (err) {
  console.error('Database error', err);
}`,
    'XSS': `// SECURE CODE PATTERN: Output Encoding
// Vulnerability: ${vuln.name}
// Fix: Sanitize user input before rendering to the DOM.

import DOMPurify from 'dompurify';

// BAD: <div dangerouslySetInnerHTML={{ __html: userInput }} />

// GOOD:
const cleanHTML = DOMPurify.sanitize(userInput);
return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;`,
    'CSRF': `// SECURE CODE PATTERN: CSRF Tokens
// Vulnerability: ${vuln.name}
// Fix: Implement Anti-CSRF tokens for state-changing requests.

// Express/CSURF Middleware Setup:
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: true });

app.post('/process', csrfProtection, (req, res) => {
  // Request is only processed if csrf token is valid
  res.send('Data is being processed');
});`,
     'SSRF': `// SECURE CODE PATTERN: URL Validation
// Vulnerability: ${vuln.name}
// Fix: Validate and allowlist target URLs.

const ALLOWED_DOMAINS = ['api.partner.com', 'cdn.trusted.com'];

function fetchUrl(userUrl) {
  const parsed = new URL(userUrl);
  if (!ALLOWED_DOMAINS.includes(parsed.hostname)) {
    throw new Error('Invalid domain');
  }
  return axios.get(userUrl);
}`
  };

  // Default generic patch if specific type not found
  const genericPatch = `// GENERIC SECURITY FIX
// Vulnerability: ${vuln.name}
// Path: ${vuln.path}

// 1. Validate Input
if (!isValid(input)) throw new Error("Invalid Input");

// 2. Encode Output
const safeOutput = encodeURIComponent(input);

// 3. Use Secure Libraries
// Update dependencies to latest secure versions.`;

  // Simple fuzzy match for vulnerability type
  const typeKey = Object.keys(commonPatches).find(key => 
    vuln.type.toUpperCase().includes(key) || vuln.name.toUpperCase().includes(key)
  );

  return commonPatches[typeKey || ''] || genericPatch;
};

export const generatePatch = async (vuln: Vulnerability): Promise<string> => {
  // If no API key is set, immediately return fallback to prevent error logs
  if (!apiKey) {
    console.warn("No API Key found. Using offline fallback.");
    return getFallbackPatch(vuln);
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are an expert cybersecurity automated agent named "Patcher".
      Your task is to generate a code fix for a detected vulnerability.
      
      Vulnerability: ${vuln.name}
      Type: ${vuln.type}
      Context/Path: ${vuln.path}
      Description: ${vuln.description}
      
      Please provide a concise, secure code snippet that fixes this issue. 
      Assume a modern web stack (React/Node or Python/FastAPI depending on context, default to JavaScript/TypeScript if unsure).
      Do not include markdown formatting or backticks, just the raw code commented and ready to review.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a white-hat security bot. Provide only secure code solutions.",
        temperature: 0.2, // Low temperature for deterministic code
      }
    });

    if (!response.text) {
        throw new Error("Empty response from AI");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error (Falling back to static patch):", error);
    // Return the high-quality fallback patch instead of an error message
    return getFallbackPatch(vuln);
  }
};

export const analyzeSecurityTrend = async (history: any[]): Promise<string> => {
    if (!apiKey) return "AI Analysis unavailable without API Key.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this security scan trend summary: ${JSON.stringify(history)}. Give a 1-sentence executive summary of the security posture improvement or degradation.`,
        });
        return response.text || "Analysis complete.";
    } catch (e) {
        return "Could not analyze trends.";
    }
}
