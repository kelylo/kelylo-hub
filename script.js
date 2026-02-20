const END_DATE = "2026-09-20T23:59:59";
const LANG_KEY = "ambition_language";

// Internationalization
const TRANSLATIONS = {
  en: {
    "motto": "7 months. 20 hours weekly. Zero excuses.",
    "skill.motto": "Focus one skill at a time.",
    "hero.tagline": "Master Your Craft",
    "hero.title": "BECOME SOMEBODY",
    "hero.subtitle": "7 months • 20 hours/week • Master the 20% that delivers 80%",
    "skills.title": "8 Tools to Master",
    "nav.home": "Home",
    "nav.manage": "Manage Skills",
    "why.title": "Your Why",
    "why.default": "I'm tired of being broke. In 7 months, I will master the skills that change my life.",
    "countdown.title": "Time Left",
    "countdown.target": "Target: Sept 20, 2026",
    "dailyQuote.title": "Daily Quote",
    "motivation.title": "Motivation"
  },
  fr: {
    "motto": "7 mois. 20 heures par semaine. Aucune excuse.",
    "skill.motto": "Concentrez-vous sur une compétence à la fois.",
    "hero.tagline": "Maitriser Votre Art",
    "hero.title": "DEVENIR QUELQU'UN",
    "hero.subtitle": "7 mois • 20h/semaine • Maîtriser les 20% qui donnent 80%",
    "skills.title": "8 Outils à Maîtriser",
    "nav.home": "Accueil",
    "nav.manage": "Gérer les Compétences",
    "why.title": "Votre Pourquoi",
    "why.default": "J'en ai marre d'être fauché. Dans 7 mois, je maîtriserai les compétences qui changeront ma vie.",
    "countdown.title": "Temps Restant",
    "countdown.target": "Objectif: 20 Sept 2026",
    "dailyQuote.title": "Citation du Jour",
    "motivation.title": "Motivation"
  }
};

let currentLang = localStorage.getItem(LANG_KEY) || 'en';

const translate = (key) => {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en'][key] || key;
};

const updatePageLanguage = () => {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.hasAttribute('contenteditable')) {
      const stored = localStorage.getItem(`ambition_why_${currentLang}`);
      if (!stored) el.textContent = translate(key);
      else el.textContent = stored;
    } else {
      el.textContent = translate(key);
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
};

const initLanguageSwitcher = () => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      localStorage.setItem(LANG_KEY, currentLang);
      updatePageLanguage();
    });
  });
  updatePageLanguage();
};

const SKILLS = [
  {
    id: "word",
    name: "Word",
    icon: "fa-file-word",
    image: "images/9.jpg",
    accent: "#2b5797",
    why: "Clean documents make you credible. Word mastery means you can deliver any report fast.",
    tasks: ["Styles", "Section Breaks", "Table of Contents", "Mail Merge"]
  },
  {
    id: "powerpoint",
    name: "PowerPoint",
    icon: "fa-file-powerpoint",
    image: "images/10.jpg",
    accent: "#c43e1c",
    why: "Slide clarity turns ideas into buy-in. You design once and reuse forever.",
    tasks: ["Slide Master", "SmartArt", "Selection Pane", "Align/Duplicate shortcuts"]
  },
  {
    id: "canva",
    name: "Canva",
    icon: "fa-palette",
    image: "images/11.jpg",
    accent: "#00c4cc",
    why: "Visuals win attention. Canva lets you publish fast with brand consistency.",
    tasks: ["Brand Kit", "Magic Resize", "Background Remover", "Template utilization"]
  },
  {
    id: "excel",
    name: "Excel",
    icon: "fa-file-excel",
    image: "images/12.jpg",
    accent: "#1d6f42",
    why: "Excel is the language of numbers. Control data and you control decisions.",
    tasks: ["Tables", "XLOOKUP", "PivotTables", "Keyboard shortcuts"]
  },
  {
    id: "autocad",
    name: "AutoCAD",
    icon: "fa-ruler-combined",
    image: "images/2.jpg",
    accent: "#d83b01",
    why: "Precision drafting means trust. AutoCAD is how ideas become plans.",
    tasks: ["Keyboard commands", "Layers", "Blocks", "Layouts/Viewports"]
  },
  {
    id: "sap2000",
    name: "SAP2000",
    icon: "fa-diagram-project",
    image: "images/3.jpg",
    accent: "#005a9c",
    why: "Structural insight comes from clean models. SAP2000 is the engineer's simulator.",
    tasks: ["Define-Draw-Assign-Analyze-Design", "Load Combinations", "Interpreting diagrams", "Code-check"]
  },
  {
    id: "robot",
    name: "ROBOT",
    icon: "fa-robot",
    image: "images/4.jpg",
    accent: "#8b5cf6",
    why: "Robot turns loads into decisions. Learn the workflow and the results.",
    tasks: ["Core workflow", "Load combinations", "Code checks", "Interface differences"]
  },
  {
    id: "english",
    name: "English",
    icon: "fa-language",
    image: "images/5.jpg",
    accent: "#7c3aed",
    why: "English multiplies your opportunities. Daily immersion builds fluency.",
    tasks: ["Listening", "Speaking", "Vocabulary", "Grammar"]
  }
];

// ─── Skill Management ────────────────────────────────────────────────────────
const CUSTOM_SKILLS_KEY  = "ambition_custom_skills";
const DELETED_SKILLS_KEY = "ambition_deleted_skills";

const loadCustomSkills = () => {
  try { return JSON.parse(localStorage.getItem(CUSTOM_SKILLS_KEY) || "[]"); }
  catch { return []; }
};

const loadDeletedSkills = () => {
  try { return JSON.parse(localStorage.getItem(DELETED_SKILLS_KEY) || "[]"); }
  catch { return []; }
};

const saveCustomSkills  = (arr) => localStorage.setItem(CUSTOM_SKILLS_KEY,  JSON.stringify(arr));
const saveDeletedSkills = (arr) => localStorage.setItem(DELETED_SKILLS_KEY, JSON.stringify(arr));

const getActiveSkills = () => {
  const deleted = loadDeletedSkills();
  const custom  = loadCustomSkills();
  return [
    ...SKILLS.filter(s => !deleted.includes(s.id)),
    ...custom
  ];
};

const deleteSkill = (id) => {
  if (SKILLS.some(s => s.id === id)) {
    const arr = loadDeletedSkills();
    if (!arr.includes(id)) saveDeletedSkills([...arr, id]);
  } else {
    saveCustomSkills(loadCustomSkills().filter(s => s.id !== id));
  }
};

const addCustomSkill = ({ name, icon, accent, why, tasks }) => {
  const id = "custom_" + Date.now();
  const custom = loadCustomSkills();
  custom.push({ id, name, icon, accent, isCustom: true,
    why: why || `Master ${name} to advance your career.`,
    tasks: tasks.length ? tasks : ["Core concept", "Practice task", "Project"]
  });
  saveCustomSkills(custom);
  return id;
};

const restoreAllSkills = () => {
  saveDeletedSkills([]);
};

// ─── Skill Manager Modal ─────────────────────────────────────────────────────
const ICON_OPTIONS = [
  { value: "fa-bolt",             label: "Bolt"        },
  { value: "fa-code",             label: "Code"        },
  { value: "fa-pen-nib",          label: "Design"      },
  { value: "fa-chart-line",       label: "Analytics"   },
  { value: "fa-database",         label: "Database"    },
  { value: "fa-camera",           label: "Photo"       },
  { value: "fa-music",            label: "Music"       },
  { value: "fa-video",            label: "Video"       },
  { value: "fa-globe",            label: "Web"         },
  { value: "fa-flask",            label: "Science"     },
  { value: "fa-calculator",       label: "Math"        },
  { value: "fa-book",             label: "Reading"     },
  { value: "fa-pencil",           label: "Writing"     },
  { value: "fa-microphone",       label: "Speaking"    },
  { value: "fa-wrench",           label: "Tools"       },
  { value: "fa-lightbulb",        label: "Ideas"       },
  { value: "fa-brain",            label: "Thinking"    },
  { value: "fa-paint-brush",      label: "Art"         },
  { value: "fa-mobile-screen",    label: "Mobile"      },
  { value: "fa-server",           label: "Server"      },
];

const ACCENT_OPTIONS = [
  "#8B5CF6","#3B82F6","#10B981","#EC4899",
  "#F59E0B","#EF4444","#06B6D4","#6366F1",
  "#14B8A6","#F97316","#84CC16","#A855F7",
];

const renderManagerModal = () => {
  const existing = document.getElementById("skillManagerModal");
  if (existing) existing.remove();

  const deleted  = loadDeletedSkills();
  const active   = getActiveSkills();

  const allSkills = [
    ...SKILLS.map(s => ({ ...s, deletable: true, isBuiltIn: true,  hidden: deleted.includes(s.id) })),
    ...loadCustomSkills().map(s => ({ ...s, deletable: true, isBuiltIn: false, hidden: false }))
  ];

  const modal = document.createElement("div");
  modal.id = "skillManagerModal";
  modal.className = "mgr-overlay";
  modal.innerHTML = `
    <div class="mgr-modal">
      <div class="mgr-header">
        <h2><i class="fa-solid fa-sliders"></i> Manage Skills</h2>
        <button class="mgr-close" id="mgrClose"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="mgr-body">
        <!-- Current skills list -->
        <div class="mgr-section">
          <h3>Current Skills</h3>
          <ul class="mgr-skill-list" id="mgrSkillList">
            ${allSkills.map(s => `
              <li class="mgr-skill-item ${s.hidden ? "mgr-hidden" : ""}" data-id="${s.id}">
                <span class="mgr-skill-dot" style="background:${s.accent}"></span>
                <i class="fa-solid ${s.icon}"></i>
                <span class="mgr-skill-name">${s.name}</span>
                ${s.hidden
                  ? `<span class="mgr-tag">hidden</span>
                     <button class="mgr-btn mgr-restore" data-id="${s.id}" title="Restore">
                       <i class="fa-solid fa-rotate-left"></i> Restore
                     </button>`
                  : `<button class="mgr-btn mgr-delete" data-id="${s.id}" title="Delete">
                       <i class="fa-solid fa-trash"></i> Delete
                     </button>`
                }
              </li>`).join("")}
          </ul>
        </div>

        <div class="mgr-divider"></div>

        <!-- Add new skill -->
        <div class="mgr-section">
          <h3>Add New Skill</h3>
          <div class="mgr-form">
            <div class="mgr-row">
              <label>Name</label>
              <input id="mgrName" type="text" placeholder="e.g. Blender, Python…" maxlength="30" />
            </div>

            <div class="mgr-row">
              <label>Why it matters</label>
              <input id="mgrWhy" type="text" placeholder="One sentence – why master this?" />
            </div>

            <div class="mgr-row">
              <label>Starter tasks <span style="color:var(--text-dim);font-weight:400">(comma-separated)</span></label>
              <input id="mgrTasks" type="text" placeholder="Task 1, Task 2, Task 3" />
            </div>

            <div class="mgr-row">
              <label>Color</label>
              <div class="mgr-colors" id="mgrColors">
                ${ACCENT_OPTIONS.map((c, i) => `
                  <button class="mgr-color-btn ${i === 0 ? "selected" : ""}"
                    data-color="${c}" style="background:${c}" title="${c}"></button>
                `).join("")}
              </div>
            </div>

            <div class="mgr-row">
              <label>Icon</label>
              <div class="mgr-icons" id="mgrIcons">
                ${ICON_OPTIONS.map((o, i) => `
                  <button class="mgr-icon-btn ${i === 0 ? "selected" : ""}"
                    data-icon="${o.value}" title="${o.label}">
                    <i class="fa-solid ${o.value}"></i>
                  </button>
                `).join("")}
              </div>
            </div>

            <button class="mgr-add-btn" id="mgrAddBtn">
              <i class="fa-solid fa-plus"></i> Add Skill
            </button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.appendChild(modal);

  // Close
  document.getElementById("mgrClose").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  // Delete / Restore
  modal.querySelectorAll(".mgr-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      deleteSkill(btn.dataset.id);
      renderManagerModal();
      renderSidebar(document.body.dataset.page === "landing" ? "index" : document.body.dataset.skill);
    });
  });

  modal.querySelectorAll(".mgr-restore").forEach(btn => {
    btn.addEventListener("click", () => {
      const deleted = loadDeletedSkills().filter(id => id !== btn.dataset.id);
      saveDeletedSkills(deleted);
      renderManagerModal();
      renderSidebar(document.body.dataset.page === "landing" ? "index" : document.body.dataset.skill);
    });
  });

  // Color picker
  let selectedColor = ACCENT_OPTIONS[0];
  modal.querySelectorAll(".mgr-color-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      modal.querySelectorAll(".mgr-color-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedColor = btn.dataset.color;
    });
  });

  // Icon picker
  let selectedIcon = ICON_OPTIONS[0].value;
  modal.querySelectorAll(".mgr-icon-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      modal.querySelectorAll(".mgr-icon-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedIcon = btn.dataset.icon;
    });
  });

  // Add skill
  document.getElementById("mgrAddBtn").addEventListener("click", () => {
    const name = document.getElementById("mgrName").value.trim();
    if (!name) { document.getElementById("mgrName").focus(); return; }

    const why   = document.getElementById("mgrWhy").value.trim();
    const raw   = document.getElementById("mgrTasks").value.trim();
    const tasks = raw ? raw.split(",").map(t => t.trim()).filter(Boolean) : [];

    const id = addCustomSkill({ name, icon: selectedIcon, accent: selectedColor, why, tasks });
    renderManagerModal();
    renderSidebar(document.body.dataset.page === "landing" ? "index" : document.body.dataset.skill);

    // Flash the new nav item
    setTimeout(() => {
      const nav = document.getElementById("navLinks");
      const link = nav?.querySelector(`[href="skill.html?id=${id}"]`);
      if (link) link.classList.add("nav-flash");
    }, 80);
  });
};

const initSkillManager = () => {
  document.querySelectorAll(".open-skill-manager").forEach(btn => {
    btn.addEventListener("click", renderManagerModal);
  });
};
// ─────────────────────────────────────────────────────────────────────────────

const QUOTES = [
  "An investment in knowledge pays the best interest. -- Benjamin Franklin",
  "The future belongs to those who learn more skills and combine them in creative ways. -- Robert Greene",
  "You don't learn to walk by following rules. You learn by doing, and by falling over. -- Richard Branson",
  "I am always doing that which I cannot do, in order that I may learn how to do it. -- Pablo Picasso",
  "Knowing is not enough; we must apply. Willing is not enough; we must do. -- Bruce Lee",
  "Everything is a learning process. Anytime you fall over, it's just teaching you to stand up the next time. -- Joel Edgerton",
  "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice. -- Brian Herbert",
  "Develop a passion for learning. If you do, you will never cease to grow. -- Anthony J. D'Angelo",
  "Change is the end result of all true learning. -- Leo Buscaglia",
  "I never lose. I either win or learn. -- Nelson Mandela",
  "You will fail your way to success. Learn from your mistakes and keep moving. -- Skip Prichard",
  "A step towards what you fear is a mile towards mastering it. -- Unknown",
  "Learning is the only thing the mind never exhausts, never fears, and never regrets. -- Leonardo da Vinci",
  "The beautiful thing about learning is that no one can take it away from you. -- B.B. King",
  "Formal education will make you a living; self-education will make you a fortune. -- Jim Rohn",
  "The only skill that will be important in the 21st century is the skill of learning new skills. Everything else will become obsolete over time. -- Peter Drucker",
  "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones. -- Benjamin Franklin",
  "The best time to plant a tree was 20 years ago. The second best time is now. -- Chinese Proverb",
  "If you think education is expensive, try ignorance. -- Andy McIntyre",
  "Someone is sitting in the shade today because someone planted a tree a long time ago. -- Warren Buffett",
  "The only thing worse than training your employees and losing them is not training them and keeping them. -- Zig Ziglar",
  "It's not about having time. It's about making time. -- Marie Forleo",
  "You don't have to be great to start, but you have to start to be great. -- Zig Ziglar",
  "The difference between who you are and who you want to be is what you do. -- Unknown",
  "What you get by achieving your goals is not as important as what you become by achieving your goals. -- Zig Ziglar",
  "The key is not to prioritize what's on your schedule, but to schedule your priorities. -- Stephen Covey",
  "Until we can manage time, we can manage nothing else. -- Peter Drucker",
  "The most successful people are the ones who know how to focus on the few things that make the biggest difference. -- Cal Newport",
  "If you want to be a lion, you must train with lions. If you want to be average, stay with the herd. -- Matshona Dhliwayo",
  "You will never change your life until you change something you do daily. The secret of your success is found in your daily routine. -- John C. Maxwell",
  "Tell me and I forget. Teach me and I remember. Involve me and I learn. -- Benjamin Franklin",
  "Learning is not attained by chance; it must be sought for with ardor and attended to with diligence. -- Abigail Adams",
  "For the things we have to learn before we can do them, we learn by doing them. -- Aristotle",
  "The only source of knowledge is experience. -- Albert Einstein",
  "In learning, you will teach, and in teaching, you will learn. -- Phil Collins",
  "I hear and I forget. I see and I remember. I do and I understand. -- Confucius",
  "The expert in anything was once a beginner. -- Helen Hayes",
  "Every artist was first an amateur. -- Ralph Waldo Emerson",
  "Live as if you were to die tomorrow. Learn as if you were to live forever. -- Mahatma Gandhi",
  "It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change. -- Charles Darwin",
  "The measure of intelligence is the ability to change. -- Albert Einstein",
  "When you're finished changing, you're finished. -- Benjamin Franklin",
  "Intellectual growth should commence at birth and cease only at death. -- Albert Einstein",
  "The mind, once stretched by a new idea, never returns to its original dimensions. -- Ralph Waldo Emerson",
  "All growth depends upon activity. There is no development physically or intellectually without effort, and effort means work. -- Calvin Coolidge",
  "The only way to make sense out of change is to plunge into it, move with it, and join the dance. -- Alan Watts",
  "Your life does not get better by chance, it gets better by change. -- Jim Rohn",
  "Champions realise that defeat - and learning from it even more than from winning - is part of the path to mastery. -- Unknown",
  "Mastery is not a function of genius or talent. It is a function of time and intense focus applied to a particular field of knowledge. -- Robert Greene",
  "The ultimate victory in competition is derived from the inner satisfaction of knowing that you have done your best and that you have gotten the most out of what you had to give. -- Howard Cosell",
  "Anyone who has never made a mistake has never tried anything new. -- Albert Einstein",
  "Mistakes are the portals of discovery. -- James Joyce",
  "Failure is simply the opportunity to begin again, this time more intelligently. -- Henry Ford",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. -- Winston Churchill",
  "Our greatest glory is not in never falling, but in rising every time we fall. -- Confucius",
  "The master has failed more times than the beginner has even tried. -- Stephen McCranie",
  "Fall seven times, stand up eight. -- Japanese Proverb",
  "Discipline is choosing between what you want now and what you want most. -- Abraham Lincoln",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. -- Aristotle",
  "The pain of discipline is nothing like the pain of regret. -- Sarah Bombell",
  "You'll never change your life until you change something you do daily. -- John C. Maxwell",
  "Motivation is what gets you started. Habit is what keeps you going. -- Jim Rohn",
  "It does not matter how slowly you go as long as you do not stop. -- Confucius",
  "The difference between the impossible and the possible lies in a person's determination. -- Tommy Lasorda",
  "When you feel like quitting, think about why you started. -- Unknown",
  "Most people fail, not because of lack of desire, but because of lack of commitment. -- Vince Lombardi",
  "The only limit to our realization of tomorrow will be our doubts of today. -- Franklin D. Roosevelt",
  "It always seems impossible until it's done. -- Nelson Mandela",
  "The gem cannot be polished without friction, nor man perfected without trials. -- Chinese Proverb",
  "I'm tired of being broke. -- You",
  "Poverty is the worst form of violence. -- Mahatma Gandhi",
  "The way to get started is to quit talking and begin doing. -- Walt Disney",
  "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it. -- Jordan Belfort",
  "Do not wait; the time will never be just right. Start where you stand, and work with whatever tools you may have at your command, and better tools will be found as you go along. -- Napoleon Hill",
  "If you're going through hell, keep going. -- Winston Churchill",
  "The most common way people give up their power is by thinking they don't have any. -- Alice Walker",
  "You cannot escape the responsibility of tomorrow by evading it today. -- Abraham Lincoln",
  "There is no passion to be found playing small - in settling for a life that is less than the one you are capable of living. -- Nelson Mandela",
  "The future depends on what you do today. -- Mahatma Gandhi",
  "It was character that got us out of bed, commitment that moved us into action, and discipline that enabled us to follow through. -- Zig Ziglar",
  "The secret of getting ahead is getting started. -- Mark Twain",
  "The best way to predict the future is to create it. -- Peter Drucker",
  "Become the person who would have achieved the goal. -- Benjamin Hardy",
  "The only person you are destined to become is the person you decide to be. -- Ralph Waldo Emerson",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. -- Ralph Waldo Emerson",
  "You are the average of the five people you spend the most time with. -- Jim Rohn",
  "The future belongs to those who prepare for it today. -- Malcolm X",
  "It is never too late to be what you might have been. -- George Eliot",
  "First, say to yourself what you would be; and then do what you have to do. -- Epictetus",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. -- Steve Jobs",
  "Your time is limited, so don't waste it living someone else's life. -- Steve Jobs",
  "You must be the change you wish to see in the world. -- Mahatma Gandhi",
  "The scale of your impact on the world is the only true measure of the rewards you'll receive. -- Earl Nightingale",
  "Think of service as a lever. The more value you provide, the greater the force you generate to lift your own life. -- Earl Nightingale",
  "You will never discover your own strength until you use it to help another stand. -- Mahatma Gandhi",
  "Your identity isn't found in isolation, but in the connections forged through selfless service. -- Mahatma Gandhi",
  "What you acquire sustains a heartbeat; what you contribute creates a legacy. -- Winston Churchill",
  "Transactions pay the bills. Contributions write the story of your life. -- Winston Churchill",
  "Don't chase success; define it. And the most enduring definition is the value you've added to the world. -- Albert Einstein",
  "Success is a report card on the past. Being of value is an investment in the future. -- Albert Einstein",
  "The quickest path to higher ground is paved by the hands you help up along the way. -- Booker T. Washington",
  "Elevation is not a solo climb; it's a team sport. Lift others, and you rise with them. -- Booker T. Washington",
  "Your existence on this planet isn't a gift; it's a lease. Service is the currency with which you renew it. -- Muhammad Ali",
  "Think of your life as a property you inhabit. Service is the maintenance that keeps it in good standing. -- Muhammad Ali",
  "The question that echoes through every stage of life isn't 'What am I becoming?', but 'Who am I becoming for?' -- Martin Luther King Jr.",
  "Forget 'What's in it for me?' The question that shapes a meaningful life is, 'What am I giving from me?' -- Martin Luther King Jr.",
  "The world tells you success is a trophy on your shelf. But the quiet truth is, success is the dent you leave in someone else's hardship. -- Unknown",
  "Profit is applause. Service is the performance. Focus on the performance, and the applause will take care of itself. -- Unknown",
  "Don't measure your life by the years you accumulate, but by the lives you touch. -- Unknown",
  "Ambition without service is just a ladder leaning against the wrong wall. -- Unknown",
  "In a world that is constantly asking 'What can I take?', the person who asks 'What can I give?' becomes a magnet for opportunity. -- Unknown",
  "Trust is the only currency that never depreciates. And service is the only mint that produces it. -- Unknown",
  "People will forget your product, forget your price, but they will never forget how you made them feel. And making them feel valued starts with serving them. -- Maya Angelou",
  "Your expertise opens the door, but your genuine care invites people to stay. -- Unknown",
  "Short-term thinking extracts value. Long-term thinking creates it. Service is the ultimate long game. -- Unknown",
  "If you want to build a ship, don't drum up the men to gather wood, divide the work, and give orders. Instead, teach them to long for the endless immensity of the sea. -- Antoine de Saint-Exupéry",
  "The best way to build your future is to help build someone else's. -- Unknown",
  "Service is not a cost. It's the most powerful investment you can make in your own relevance. -- Unknown",
  "The mystery of who you are is solved in the act of giving yourself away. -- Unknown",
  "We thought we were building a business to serve our needs. We realized we needed to serve the business's purpose to find our own. -- Unknown",
  "You have two hands: one to help yourself, and one to help others. -- Audrey Hepburn",
  "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well. -- Ralph Waldo Emerson",
  "They don't care how much you know until they know how much you care. -- Theodore Roosevelt"
];

const SPEECHES = {
  monday: {
    title: "Start Strong (Morning)",
    time: "Say this before your first session.",
    body: `You are not where you want to be. Say it out loud. "I am not where I want to be." Good. Now say the second part: "But I know exactly where I'm going."

The next 7 months are not about talent. They're not about luck. They're about 3 hours a day when no one is watching. They're about opening the software when you're tired. They're about failing at a task and doing it again until it works.

Warren Buffett said the best investment pays the best interest. You are investing in the only asset that cannot be taken from you -- your mind, your hands, your ability to execute.

The person who opens Excel at 6 AM and the person who stays in bed are the same person -- just separated by a decision. Choose.

See you at your desk.`
  },
  tuesday: {
    title: "Build the Habit (Midday)",
    time: "Read this before your second block.",
    body: `You don't need perfect conditions. You need to show up. When the work feels simple, stay. When it feels heavy, stay. Every rep teaches your body and mind who is in charge.

The 20% that gives 80% is found by doing the basics with ruthless consistency. Today is a vote for the person you are becoming. Cast it.`
  },
  wednesday: {
    title: "Resilience Check (Evening)",
    time: "Read this when you feel resistance.",
    body: `Resilience is not a mood. It is a decision you repeat. You are allowed to be tired. You are not allowed to quit.

You will fail your way to success. Learn from your mistakes and keep moving. Every time you return to the work, you prove your future is stronger than your fear.`
  },
  thursday: {
    title: "Skill Combination (Morning)",
    time: "Say this before you start.",
    body: `The future belongs to those who learn more skills and combine them in creative ways. You are not just learning one tool -- you are building a system. Let that thought make you dangerous.

Stay focused on the 20% that moves the needle. Output over overthinking.`
  },
  friday: {
    title: "Finish the Week (Evening)",
    time: "Say this before your last session today.",
    body: `Most people coast on Friday. You will close the week with intent. The grind is the advantage. The plateau is where winners are made.

One more hour. One more task. The future is being forged right now.`
  },
  saturday: {
    title: "Long Game (Morning)",
    time: "Read this before your deep work block.",
    body: `Mastery is not a function of talent. It is time and intense focus applied to a field. Put in the hours and let the math work in your favor.

What you get by achieving your goals is not as important as what you become by achieving your goals.`
  },
  sunday: {
    title: "Reset and Reflect (Night)",
    time: "Say this before planning the week.",
    body: `This week was not about perfection. It was about becoming. Review what you learned, forgive the misses, and set the next target.

You are building a life you respect. Keep going.`
  }
};

const VERSES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // I. SERVICE AS A MISSION (1-25) - Called to serve as purpose and identity
  // ═══════════════════════════════════════════════════════════════════════════
  { ref: "Mark 10:45", theme: "Service", text: "For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many." },
  { ref: "Matthew 23:11-12", theme: "Service", text: "The greatest among you will be your servant. For those who exalt themselves will be humbled, and those who humble themselves will be exalted." },
  { ref: "Galatians 5:13", theme: "Service", text: "You, my brothers and sisters, were called to be free. But do not use your freedom to indulge the flesh; rather, serve one another humbly in love." },
  { ref: "1 Peter 4:10", theme: "Service", text: "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms." },
  { ref: "John 13:14-15", theme: "Service", text: "Now that I, your Lord and Teacher, have washed your feet, you also should wash one another's feet. I have set you an example that you should do as I have done for you." },
  { ref: "Mark 10:43-44", theme: "Service", text: "Whoever wants to become great among you must be your servant, and whoever wants to be first must be slave of all." },
  { ref: "Matthew 25:40", theme: "Service", text: "Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me." },
  { ref: "James 1:27", theme: "Service", text: "Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress and to keep oneself from being polluted by the world." },
  { ref: "Ephesians 6:7", theme: "Service", text: "Serve wholeheartedly, as if you were serving the Lord, not people." },
  { ref: "Romans 15:1", theme: "Service", text: "We who are strong ought to bear with the failings of the weak and not to please ourselves." },
  { ref: "Galatians 6:2", theme: "Service", text: "Carry each other's burdens, and in this way you will fulfill the law of Christ." },
  { ref: "1 Timothy 6:18", theme: "Service", text: "Command them to do good, to be rich in good deeds, and to be generous and willing to share." },
  { ref: "Hebrews 13:16", theme: "Service", text: "And do not forget to do good and to share with others, for with such sacrifices God is pleased." },
  { ref: "Mark 10:42-43", theme: "Service", text: "Jesus called them together and said, 'You know that those who are regarded as rulers of the Gentiles lord it over them... Not so with you. Instead, whoever wants to become great among you must be your servant.'" },
  { ref: "Romans 14:7", theme: "Service", text: "None of us lives for ourselves alone, and none of us dies for ourselves alone." },
  { ref: "Matthew 20:28", theme: "Service", text: "Just as the Son of Man did not come to be served, but to serve." },
  { ref: "1 Peter 4:11", theme: "Service", text: "If anyone serves, they should do so with the strength God provides, so that in all things God may be praised through Jesus Christ." },
  { ref: "Matthew 5:14-16", theme: "Service", text: "You are the light of the world. A town built on a hill cannot be hidden... let your light shine before others, that they may see your good deeds and glorify your Father in heaven." },
  { ref: "Ephesians 2:10", theme: "Service", text: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do." },
  { ref: "Matthew 5:16", theme: "Service", text: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven." },
  { ref: "Isaiah 58:10", theme: "Service", text: "If you spend yourselves in behalf of the hungry and satisfy the needs of the oppressed, then your light will rise in the darkness, and your night will become like the noonday." },
  { ref: "1 John 3:18", theme: "Service", text: "Dear children, let us not love with words or speech but with actions and in truth." },
  { ref: "Matthew 10:8", theme: "Service", text: "Freely you have received; freely give." },
  { ref: "Luke 6:38", theme: "Service", text: "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap." },
  { ref: "Matthew 25:40", theme: "Service", text: "The King will reply, 'Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me.'" },

  // ═══════════════════════════════════════════════════════════════════════════
  // II. PROVISION & MAKING A LIVING (26-45) - God's promises for diligent workers
  // ═══════════════════════════════════════════════════════════════════════════
  { ref: "Proverbs 11:24-25", theme: "Provision", text: "One person gives freely, yet gains even more; another withholds unduly, but comes to poverty. A generous person will prosper; whoever refreshes others will be refreshed." },
  { ref: "Proverbs 19:17", theme: "Provision", text: "Whoever is kind to the poor lends to the LORD, and he will reward them for what they have done." },
  { ref: "Proverbs 3:9-10", theme: "Provision", text: "Honor the LORD with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing, and your vats will brim over with new wine." },
  { ref: "Malachi 3:10", theme: "Provision", text: "Bring the whole tithe into the storehouse... Test me in this, says the LORD Almighty, and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it." },
  { ref: "Acts 20:35", theme: "Provision", text: "In everything I did, I showed you that by this kind of hard work we must help the weak, remembering the words the Lord Jesus himself said: 'It is more blessed to give than to receive.'" },
  { ref: "Proverbs 22:9", theme: "Provision", text: "The generous will themselves be blessed, for they share their food with the poor." },
  { ref: "2 Corinthians 9:6-7", theme: "Provision", text: "Whoever sows sparingly will also reap sparingly, and whoever sows generously will also reap generously. Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." },
  { ref: "2 Corinthians 9:8", theme: "Provision", text: "And God is able to bless you abundantly, so that in all things at all times, having all that you need, you will abound in every good work." },
  { ref: "Proverbs 13:11", theme: "Provision", text: "Dishonest money dwindles away, but whoever gathers money little by little makes it grow." },
  { ref: "Proverbs 10:4", theme: "Provision", text: "Lazy hands make for poverty, but diligent hands bring wealth." },
  { ref: "Proverbs 14:23", theme: "Provision", text: "All hard work brings a profit, but mere talk leads only to poverty." },
  { ref: "Proverbs 12:11", theme: "Provision", text: "Those who work their land will have abundant food, but those who chase fantasies have no sense." },
  { ref: "Proverbs 16:3", theme: "Provision", text: "Commit to the LORD whatever you do, and he will establish your plans." },
  { ref: "Proverbs 10:22", theme: "Provision", text: "The blessing of the LORD brings wealth, without painful toil for it." },
  { ref: "Acts 20:35", theme: "Provision", text: "I have shown you that by working hard in this way we must help the weak." },
  { ref: "Colossians 3:23", theme: "Provision", text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters." },
  { ref: "2 Thessalonians 3:10", theme: "Provision", text: "For even when we were with you, we gave you this rule: 'The one who is unwilling to work shall not eat.'" },
  { ref: "1 Thessalonians 4:11-12", theme: "Provision", text: "Make it your ambition to lead a quiet life: You should mind your own business and work with your hands, just as we told you, so that your daily life may win the respect of outsiders and so that you will not be dependent on anybody." },
  { ref: "Proverbs 13:22", theme: "Provision", text: "A good person leaves an inheritance for their children's children, but a sinner's wealth is stored up for the righteous." },
  { ref: "Ecclesiastes 5:12", theme: "Provision", text: "The sleep of a laborer is sweet, whether they eat little or much, but as for the rich, their abundance permits them no sleep." },

  // ═══════════════════════════════════════════════════════════════════════════
  // III. RESILIENCE (46-75) - Strength to endure, rise again, and persevere
  // ═══════════════════════════════════════════════════════════════════════════
  { ref: "Proverbs 24:16", theme: "Resilience", text: "Though the righteous fall seven times, they rise again, but the wicked stumble when calamity strikes." },
  { ref: "Micah 7:8", theme: "Resilience", text: "Do not gloat over me, my enemy! Though I have fallen, I will arise. Though I sit in darkness, the LORD will be my light." },
  { ref: "Psalm 37:23-24", theme: "Resilience", text: "The steps of a good man are ordered by the LORD, and He delights in his way. Though he fall, he shall not be utterly cast down; for the LORD upholds him with His hand." },
  { ref: "Psalm 145:14", theme: "Resilience", text: "The LORD upholds all who fall and lifts up all who are bowed down." },
  { ref: "Isaiah 40:31", theme: "Resilience", text: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint." },
  { ref: "Job 5:19", theme: "Resilience", text: "He will deliver you from six troubles; in seven no harm will touch you." },
  { ref: "2 Corinthians 4:8-9", theme: "Resilience", text: "We are hard pressed on every side, but not crushed; perplexed, but not in despair; persecuted, but not abandoned; struck down, but not destroyed." },
  { ref: "Philippians 3:13-14", theme: "Resilience", text: "Brothers and sisters, I do not consider myself yet to have taken hold of it. But one thing I do: Forgetting what is behind and straining toward what is ahead, I press on toward the goal." },
  { ref: "Jeremiah 1:19", theme: "Resilience", text: "They will fight against you but will not overcome you, for I am with you and will rescue you, declares the LORD." },
  { ref: "Isaiah 40:29", theme: "Resilience", text: "He gives strength to the weary and increases the power of the weak." },
  { ref: "Philippians 4:13", theme: "Resilience", text: "I can do all this through him who gives me strength." },
  { ref: "2 Corinthians 12:9", theme: "Resilience", text: "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.' Therefore I will boast all the more gladly about my weaknesses, so that Christ's power may rest on me." },
  { ref: "Psalm 27:1", theme: "Resilience", text: "The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—of whom shall I be afraid?" },
  { ref: "Psalm 46:1-3", theme: "Resilience", text: "God is our refuge and strength, an ever-present help in trouble. Therefore we will not fear, though the earth give way and the mountains fall into the heart of the sea." },
  { ref: "Deuteronomy 31:6", theme: "Resilience", text: "Be strong and courageous. Do not be afraid or terrified because of them, for the LORD your God goes with you; he will never leave you nor forsake you." },
  { ref: "Joshua 1:9", theme: "Resilience", text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go." },
  { ref: "Psalm 20:8", theme: "Resilience", text: "They collapse and fall, but we rise up and stand firm." },
  { ref: "1 Corinthians 15:58", theme: "Resilience", text: "Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the Lord, because you know that your labor in the Lord is not in vain." },
  { ref: "Nahum 1:7", theme: "Resilience", text: "The LORD is good, a refuge in times of trouble. He cares for those who trust in him." },
  { ref: "James 1:2-3", theme: "Resilience", text: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance." },
  { ref: "Romans 5:3-4", theme: "Resilience", text: "Not only so, but we also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope." },
  { ref: "James 1:12", theme: "Resilience", text: "Blessed is the one who perseveres under trial because, having stood the test, that person will receive the crown of life that the Lord has promised to those who love him." },
  { ref: "Hebrews 12:1", theme: "Resilience", text: "Therefore, since we are surrounded by such a great cloud of witnesses, let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us." },
  { ref: "Hebrews 10:36", theme: "Resilience", text: "For you have need of endurance, so that when you have done the will of God, you may receive what was promised." },
  { ref: "1 Corinthians 16:13", theme: "Resilience", text: "Be on your guard; stand firm in the faith; be courageous; be strong." },
  { ref: "1 Peter 5:10", theme: "Resilience", text: "After you have suffered a little while, the God of all grace, who has called you to his eternal glory in Christ, will himself restore, confirm, strengthen, and establish you." },
  { ref: "2 Timothy 4:7", theme: "Resilience", text: "I have fought the good fight, I have finished the race, I have kept the faith." },
  { ref: "1 Thessalonians 5:24", theme: "Resilience", text: "The one who calls you is faithful, and he will do it." },
  { ref: "Romans 8:28", theme: "Resilience", text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose." },
  { ref: "Galatians 6:9", theme: "Resilience", text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." },

  // ═══════════════════════════════════════════════════════════════════════════
  // IV. DISCIPLINE (76-100) - Self-control, training, and correction
  // ═══════════════════════════════════════════════════════════════════════════
  { ref: "Hebrews 12:6", theme: "Discipline", text: "For the Lord disciplines the one he loves, and chastises every son whom he receives." },
  { ref: "Hebrews 12:11", theme: "Discipline", text: "No discipline seems pleasant at the time, but painful. Later on, however, it produces a harvest of righteousness and peace for those who have been trained by it." },
  { ref: "Hebrews 12:7", theme: "Discipline", text: "Endure hardship as discipline; God is treating you as his children. For what children are not disciplined by their father?" },
  { ref: "Proverbs 12:1", theme: "Discipline", text: "Whoever loves discipline loves knowledge, but whoever hates correction is stupid." },
  { ref: "Proverbs 15:32", theme: "Discipline", text: "Those who disregard discipline despise themselves, but the one who heeds correction gains understanding." },
  { ref: "Proverbs 19:20", theme: "Discipline", text: "Listen to advice and accept discipline, and at the end you will be counted among the wise." },
  { ref: "Proverbs 29:15", theme: "Discipline", text: "A rod and a reprimand impart wisdom, but a child left undisciplined disgraces its mother." },
  { ref: "Proverbs 10:17", theme: "Discipline", text: "Whoever heeds discipline shows the way to life, but whoever ignores correction leads others astray." },
  { ref: "Lamentations 3:27", theme: "Discipline", text: "It is good for a man to bear the yoke while he is young." },
  { ref: "1 Corinthians 9:27", theme: "Discipline", text: "But I discipline my body and keep it under control, lest after preaching to others I myself should be disqualified." },
  { ref: "Hebrews 12:11", theme: "Discipline", text: "For the moment all discipline seems painful rather than pleasant, but later it yields the peaceful fruit of righteousness." },
  { ref: "1 Peter 4:7", theme: "Discipline", text: "Be self-controlled and sober-minded for the sake of your prayers." },
  { ref: "2 Timothy 1:7", theme: "Discipline", text: "For God gave us a spirit not of fear but of power and love and self-control." },
  { ref: "1 Timothy 3:2", theme: "Discipline", text: "An overseer must be... self-controlled, sensible, dignified, hospitable, an apt teacher." },
  { ref: "Titus 2:6", theme: "Discipline", text: "Likewise, urge the younger men to be self-controlled." },
  { ref: "Proverbs 25:28", theme: "Discipline", text: "Like a city whose walls are broken through is a person who lacks self-control." },
  { ref: "Proverbs 16:32", theme: "Discipline", text: "Better a patient person than a warrior, one with self-control than one who takes a city." },
  { ref: "Galatians 5:22-23", theme: "Discipline", text: "The fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law." },
  { ref: "1 Peter 1:13", theme: "Discipline", text: "Therefore, with minds that are alert and fully sober, set your hope on the grace to be brought to you when Jesus Christ is revealed at his coming." },
  { ref: "2 Peter 1:5-6", theme: "Discipline", text: "For this very reason, make every effort to add to your faith goodness; and to goodness, knowledge; and to knowledge, self-control; and to self-control, perseverance; and to perseverance, godliness." },
  { ref: "1 Corinthians 9:24-25", theme: "Discipline", text: "Do you not know that in a race all the runners run, but only one gets the prize? Run in such a way as to get the prize. Everyone who competes in the games goes into strict training." },
  { ref: "Titus 1:7-8", theme: "Discipline", text: "Since an overseer manages God's household, he must be blameless—not overbearing, not quick-tempered, not given to drunkenness, not violent, not pursuing dishonest gain. Rather, he must be hospitable, one who loves what is good, who is self-controlled, upright, holy and disciplined." },
  { ref: "1 Timothy 4:7-8", theme: "Discipline", text: "Train yourself to be godly. For physical training is of some value, but godliness has value for all things, holding promise for both the present life and the life to come." },
  { ref: "Proverbs 23:14", theme: "Discipline", text: "If you strike him with the rod, you will save his soul from Sheol." },
  { ref: "Job 5:17", theme: "Discipline", text: "Blessed is the one whom God corrects; so do not despise the discipline of the Almighty." }
];

// Background images for carousel rotation
const CAROUSEL_IMAGES = [
  "images/6.jpg",
  "images/7.jpg",
  "images/8.jpg",
  "images/1.jpg"
];

const CAROUSEL_SLIDES = [
  ...QUOTES.map((text, index) => ({ 
    title: "Quote", 
    text,
    background: CAROUSEL_IMAGES[index % CAROUSEL_IMAGES.length]
  })),
  ...Object.values(SPEECHES).map((speech, index) => ({
    title: speech.title,
    text: `${speech.time}\n\n${speech.body}`,
    background: CAROUSEL_IMAGES[(index + 1) % CAROUSEL_IMAGES.length]
  })),
  ...VERSES.map((verse, index) => ({
    title: `${verse.ref} (${verse.theme || 'Faith'})`,
    text: verse.text,
    background: CAROUSEL_IMAGES[(index + 2) % CAROUSEL_IMAGES.length]
  }))
];

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
const THEME_KEY = "ambition_theme";

const initThemeToggle = () => {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  const btn = byId('themeToggle');
  if (!btn) return;
  const update = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = '<i class="fa-solid ' + (isDark ? 'fa-sun' : 'fa-moon') + '"></i>';
  };
  update();
  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
    }
    update();
  });
};

// ─── Hero tagline quote carousel ──────────────────────────────────────────────
const initHeroTaglineQuotes = () => {
  const el = byId('heroTaglineQuote');
  if (!el) return;
  const quotes = QUOTES.map(q => q.split(' -- ')[0].trim());
  let i = Math.floor(Math.random() * quotes.length);
  el.textContent = quotes[i];
  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => {
      i = (i + 1) % quotes.length;
      el.textContent = quotes[i];
      el.style.opacity = '1';
    }, 500);
  }, 7000);
};

// ─── Skill page with hero image background ────────────────────────
const initSkillBg = (skill) => {
  if (!skill || !skill.image) return;
  // Hero image is displayed via .skill-hero-image in HTML
  // Gradient overlay applied via CSS
};

const byId = (id) => document.getElementById(id);

// Safe element query with error handling
const safeQuery = (selector, context = document) => {
  try {
    return context.querySelector(selector);
  } catch (error) {
    console.warn(`Query selector failed: ${selector}`, error);
    return null;
  }
};

const safeQueryAll = (selector, context = document) => {
  try {
    return context.querySelectorAll(selector);
  } catch (error) {
    console.warn(`QueryAll selector failed: ${selector}`, error);
    return [];
  }
};

const loadTasks = (skill) => {
  const key = `ambition_tasks_${skill.id}`;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error(`Failed to load tasks for ${skill.id}:`, err);
  }
  const initial = skill.tasks.map((text) => ({ text, done: false }));
  try {
    localStorage.setItem(key, JSON.stringify(initial));
  } catch (err) {
    console.error(`Failed to save initial tasks for ${skill.id}:`, err);
  }
  return initial;
};

const saveTasks = (skillId, tasks) => {
  try {
    localStorage.setItem(`ambition_tasks_${skillId}`, JSON.stringify(tasks));
  } catch (err) {
    console.error(`Failed to save tasks for ${skillId}:`, err);
  }
};

const loadNotes = (skillId) => {
  try {
    return localStorage.getItem(`ambition_notes_${skillId}`) || "";
  } catch (err) {
    console.error(`Failed to load notes for ${skillId}:`, err);
    return "";
  }
};

const saveNotes = (skillId, value) => {
  try {
    localStorage.setItem(`ambition_notes_${skillId}`, value);
  } catch (err) {
    console.error(`Failed to save notes for ${skillId}:`, err);
  }
};

const getCountdown = () => {
  const end = new Date(END_DATE);
  const now = new Date();
  const diff = end - now;
  if (diff <= 0) return { days: 0, hours: 0 };
  const hoursTotal = Math.floor(diff / (1000 * 60 * 60));
  return {
    days: Math.floor(hoursTotal / 24),
    hours: hoursTotal % 24
  };
};

const setAccent = (skill) => {
  document.documentElement.style.setProperty("--accent", skill.accent);
  document.documentElement.style.setProperty(
    "--accent-soft",
    `${skill.accent}33`
  );
};

const renderSidebar = (activeId) => {
  // Render to both desktop nav and mobile drawer

  const items = [
    { id: "index", name: translate("nav.home"), icon: "fa-house", href: "index.html" },
    ...getActiveSkills().map((skill) => ({
      id: skill.id,
      name: skill.name,
      icon: skill.icon,
      href: skill.isCustom ? `skill.html?id=${skill.id}` : `${skill.id}.html`
    })),
    {
      id: "manage",
      name: translate("nav.manage") || "Manage Skills",
      icon: "fa-sliders",
      href: "#",
      isManager: true
    }
  ];

  const html = items
    .map((item) => {
      const activeClass = item.id === activeId ? "active" : "";
      const managerClass = item.isManager ? "open-skill-manager nav-manage" : "";
      return `<a class="nav-link ${activeClass} ${managerClass}" href="${item.href}"><i class="fa-solid ${item.icon}"></i> <span>${item.name}</span></a>`;
    })
    .join("");

  [byId("navLinks"), byId("navDrawer")].forEach(nav => {
    if (!nav) return;
    nav.innerHTML = html;
    nav.querySelectorAll(".open-skill-manager").forEach(btn => {
      btn.addEventListener("click", (e) => { e.preventDefault(); renderManagerModal(); });
    });
  });
};

const initNavToggle = () => {
  const toggle = byId("navToggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
    const isOpen = document.body.classList.contains("nav-open");
    toggle.innerHTML = `<i class="fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}"></i>`;
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest(".nav-drawer a")) {
      document.body.classList.remove("nav-open");
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
};

const initCarousel = () => {
  const track = byId("carouselTrack");
  const dots = byId("carouselDots");
  if (!track || !dots) {
    console.warn("Carousel elements not found");
    return;
  }

  track.innerHTML = "";
  dots.innerHTML = "";

  if (CAROUSEL_SLIDES.length === 0) {
    console.warn("No carousel slides to display");
    return;
  }

  CAROUSEL_SLIDES.forEach((slide, index) => {
    const el = document.createElement("div");
    el.className = "carousel-slide";
    el.style.backgroundImage = `url('${slide.background}')`;
    el.innerHTML = `<h2>${slide.title}</h2><p>${slide.text.replace(/\n/g, "<br>")}</p>`;
    track.appendChild(el);

    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      setSlide(index);
      resetTimer();
    });
    dots.appendChild(dot);
  });

  let current = 0;
  const setSlide = (index) => {
    if (index < 0 || index >= CAROUSEL_SLIDES.length) {
      console.warn(`Invalid slide index: ${index}`);
      return;
    }
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    [...dots.children].forEach((child, i) => {
      child.classList.toggle("active", i === current);
    });
  };

  const prev = byId("carouselPrev");
  const next = byId("carouselNext");
  if (prev) prev.addEventListener("click", () => {
    setSlide((current - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
    resetTimer();
  });
  if (next) next.addEventListener("click", () => {
    setSlide((current + 1) % CAROUSEL_SLIDES.length);
    resetTimer();
  });

  let timer = null;
  const resetTimer = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(() => setSlide((current + 1) % CAROUSEL_SLIDES.length), 7000);
  };

  resetTimer();
  console.log(`Carousel initialized with ${CAROUSEL_SLIDES.length} slides`);
};

const getSpeechForToday = () => {
  const day = new Date().getDay();
  const keys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return SPEECHES[keys[day]];
};

const getVerseForToday = () => {
  const day = new Date().getDay();
  return VERSES[day % VERSES.length];
};

const renderFooterMotivation = () => {
  const quote = byId("footerQuote");
  const speech = byId("footerSpeech");
  const verse = byId("footerVerse");
  const pick = getSpeechForToday();
  const versePick = getVerseForToday();

  if (quote) {
    quote.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }
  if (speech && pick) {
    speech.textContent = `${pick.title}\n${pick.time}\n\n${pick.body}`;
  }
  if (verse && versePick) {
    verse.textContent = `${versePick.text} (${versePick.ref})`;
  }
};

const initHeroCycle = () => {
  const heroImg = document.querySelector(".hero-section .hero-image");
  if (!heroImg) return;
  const images = [
    "images/1.jpg","images/9.jpg","images/10.jpg","images/11.jpg",
    "images/12.jpg","images/2.jpg","images/3.jpg","images/4.jpg","images/5.jpg"
  ];
  const dotsEl = byId("heroDots");
  let cur = 0;

  if (dotsEl) {
    dotsEl.innerHTML = images.map((_, i) =>
      `<button aria-label="Slide ${i+1}"${i===0 ? ' class="active"' : ''}></button>`
    ).join("");
  }

  const goTo = (idx) => {
    cur = (idx + images.length) % images.length;
    heroImg.src = images[cur];
    if (dotsEl) [...dotsEl.children].forEach((b, i) => b.classList.toggle("active", i === cur));
  };

  const prev = byId("heroPrev"), next = byId("heroNext");
  if (prev) prev.addEventListener("click", () => { goTo(cur - 1); reset(); });
  if (next) next.addEventListener("click", () => { goTo(cur + 1); reset(); });
  if (dotsEl) dotsEl.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (btn) { goTo([...dotsEl.children].indexOf(btn)); reset(); }
  });

  let timer;
  const reset = () => { clearInterval(timer); timer = setInterval(() => goTo(cur + 1), 6000); };
  reset();
};

const initLanding = () => {
  renderSidebar("index");
  initNavToggle();
  initCarousel();
  initHeroCycle();
  initLanguageSwitcher();
  initThemeToggle();
  initHeroTaglineQuotes();
  initSkillManager();

  const countdown = byId("countdown");
  const quote = byId("dailyQuote");
  const speech = byId("speechText");
  const speechBtn = byId("speechRefresh");
  const why = byId("whyEditable");

  const updateCountdown = () => {
    if (!countdown) return;
    const { days, hours } = getCountdown();
    countdown.textContent = `${days} days ${hours} hours`;
    const heroCD = byId("heroCountdown");
    if (heroCD) heroCD.textContent = `${days} days`;
  };

  if (quote) {
    quote.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }

  const setSpeech = () => {
    if (!speech) return;
    const todaySpeech = getSpeechForToday();
    speech.textContent = `${todaySpeech.title}\n${todaySpeech.time}\n\n${todaySpeech.body}`;
  };

  if (speechBtn) speechBtn.addEventListener("click", setSpeech);
  setSpeech();
  updateCountdown();
  setInterval(updateCountdown, 60000);
  renderFooterMotivation();

  if (why) {
    const stored = localStorage.getItem(`ambition_why_${currentLang}`) || translate("why.default");
    why.textContent = stored;
    why.addEventListener("input", () => {
      localStorage.setItem(`ambition_why_${currentLang}`, why.textContent.trim());
    });
  }
};

const renderTasks = (skill, tasks) => {
  const list = byId("taskList");
  if (!list) return;

  list.innerHTML = tasks
    .map((task, index) => {
      return `
        <li class="task-item">
          <input type="checkbox" ${task.done ? "checked" : ""} data-index="${index}" />
          <span>${task.text}</span>
          <div class="task-actions">
            <button class="icon-button" data-edit="${index}"><i class="fa-solid fa-pen"></i></button>
            <button class="icon-button" data-delete="${index}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </li>
      `;
    })
    .join("");

  list.querySelectorAll("input[type='checkbox']").forEach((box) => {
    box.addEventListener("change", (event) => {
      const idx = Number(event.target.dataset.index);
      tasks[idx].done = event.target.checked;
      saveTasks(skill.id, tasks);
    });
  });

  list.querySelectorAll("button[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.edit);
      const next = prompt("Edit task", tasks[idx].text);
      if (!next) return;
      tasks[idx].text = next.trim();
      saveTasks(skill.id, tasks);
      renderTasks(skill, tasks);
    });
  });

  list.querySelectorAll("button[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.delete);
      tasks.splice(idx, 1);
      saveTasks(skill.id, tasks);
      renderTasks(skill, tasks);
      setFocus(skill, tasks);
    });
  });
};

const setFocus = (skill, tasks) => {
  const focus = byId("todayFocus");
  if (!focus) return;
  const pool = tasks.filter((task) => !task.done);
  const pick = (pool.length ? pool : tasks)[Math.floor(Math.random() * (pool.length ? pool.length : tasks.length))];
  focus.textContent = pick ? pick.text : "Add tasks to generate focus.";
};

const initSkillPage = () => {
  const skillId = document.body.dataset.skill;
  if (!skillId) return;

  const skill = SKILLS.find((item) => item.id === skillId);
  if (!skill) return;

  setAccent(skill);
  renderSidebar(skillId);
  initNavToggle();
  initLanguageSwitcher();
  initThemeToggle();
  initSkillBg(skill);

  const title = byId("skillTitle");
  const why = byId("skillWhy");
  const badge = byId("timeBadge");
  const icon = byId("skillIcon");

  if (title) title.textContent = skill.name;
  if (why) why.textContent = skill.why;
  if (icon) icon.className = `fa-solid ${skill.icon}`;
  if (badge) badge.textContent = skill.id === "english" ? "1 hour daily" : "2.5 hours today";

  const tasks = loadTasks(skill);
  renderTasks(skill, tasks);
  setFocus(skill, tasks);

  const refresh = byId("refreshFocus");
  if (refresh) refresh.addEventListener("click", () => setFocus(skill, tasks));

  const addBtn = byId("addTaskBtn");
  const addInput = byId("newTaskInput");
  if (addBtn && addInput) {
    addBtn.addEventListener("click", () => {
      const value = addInput.value.trim();
      if (!value) return;
      tasks.push({ text: value, done: false });
      addInput.value = "";
      saveTasks(skill.id, tasks);
      renderTasks(skill, tasks);
      setFocus(skill, tasks);
    });
  }

  const notes = byId("notesInput");
  if (notes) {
    notes.value = loadNotes(skill.id);
    notes.addEventListener("input", () => saveNotes(skill.id, notes.value));
  }

  // Initialize resources (files & videos) if ResourcesManager is available
  if (typeof ResourcesManager !== 'undefined') {
    initResourcesManager(skill.id);
  }

  // Initialize AI Smart Suggestions
  if (typeof aiManager !== 'undefined' && CONFIG.AI_FEATURES.SMART_SUGGESTIONS_ENABLED) {
    initAISmartSuggestions(skill);
  }

  if (skill.id === "english") {
    const plan = byId("englishPlan");
    const planBtn = byId("englishRefresh");
    const sessions = [
      "Read a civil engineering article and summarize it in 5 sentences.",
      "Shadow a 5-minute talk, then record your own version.",
      "Write a 200-word email explaining a design change.",
      "Review 15 new technical words and use each in a sentence."
    ];

    const setPlan = () => {
      if (!plan) return;
      plan.textContent = sessions[Math.floor(Math.random() * sessions.length)];
    };

    if (planBtn) planBtn.addEventListener("click", setPlan);
    setPlan();
  }

  initRoadmapPhases(skill.id);

  const scheduled = byId("scheduledSpeech");
  const scheduledVerse = byId("scheduledVerse");
  const pick = getSpeechForToday();
  const versePick = getVerseForToday();
  if (scheduled && pick) {
    scheduled.textContent = `${pick.title}\n${pick.time}\n\n${pick.body}`;
  }
  if (scheduledVerse && versePick) {
    scheduledVerse.textContent = `${versePick.text} (${versePick.ref})`;
  }

  renderFooterMotivation();
  initCollapsibleSections();
};

const initCollapsibleSections = () => {
  try {
    const cards = document.querySelectorAll("body[data-skill] .card");
    let processed = 0;
    
    cards.forEach((card) => {
      const title = card.querySelector(".card-title");
      if (!title || card.dataset.collapsible === "1") return;

      const body = document.createElement("div");
      body.className = "collapsible-body";

      const nodes = [];
      let next = title.nextSibling;
      while (next) {
        const current = next;
        next = next.nextSibling;
        nodes.push(current);
      }
      nodes.forEach((node) => body.appendChild(node));
      card.appendChild(body);

      title.classList.add("collapsible-title");
      if (!title.querySelector(".chevron")) {
        const chevron = document.createElement("span");
        chevron.className = "chevron";
        chevron.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
        title.appendChild(chevron);
      }

      card.classList.add("collapsible-card", "collapsed");
      card.dataset.collapsible = "1";

      const toggle = (forceOpen) => {
        const isCollapsed = card.classList.contains("collapsed");
        const shouldOpen = forceOpen !== undefined ? forceOpen : isCollapsed;
        card.classList.toggle("collapsed", !shouldOpen);
        card.classList.toggle("expanded", shouldOpen);
        body.style.maxHeight = shouldOpen ? `${body.scrollHeight}px` : "0px";
      };

      title.addEventListener("click", (event) => {
        if (event.target.closest("button, a, input, textarea")) return;
        toggle();
      });

      toggle(false);
      processed++;
    });
    
    if (processed > 0) {
      console.log(`Initialized ${processed} collapsible sections`);
    }
  } catch (err) {
    console.error("Failed to initialize collapsible sections:", err);
  }
};

const initRoadmapPhases = (skillId) => {
  const cards = document.querySelectorAll(".roadmap-card");
  if (!cards.length) return;

  cards.forEach((card, cardIndex) => {
    const headings = [...card.querySelectorAll("h4")];
    headings.forEach((heading, index) => {
      const table = heading.nextElementSibling;
      if (!table || table.tagName !== "TABLE") return;

      const phaseId = `${skillId}_phase_${cardIndex}_${index}`;
      const wrapper = document.createElement("div");
      wrapper.className = "roadmap-phase";
      wrapper.dataset.phase = phaseId;

      const summary = document.createElement("div");
      summary.className = "phase-summary";
      summary.innerHTML = `
        <div>
          <h5>${heading.textContent}</h5>
          <p class="phase-desc">Daily focus and hands-on tasks for this phase.</p>
        </div>
        <div class="phase-meta">
          <span class="phase-progress"></span>
          <button class="button secondary phase-start" type="button">Start This Phase</button>
          <span class="phase-chevron"><i class="fa-solid fa-chevron-down"></i></span>
        </div>
      `;

      const body = document.createElement("div");
      body.className = "phase-body";
      body.appendChild(table);

      wrapper.appendChild(summary);
      wrapper.appendChild(body);

      heading.parentNode.insertBefore(wrapper, heading);
      heading.remove();

      setupPhaseTable(wrapper, table, skillId, phaseId);

      summary.addEventListener("click", (event) => {
        if (event.target.closest(".phase-start")) return;
        togglePhase(wrapper);
      });

      const startButton = summary.querySelector(".phase-start");
      if (startButton) {
        startButton.addEventListener("click", () => {
          setActivePhase(skillId, phaseId);
          togglePhase(wrapper, true);
        });
      }
    });
  });

  const active = localStorage.getItem(`roadmap_active_${skillId}`);
  if (active) {
    document.querySelectorAll(".roadmap-phase").forEach((phase) => {
      phase.classList.toggle("phase-active", phase.dataset.phase === active);
      if (phase.dataset.phase === active) togglePhase(phase, true);
    });
  }
};

const setupPhaseTable = (phase, table, skillId, phaseId) => {
  if (table.dataset.enhanced === "1") return;
  table.dataset.enhanced = "1";

  try {
    const headRow = table.querySelector("thead tr");
    if (!headRow) {
      console.warn("Phase table missing header row");
      return;
    }

    const markHead = document.createElement("th");
    markHead.textContent = "Done";
    headRow.insertBefore(markHead, headRow.firstChild);

    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row, index) => {
      const dayText = row.children[0]?.textContent || `Day ${index + 1}`;
      const dayNum = dayText.match(/\d+/)?.[0] || `${index + 1}`;
      const key = `roadmap_${skillId}_${phaseId}_day_${dayNum}`;

      const cell = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "phase-checkbox";
      
      try {
        checkbox.checked = localStorage.getItem(key) === "1";
      } catch (err) {
        console.error(`Failed to load checkbox state for ${key}:`, err);
      }
      
      cell.appendChild(checkbox);
      row.insertBefore(cell, row.firstChild);

      row.classList.toggle("day-complete", checkbox.checked);
      checkbox.addEventListener("change", () => {
        try {
          localStorage.setItem(key, checkbox.checked ? "1" : "0");
          row.classList.toggle("day-complete", checkbox.checked);
          updatePhaseProgress(phase);
        } catch (err) {
          console.error(`Failed to save checkbox state for ${key}:`, err);
        }
      });
    });

    updatePhaseProgress(phase);
  } catch (err) {
    console.error(`Failed to setup phase table for ${phaseId}:`, err);
  }
};

const updatePhaseProgress = (phase) => {
  const boxes = phase.querySelectorAll(".phase-checkbox");
  const done = [...boxes].filter((box) => box.checked).length;
  const progress = phase.querySelector(".phase-progress");
  if (progress) {
    progress.textContent = `${done}/${boxes.length} days completed`;
  }
};

const togglePhase = (phase, forceOpen) => {
  const body = phase.querySelector(".phase-body");
  const isOpen = phase.classList.contains("open");
  const nextOpen = forceOpen === undefined ? !isOpen : forceOpen;
  phase.classList.toggle("open", nextOpen);
  if (body) {
    body.style.maxHeight = nextOpen ? `${body.scrollHeight}px` : "0px";
  }
};

const setActivePhase = (skillId, phaseId) => {
  try {
    localStorage.setItem(`roadmap_active_${skillId}`, phaseId);
    document.querySelectorAll(".roadmap-phase").forEach((phase) => {
      phase.classList.toggle("phase-active", phase.dataset.phase === phaseId);
    });
    console.log(`Set active phase: ${phaseId}`);
  } catch (err) {
    console.error(`Failed to set active phase for ${skillId}:`, err);
  }
};

const initCustomSkillPage = () => {
  const params  = new URLSearchParams(window.location.search);
  const skillId = params.get("id");
  if (!skillId) { window.location.href = "index.html"; return; }

  // Find in custom skills
  const skill = loadCustomSkills().find(s => s.id === skillId);
  if (!skill) { window.location.href = "index.html"; return; }

  // Apply accent colour + hero background
  setAccent(skill);
  document.body.dataset.skill = skillId;

  // Hero: solid accent bg
  const heroBg = byId("skillHeroBg");
  if (heroBg) {
    heroBg.style.background = `linear-gradient(135deg, ${skill.accent}55 0%, ${skill.accent}22 100%)`;
    heroBg.style.position   = "absolute";
    heroBg.style.inset      = "0";
    heroBg.style.zIndex     = "0";
  }

  // Populate hero
  const title = byId("skillTitle");
  const why   = byId("skillWhy");
  const icon  = byId("skillIcon");
  const badge = byId("timeBadge");
  if (title) title.textContent = skill.name;
  if (why)   why.textContent   = skill.why;
  if (icon)  icon.className    = `fa-solid ${skill.icon}`;
  if (badge) badge.textContent = "2.5 hours today";

  // Update page title
  document.title = `${skill.name} | Ambition Hub`;

  renderSidebar(skillId);
  initNavToggle();
  initLanguageSwitcher();
  initThemeToggle();
  initSkillBg(skill);

  const tasks = loadTasks(skill);
  renderTasks(skill, tasks);
  setFocus(skill, tasks);

  const refresh = byId("refreshFocus");
  if (refresh) refresh.addEventListener("click", () => setFocus(skill, tasks));

  const addBtn   = byId("addTaskBtn");
  const addInput = byId("newTaskInput");
  if (addBtn && addInput) {
    addBtn.addEventListener("click", () => {
      const value = addInput.value.trim();
      if (!value) return;
      tasks.push({ text: value, done: false });
      addInput.value = "";
      saveTasks(skill.id, tasks);
      renderTasks(skill, tasks);
      setFocus(skill, tasks);
    });
  }

  const notes = byId("notesInput");
  if (notes) {
    notes.value = loadNotes(skill.id);
    notes.addEventListener("input", () => saveNotes(skill.id, notes.value));
  }

  const scheduled    = byId("scheduledSpeech");
  const scheduledVerse = byId("scheduledVerse");
  const pick         = getSpeechForToday();
  const versePick    = getVerseForToday();
  if (scheduled && pick)
    scheduled.textContent = `${pick.title}\n${pick.time}\n\n${pick.body}`;
  if (scheduledVerse && versePick)
    scheduledVerse.textContent = `${versePick.text} (${versePick.ref})`;

  renderFooterMotivation();
  initCollapsibleSections();
};

// ── RESOURCES MANAGER (FILES & VIDEOS) ───────────────────────────────────
const initResourcesManager = async (skillId) => {
  try {
    await ResourcesManager.initDB();
    
    // File upload handling
    const uploadFileBtn = byId('uploadFileBtn');
    const fileInput = byId('fileInput');
    const filesList = byId('filesList');
    
    if (uploadFileBtn && fileInput) {
      uploadFileBtn.addEventListener('click', () => fileInput.click());
      
      fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        for (const file of files) {
          if (file.size > 50 * 1024 * 1024) { // 50MB limit
            alert(`File "${file.name}" is too large. Maximum size is 50MB.`);
            continue;
          }
          
          try {
            await ResourcesManager.saveFile(skillId, file);
          } catch (error) {
            console.error('Error saving file:', error);
            alert(`Failed to upload "${file.name}". Please try again.`);
          }
        }
        
        fileInput.value = ''; // Reset input
        await renderFiles(skillId);
      });
    }
    
    // Video adding handling
    const addVideoBtn = byId('addVideoBtn');
    const videoUrlInput = byId('videoUrlInput');
    const videoTitleInput = byId('videoTitleInput');
    const videosList = byId('videosList');
    
    if (addVideoBtn && videoUrlInput) {
      addVideoBtn.addEventListener('click', async () => {
        const url = videoUrlInput.value.trim();
        if (!url) {
          alert('Please paste a video URL');
          videoUrlInput.focus();
          return;
        }
        
        const title = videoTitleInput.value.trim() || 'Learning Video';
        
        // Show loading state
        const originalHTML = addVideoBtn.innerHTML;
        addVideoBtn.disabled = true;
        addVideoBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Adding...';
        
        // No try-catch - always succeed (like opening a file)
        await ResourcesManager.saveVideo(skillId, url, title);
        await renderVideos(skillId);
        
        // Clear inputs
        videoUrlInput.value = '';
        videoTitleInput.value = '';
        videoUrlInput.focus();
        
        // Reset button
        addVideoBtn.disabled = false;
        addVideoBtn.innerHTML = originalHTML;
      });
      
      // Allow Enter key to add video
      const handleEnter = (e) => {
        if (e.key === 'Enter') {
          addVideoBtn.click();
        }
      };
      videoUrlInput.addEventListener('keypress', handleEnter);
      videoTitleInput.addEventListener('keypress', handleEnter);
    }
    
    // Video player modal
    const videoModal = byId('videoPlayerModal');
    const closeVideoModal = byId('closeVideoModal');
    const videoPlayerContainer = byId('videoPlayerContainer');
    
    if (closeVideoModal) {
      closeVideoModal.addEventListener('click', () => {
        videoModal.classList.remove('active');
        videoPlayerContainer.innerHTML = ''; // Clear player
      });
      
      // Close on backdrop click
      videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
          videoModal.classList.remove('active');
          videoPlayerContainer.innerHTML = '';
        }
      });
      
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
          videoModal.classList.remove('active');
          videoPlayerContainer.innerHTML = '';
        }
      });
    }
    
    // Initial render
    await renderFiles(skillId);
    await renderVideos(skillId);
    
  } catch (error) {
    console.error('Error initializing ResourcesManager:', error);
  }
};

const renderFiles = async (skillId) => {
  const filesList = byId('filesList');
  if (!filesList) return;
  
  try {
    const files = await ResourcesManager.getFiles(skillId);
    
    if (files.length === 0) {
      filesList.innerHTML = '<p class="empty-state">No files uploaded yet. Click "Upload" to add documents.</p>';
      return;
    }
    
    filesList.innerHTML = files.map(file => {
      const canAnalyze = file.type.includes('text') || file.type.includes('pdf') || 
                         file.name.endsWith('.txt') || file.name.endsWith('.md');
      
      // Show thumbnail for images and videos
      const thumbnailHtml = file.thumbnail ? 
        `<div class="file-thumbnail"><img src="${file.thumbnail}" alt="${file.name}" /></div>` : 
        `<div class="file-icon"><i class="${ResourcesManager.getFileIcon(file.type)}"></i></div>`;
      
      return `
        <div class="file-item" data-file-id="${file.id}">
          ${thumbnailHtml}
          <div class="file-info">
            <div class="file-name" title="${file.name}">${file.name}</div>
            <div class="file-meta">${ResourcesManager.formatFileSize(file.size)} • ${new Date(file.uploadDate).toLocaleDateString()}</div>
          </div>
          <div class="file-actions">
            <button onclick="openFileViewer(${file.id}, '${file.name.replace(/'/g, "\\'")}')” title="Open">
              <i class="fa-solid fa-eye"></i>
            </button>
            ${canAnalyze ? `
              <button onclick="analyzeFileWithAI(${file.id}, '${file.name.replace(/'/g, "\\'")}')" title="Analyze with AI" class="ai-analyze-btn">
                <i class="fa-solid fa-robot"></i>
              </button>
            ` : ''}
            <button onclick="downloadFile(${file.id})" title="Download">
              <i class="fa-solid fa-download"></i>
            </button>
            <button class="delete-btn" onclick="deleteFile(${file.id}, '${skillId}')" title="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error rendering files:', error);
    filesList.innerHTML = '<p class="empty-state">Error loading files.</p>';
  }
};

const renderVideos = async (skillId) => {
  const videosList = byId('videosList');
  if (!videosList) return;
  
  try {
    const videos = await ResourcesManager.getVideos(skillId);
    
    if (videos.length === 0) {
      videosList.innerHTML = '<p class="empty-state">No videos added yet. Click "Add Video" to embed YouTube tutorials.</p>';
      return;
    }
    
    videosList.innerHTML = videos.map((video, index) => `
      <div class="video-item" data-video-id="${video.id}">
        <div class="video-thumbnail" onclick="playVideo(${video.id})" title="Click to play">
          ${video.thumbnail 
            ? `<img src="${video.thumbnail}" alt="${video.title}" onerror="this.parentElement.innerHTML='<div class=\\"video-placeholder\\"><i class=\\"fa-brands fa-youtube\\"></i></div>'" />` 
            : `<div class="video-placeholder"><i class="fa-${video.type === 'youtube' ? 'brands fa-youtube' : video.type === 'vimeo' ? 'brands fa-vimeo' : 'solid fa-video'}"></i></div>`}
          <div class="play-icon">
            <i class="fa-solid fa-play"></i>
          </div>
          <span class="video-number">${index + 1}</span>
        </div>
        <div class="video-info">
          <div class="video-title" title="${video.title}">${video.title}</div>
          <span class="video-type badge">${video.type.toUpperCase()}</span>
        </div>
        <div class="video-actions">
          <button onclick="playVideoInNewTab(${video.id})" title="Open with AI Summary">
            <i class="fa-solid fa-external-link-alt"></i> Open
          </button>
          <button class="delete-btn" onclick="deleteVideo(${video.id}, '${skillId}')" title="Delete video">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error rendering videos:', error);
    videosList.innerHTML = '<p class="empty-state">Error loading videos.</p>';
  }
};

// Global functions for file/video actions
window.openFileViewer = async (fileId, fileName) => {
  try {
    const db = await ResourcesManager.initDB();
    const tx = db.transaction('files', 'readonly');
    const store = tx.objectStore('files');
    const file = await store.get(fileId);
    
    if (file) {
      ResourcesManager.openFileViewer(file);
    }
  } catch (error) {
    console.error('Error opening file viewer:', error);
    alert('Failed to open file.');
  }
};

window.downloadFile = async (fileId) => {
  try {
    const db = await ResourcesManager.initDB();
    const tx = db.transaction('files', 'readonly');
    const store = tx.objectStore('files');
    const file = await store.get(fileId);
    
    if (file) {
      const a = document.createElement('a');
      a.href = file.data;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('Failed to download file.');
  }
};

window.deleteFile = async (fileId, skillId) => {
  if (!confirm('Are you sure you want to delete this file?')) return;
  
  try {
    await ResourcesManager.deleteFile(fileId);
    await renderFiles(skillId);
  } catch (error) {
    console.error('Error deleting file:', error);
    alert('Failed to delete file.');
  }
};

window.playVideo = async (videoId) => {
  try {
    const db = await ResourcesManager.initDB();
    const tx = db.transaction('videos', 'readonly');
    const store = tx.objectStore('videos');
    const video = await store.get(videoId);
    
    if (!video) return;
    
    const modal = byId('videoPlayerModal');
    const container = byId('videoPlayerContainer');
    
    if (video.type === 'direct') {
      // Direct video files with HTML5 player - proper 16:9 aspect ratio
      container.innerHTML = `
        <div style="position: relative; width: 100%; max-width: 1920px; aspect-ratio: 16/9; margin: auto;">
          <video 
            controls 
            autoplay 
            controlsList="nodownload" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; background: #000; border-radius: 8px;"
            onloadedmetadata="this.style.aspectRatio = this.videoWidth + '/' + this.videoHeight">
            <source src="${video.embedUrl}" type="video/mp4">
            <source src="${video.embedUrl}" type="video/webm">
            <source src="${video.embedUrl}" type="video/ogg">
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    } else {
      // YouTube and other embeds with proper 16:9 ratio and fullscreen support
      container.innerHTML = `
        <div style="position: relative; width: 100%; max-width: 1920px; aspect-ratio: 16/9; margin: auto;">
          <iframe 
            src="${video.embedUrl}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
            allowfullscreen
            webkitallowfullscreen
            mozallowfullscreen
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;">
          </iframe>
        </div>
      `;
    }
    
    modal.classList.add('active');
  } catch (error) {
    console.error('Error playing video:', error);
    alert('Failed to play video.');
  }
};

window.playVideoInNewTab = async (videoId) => {
  try {
    const db = await ResourcesManager.initDB();
    const tx = db.transaction('videos', 'readonly');
    const store = tx.objectStore('videos');
    const video = await store.get(videoId);
    
    if (video) {
      // Open in new video player with summarization
      const url = encodeURIComponent(video.originalUrl);
      const title = encodeURIComponent(video.title);
      window.open(`video-player.html?url=${url}&title=${title}`, '_blank');
    }
  } catch (error) {
    console.error('Error opening video player:', error);
    alert('Failed to open video.');
  }
};

window.openVideoInNewTab = async (videoId) => {
  try {
    const db = await ResourcesManager.initDB();
    const tx = db.transaction('videos', 'readonly');
    const store = tx.objectStore('videos');
    const video = await store.get(videoId);
    
    if (video) {
      window.open(video.originalUrl, '_blank');
    }
  } catch (error) {
    console.error('Error opening video:', error);
  }
};

window.deleteVideo = async (videoId, skillId) => {
  if (!confirm('Are you sure you want to delete this video?')) return;
  
  try {
    await ResourcesManager.deleteVideo(videoId);
    await renderVideos(skillId);
  } catch (error) {
    console.error('Error deleting video:', error);
    alert('Failed to delete video.');
  }
};

const initPage = () => {
  try {
    if (document.body.dataset.page === "landing") {
      initLanding();
    } else if (window.location.pathname.endsWith("skill.html") ||
               window.location.search.includes("id=custom_")) {
      initCustomSkillPage();
    } else {
      initSkillPage();
    }
  } catch (err) {
    console.error("Critical error during page initialization:", err);
  }
};

// ── PWA SERVICE WORKER REGISTRATION ──────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then((registration) => {
        console.log('✓ Service Worker registered (v2.4 - Fast & Fixed)');
        
        // Check for updates every hour (lightweight)
        setInterval(() => {
          registration.update();
        }, 3600000);
      })
      .catch((error) => {
        console.error('✗ Service Worker registration failed:', error);
      });
  });
}

// ── AI SMART SUGGESTIONS ─────────────────────────────────────────────────
async function initAISmartSuggestions(skill) {
  const section = document.getElementById('aiSuggestionsSection');
  const content = document.getElementById('aiSuggestionsContent');
  const refreshBtn = document.getElementById('refreshAISuggestions');
  
  if (!section || !content) return;
  
  // Check if suggestions were recently generated (cache for 4 hours)
  const cacheKey = `ai-suggestions-${skill.id}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      const { suggestions, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      const maxAge = 4 * 3600000; // 4 hours
      
      if (age < maxAge) {
        displaySuggestions(suggestions);
        section.style.display = 'block';
        return;
      }
    } catch (e) {
      // Invalid cache, continue to generate new
    }
  }
  
  // Generate new suggestions
  loadAISuggestions(skill);
  
  // Refresh button handler
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadAISuggestions(skill));
  }
}

async function loadAISuggestions(skill) {
  const section = document.getElementById('aiSuggestionsSection');
  const content = document.getElementById('aiSuggestionsContent');
  
  if (!section || !content) return;
  
  section.style.display = 'block';
  content.innerHTML = `
    <div class="loading-spinner">
      <i class="fa-solid fa-spinner fa-spin"></i> Generating personalized suggestions...
    </div>
  `;
  
  try {
    const suggestions = await aiManager.generateSmartSuggestions(skill.id);
    
    // Cache the suggestions
    const cacheKey = `ai-suggestions-${skill.id}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      suggestions,
      timestamp: Date.now()
    }));
    
    displaySuggestions(suggestions);
    
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    content.innerHTML = `
      <div style="color: var(--text-dim); text-align: center; padding: 20px;">
        <i class="fa-solid fa-exclamation-triangle"></i> 
        <p>Could not generate suggestions. ${error.message}</p>
        <button class="button secondary" onclick="loadAISuggestions(SKILLS.find(s => s.id === '${skill.id}'))" style="margin-top: 12px;">
          Try Again
        </button>
      </div>
    `;
  }
}

function displaySuggestions(suggestions) {
  const content = document.getElementById('aiSuggestionsContent');
  if (!content) return;
  
  // Format the AI response into a nice display
  let formatted = suggestions
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // Extract numbered items if present
  if (formatted.match(/\d+\./)) {
    formatted = formatted
      .replace(/(\d+\.\s)(.+?)(?=<br>|<\/p>|$)/g, '<li>$2</li>')
      .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
  }
  
  content.innerHTML = `
    <div class="ai-suggestions-text">
      <p>${formatted}</p>
    </div>
  `;
}

// Add AI suggestions styling
const aiSuggestionsStyle = document.createElement('style');
aiSuggestionsStyle.textContent = `
  .ai-suggestions-card {
    background: linear-gradient(135deg, #FFF9F0 0%, #FFFFFF 100%);
    border: 2px solid rgba(246, 135, 18, 0.2);
  }
  
  .ai-suggestions-content {
    color: var(--text);
    line-height: 1.8;
  }
  
  .ai-suggestions-text {
    font-size: 0.95rem;
  }
  
  .ai-suggestions-text strong {
    color: var(--brand-navy);
    font-weight: 600;
  }
  
  .ai-suggestions-text ol {
    margin: 12px 0;
    padding-left: 24px;
  }
  
  .ai-suggestions-text li {
    margin: 8px 0;
    color: var(--text);
  }
  
  .loading-spinner {
    text-align: center;
    padding: 24px;
    color: var(--brand-orange);
  }
  
  .loading-spinner i {
    font-size: 1.5rem;
    margin-bottom: 8px;
    display: block;
  }
`;
document.head.appendChild(aiSuggestionsStyle);

// ── AI FILE ANALYSIS ─────────────────────────────────────────────────────
async function analyzeFileWithAI(fileId, fileName) {
  try {
    // Get file from IndexedDB
    const files = await ResourcesManager.getFiles(document.body.dataset.skill);
    const file = files.find(f => f.id === fileId);
    
    if (!file) {
      alert('File not found');
      return;
    }

    // Extract text content
    let textContent = '';
    
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      // For text files, decode from data URL
      const dataUrl = file.data;
      const base64 = dataUrl.split(',')[1];
      textContent = atob(base64);
    } else if (file.type.includes('pdf')) {
      // For PDFs, we'll use a simplified approach (note: full PDF parsing would need pdf.js)
      alert('PDF analysis coming soon! For now, please try with .txt or .md files.');
      return;
    } else {
      alert('This file type is not supported for AI analysis. Please use text files (.txt, .md)');
      return;
    }

    if (!textContent || textContent.length < 10) {
      alert('Could not extract text from this file');
      return;
    }

    // Limit text length to avoid token limits
    const maxLength = 10000;
    if (textContent.length > maxLength) {
      textContent = textContent.substring(0, maxLength) + '... (truncated)';
    }

    // Open chat and send analysis request
    if (window.aiChatUI) {
      window.aiChatUI.openChat();
      
      setTimeout(async () => {
        // Show processing message
        const chatInput = document.getElementById('aiChatInput');
        if (chatInput) {
          chatInput.value = `Analyzing "${fileName}"...`;
          chatInput.disabled = true;
        }

        try {
          // Get AI analysis
          const analysis = await aiManager.analyzeDocument(fileName, textContent, 'notes');
          
          // Enable input
          if (chatInput) {
            chatInput.value = '';
            chatInput.disabled = false;
          }

          // Display result in chat
          window.aiChatUI.addMessage('user', `Analyze my document: ${fileName}`);
          window.aiChatUI.addMessage('ai', `📄 Analysis of "${fileName}":\n\n${analysis}\n\n💡 Would you like me to create a quiz, extract key concepts, or provide additional suggestions?`);
          window.aiChatUI.saveChatHistory();
          
        } catch (error) {
          console.error('Analysis error:', error);
          if (chatInput) {
            chatInput.value = '';
            chatInput.disabled = false;
          }
          window.aiChatUI.addMessage('ai', `Sorry, I couldn't analyze the file: ${error.message}`);
        }
      }, 500);
    } else {
      alert('AI Assistant is not available. Please refresh the page.');
    }
    
  } catch (error) {
    console.error('Error analyzing file:', error);
    alert('Failed to analyze file: ' + error.message);
  }
}

// Add AI analyze button styling
const aiAnalyzeStyle = document.createElement('style');
aiAnalyzeStyle.textContent = `
  .ai-analyze-btn {
    background: linear-gradient(135deg, var(--brand-orange), #ff9838);
    color: white !important;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s;
  }
  
  .ai-analyze-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(246, 135, 18, 0.4);
  }
  
  .file-actions button {
    border: none;
    background: var(--bg-hover);
    color: var(--text);
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .file-actions button:hover {
    background: var(--brand-navy);
    color: white;
  }
  
  .file-actions .delete-btn:hover {
    background: var(--red);
    color: white;
  }
`;
document.head.appendChild(aiAnalyzeStyle);

// ── PWA INSTALL PROMPT ───────────────────────────────────────────────────
let deferredPrompt;
const installPromptDelay = 3000; // Show after 3 seconds

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show custom install prompt after delay
  setTimeout(() => {
    showInstallPromotion();
  }, installPromptDelay);
});

function showInstallPromotion() {
  if (!deferredPrompt) return;
  
  // Check if already dismissed
  if (localStorage.getItem('pwa-install-dismissed') === 'true') return;
  
  // Create install banner
  const banner = document.createElement('div');
  banner.className = 'pwa-install-banner';
  banner.innerHTML = `
    <div class="pwa-install-content">
      <img src="images/logo-best.svg" alt="KELYLO" class="pwa-install-icon" />
      <div class="pwa-install-text">
        <strong>Install KELYLO</strong>
        <p>Get the full app experience on your device</p>
      </div>
      <div class="pwa-install-actions">
        <button class="pwa-install-btn" id="pwaInstallBtn">Install</button>
        <button class="pwa-dismiss-btn" id="pwaDismissBtn">×</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Install button handler
  document.getElementById('pwaInstallBtn').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);
    deferredPrompt = null;
    banner.remove();
  });
  
  // Dismiss button handler
  document.getElementById('pwaDismissBtn').addEventListener('click', () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    banner.remove();
  });
}

// Handle successful installation
window.addEventListener('appinstalled', () => {
  console.log('✓ PWA installed successfully');
  deferredPrompt = null;
});

// ── INITIALIZE PAGE ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", initPage);
