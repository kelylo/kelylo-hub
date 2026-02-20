/**
 * KELYLO AI Chat UI Controller
 * Handles the chat interface, message rendering, and user interactions
 */

// Gemini-style 4-pointed sparkle star SVG — used throughout the chat UI
const SPARKLE_SVG = {
  large: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"/></svg>`,
  medium: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"/></svg>`,
  small: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"/></svg>`
};

class AIChatUI {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.currentSkill = null;

    this.init();
  }

  init() {
    this.injectHTML();
    this.bindEvents();
    this.loadChatHistory();
    this.detectCurrentSkill();
  }

  injectHTML() {
    const chatHTML = `
      <!-- AI Chat Floating Button -->
      <button class="ai-chat-button" id="aiChatButton" title="KELYLO AI">
        ${SPARKLE_SVG.large}
      </button>

      <!-- AI Chat Modal -->
      <div class="ai-chat-modal" id="aiChatModal">
        <div class="ai-chat-container">
          <!-- Header -->
          <div class="ai-chat-header">
            <div class="ai-chat-header-info">
              <div class="ai-avatar">
                ${SPARKLE_SVG.medium}
              </div>
              <div class="ai-chat-title">
                <h3>KELYLO AI</h3>
                <div class="ai-chat-status">
                  <span class="status-indicator"></span>
                  <span>Online & Ready</span>
                </div>
              </div>
            </div>
            <div class="ai-chat-header-actions">
              <button class="ai-chat-new" id="aiChatNew" title="New Chat">
                <i class="fa-solid fa-plus"></i>
              </button>
              <button class="ai-chat-close" id="aiChatClose" title="Close">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div class="ai-chat-messages" id="aiChatMessages">
            <div class="ai-welcome">
              <div class="ai-welcome-icon"><img src="images/ai-bot-icon.svg" alt="AI Assistant" /></div>
              <h4>Hey! I'm KELYLO AI</h4>
              <p>Your learning companion for ${this.currentSkill?.name || 'all 8 skills'}. Ask me anything — study plans, tips, motivation, or just a chat!</p>

              <div class="ai-welcome-suggestions">
                <button class="suggestion-btn" data-suggestion="What should I study in ${this.currentSkill?.name || 'SAP2000'} today?">
                  📚 What to study today?
                </button>
                <button class="suggestion-btn" data-suggestion="Give me a full roadmap for ${this.currentSkill?.name || 'Excel'}">
                  🗺️ Show me the roadmap
                </button>
                <button class="suggestion-btn" data-suggestion="I feel stuck. Can you motivate me?">
                  💪 I need motivation
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="ai-quick-actions">
            <button class="quick-action-btn" data-action="suggest-tasks">
              ✨ Smart Suggestions
            </button>
            <button class="quick-action-btn" data-action="explain-concept">
              📖 Explain Concept
            </button>
            <button class="quick-action-btn" data-action="create-quiz">
              🎓 Create Quiz
            </button>
            <button class="quick-action-btn" data-action="tips">
              💡 Quick Tips
            </button>
          </div>

          <!-- Input Area -->
          <div class="ai-chat-input-area">
            <div class="ai-chat-input-wrapper">
              <textarea
                class="ai-chat-input"
                id="aiChatInput"
                placeholder="Ask me anything..."
                rows="1"
              ></textarea>
            </div>
            <button class="ai-send-button" id="aiSendButton">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
  }

  bindEvents() {
    const chatButton = document.getElementById('aiChatButton');
    const chatModal = document.getElementById('aiChatModal');
    const chatClose = document.getElementById('aiChatClose');
    const chatNew = document.getElementById('aiChatNew');
    const sendButton = document.getElementById('aiSendButton');
    const chatInput = document.getElementById('aiChatInput');

    chatButton?.addEventListener('click', () => this.openChat());
    chatClose?.addEventListener('click', () => this.closeChat());
    chatNew?.addEventListener('click', () => this.clearChat());
    chatModal?.addEventListener('click', (e) => {
      if (e.target === chatModal) this.closeChat();
    });

    sendButton?.addEventListener('click', () => this.sendMessage());
    chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    chatInput?.addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    });

    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleQuickAction(action);
      });
    });

    document.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const suggestion = e.currentTarget.dataset.suggestion;
        this.sendMessage(suggestion);
      });
    });
  }

  detectCurrentSkill() {
    const skillId = document.body.dataset.skill;
    if (skillId && typeof SKILLS !== 'undefined') {
      this.currentSkill = SKILLS.find(s => s.id === skillId);
    }
  }

  openChat() {
    const modal = document.getElementById('aiChatModal');
    modal?.classList.add('active');
    this.isOpen = true;

    setTimeout(() => {
      document.getElementById('aiChatInput')?.focus();
    }, 300);
  }

  closeChat() {
    const modal = document.getElementById('aiChatModal');
    modal?.classList.remove('active');
    this.isOpen = false;
  }

  async sendMessage(text = null) {
    const input = document.getElementById('aiChatInput');
    const message = text || input?.value.trim();

    if (!message) return;

    if (!text) {
      input.value = '';
      input.style.height = 'auto';
    }

    const welcome = document.querySelector('.ai-welcome');
    if (welcome) welcome.remove();

    // Capture conversation history BEFORE adding the current user message
    const conversationHistory = [...this.messages];

    // Add user message to UI and memory
    this.addMessage('user', message);

    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Call Gemini API with full conversation history for context
      const response = await aiManager.chat(message, this.currentSkill, conversationHistory);

      this.hideTypingIndicator();
      this.addMessage('ai', response);
      this.saveChatHistory();

    } catch (error) {
      console.error('AI Error:', error);
      this.hideTypingIndicator();
      this.addMessage('ai', `Sorry, I hit an error: ${error.message}. Please try again.`);
    }
  }

  addMessage(sender, content) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;

    const avatarIcon = sender === 'ai' ? SPARKLE_SVG.small : '<i class="fa-solid fa-user"></i>';

    const messageHTML = `
      <div class="ai-message ${sender}">
        <div class="message-avatar ${sender}">
          ${avatarIcon}
        </div>
        <div class="message-content">
          ${this.formatMessage(content)}
          <div class="message-time">${this.getTimeString()}</div>
        </div>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    this.messages.push({ sender, content, timestamp: Date.now() });
  }

  formatMessage(content) {
    let formatted = content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');

    if (formatted.includes('\n1.') || formatted.includes('<br>1.')) {
      formatted = formatted.replace(/(\d+\.\s.+?)(?=<br>|$)/g, '<li>$1</li>');
      formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    }

    if (formatted.includes('- ') || formatted.includes('• ')) {
      formatted = formatted
        .replace(/[-•]\s(.+?)(<br>|$)/g, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    }

    return `<p>${formatted}</p>`;
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;

    const typingHTML = `
      <div class="ai-message ai typing-indicator-message">
        <div class="message-avatar ai">
          ${SPARKLE_SVG.small}
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator-message');
    typingIndicator?.remove();
  }

  async handleQuickAction(action) {
    const skillName = this.currentSkill?.name || 'this skill';
    const actions = {
      'suggest-tasks': `Based on my current progress, suggest 3-5 specific tasks I should focus on today for ${skillName}.`,
      'explain-concept': `What is the most important concept I should understand in ${skillName} right now?`,
      'create-quiz': `Create 3 quick quiz questions to test my knowledge of ${skillName}.`,
      'tips': `Give me 3 practical tips for mastering ${skillName} faster.`
    };

    const message = actions[action];
    if (message) {
      await this.sendMessage(message);
    }
  }

  getTimeString() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  saveChatHistory() {
    try {
      const history = {
        messages: this.messages.slice(-50),
        skill: this.currentSkill?.id,
        timestamp: Date.now()
      };
      localStorage.setItem('ai-chat-history', JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save chat history:', error);
    }
  }

  loadChatHistory() {
    try {
      const stored = localStorage.getItem('ai-chat-history');
      if (!stored) return;

      const history = JSON.parse(stored);
      const age = Date.now() - history.timestamp;
      const maxAge = 24 * 3600000;

      if (history.skill === this.currentSkill?.id && age < maxAge) {
        this.messages = history.messages || [];

        const messagesContainer = document.getElementById('aiChatMessages');
        if (messagesContainer && this.messages.length > 0) {
          const welcome = messagesContainer.querySelector('.ai-welcome');
          if (welcome) welcome.remove();

          this.messages.forEach(msg => {
            this.addMessageToDOM(msg.sender, msg.content, false);
          });
        }
      }
    } catch (error) {
      console.warn('Failed to load chat history:', error);
    }
  }

  addMessageToDOM(sender, content, scroll = true) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;

    const avatarIcon = sender === 'ai' ? SPARKLE_SVG.small : '<i class="fa-solid fa-user"></i>';

    const messageHTML = `
      <div class="ai-message ${sender}">
        <div class="message-avatar ${sender}">
          ${avatarIcon}
        </div>
        <div class="message-content">
          ${this.formatMessage(content)}
        </div>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

    if (scroll) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  clearChat() {
    if (!confirm('Start a new chat? This will clear your current conversation.')) {
      return;
    }

    this.messages = [];
    localStorage.removeItem('ai-chat-history');

    const messagesContainer = document.getElementById('aiChatMessages');
    if (messagesContainer) {
      const skillName = this.currentSkill?.name || 'all 8 skills';
      messagesContainer.innerHTML = `
        <div class="ai-welcome">
          <div class="ai-welcome-icon"><img src="images/ai-bot-icon.svg" alt="AI Assistant" /></div>
          <h4>Hey! I'm KELYLO AI</h4>
          <p>Your learning companion for ${skillName}. Ask me anything — study plans, tips, motivation, or just a chat!</p>

          <div class="ai-welcome-suggestions">
            <button class="suggestion-btn" data-suggestion="What should I study in ${this.currentSkill?.name || 'SAP2000'} today?">
              📚 What to study today?
            </button>
            <button class="suggestion-btn" data-suggestion="Give me a full roadmap for ${this.currentSkill?.name || 'Excel'}">
              🗺️ Show me the roadmap
            </button>
            <button class="suggestion-btn" data-suggestion="I feel stuck. Can you motivate me?">
              💪 I need motivation
            </button>
          </div>
        </div>
      `;

      messagesContainer.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const suggestion = e.currentTarget.dataset.suggestion;
          this.sendMessage(suggestion);
        });
      });
    }
  }
}

// Initialize AI Chat UI when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.aiChatUI = new AIChatUI();
  });
} else {
  window.aiChatUI = new AIChatUI();
}
