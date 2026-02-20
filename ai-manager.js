/**
 * KELYLO AI Manager - Gemini API Integration
 * Handles all AI features: Chat Assistant, Document Analysis, Smart Suggestions
 */

class AIManager {
  constructor() {
    this.apiKey = CONFIG.GEMINI_API_KEY;
    this.endpoint = CONFIG.GEMINI_API_ENDPOINT;
    this.requestCount = { minute: 0, day: 0 };
    this.lastRequestTime = Date.now();
    this.cache = new Map();

    // Initialize IndexedDB for AI cache
    this.initCache();
  }

  async initCache() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('kelylo-ai-cache', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('responses')) {
          const store = db.createObjectStore('responses', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Rate limiting check
  canMakeRequest() {
    const now = Date.now();
    const minuteAgo = now - 60000;
    const dayAgo = now - 86400000;

    if (this.lastRequestTime < minuteAgo) {
      this.requestCount.minute = 0;
    }
    if (this.lastRequestTime < dayAgo) {
      this.requestCount.day = 0;
    }

    return (
      this.requestCount.minute < CONFIG.RATE_LIMIT.MAX_REQUESTS_PER_MINUTE &&
      this.requestCount.day < CONFIG.RATE_LIMIT.MAX_REQUESTS_PER_DAY
    );
  }

  getCacheKey(prompt, context) {
    return btoa(JSON.stringify({ prompt, context })).substring(0, 50);
  }

  async getCachedResponse(cacheKey) {
    if (!CONFIG.CACHE_RESPONSES || !this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db.transaction(['responses'], 'readonly');
      const store = transaction.objectStore('responses');
      const request = store.get(cacheKey);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const age = Date.now() - result.timestamp;
          const maxAge = CONFIG.CACHE_DURATION_HOURS * 3600000;
          if (age < maxAge) {
            resolve(result.response);
            return;
          }
        }
        resolve(null);
      };

      request.onerror = () => resolve(null);
    });
  }

  async cacheResponse(cacheKey, response) {
    if (!CONFIG.CACHE_RESPONSES || !this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db.transaction(['responses'], 'readwrite');
      const store = transaction.objectStore('responses');
      store.put({ id: cacheKey, response, timestamp: Date.now() });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    });
  }

  // Build rich system instruction with full KELYLO knowledge
  buildSystemInstruction(context) {
    let instruction = `You are KELYLO AI — the built-in intelligent assistant of KELYLO "The Ambition Hub". You are knowledgeable, warm, motivating, and practical. You know everything about this app and the 8 skills it teaches.

== ABOUT KELYLO ==
KELYLO is a Progressive Web App (PWA) that helps users master 8 essential professional skills in 7 months (20 hours/week). The app has:
• Home page + 8 skill pages: Microsoft Word, Microsoft Excel, PowerPoint, Canva, AutoCAD, SAP2000, Robot Structural Analysis, English Communication
• Each skill page has: Time Tracker (log practice hours), Vital 20% Tasks (Pareto principle tasks), Notes (auto-save), Files & Documents (upload PDFs/Word/Excel/images up to 50MB, stored in IndexedDB), Learning Videos (embed YouTube/Vimeo/Google Drive links), AI Smart Suggestions, and a detailed 80/20 Roadmap
• Works fully offline after first visit (Service Worker caching)
• Installable on any device as a native app
• 7-month countdown targeting September 20, 2026
• Daily Bible verses: 125 verses across 4 themes — Service (Mark 10:45), Provision (Proverbs 11:24), Resilience (Isaiah 40:31), Discipline (Hebrews 12:6)
• English and French bilingual support
• Dark/Light theme toggle

== THE 8 SKILLS — DETAILED KNOWLEDGE ==

1. MICROSOFT WORD
Why: Clean documents make you credible. Word mastery means you can deliver any report fast.
Key topics: Styles (Heading 1/2/3, Normal), Section Breaks, Table of Contents (automatic), Mail Merge, Track Changes, Templates, Forms, Columns
Study path: Styles → Consistent formatting → Templates → Automatic TOC → Mail Merge → Track Changes collaboration
Key shortcuts: Ctrl+S (save), Ctrl+Z (undo), Ctrl+B/I/U (bold/italic/underline), F12 (Save As)
Vital 20%: Styles + TOC + Mail Merge = 80% of professional Word usage

2. MICROSOFT EXCEL
Why: Excel skills turn raw data into decisions. Master it and you become indispensable.
Key topics: Formulas (SUM, IF, COUNTIF, SUMIF), VLOOKUP, INDEX-MATCH, Pivot Tables, Conditional Formatting, Charts (bar, line, pie), Data Validation, Macros (VBA basics), Power Query
Study path: Basic formulas → Logical functions → VLOOKUP/INDEX-MATCH → Pivot tables → Dynamic charts → Macros
Key shortcuts: Ctrl+T (table), Alt+= (AutoSum), Ctrl+Shift+L (filter), F2 (edit cell)
Vital 20%: Pivot Tables + VLOOKUP + IF formulas = 80% of Excel work

3. MICROSOFT POWERPOINT
Why: Great presentations get projects approved. Master PowerPoint to communicate ideas visually.
Key topics: Master Slides, Slide Layouts, Themes, Animations, Transitions, SmartArt, Selection Pane, Speaker Notes, Presenter View
Study path: Templates → Master slides → Layouts → Animations → Slide show → Presenter view
Design rules: 6x6 rule (6 bullets, 6 words max), one idea per slide, use visuals over text
Vital 20%: Master slides + animations + presenter view = professional presentations

4. CANVA
Why: Visual content gets more engagement. Canva makes professional design accessible to everyone.
8-Week Roadmap:
• Week 1-2 (Foundations): Interface basics, template library (50+ templates), drag-and-drop, element alignment, resizing/cropping
• Week 3-4 (Design Elements): Typography (font hierarchy), color theory and palettes, background removal, custom shapes, layer management
• Week 5-6 (Brand Identity): Brand kit (colors + fonts), custom templates from scratch, white space and composition, social media post series (10+ posts), export for different platforms
• Week 7-8 (Advanced): Marketing materials, animated social media content, presentation templates, data infographics, logos and branding
Tips: Use templates as starting points, maintain consistent brand colors, master alignment tools, export in the right format

5. AUTOCAD
Why: AutoCAD is the industry standard for technical drawings. Learn it to communicate designs professionally.
Key topics: Drawing commands (LINE, CIRCLE, ARC, RECTANGLE, POLYGON), Modify tools (TRIM, EXTEND, OFFSET, MIRROR, ARRAY), Layers (color, linetype, lineweight), Blocks and References (INSERT, XREF), Dimensioning (linear, angular, radius, ordinate), Layouts (Model Space vs Paper Space), Plotting/Printing, 3D modeling (EXTRUDE, REVOLVE, UNION, SUBTRACT)
Study path: 2D basics → Precision drawing → Layers & organization → Blocks → Dimensioning → Paper space layouts → 3D modeling
Key shortcuts: L (Line), C (Circle), TR (Trim), O (Offset), M (Move), CO (Copy), Z+E (Zoom Extents)
Vital 20%: Layers + Blocks + Dimensioning + Layouts = professional CAD drawings

6. SAP2000
Why: SAP2000 is essential for structural engineering — analyze and design safe structures.
What to study / Full learning roadmap:
• Phase 1 — Interface & Setup: Grid setup, units (kN/m or kip/ft), model templates, toolbars, coordinate systems (Global X/Y/Z)
• Phase 2 — Model Geometry: Define joints (nodes), draw frame elements (beams/columns), add shell elements (slabs/walls), import DXF drawings, set up grid lines
• Phase 3 — Materials & Sections: Define concrete (C25/C30/C35, fc=25MPa), steel (S275/S355, Fy=275MPa), import section library (W-sections, IPE, HEA, rectangular/circular sections), define section properties
• Phase 4 — Boundary Conditions: Joint restraints (pin: fixed translation / roller: one direction / fixed: all DOF), diaphragm constraints for floor slabs
• Phase 5 — Load Definition: Dead load (self-weight + superimposed), live load (residential 2kN/m², office 3kN/m²), wind load (static equivalent or dynamic), seismic load (equivalent lateral force or response spectrum per IBC/Eurocode 8), thermal loads
• Phase 6 — Analysis Types: Linear static analysis, Modal analysis (eigenvalue, natural frequencies, mode shapes), Response Spectrum Analysis, P-Delta (geometric nonlinearity)
• Phase 7 — Load Combinations: Create factored combinations per code — ASCE 7: 1.2D + 1.6L, 1.2D + L + E; Eurocode: 1.35G + 1.5Q; check all required combinations
• Phase 8 — Result Interpretation: Moment diagrams (M3), Shear diagrams (V2), Axial forces (P), Deformed shape, Joint reactions (support forces), Story drift, Base shear, Check deflection limits (L/250, L/360)
• Phase 9 — Member Design: Steel design (AISC 360 or Eurocode 3) — check interaction ratios, utilization, buckling; RC design (ACI 318 or Eurocode 2) — required reinforcement, column/beam design
• Phase 10 — Real Projects: simple beam → simply supported truss → 2D portal frame → 3D frame → multi-story building → full analysis report
Key tips: Always verify with hand calculations, start with simple models before complex ones, check units carefully, understand the structural system before modeling

7. ROBOT STRUCTURAL ANALYSIS
Why: Advanced structural analysis software for designing safe structures efficiently.
Key topics: Model setup, material definitions, section library, load cases (ULS + SLS), load combinations, FEM analysis, result reading (forces, displacements), member design (steel/RC), optimization, generating calculation reports
Study path: Basic frame → Define materials/sections → Apply loads → Run FEM → Read results → Design members → Generate report
Comparison with SAP2000: Robot has deeper European code integration (Eurocode), SAP2000 is stronger in US codes (ASCE/ACI/AISC)

8. ENGLISH COMMUNICATION
Why: Clear English opens global opportunities. Master it to share your expertise worldwide.
Key topics: Technical writing (clear, concise sentences), Email writing (subject line, structure, tone), Report structure (executive summary, introduction, methodology, results, conclusion), Presentations (opening hook, clear structure, closing), Technical vocabulary (engineering, business), Grammar for professionals (active vs passive voice, tense consistency), Listening and speaking confidence
Study path: Daily reading (technical articles 15min/day) → Email practice (write 1 professional email/day) → Report writing (structure practice) → Presentations (record yourself) → Vocabulary building (5 new words/day)
Vital 20%: Email writing + report structure + presentation skills = 80% of professional English use

== HOW TO USE KELYLO ==
• Time Tracker: Log hours on each skill page — awareness drives improvement
• Vital Tasks: Add the 20% of tasks that produce 80% of results (Pareto principle)
• Files: Upload PDFs, Word docs, Excel files, images up to 50MB each (stored locally, works offline)
• Videos: Paste YouTube/Vimeo/Google Drive URL to embed and watch inside the app
• Notes: Auto-saving text notes per skill
• Roadmap: Follow the 80/20 learning path on each skill's page
• AI Chat: That's me — ask anything anytime!
• Offline: Everything works offline after first visit (files, tasks, notes all stored in browser)
• Install: Add KELYLO to home screen for app-like experience

== YOUR PERSONALITY ==
• Warm and genuine — like a mentor who truly wants the user to succeed
• Knowledgeable — give real, specific, actionable answers
• Motivating — when someone seems stuck or overwhelmed, encourage them authentically
• Conversational — if someone says "hi" or chats casually, respond naturally and friendly (NOT robotically)
• Practical — always give actionable steps, not vague advice
• Bilingual — respond in the same language the user writes (English or French)
• Never say "I'm not sure about that" for skill questions — you know everything about these 8 skills
• If someone asks what to study in any skill, give a detailed, specific roadmap from the content above`;

    // Add current skill context
    if (context.skill) {
      instruction += `\n\n== CURRENT CONTEXT ==\nUser is on the ${context.skill.name} page right now.`;
      if (context.skill.why) {
        instruction += `\nSkill motivation: ${context.skill.why}`;
      }
    }

    // Add user progress context
    if (context.progress) {
      instruction += `\nUser progress on this skill: ${context.progress.time} spent practicing.`;
      if (context.progress.tasks) {
        instruction += `\nTasks: ${context.progress.tasks.completed}/${context.progress.tasks.total} done today.`;
      }
    }

    // Add file context for document analysis
    if (context.fileContent) {
      instruction += `\n\nAnalyzing document: "${context.fileName || 'uploaded file'}"\nContent preview:\n${context.fileContent.substring(0, 2000)}`;
    }

    return instruction;
  }

  // Main API call to Gemini — supports multi-turn conversation
  async generateContent(prompt, context = {}, history = []) {
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }

    const isConversation = history.length > 0;
    let cacheKey = null;

    // Only use cache for single-turn requests (document analysis, smart suggestions)
    if (!isConversation) {
      cacheKey = this.getCacheKey(prompt, context);
      const cached = await this.getCachedResponse(cacheKey);
      if (cached) {
        console.log('✓ Returning cached AI response');
        return cached;
      }
    }

    const systemInstruction = this.buildSystemInstruction(context);

    // Build contents array — include conversation history for multi-turn
    const contents = isConversation
      ? [
          ...history.slice(-8).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          })),
          { role: 'user', parts: [{ text: prompt }] }
        ]
      : [{ role: 'user', parts: [{ text: prompt }] }];

    // Choose endpoint: local backend (API key hidden) or direct Gemini (deployed)
    const url = CONFIG.USE_LOCAL_BACKEND
      ? CONFIG.LOCAL_BACKEND_URL
      : `${this.endpoint}?key=${this.apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: CONFIG.AI_FEATURES.TEMPERATURE,
            maxOutputTokens: CONFIG.AI_FEATURES.MAX_TOKENS,
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const text = data.candidates[0]?.content?.parts[0]?.text;

      if (!text) {
        throw new Error('No response from AI');
      }

      this.requestCount.minute++;
      this.requestCount.day++;
      this.lastRequestTime = Date.now();

      // Only cache single-turn responses
      if (!isConversation && cacheKey) {
        await this.cacheResponse(cacheKey, text);
      }

      return text;
    } catch (error) {
      console.error('AI API Error:', error);

      if (CONFIG.AI_FEATURES.LOCAL_FALLBACK && typeof KELYLO_KNOWLEDGE !== 'undefined') {
        console.log('→ Using local knowledge base fallback');
        return this.getLocalResponse(prompt, context);
      }

      throw error;
    }
  }

  // Local knowledge base fallback (used when Gemini API is unavailable)
  getLocalResponse(userPrompt, context = {}) {
    const prompt = userPrompt.toLowerCase().trim();
    const kb = KELYLO_KNOWLEDGE;

    // Use intelligent search agent for navigation/feature queries
    if (kb.searchAgent) {
      if (prompt.includes('where') || prompt.includes('what can') || prompt.includes('find') ||
          prompt.includes('how to') || prompt.includes('feature') || prompt.includes('capability')) {
        const searchResult = kb.searchAgent.intelligentSearch(userPrompt);
        if (searchResult) return searchResult + "\n\n💡 Need more specific help? Just ask!";
      }

      const pageKeywords = ['page', 'word page', 'excel page', 'home page', 'skill page'];
      if (pageKeywords.some(kw => prompt.includes(kw))) {
        const pageName = prompt.match(/(word|excel|powerpoint|canva|autocad|sap2000|robot|english|home)/i)?.[0];
        if (pageName) {
          const pageInfo = kb.searchAgent.getPageCapabilities(pageName);
          if (pageInfo) {
            return `**${pageInfo.name} Page**\n\n**Purpose:** ${pageInfo.purpose}\n\n**What you can do:**\n${pageInfo.capabilities.map((cap, i) => `${i + 1}. ${cap}`).join('\n')}\n\n**Sections on this page:**\n${pageInfo.sections.map(s => `• ${s}`).join('\n')}\n\nWhat would you like to do?`;
          }
        }
      }

      const featureKeywords = ['upload', 'video', 'task', 'note', 'time track', 'ai suggest', 'offline'];
      const matchedFeature = featureKeywords.find(kw => prompt.includes(kw));
      if (matchedFeature) {
        const featureKey = matchedFeature.replace(' ', '').replace('aisuggect', 'aiAssistant').replace('timetrack', 'timeTracking');
        const feature = kb.searchAgent.findFeature(featureKey);
        if (feature) {
          let response = `**${feature.name || 'Feature'}**\n\n${feature.description}\n\n`;
          if (feature.location) response += `📍 **Where:** ${feature.location}\n\n`;
          if (feature.capabilities && feature.capabilities.length > 0) {
            response += `**Capabilities:**\n${feature.capabilities.map((cap, i) => `${i + 1}. ${cap}`).join('\n')}`;
          }
          return response;
        }
      }
    }

    // Check FAQs (skip the "hi" greeting — handle it below for a more natural response)
    for (const faq of kb.faqs) {
      const isGreeting = faq.q.includes('hi') || faq.q.includes('hello') || faq.q.includes('hey');
      if (isGreeting) continue; // let greetings be handled naturally below
      if (faq.q.some(q => prompt.includes(q.toLowerCase()))) {
        return faq.a;
      }
    }

    // Natural greeting response
    if (prompt === 'hi' || prompt === 'hello' || prompt === 'hey' || prompt === 'salut' || prompt === 'bonjour') {
      const skillName = context.skill?.name || 'your skills';
      return `Hey! Good to see you here 👋 \n\nI'm KELYLO AI — your learning companion. You're working on **${skillName}** — great choice!\n\nWhat's on your mind? Whether you need a study plan, motivation, tips, or just want to chat — I'm here for it. What would you like to focus on today?`;
    }

    // Check for skill mentions anywhere in the prompt
    const skillMatch = prompt.match(/(word|excel|powerpoint|canva|autocad|sap2000|robot|english)/i);
    const targetSkillId = skillMatch ? skillMatch[0].toLowerCase() : (context.skill?.id || null);

    if (targetSkillId) {
      const skillInfo = kb.skills[targetSkillId];

      if (skillInfo) {
        // Learning / study / roadmap queries
        const isLearningQuery = prompt.includes('roadmap') || prompt.includes('master') ||
          prompt.includes('learning path') || prompt.includes('how to learn') ||
          prompt.includes('guide') || prompt.includes('step by step') ||
          prompt.includes('study') || prompt.includes('learn') ||
          prompt.includes('start') || prompt.includes('begin') ||
          prompt.includes('what to') || prompt.includes('where to') ||
          prompt.includes('plan') || prompt.includes('schedule') ||
          prompt.includes('path') || prompt.includes('course');

        if (isLearningQuery) {
          if (skillInfo.roadmap && skillInfo.roadmap.length > 0) {
            let response = `**🎯 Roadmap to Master ${skillInfo.name}**\n\n`;
            response += `*${skillInfo.why}*\n\n`;
            skillInfo.roadmap.forEach(phase => {
              response += `**📅 ${phase.week} — ${phase.focus}**\n`;
              phase.tasks.forEach((task, i) => {
                response += `${i + 1}. ${task}\n`;
              });
              response += '\n';
            });
            response += `**💡 Pro Tips:**\n${skillInfo.tips.map(tip => `• ${tip}`).join('\n')}\n\n`;
            response += `Go to the ${skillInfo.name} page to start tracking your progress!`;
            return response;
          } else {
            return `**Learning ${skillInfo.name}:**\n\n${skillInfo.description}\n\n**Why it matters:**\n${skillInfo.why}\n\n**Start with these tasks:**\n${skillInfo.tasks.slice(0, 5).map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n**Key tips:**\n${skillInfo.tips.map(t => `• ${t}`).join('\n')}\n\nVisit the ${skillInfo.name} page to get started!`;
          }
        }

        // Tips / suggestions
        if (prompt.includes('tip') || prompt.includes('suggest') || prompt.includes('improve') || prompt.includes('better')) {
          return `**${skillInfo.name} Tips:**\n\n${skillInfo.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}\n\n**Suggested tasks:**\n${skillInfo.tasks.slice(0, 3).map(t => `• ${t}`).join('\n')}\n\n*${skillInfo.why}*`;
        }

        // About skill
        if (prompt.includes('what is') || prompt.includes('about') || prompt.includes('tell me') || prompt.includes('explain')) {
          return `**${skillInfo.name}**\n\n${skillInfo.description}\n\n**Why it matters:**\n${skillInfo.why}\n\n**Key tips:**\n${skillInfo.tips.slice(0, 3).map(tip => `• ${tip}`).join('\n')}\n\nWhat specific aspect would you like to learn?`;
        }

        // Default skill response — show tasks
        return `**${skillInfo.name} — where to start:**\n\n${skillInfo.why}\n\n**Suggested tasks:**\n${skillInfo.tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n**Tips:**\n${skillInfo.tips.slice(0, 3).map(t => `• ${t}`).join('\n')}\n\nGo to the ${skillInfo.name} page to track your progress!`;
      }
    }

    // Motivation
    if (prompt.includes('motivat') || prompt.includes('encourage') || prompt.includes('can i do') || prompt.includes('give up') || prompt.includes('hard')) {
      const encouragements = kb.defaults.encouragement;
      const random = encouragements[Math.floor(Math.random() * encouragements.length)];
      const skillMotivation = context.skill ? kb.quickResponses.motivation.replace('{skill}', context.skill.name) : "Keep learning and practicing. You're investing in yourself!";
      return `${random}\n\n${skillMotivation}`;
    }

    // Resources
    if (prompt.includes('resource') || prompt.includes('tutorial') || prompt.includes('video') || prompt.includes('course')) {
      if (context.skill) {
        return kb.quickResponses.resources.replace('{skill}', context.skill.name);
      }
      return "I can help you find resources! Which skill are you working on?\n\n• Microsoft Word\n• Microsoft Excel\n• PowerPoint\n• Canva\n• AutoCAD\n• SAP2000\n• Robot Structural Analysis\n• English Communication";
    }

    // Troubleshooting
    if (prompt.includes('problem') || prompt.includes('stuck') || prompt.includes('difficult') || prompt.includes('help')) {
      if (context.skill) {
        return kb.quickResponses.troubleshooting.replace('{skill}', context.skill.name);
      }
      return "I'm here to help! What are you having trouble with? Tell me the skill and the specific challenge you're facing.";
    }

    // About KELYLO
    if (prompt.includes('kelylo') || prompt.includes('this app') || prompt.includes('pwa') || prompt.includes('app')) {
      return `**About KELYLO**\n\n${kb.about.description}\n\n**Features:**\n${kb.about.features.map(f => `✅ ${f}`).join('\n')}\n\n**Purpose:**\n${kb.about.purpose}\n\nHow can I help you make the most of KELYLO?`;
    }

    // Generic fallback — still try to be helpful
    return `I'm here to help you on your KELYLO journey! 🚀\n\nYou can ask me about:\n\n• **Any skill** — Word, Excel, PowerPoint, Canva, AutoCAD, SAP2000, Robot, English\n• **What to study** and how to start\n• **Tips and tricks** for faster learning\n• **How to use KELYLO** features\n• **Motivation** when things get tough\n\nWhat would you like to know?`;
  }

  // Feature 1: Chat Assistant — with full conversation history for multi-turn
  async chat(message, skillContext, conversationHistory = []) {
    return await this.generateContent(message, {
      skill: skillContext,
      progress: this.getUserProgress(skillContext?.id)
    }, conversationHistory);
  }

  // Feature 2: Document Analysis
  async analyzeDocument(fileName, fileContent, analysisType = 'summary') {
    const prompts = {
      summary: 'Provide a concise summary of this document with key points.',
      notes: 'Extract the most important concepts and create study notes in bullet points.',
      quiz: 'Based on this content, generate 5 multiple-choice questions to test understanding.',
      concepts: 'Identify and explain the main concepts, theories, or techniques covered.'
    };

    return await this.generateContent(prompts[analysisType] || prompts.summary, {
      fileName,
      fileContent
    });
  }

  // Feature 3: Smart Suggestions
  async generateSmartSuggestions(skillId) {
    const skill = SKILLS.find(s => s.id === skillId);
    const progress = this.getUserProgress(skillId);

    const prompt = `Based on the user's progress, suggest 3-5 specific tasks or exercises they should focus on today to improve their ${skill.name} skills. Make suggestions practical and actionable.`;

    return await this.generateContent(prompt, {
      skill,
      progress
    });
  }

  // Get user progress from localStorage
  getUserProgress(skillId) {
    try {
      const tasks = JSON.parse(localStorage.getItem(`tasks-${skillId}`) || '[]');
      const completed = tasks.filter(t => t.done).length;
      const timeSpent = localStorage.getItem(`time-${skillId}`) || '0 hours';

      return {
        time: timeSpent,
        tasks: {
          total: tasks.length,
          completed
        }
      };
    } catch {
      return null;
    }
  }

  // Video summarization
  async summarizeVideo(videoTitle, videoUrl) {
    const prompt = `The user is watching a learning video titled "${videoTitle}". Provide:
1. What key topics are likely covered
2. Suggested timestamps to focus on (estimate)
3. Key takeaways to note while watching
4. Practice exercises after watching`;

    return await this.generateContent(prompt, {
      skill: { name: 'Video Learning' }
    });
  }
}

// Initialize global AI manager
const aiManager = new AIManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIManager;
}
