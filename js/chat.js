// Chat functionality
class PsycheTechChat {
    constructor() {
        this.messages = [];
        this.riskLevel = 'low';
        this.riskScore = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialMessage();
    }

    bindEvents() {
        // Send message on button click
        document.getElementById('sendMessage').addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.closest('.quick-btn').dataset.message;
                document.getElementById('messageInput').value = message;
                this.sendMessage();
            });
        });

        // Risk panel toggle
        document.querySelector('.btn-action[title="Risk Assessment"]').addEventListener('click', () => {
            this.toggleRiskPanel();
        });

        // Close risk panel
        document.querySelector('.btn-close-risk').addEventListener('click', () => {
            this.closeRiskPanel();
        });

        // Character count
        document.getElementById('messageInput').addEventListener('input', (e) => {
            const count = e.target.value.length;
            document.querySelector('.char-count').textContent = `${count}/500`;
        });

        // SOS button
        document.querySelector('.btn-sos').addEventListener('click', () => {
            this.showHandoffModal();
        });
    }

    loadInitialMessage() {
        this.addMessage('Hello! I\'m your PsycheTech AI assistant. I\'m here to provide support, resources, and guidance for your mental wellness. How can I help you today?', 'bot');
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (message === '') return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        document.querySelector('.char-count').textContent = '0/500';

        // Simulate typing indicator
        this.showTypingIndicator();

        // Generate AI response after delay
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateResponse(message);
        }, 1000 + Math.random() * 1000);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-content">${this.formatMessage(text)}</div>
            <div class="message-time">${timestamp}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store message
        this.messages.push({
            text,
            sender,
            timestamp: new Date(),
            riskScore: sender === 'user' ? this.analyzeRisk(text) : 0
        });

        // Update risk assessment if user message
        if (sender === 'user') {
            this.updateRiskAssessment(text);
        }
    }

    formatMessage(text) {
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Convert line breaks
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.typingIndicator = typingDiv;
    }

    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.remove();
            this.typingIndicator = null;
        }
    }

    analyzeRisk(text) {
        const lowerText = text.toLowerCase();
        let riskScore = 0;

        // High-risk keywords
        const highRiskWords = ['suicide', 'kill myself', 'end it all', 'want to die', 'harm myself', 'overdose', 'jump off', 'cut myself'];
        const mediumRiskWords = ['depressed', 'hopeless', 'can\'t go on', 'give up', 'alone', 'worthless', 'useless', 'anxiety', 'panic', 'overwhelmed'];
        const lowRiskWords = ['sad', 'stressed', 'worried', 'nervous', 'tired', 'sleep', 'study', 'exam'];

        highRiskWords.forEach(word => {
            if (lowerText.includes(word)) riskScore += 3;
        });

        mediumRiskWords.forEach(word => {
            if (lowerText.includes(word)) riskScore += 2;
        });

        lowRiskWords.forEach(word => {
            if (lowerText.includes(word)) riskScore += 1;
        });

        return Math.min(riskScore, 10); // Cap at 10
    }

    updateRiskAssessment(text) {
        const riskScore = this.analyzeRisk(text);
        this.riskScore = Math.max(this.riskScore, riskScore);
        
        let riskLevel = 'low';
        if (riskScore >= 7) riskLevel = 'high';
        else if (riskScore >= 4) riskLevel = 'medium';

        this.riskLevel = riskLevel;

        // Update risk panel
        this.updateRiskPanel();

        // Show handoff options for high risk
        if (riskLevel === 'high') {
            setTimeout(() => {
                this.showHandoffOptions();
            }, 1500);
        }
    }

    updateRiskPanel() {
        const gaugeFill = document.getElementById('gaugeFill');
        const riskLevelElement = document.getElementById('riskLevel');
        const riskTriggers = document.getElementById('riskTriggers');

        // Update gauge
        const percentage = (this.riskScore / 10) * 100;
        gaugeFill.style.width = `${percentage}%`;
        gaugeFill.className = `gauge-fill ${this.riskLevel}`;

        // Update risk level text
        const levelTexts = {
            low: { text: 'Low Risk', desc: 'Conversation appears normal' },
            medium: { text: 'Medium Risk', desc: 'Moderate concerns detected' },
            high: { text: 'High Risk', desc: 'Immediate support recommended' }
        };

        riskLevelElement.innerHTML = `
            <span class="level-text ${this.riskLevel}">${levelTexts[this.riskLevel].text}</span>
            <span class="level-desc">${levelTexts[this.riskLevel].desc}</span>
        `;

        // Update triggers
        riskTriggers.innerHTML = this.generateRiskTriggers();
    }

    generateRiskTriggers() {
        if (this.riskScore === 0) {
            return '<p>No risk triggers detected in current conversation.</p>';
        }

        const triggers = [];
        const lastUserMessage = this.messages.filter(m => m.sender === 'user').pop();

        if (lastUserMessage) {
            triggers.push({
                text: 'Recent message contains concerning language',
                severity: this.riskLevel
            });
        }

        if (this.riskScore > 5) {
            triggers.push({
                text: 'Multiple risk indicators detected',
                severity: 'medium'
            });
        }

        if (this.messages.filter(m => m.sender === 'user' && m.riskScore > 3).length > 2) {
            triggers.push({
                text: 'Pattern of concerning messages',
                severity: 'high'
            });
        }

        return `
            <h5>Risk Triggers</h5>
            ${triggers.map(trigger => `
                <div class="trigger-item">
                    <span>${trigger.text}</span>
                    <span class="trigger-severity ${trigger.severity}">${trigger.severity.toUpperCase()}</span>
                </div>
            `).join('')}
        `;
    }

    showHandoffOptions() {
        const messagesContainer = document.getElementById('chatMessages');
        
        const handoffDiv = document.createElement('div');
        handoffDiv.className = 'message bot';
        
        handoffDiv.innerHTML = `
            <div class="risk-indicator high">
                <div class="risk-gauge-small">
                    <div class="gauge-small">
                        <div class="gauge-fill-small high"></div>
                    </div>
                    <span class="risk-text">High Risk Level Detected</span>
                </div>
                <p>Based on our conversation, I'm concerned about your wellbeing. Here are immediate support options:</p>
                <div class="handoff-options">
                    <h4>Support Options</h4>
                    <div class="sos-options">
                        <button class="btn-sos-option emergency" onclick="chat.showHandoffModal()">
                            <i class="fas fa-life-ring"></i>
                            Emergency Help
                        </button>
                        <button class="btn-sos-option booking" onclick="window.location.href='booking.html'">
                            <i class="fas fa-calendar-check"></i>
                            Book Session
                        </button>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.appendChild(handoffDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showHandoffModal() {
        const modal = document.getElementById('handoffModal');
        modal.classList.add('show');
    }

    closeHandoffModal() {
        const modal = document.getElementById('handoffModal');
        modal.classList.remove('show');
    }

    toggleRiskPanel() {
        const panel = document.getElementById('riskPanel');
        panel.classList.toggle('open');
    }

    closeRiskPanel() {
        const panel = document.getElementById('riskPanel');
        panel.classList.remove('open');
    }

    generateResponse(userMessage) {
        let response = '';
        const lowerMessage = userMessage.toLowerCase();

        // Response patterns based on message content
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = "Hello! I'm here to support you. How are you feeling today?";
        } else if (lowerMessage.includes('anxious') || lowerMessage.includes('nervous') || lowerMessage.includes('worried')) {
            response = "I understand that feeling anxious can be really challenging. Would you like to try a quick breathing exercise, or would you prefer to talk about what's making you feel this way?";
        } else if (lowerMessage.includes('depressed') || lowerMessage.includes('sad') || lowerMessage.includes('down')) {
            response = "I'm sorry you're feeling this way. It takes courage to talk about these feelings. Remember that support is available, and you don't have to go through this alone.";
        } else if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
            response = "Sleep issues can really affect your wellbeing. I can share some sleep hygiene tips, or we can explore what might be affecting your sleep patterns.";
        } else if (lowerMessage.includes('study') || lowerMessage.includes('exam') || lowerMessage.includes('test')) {
            response = "Academic pressure can be overwhelming. Let's talk about some stress management techniques that might help you prepare while taking care of your mental health.";
        } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
            response = "I'm here to help. Whether you need someone to talk to, resources for support, or guidance on next steps, I'm available 24/7. What specific support are you looking for right now?";
        } else {
            // Default empathetic response
            response = "Thank you for sharing that with me. It sounds like you're going through a difficult time. I'm here to listen and support you. Could you tell me more about how you're feeling?";
        }

        this.addMessage(response, 'bot');

        // Add risk indicator for high-risk conversations
        if (this.riskLevel === 'high') {
            setTimeout(() => {
                this.addMessage("I want to emphasize that professional support is available whenever you're ready. Your wellbeing is important, and there are people who want to help.", 'bot');
            }, 500);
        }
    }
}

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.chat = new PsycheTechChat();
    
    // Close modal when clicking outside
    document.getElementById('handoffModal').addEventListener('click', (e) => {
        if (e.target.id === 'handoffModal') {
            window.chat.closeHandoffModal();
        }
    });

    // Close modal with button
    document.querySelector('.btn-close-modal').addEventListener('click', () => {
        window.chat.closeHandoffModal();
    });

    // Emergency call button
    document.querySelector('.btn-call').addEventListener('click', () => {
        alert('This would connect to emergency services. In a real implementation, this would dial the crisis hotline.');
    });

    // Peer support button
    document.querySelector('.btn-peer').addEventListener('click', () => {
        alert('Connecting you with a peer support volunteer...');
    });
});