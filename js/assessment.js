class PsycheTechAssessment {
    constructor() {
        this.currentAssessment = null;
        this.currentQuestion = 0;
        this.responses = [];
        this.scores = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadAssessmentData();
    }

    bindEvents() {
        // Start assessment buttons
        document.querySelectorAll('.start-assessment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.assessment-card');
                const assessmentType = card.dataset.type;
                this.startAssessment(assessmentType);
            });
        });

        // Navigation buttons
        document.getElementById('prevQuestion').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submitAssessment').addEventListener('click', () => this.submitAssessment());

        // Results actions
        document.getElementById('saveResults').addEventListener('click', () => this.saveResults());
        document.getElementById('newAssessment').addEventListener('click', () => this.showAssessmentSelection());

        // Close modal
        document.querySelector('.btn-close-modal').addEventListener('click', () => this.closeModal());
    }

    loadAssessmentData() {
        this.assessments = {
            phq9: {
                title: 'PHQ-9 Depression Assessment',
                description: 'Patient Health Questionnaire - 9 items',
                instruction: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
                questions: [
                    'Little interest or pleasure in doing things',
                    'Feeling down, depressed, or hopeless',
                    'Trouble falling or staying asleep, or sleeping too much',
                    'Feeling tired or having little energy',
                    'Poor appetite or overeating',
                    'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
                    'Trouble concentrating on things, such as reading the newspaper or watching television',
                    'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
                    'Thoughts that you would be better off dead or of hurting yourself in some way'
                ],
                options: [
                    { label: 'Not at all', value: 0 },
                    { label: 'Several days', value: 1 },
                    { label: 'More than half the days', value: 2 },
                    { label: 'Nearly every day', value: 3 }
                ],
                scoring: {
                    ranges: [
                        { min: 0, max: 4, level: 'minimal', description: 'Minimal depression' },
                        { min: 5, max: 9, level: 'mild', description: 'Mild depression' },
                        { min: 10, max: 14, level: 'moderate', description: 'Moderate depression' },
                        { min: 15, max: 19, level: 'moderately severe', description: 'Moderately severe depression' },
                        { min: 20, max: 27, level: 'severe', description: 'Severe depression' }
                    ]
                }
            },
            gad7: {
                title: 'GAD-7 Anxiety Assessment',
                description: 'Generalized Anxiety Disorder - 7 items',
                instruction: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
                questions: [
                    'Feeling nervous, anxious, or on edge',
                    'Not being able to stop or control worrying',
                    'Worrying too much about different things',
                    'Trouble relaxing',
                    'Being so restless that it is hard to sit still',
                    'Becoming easily annoyed or irritable',
                    'Feeling afraid as if something awful might happen'
                ],
                options: [
                    { label: 'Not at all', value: 0 },
                    { label: 'Several days', value: 1 },
                    { label: 'More than half the days', value: 2 },
                    { label: 'Nearly every day', value: 3 }
                ],
                scoring: {
                    ranges: [
                        { min: 0, max: 4, level: 'minimal', description: 'Minimal anxiety' },
                        { min: 5, max: 9, level: 'mild', description: 'Mild anxiety' },
                        { min: 10, max: 14, level: 'moderate', description: 'Moderate anxiety' },
                        { min: 15, max: 21, level: 'severe', description: 'Severe anxiety' }
                    ]
                }
            },
            ghq: {
                title: 'GHQ-12 General Health Assessment',
                description: 'General Health Questionnaire - 12 items',
                instruction: 'Recently, have you experienced:',
                questions: [
                    'Been able to concentrate on whatever you\'re doing?',
                    'Lost much sleep over worry?',
                    'Felt that you are playing a useful part in things?',
                    'Felt capable of making decisions about things?',
                    'Felt constantly under strain?',
                    'Felt you couldn\'t overcome your difficulties?',
                    'Been able to enjoy your normal day-to-day activities?',
                    'Been able to face up to your problems?',
                    'Been feeling unhappy or depressed?',
                    'Been losing confidence in yourself?',
                    'Been thinking of yourself as a worthless person?',
                    'Been feeling reasonably happy, all things considered?'
                ],
                options: [
                    { label: 'Better than usual', value: 0 },
                    { label: 'Same as usual', value: 1 },
                    { label: 'Less than usual', value: 2 },
                    { label: 'Much less than usual', value: 3 }
                ],
                scoring: {
                    ranges: [
                        { min: 0, max: 11, level: 'low', description: 'Low probability of disorder' },
                        { min: 12, max: 20, level: 'medium', description: 'Medium probability of disorder' },
                        { min: 21, max: 36, level: 'high', description: 'High probability of disorder' }
                    ]
                }
            }
        };
    }

    startAssessment(assessmentType) {
        this.currentAssessment = assessmentType;
        this.currentQuestion = 0;
        this.responses = [];
        
        document.getElementById('assessmentSelection').style.display = 'none';
        document.getElementById('assessmentQuestions').style.display = 'block';
        document.getElementById('assessmentResults').style.display = 'none';
        
        this.updateProgress();
        this.showQuestion();
    }

    showQuestion() {
        const assessment = this.assessments[this.currentAssessment];
        const questionElement = document.getElementById('questionText');
        const optionsContainer = document.getElementById('optionsContainer');
        
        questionElement.textContent = assessment.questions[this.currentQuestion];
        document.getElementById('questionInstruction').textContent = assessment.instruction;
        
        // Update counters
        document.getElementById('currentQuestion').textContent = this.currentQuestion + 1;
        document.getElementById('totalQuestions').textContent = assessment.questions.length;
        
        // Create options
        optionsContainer.innerHTML = '';
        assessment.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.innerHTML = `
                <div class="option-radio"></div>
                <span class="option-label">${option.label}</span>
                <span class="option-value">${option.value} points</span>
            `;
            
            optionElement.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        // Update navigation buttons
        this.updateNavigation();
    }

    selectOption(optionIndex) {
        // Remove selected class from all options
        document.querySelectorAll('.option-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        document.querySelectorAll('.option-item')[optionIndex].classList.add('selected');
        
        // Store response
        const assessment = this.assessments[this.currentAssessment];
        this.responses[this.currentQuestion] = assessment.options[optionIndex].value;
        
        // Enable next button
        document.getElementById('nextQuestion').disabled = false;
    }

    updateNavigation() {
        const assessment = this.assessments[this.currentAssessment];
        
        // Previous button
        document.getElementById('prevQuestion').disabled = this.currentQuestion === 0;
        
        // Next/Submit button
        if (this.currentQuestion === assessment.questions.length - 1) {
            document.getElementById('nextQuestion').style.display = 'none';
            document.getElementById('submitAssessment').style.display = 'block';
        } else {
            document.getElementById('nextQuestion').style.display = 'block';
            document.getElementById('submitAssessment').style.display = 'none';
        }
        
        // Disable next button if no option selected
        document.getElementById('nextQuestion').disabled = this.responses[this.currentQuestion] === undefined;
    }

    nextQuestion() {
        if (this.currentQuestion < this.assessments[this.currentAssessment].questions.length - 1) {
            this.currentQuestion++;
            this.updateProgress();
            this.showQuestion();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.updateProgress();
            this.showQuestion();
            
            // Select previously chosen option
            if (this.responses[this.currentQuestion] !== undefined) {
                const options = document.querySelectorAll('.option-item');
                options[this.responses[this.currentQuestion]].classList.add('selected');
            }
        }
    }

    updateProgress() {
        const assessment = this.assessments[this.currentAssessment];
        const progress = ((this.currentQuestion + 1) / assessment.questions.length) * 100;
        
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = 
            `Question ${this.currentQuestion + 1} of ${assessment.questions.length}`;
    }

    submitAssessment() {
        const assessment = this.assessments[this.currentAssessment];
        const totalScore = this.responses.reduce((sum, score) => sum + score, 0);
        
        this.calculateResults(totalScore);
        this.showResults(totalScore);
    }

    calculateResults(totalScore) {
        const assessment = this.assessments[this.currentAssessment];
        const ranges = assessment.scoring.ranges;
        
        let result = ranges[0];
        for (const range of ranges) {
            if (totalScore >= range.min && totalScore <= range.max) {
                result = range;
                break;
            }
        }
        
        this.currentResult = {
            score: totalScore,
            level: result.level,
            description: result.description,
            maxScore: ranges[ranges.length - 1].max
        };
    }

    showResults(totalScore) {
        document.getElementById('assessmentQuestions').style.display = 'none';
        document.getElementById('assessmentResults').style.display = 'block';
        
        const assessment = this.assessments[this.currentAssessment];
        
        // Update results display
        document.getElementById('assessmentType').textContent = assessment.title;
        document.getElementById('totalScore').textContent = totalScore;
        
        // Update gauge
        const percentage = (totalScore / this.currentResult.maxScore) * 100;
        const gaugeFill = document.getElementById('resultGauge');
        gaugeFill.style.width = `${percentage}%`;
        gaugeFill.className = `gauge-fill ${this.currentResult.level}`;
        
        // Update interpretation
        const interpretation = document.getElementById('scoreInterpretation');
        interpretation.innerHTML = `
            <div class="interpretation-title">${this.currentResult.description}</div>
            <div class="interpretation-desc">
                Based on your score of ${totalScore}, you fall into the ${this.currentResult.level} range. 
                ${this.getInterpretationText(this.currentResult.level)}
            </div>
        `;
        
        // Show recommendations
        this.showRecommendations();
    }

    getInterpretationText(level) {
        const texts = {
            minimal: 'This suggests you\'re currently experiencing minimal symptoms. Continue practicing good self-care habits.',
            mild: 'You may be experiencing mild symptoms. Consider implementing stress management techniques.',
            moderate: 'Moderate symptoms suggest it may be helpful to seek additional support and resources.',
            severe: 'Severe symptoms indicate that professional support could be beneficial for your wellbeing.'
        };
        return texts[level] || 'Consider discussing these results with a healthcare professional.';
    }

    showRecommendations() {
        const container = document.getElementById('recommendationCards');
        const recommendations = this.getRecommendations();
        
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-card">
                <i class="fas ${rec.icon}"></i>
                <h5>${rec.title}</h5>
                <p>${rec.description}</p>
            </div>
        `).join('');
    }

    getRecommendations() {
        const level = this.currentResult.level;
        
        const baseRecommendations = [
            {
                icon: 'fa-comments',
                title: 'Chat Support',
                description: 'Connect with our AI assistant for immediate guidance and support.'
            },
            {
                icon: 'fa-book',
                title: 'Educational Resources',
                description: 'Access articles and tools for mental health management.'
            }
        ];
        
        if (level === 'mild' || level === 'moderate') {
            baseRecommendations.push({
                icon: 'fa-users',
                title: 'Peer Support',
                description: 'Connect with trained student volunteers who understand your experience.'
            });
        }
        
        if (level === 'moderate' || level === 'severe') {
            baseRecommendations.push({
                icon: 'fa-user-md',
                title: 'Professional Help',
                description: 'Consider booking a session with a licensed counselor.'
            });
        }
        
        if (level === 'severe') {
            baseRecommendations.push({
                icon: 'fa-life-ring',
                title: 'Emergency Support',
                description: 'Immediate connection to crisis services if needed.'
            });
        }
        
        return baseRecommendations;
    }

    saveResults() {
        const results = {
            assessment: this.currentAssessment,
            score: this.currentResult.score,
            level: this.currentResult.level,
            date: new Date().toISOString(),
            responses: this.responses
        };
        
        // In a real app, this would save to a database
        localStorage.setItem(`assessment_${Date.now()}`, JSON.stringify(results));
        
        alert('Results saved successfully!');
    }

    showAssessmentSelection() {
        document.getElementById('assessmentSelection').style.display = 'block';
        document.getElementById('assessmentQuestions').style.display = 'none';
        document.getElementById('assessmentResults').style.display = 'none';
        
        // Reset progress
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressText').textContent = 'Question 1 of 9';
    }

    showInfoModal(assessmentType) {
        const assessment = this.assessments[assessmentType];
        const modal = document.getElementById('infoModal');
        const content = document.getElementById('modalContent');
        
        content.innerHTML = `
            <div class="assessment-info">
                <h4>${assessment.title}</h4>
                <p>${assessment.description}</p>
                <p>This assessment is a validated screening tool used worldwide to help identify potential mental health concerns.</p>
                <h4>What to expect:</h4>
                <ul>
                    <li>${assessment.questions.length} questions about your recent experiences</li>
                    <li>Takes approximately ${Math.ceil(assessment.questions.length / 3)} minutes</li>
                    <li>Completely confidential and anonymous</li>
                    <li>Provides immediate results with recommendations</li>
                </ul>
                <p><strong>Note:</strong> This is a screening tool, not a diagnostic assessment. Always consult with a healthcare professional for formal diagnosis.</p>
            </div>
        `;
        
        modal.classList.add('show');
    }

    closeModal() {
        document.getElementById('infoModal').classList.remove('show');
    }
}

// Initialize assessment when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.psycheTechAssessment = new PsycheTechAssessment();
});

// Close modal on clicking outside content
document.addEventListener('click', (e) => {
    const modal = document.getElementById('infoModal');
    if (modal.classList.contains('show') && !modal.contains(e.target)) {
        window.psycheTechAssessment.closeModal();
    }
});