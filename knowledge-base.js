/**
 * KELYLO Local Knowledge Base
 * Fallback AI responses when Gemini API is unavailable
 */

const KELYLO_KNOWLEDGE = {
  // Page Capabilities & Structure
  pages: {
    home: {
      path: "index.html",
      name: "Home Page",
      capabilities: [
        "View all 8 skills at a glance",
        "Quick navigation to any skill",
        "Visual skill cards with icons",
        "Motivational quotes section",
        "Daily Bible verse",
        "PWA installation prompt",
        "Overview of KELYLO features"
      ],
      sections: ["Hero", "Skills Grid", "Quotes", "Daily Verse"],
      purpose: "Central hub for accessing all skills and features"
    },
    word: {
      path: "word.html",
      name: "Microsoft Word",
      capabilities: [
        "Track time spent on Word practice",
        "Manage vital 20% Word tasks",
        "Upload Word documents and PDFs",
        "Embed Word tutorial videos",
        "Take notes about Word concepts",
        "View daily focus area",
        "Get AI suggestions for Word mastery",
        "Check today's task progress"
      ],
      sections: ["Hero with skill image", "AI Smart Suggestions", "Today's Focus", "Vital Tasks", "Time Tracker", "Notes", "Files & Documents", "Learning Videos"],
      purpose: "Master Microsoft Word through focused practice and tracking"
    },
    excel: {
      path: "excel.html",
      name: "Microsoft Excel",
      capabilities: [
        "Track Excel practice hours",
        "Manage Excel vital tasks",
        "Upload Excel files and templates",
        "Embed Excel tutorial videos",
        "Take Excel study notes",
        "View focus area for data analysis",
        "Get AI-powered Excel suggestions",
        "Monitor daily progress"
      ],
      sections: ["Hero with skill image", "AI Smart Suggestions", "Today's Focus", "Vital Tasks", "Time Tracker", "Notes", "Files & Documents", "Learning Videos"],
      purpose: "Master data analysis and spreadsheet skills"
    },
    powerpoint: {
      path: "powerpoint.html",
      name: "Microsoft PowerPoint",
      capabilities: [
        "Track presentation practice time",
        "Manage PowerPoint vital tasks",
        "Upload presentations and templates",
        "Embed presentation tutorial videos",
        "Take notes on design principles",
        "View daily presentation focus",
        "Get AI presentation tips",
        "Track slide design progress"
      ],
      sections: ["Hero with skill image", "AI Smart Suggestions", "Today's Focus", "Vital Tasks", "Time Tracker", "Notes", "Files & Documents", "Learning Videos"],
      purpose: "Create compelling presentations and visual storytelling"
    },
    canva: {
      path: "canva.html",
      name: "Canva Design",
      capabilities: [
        "Track graphic design practice",
        "Manage Canva vital tasks",
        "Upload design files and templates",
        "Embed Canva tutorial videos",
        "Take design notes",
        "View daily design focus",
        "Get AI design suggestions",
        "Monitor creative progress"
      ],
      sections: ["Hero with skill image", "AI Smart Suggestions", "Today's Focus", "Vital Tasks", "Time Tracker", "Notes", "Files & Documents", "Learning Videos"],
      purpose: "Master graphic design without being a designer"
    },
    autocad: {
      path: "autocad.html",
      name: "AutoCAD",
      capabilities: [
        "Track AutoCAD practice hours",
        "Manage CAD vital tasks",
        "Upload drawing files (DWG, DXF, PDF)",
        "Embed AutoCAD tutorial videos",
        "Take technical drawing notes",
        "View daily CAD focus",
        "Get AI AutoCAD tips",
        "Track drafting progress"
      ],
      sections: ["Hero with skill image", "AI Smart Suggestions", "Today's Focus", "Vital Tasks", "Time Tracker", "Notes", "Files & Documents", "Learning Videos"],
      purpose: "Create precise technical drawings professionally"
    },
    sap2000: {
      path: "sap2000.html",
      name: "SAP2000",
      capabilities: [
        "Track structural analysis practice",
        "Manage SAP2000 vital tasks",
        "Upload analysis files and reports",
        "Embed SAP2000 tutorial videos",
        "Take structural engineering notes",
        "View daily analysis focus",
        "Get AI structural tips",
        "Monitor modeling progress"
      ],
      sections: ["Hero with skill image", "AI Smart Suggestions", "Today's Focus", "Vital Tasks", "Time Tracker", "Notes", "Files & Documents", "Learning Videos"],
      purpose: "Master structural analysis and design software"
    },
    robot: {
      path: "robot.html",
      name: "Robot Structural Analysis",
      capabilities: [
        "Track Robot software practice",
        "Manage structural design tasks",
        "Upload analysis files",
        "Embed Robot tutorial videos",
        "Take engineering notes",
        "View daily design focus",
        "Get AI structural advice",
        "Track analysis progress"
      ],
      sections: ["Hero with skill image", "AI Smart Suggestions", "Today's Focus", "Vital Tasks", "Time Tracker", "Notes", "Files & Documents", "Learning Videos"],
      purpose: "Advanced structural engineering software mastery"
    },
    english: {
      path: "english.html",
      name: "English Communication",
      capabilities: [
        "Track English practice time",
        "Manage English vital tasks",
        "Upload reading materials",
        "Embed English tutorial videos",
        "Take language notes",
        "View daily language focus",
        "Get AI language tips",
        "Monitor communication progress"
      ],
      sections: ["Hero with skill image", "AI Smart Suggestions", "Today's Focus", "Vital Tasks", "Time Tracker", "Notes", "Files & Documents", "Learning Videos"],
      purpose: "Master professional English for technical fields"
    }
  },

  // Common Features Across All Skill Pages
  commonFeatures: {
    timeTracking: {
      description: "Log and monitor hours spent practicing each skill",
      location: "Every skill page has a time badge showing hours practiced today"
    },
    vitalTasks: {
      description: "Manage the 20% of tasks that drive 80% of results (Pareto Principle)",
      location: "Vital 20% Tasks card on each skill page",
      capabilities: ["Add tasks", "Check off completed tasks", "Delete tasks", "Tasks persist locally"]
    },
    fileUpload: {
      description: "Upload and organize learning materials",
      location: "Files & Documents section on each skill page",
      capabilities: ["Upload PDFs, Word, Excel, PowerPoint, images, zip files", "50MB max per file", "Download anytime", "Delete when no longer needed", "Stored locally in IndexedDB"],
      supported: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".png", ".jpg", ".jpeg", ".zip"]
    },
    videoEmbedding: {
      description: "Embed and watch tutorial videos directly in KELYLO",
      location: "Learning Videos section on each skill page",
      capabilities: ["Add videos from YouTube, Vimeo, Google Drive", "Direct video links (.mp4, .webm, .ogg)", "Play in fullscreen modal", "Delete videos", "Stored locally"],
      supported: ["YouTube", "Vimeo", "Google Drive", "Direct video files"]
    },
    notes: {
      description: "Take and save notes about concepts and learnings",
      location: "Notes section on each skill page",
      capabilities: ["Type notes", "Auto-save", "Persistent storage", "Per-skill notes"]
    },
    aiAssistant: {
      description: "Get AI-powered help, suggestions, and guidance",
      location: "Floating chat button on every page (including home)",
      capabilities: [
        "Ask questions about any skill",
        "Get personalized task suggestions",
        "Analyze uploaded documents",
        "Receive motivational support",
        "Learn how to use KELYLO features",
        "Works offline with local knowledge base",
        "Context-aware responses based on current page"
      ]
    },
    offlineMode: {
      description: "Works without internet after first visit",
      capabilities: ["All pages cached", "Tasks and notes stored locally", "Files accessible offline", "Videos (external) need internet", "AI uses local fallback offline"]
    },
    pwaFeatures: {
      description: "Progressive Web App capabilities",
      capabilities: ["Install on any device", "Works like native app", "Offline support", "Fast loading", "Push notifications ready"]
    }
  },

  // About KELYLO
  about: {
    name: "KELYLO",
    description: "KELYLO is a Progressive Web App (PWA) designed to help you master essential professional skills. Track your progress, manage tasks, and achieve your learning goals.",
    features: [
      "Track time spent on each skill",
      "Manage vital 20% tasks using Pareto principle",
      "Upload and organize learning materials",
      "Embed and watch tutorial videos",
      "AI-powered learning assistance",
      "Works offline after first visit",
      "Installable on any device"
    ],
    purpose: "Help professionals master critical skills like Microsoft Office, AutoCAD, SAP2000, and more through focused practice and smart tracking."
  },

  // Skills Information
  skills: {
    word: {
      name: "Microsoft Word",
      description: "Master document creation and formatting",
      why: "Clean documents make you credible. Word mastery means you can deliver any report fast.",
      tips: [
        "Use styles for consistent formatting",
        "Master keyboard shortcuts for speed",
        "Learn table of contents automation",
        "Practice mail merge for efficiency",
        "Use templates for common documents"
      ],
      tasks: [
        "Create a professional report with table of contents",
        "Design a business letter template",
        "Practice formatting academic papers",
        "Master track changes for collaboration",
        "Create forms with fill-in fields"
      ]
    },
    excel: {
      name: "Microsoft Excel",
      description: "Analyze data and create powerful spreadsheets",
      why: "Excel skills turn raw data into decisions. Master it and you become indispensable.",
      tips: [
        "Learn pivot tables for data analysis",
        "Master VLOOKUP and INDEX-MATCH",
        "Use conditional formatting effectively",
        "Practice creating dynamic charts",
        "Learn basic macros for automation"
      ],
      tasks: [
        "Create a budget tracker with formulas",
        "Build a dashboard with pivot tables",
        "Practice data validation and dropdowns",
        "Create interactive charts",
        "Automate reports with macros"
      ]
    },
    powerpoint: {
      name: "Microsoft PowerPoint",
      description: "Create compelling presentations",
      why: "Great presentations get projects approved. Master PowerPoint to communicate ideas visually.",
      tips: [
        "Use master slides for consistency",
        "Keep text minimal, use visuals",
        "Practice smooth transitions",
        "Learn animation timing",
        "Design with the 6x6 rule"
      ],
      tasks: [
        "Create a project proposal presentation",
        "Design custom templates",
        "Practice presenting with speaker notes",
        "Build animated infographics",
        "Create interactive slideshows"
      ]
    },
    canva: {
      name: "Canva",
      description: "Design professional graphics without being a designer",
      why: "Visual content gets more engagement. Canva makes professional design accessible to everyone.",
      roadmap: [
        {
          week: "Week 1-2: Foundations",
          focus: "Interface & Basics",
          tasks: [
            "Complete Canva's built-in tutorial",
            "Explore the template library (50+ templates)",
            "Master the drag-and-drop system",
            "Learn element positioning and alignment",
            "Practice resizing and cropping images"
          ]
        },
        {
          week: "Week 3-4: Design Elements",
          focus: "Text, Colors & Shapes",
          tasks: [
            "Study typography basics (fonts, hierarchy)",
            "Learn color theory and palettes",
            "Master background removal tool",
            "Create custom shapes and icons",
            "Practice layering elements"
          ]
        },
        {
          week: "Week 5-6: Brand Identity",
          focus: "Consistency & Templates",
          tasks: [
            "Create a brand kit with colors and fonts",
            "Design your own templates from scratch",
            "Learn about white space and composition",
            "Create social media post series (10+ posts)",
            "Export for different platforms"
          ]
        },
        {
          week: "Week 7-8: Advanced Projects",
          focus: "Real-World Applications",
          tasks: [
            "Design complete marketing materials",
            "Create animated social media content",
            "Build presentation templates",
            "Design infographics with data",
            "Create logos and branding elements"
          ]
        }
      ],
      tips: [
        "Use templates as starting points",
        "Maintain consistent brand colors",
        "Master the alignment tools",
        "Learn to create custom templates",
        "Export in the right format for each use"
      ],
      tasks: [
        "Design social media graphics",
        "Create marketing materials",
        "Build presentation templates",
        "Design infographics",
        "Make custom logos and branding"
      ]
    },
    autocad: {
      name: "AutoCAD",
      description: "Create precise technical drawings",
      why: "AutoCAD is the standard for technical drawings. Learn it to communicate designs professionally.",
      tips: [
        "Master keyboard shortcuts for speed",
        "Use layers for organization",
        "Learn dimensioning standards",
        "Practice with blocks and references",
        "Understand coordinate systems"
      ],
      tasks: [
        "Draw building floor plans",
        "Create elevation drawings",
        "Practice 3D modeling basics",
        "Design mechanical parts",
        "Create construction details"
      ]
    },
    sap2000: {
      name: "SAP2000",
      description: "Structural analysis and design software",
      why: "SAP2000 is essential for structural engineering. Master it to analyze and design safe structures.",
      tips: [
        "Understand structural modeling basics",
        "Learn load combinations properly",
        "Master result interpretation",
        "Practice with simple models first",
        "Verify results with hand calculations"
      ],
      tasks: [
        "Model simple beam structures",
        "Analyze frame buildings",
        "Design concrete members",
        "Practice seismic analysis",
        "Study steel connection design"
      ]
    },
    robot: {
      name: "Robot Structural Analysis",
      description: "Structural engineering software",
      why: "Robot helps engineers design safe structures efficiently through advanced analysis.",
      tips: [
        "Start with basic frame analysis",
        "Learn material property definitions",
        "Master load case combinations",
        "Understand output interpretation",
        "Practice iterative design process"
      ],
      tasks: [
        "Analyze steel frame structures",
        "Design reinforced concrete elements",
        "Model complex loading scenarios",
        "Generate calculation reports",
        "Optimize structural members"
      ]
    },
    english: {
      name: "English Communication",
      description: "Professional English for technical fields",
      why: "Clear English communication opens global opportunities. Master it to share your expertise worldwide.",
      tips: [
        "Read technical articles daily",
        "Practice writing clear emails",
        "Record yourself speaking",
        "Learn technical vocabulary",
        "Watch English technical videos"
      ],
      tasks: [
        "Write project reports in English",
        "Present technical concepts clearly",
        "Practice email communication",
        "Read and summarize technical papers",
        "Join English technical discussions"
      ]
    }
  },

  // Common Questions and Answers
  faqs: [
    {
      q: ["hi", "hello", "hey", "greetings"],
      a: "Hello! I'm your KELYLO AI Assistant. I'm here to help you master professional skills like Microsoft Office, AutoCAD, SAP2000, and more. What would you like to learn today?"
    },
    {
      q: ["what is kelylo", "what is this", "about kelylo", "tell me about kelylo"],
      a: "KELYLO is your personal Progressive Web App for mastering essential professional skills. I help you:\n\n• Track your learning time\n• Manage vital tasks (20% that drive 80% results)\n• Upload and organize study materials\n• Access tutorial videos\n• Get AI-powered guidance\n• Work offline after first visit\n\nYou can install KELYLO on any device and access it anytime!"
    },
    {
      q: ["how to use", "how does it work", "guide", "tutorial"],
      a: "Here's how to use KELYLO:\n\n1. **Choose a skill** - Click on Word, Excel, PowerPoint, etc.\n2. **Track your time** - Log hours spent practicing\n3. **Add vital tasks** - Focus on the 20% that matters most\n4. **Upload files** - Store learning materials\n5. **Add videos** - Embed tutorials from YouTube, Vimeo, etc.\n6. **Check progress** - Review your learning journey\n7. **Chat with me** - Get help and suggestions anytime!\n\nStart by clicking a skill that interests you!"
    },
    {
      q: ["features", "what can i do", "capabilities"],
      a: "KELYLO offers powerful features:\n\n✅ **Skill Tracking**: Monitor 8 essential skills\n✅ **Time Logging**: Track practice hours\n✅ **Task Management**: Focus on vital 20% tasks\n✅ **File Upload**: Store PDFs, docs, presentations\n✅ **Video Library**: Embed and watch tutorials\n✅ **AI Assistant**: Get personalized guidance (that's me!)\n✅ **Smart Suggestions**: Receive custom learning tasks\n✅ **Offline Mode**: Works without internet\n✅ **PWA**: Install on phone, tablet, or desktop\n\nWhat would you like to try first?"
    },
    {
      q: ["skills", "what skills", "available skills"],
      a: "KELYLO helps you master 8 essential skills:\n\n📝 **Microsoft Word** - Document creation\n📊 **Microsoft Excel** - Data analysis\n🎨 **PowerPoint** - Presentations\n🖼️ **Canva** - Graphic design\n📐 **AutoCAD** - Technical drawings\n🏗️ **SAP2000** - Structural analysis\n🔧 **Robot** - Engineering software\n🌍 **English** - Professional communication\n\nWhich skill would you like to improve?"
    },
    {
      q: ["how to improve", "get better", "learn faster", "tips"],
      a: "Here are proven strategies to improve faster:\n\n1. **Apply the 80/20 rule** - Focus on the vital 20% of skills that deliver 80% of results\n2. **Practice daily** - Even 30 minutes of focused practice beats 3 hours once a week\n3. **Use spaced repetition** - Review concepts regularly\n4. **Learn by doing** - Build real projects, not just tutorials\n5. **Track your time** - Awareness drives improvement\n6. **Get feedback** - Share your work and iterate\n7. **Teach others** - Teaching solidifies your understanding\n\nWhich skill would you like to focus on?"
    },
    {
      q: ["upload file", "add file", "how to upload"],
      a: "To upload files to KELYLO:\n\n1. Go to any skill page (Word, Excel, etc.)\n2. Scroll to the **Files & Documents** section\n3. Click the **Upload** button\n4. Select your files (PDF, Word, Excel, etc.)\n5. Files are stored locally in your browser\n\nYou can:\n• Download files anytime\n• Delete files you no longer need\n• Upload up to 50MB per file\n• Access files offline\n\nFiles are private and stay on your device!"
    },
    {
      q: ["add video", "upload video", "embed video"],
      a: "To add learning videos:\n\n1. Go to any skill page\n2. Find the **Learning Videos** section\n3. Click **Add Video**\n4. Paste a video URL (YouTube, Vimeo, Google Drive, etc.)\n5. Give it a title\n6. Click Save\n\nSupported sources:\n• YouTube\n• Vimeo\n• Google Drive\n• Direct video links (.mp4, .webm)\n\nVideos play directly in KELYLO!"
    },
    {
      q: ["offline", "work offline", "no internet"],
      a: "Yes! KELYLO works offline:\n\n✅ **After first visit**: All pages cached\n✅ **Your data**: Tasks, notes, files stay local\n✅ **Videos**: External videos need internet\n✅ **AI features**: Need internet for Gemini API\n\nFor best offline experience:\n1. Visit all skill pages once\n2. Upload files locally\n3. Download videos if possible\n4. Add tasks and notes\n\nYour progress is always saved locally!"
    },
    {
      q: ["install", "add to home", "pwa"],
      a: "Install KELYLO as an app:\n\n**On Desktop:**\n1. Click the install icon in address bar\n2. Or click menu > Install KELYLO\n\n**On Mobile:**\n1. Open in browser (Chrome/Safari)\n2. Tap Share (iOS) or Menu (Android)\n3. Select 'Add to Home Screen'\n\n**Benefits:**\n✅ Opens in its own window\n✅ Faster launch\n✅ Works offline\n✅ Feels like a native app\n\nTry it now!"
    },
    {
      q: ["verse", "bible verse", "daily verse", "scripture", "verses", "spiritual", "faith"],
      a: "KELYLO includes 125 Bible verses organized into 4 spiritual themes:\n\n📖 **Service** (Verses 1-25): Called to serve as purpose and identity\n💰 **Provision** (Verses 26-45): God's promises for diligent workers\n💪 **Resilience** (Verses 46-75): Strength to endure and rise again\n🎯 **Discipline** (Verses 76-100): Self-control, training, and correction\n\n**Where to find them:**\n• A new verse appears daily in the footer\n• All verses rotate through the homepage carousel\n• Each verse includes its reference and theme\n\n**Purpose:** Combining skill mastery with spiritual strength builds both competence and character. Your journey is about becoming excellent in what you do AND who you are!\n\nCheck the footer or homepage carousel for today's inspiration! 🙏"
    },
    {
      q: ["delete", "remove", "clear data"],
      a: "To manage your data:\n\n**Delete specific items:**\n• Files: Click trash icon next to file\n• Videos: Click trash icon next to video\n• Tasks: Uncheck and remove from list\n\n**Clear all data:**\n1. Open browser settings\n2. Clear site data for KELYLO\n3. Refresh the page\n\n⚠️ Warning: Clearing data deletes all tasks, files, and settings. This cannot be undone!"
    }
  ],

  // Skill-specific quick responses
  quickResponses: {
    suggestions: "Here are personalized suggestions for {skill}:\n\n1. **Practice fundamentals** - Master the core features first\n2. **Build a project** - Apply skills to something real\n3. **Review daily** - Spend 15 minutes reviewing concepts\n4. **Find a mentor** - Learn from someone experienced\n5. **Track your progress** - Log time and tasks here in KELYLO\n\nWhat specific area would you like help with?",
    
    motivation: "Remember: Every expert was once a beginner. Your consistent practice in {skill} will compound over time. Focus on progress, not perfection. You're building skills that will serve you for decades. Keep going! 💪",
    
    resources: "Great learning resources for {skill}:\n\n• YouTube tutorials (search '{skill} tutorial')\n• Official documentation\n• Online courses (Udemy, Coursera, LinkedIn Learning)\n• Practice projects\n• Community forums\n\nWould you like specific recommendations?",
    
    troubleshooting: "Having trouble with {skill}? Try this:\n\n1. **Break it down** - Focus on one concept at a time\n2. **Find examples** - Search for similar projects\n3. **Practice more** - Repetition builds skill\n4. **Ask for help** - Use forums or find a mentor\n5. **Document learnings** - Write what you discover\n\nWhat specific challenge are you facing?"
  },

  // Default responses
  defaults: {
    unknown: "I'm not sure about that, but I'd love to help! I can assist with:\n\n• Learning any of the 8 skills in KELYLO\n• Managing your tasks and time\n• Uploading files and videos\n• Getting study tips and suggestions\n• Using KELYLO features\n\nWhat would you like to know?",
    
    encouragement: [
      "You're doing great! Keep practicing!",
      "Every hour of practice brings you closer to mastery!",
      "Consistency is key. You're on the right track!",
      "Small daily improvements lead to massive results!",
      "Your future self will thank you for this effort!"
    ],
    
    bibleVerses: {
      description: "125 Bible verses organized by spiritual themes to inspire and strengthen",
      themes: {
        service: "25 verses about serving others as mission and purpose (Mark 10:45, Matthew 23:11-12, Galatians 5:13, etc.)",
        provision: "20 verses about God's provision for diligent workers (Proverbs 11:24-25, Malachi 3:10, 2 Corinthians 9:6-8, etc.)",
        resilience: "30 verses about strength to endure and rise again (Proverbs 24:16, Micah 7:8, Isaiah 40:31, Philippians 4:13, etc.)",
        discipline: "25 verses about self-control, training, and correction (Hebrews 12:6-11, Proverbs 12:1, 1 Corinthians 9:27, etc.)"
      },
      usage: "A different verse appears daily in the footer to motivate and encourage your growth journey. All verses also rotate through the homepage carousel for inspiration.",
      purpose: "Combine skill mastery with spiritual strength - building both competence and character"
    }
  },

  // Intelligent Agent: Search across all pages and capabilities
  searchAgent: {
    // Search for capabilities across all pages
    findCapability(query) {
      const results = [];
      const searchTerms = query.toLowerCase().split(' ');
      
      // Search through pages
      for (const [pageId, pageInfo] of Object.entries(KELYLO_KNOWLEDGE.pages)) {
        const pageText = `${pageInfo.name} ${pageInfo.capabilities.join(' ')} ${pageInfo.sections.join(' ')} ${pageInfo.purpose}`.toLowerCase();
        
        const matches = searchTerms.filter(term => pageText.includes(term));
        if (matches.length > 0) {
          results.push({
            page: pageInfo.name,
            path: pageInfo.path,
            relevance: matches.length / searchTerms.length,
            capabilities: pageInfo.capabilities,
            purpose: pageInfo.purpose
          });
        }
      }
      
      // Search through common features
      for (const [featureId, featureInfo] of Object.entries(KELYLO_KNOWLEDGE.commonFeatures)) {
        const featureText = `${featureId} ${featureInfo.description} ${featureInfo.capabilities ? featureInfo.capabilities.join(' ') : ''}`.toLowerCase();
        
        const matches = searchTerms.filter(term => featureText.includes(term));
        if (matches.length > 0) {
          results.push({
            feature: featureId,
            description: featureInfo.description,
            location: featureInfo.location,
            relevance: matches.length / searchTerms.length,
            capabilities: featureInfo.capabilities || []
          });
        }
      }
      
      // Sort by relevance
      return results.sort((a, b) => b.relevance - a.relevance);
    },
    
    // Get all capabilities of a specific page
    getPageCapabilities(pageName) {
      const page = Object.values(KELYLO_KNOWLEDGE.pages).find(p => 
        p.name.toLowerCase().includes(pageName.toLowerCase()) || 
        p.path.toLowerCase().includes(pageName.toLowerCase())
      );
      
      if (page) {
        return {
          name: page.name,
          path: page.path,
          capabilities: page.capabilities,
          sections: page.sections,
          purpose: page.purpose
        };
      }
      return null;
    },
    
    // Find where a specific feature is available
    findFeature(featureName) {
      const feature = KELYLO_KNOWLEDGE.commonFeatures[featureName];
      if (feature) {
        return feature;
      }
      
      // Search in feature descriptions
      for (const [key, value] of Object.entries(KELYLO_KNOWLEDGE.commonFeatures)) {
        if (value.description.toLowerCase().includes(featureName.toLowerCase())) {
          return { name: key, ...value };
        }
      }
      return null;
    },
    
    // Get comprehensive answer based on intelligent search
    intelligentSearch(query) {
      const results = this.findCapability(query);
      
      if (results.length === 0) {
        return null;
      }
      
      // Build response from top results
      let response = "";
      
      // Top page results
      const pages = results.filter(r => r.page).slice(0, 3);
      if (pages.length > 0) {
        response += "**Found in these pages:**\n\n";
        pages.forEach(page => {
          response += `📄 **${page.page}**\n`;
          response += `• ${page.purpose}\n`;
          response += `• Capabilities: ${page.capabilities.slice(0, 3).join(', ')}\n\n`;
        });
      }
      
      // Top feature results
      const features = results.filter(r => r.feature).slice(0, 2);
      if (features.length > 0) {
        response += "**Related features:**\n\n";
        features.forEach(feature => {
          response += `✨ **${feature.feature}**\n`;
          response += `• ${feature.description}\n`;
          if (feature.location) response += `• Location: ${feature.location}\n`;
          response += '\n';
        });
      }
      
      return response || null;
    }
  }
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.KELYLO_KNOWLEDGE = KELYLO_KNOWLEDGE;
}
