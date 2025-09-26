class PsycheTechResources {
    constructor() {
        this.currentExercise = null;
        this.exerciseTimer = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeSearch();
    }

    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Exercise buttons
        document.querySelectorAll('.start-exercise').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseType = e.target.closest('.start-exercise').dataset.exercise;
                this.startExercise(exerciseType);
            });
        });

        // Emergency buttons
        document.querySelector('.btn-emergency').addEventListener('click', () => {
            this.handleEmergencyCall();
        });

        document.querySelector('.btn-textline').addEventListener('click', () => {
            this.handleTextLine();
        });

        // Close modal
        document.querySelector('.btn-close-modal').addEventListener('click', () => {
            this.closeExerciseModal();
        });
    }

    initializeSearch() {
        const searchInput = document.getElementById('resourceSearch');
        searchInput.addEventListener('input', (e) => {
            this.filterResources(e.target.value);
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show corresponding tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    filterResources(searchTerm) {
        const resources = document.querySelectorAll('.resource-card, .article-card, .tool-card');
        const term = searchTerm.toLowerCase();

        resources.forEach(resource => {
            const text = resource.textContent.toLowerCase();
            if (text.includes(term)) {
                resource.style.display = 'block';
                resource.classList.add('search-highlight');
            } else {
                resource.style.display = 'none';
                resource.classList.remove('search-highlight');
            }
        });
    }

    startExercise(exerciseType) {
        this.currentExercise = exerciseType;
        this.showExerciseModal(exerciseType);
    }

    showExerciseModal(exerciseType) {
        const modal = document.getElementById('exerciseModal');
        const container = document.getElementById('exerciseContainer');
        const title = document.getElementById('exerciseTitle');

        // Set title based on exercise type
        const titles = {
            breathing: 'Breathing Exercise',
            meditation: 'Mindfulness Meditation',
            journaling: 'Journaling Exercise'
        };
        title.textContent = titles[exerciseType] || 'Wellness Exercise';

        // Load exercise content
        container.innerHTML = this.getExerciseContent(exerciseType);

        modal.classList.add('show');

        // Start exercise if applicable
        if (exerciseType === 'breathing') {
            this.startBreathingExercise();
        }
    }

    getExerciseContent(exerciseType) {
        const contents = {
            breathing: `
                <div class="breathing-exercise">
                    <div class="breathing-animation">
                        <div class="breathing-text" id="breathText">Breathe In</div>
                    </div>
                    <div class="breathing-timer" id="breathTimer">4:00</div>
                    <div class="exercise-instructions">
                        <p>Follow the breathing pattern: 4 seconds in, hold for 4 seconds, 4 seconds out</p>
                    </div>
                    <div class="exercise-controls">
                        <button class="btn-primary" id="startBreathing">
                            <i class="fas fa-play"></i>
                            Start
                        </button>
                        <button class="btn-outline" id="pauseBreathing" style="display: none;">
                            <i class="fas fa-pause"></i>
                            Pause
                        </button>
                        <button class="btn-outline" onclick="resources.closeExerciseModal()">
                            <i class="fas fa-times"></i>
                            Close
                        </button>
                    </div>
                </div>
            `,
            meditation: `
                <div class="meditation-exercise">
                    <div class="meditation-icon">
                        <i class="fas fa-spa"></i>
                    </div>
                    <h4>Mindfulness Meditation</h4>
                    <div class="meditation-options">
                        <button class="btn-outline" data-duration="5">5 minutes</button>
                        <button class="btn-outline" data-duration="10">10 minutes</button>
                        <button class="btn-outline" data-duration="15">15 minutes</button>
                    </div>
                    <div class="exercise-instructions">
                        <p>Find a comfortable position and focus on your breath. Allow thoughts to come and go without judgment.</p>
                    </div>
                </div>
            `,
            journaling: `
                <div class="journaling-exercise">
                    <h4>Journaling Prompt</h4>
                    <div class="journal-prompt-large">
                        "What are three things you're grateful for today, and why?"
                    </div>
                    <textarea class="journal-textarea" placeholder="Start writing here..." rows="8"></textarea>
                    <div class="journal-actions">
                        <button class="btn-primary">
                            <i class="fas fa-save"></i>
                            Save Entry
                        </button>
                        <button class="btn-outline" onclick="resources.getNewPrompt()">
                            <i class="fas fa-redo"></i>
                            New Prompt
                        </button>
                    </div>
                </div>
            `
        };

        return contents[exerciseType] || '<p>Exercise content not available.</p>';
    }

    startBreathingExercise() {
        let timeLeft = 240; // 4 minutes in seconds
        let isBreathingIn = true;
        let isRunning = false;

        const timerElement = document.getElementById('breathTimer');
        const textElement = document.getElementById('breathText');
        const startBtn = document.getElementById('startBreathing');
        const pauseBtn = document.getElementById('pauseBreathing');

        const updateDisplay = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Alternate breathing text
            if (isRunning) {
                textElement.textContent = isBreathingIn ? 'Breathe In' : 'Breathe Out';
                isBreathingIn = !isBreathingIn;
            }
        };

        startBtn.addEventListener('click', () => {
            isRunning = true;
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'block';

            this.exerciseTimer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    this.completeExercise();
                }
            }, 1000);

            // Start breathing animation
            setInterval(() => {
                isBreathingIn = !isBreathingIn;
                updateDisplay();
            }, 4000);
        });

        pauseBtn.addEventListener('click', () => {
            isRunning = false;
            clearInterval(this.exerciseTimer);
            startBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        });

        updateDisplay();
    }

    completeExercise() {
        clearInterval(this.exerciseTimer);
        alert('Exercise completed! Great job taking time for your wellbeing.');
        this.closeExerciseModal();
    }

    getNewPrompt() {
        const prompts = [
            "What was the most challenging part of your day, and how did you handle it?",
            "Describe a recent accomplishment you're proud of, no matter how small.",
            "What self-care activity would you like to prioritize this week?",
            "Write about a person who has positively impacted your life recently.",
            "What are you looking forward to in the coming days?",
            "Describe a moment today when you felt truly present and engaged.",
            "What's one thing you can do tomorrow to support your mental health?",
            "Write about a challenge you overcame and what you learned from it."
        ];

        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        document.querySelector('.journal-prompt-large').textContent = `"${randomPrompt}"`;
        document.querySelector('.journal-textarea').value = '';
    }

    handleEmergencyCall() {
        if (confirm('This will connect you to emergency services. Are you in immediate danger?')) {
            // In a real implementation, this would initiate a phone call
            window.open('tel:1-800-273-8255');
        }
    }

    handleTextLine() {
        alert('In a real implementation, this would open your messaging app to text the crisis line.');
        // window.open('sms:741741?body=HOME');
    }

    closeExerciseModal() {
        clearInterval(this.exerciseTimer);
        document.getElementById('exerciseModal').classList.remove('show');
    }
}

// Initialize resources when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.resources = new PsycheTechResources();
    
    // Close modal when clicking outside
    document.getElementById('exerciseModal').addEventListener('click', (e) => {
        if (e.target.id === 'exerciseModal') {
            window.resources.closeExerciseModal();
        }
    });
});