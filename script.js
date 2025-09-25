        document.addEventListener('DOMContentLoaded', function() {
            const chatMessages = document.getElementById('chatMessages');
            const messageInput = document.getElementById('messageInput');
            const sendButton = document.getElementById('sendButton');
            const riskCount = document.getElementById('riskCount');
            
            // High-risk trigger phrases
            const highRiskPhrases = [
                'overwhelmed', 'anxiety', 'panic', 'can\'t sleep', 'sad', 'lonely', 
                'hopeless', 'stress', 'depressed', 'suicidal', 'hurt myself'
            ];
            
            // Send message function
            function sendMessage() {
                const message = messageInput.value.trim();
                if (message === '') return;
                
                // Add user message to chat
                addMessage(message, 'user');
                
                // Check if message contains high-risk phrases
                const isHighRisk = highRiskPhrases.some(phrase => 
                    message.toLowerCase().includes(phrase.toLowerCase())
                );
                
                // Simulate bot response after a short delay
                setTimeout(() => {
                    if (isHighRisk) {
                        // High-risk response
                        addHighRiskResponse(message);
                        // Increment risk count in dashboard
                        riskCount.textContent = parseInt(riskCount.textContent) + 1;
                    } else {
                        // Normal response
                        addNormalResponse(message);
                    }
                }, 1000);
                
                // Clear input
                messageInput.value = '';
            }
            
            // Add message to chat
            function addMessage(text, sender) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
                
                const senderName = sender === 'user' ? 'You' : 'PsycheBot';
                messageDiv.innerHTML = `<strong>${senderName}:</strong> ${text}`;
                
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            // Add normal bot response
            function addNormalResponse(userMessage) {
                const responses = [
                    "I understand. It's important to acknowledge these feelings.",
                    "Thank you for sharing. How has this been affecting your daily life?",
                    "I'm here to listen. Can you tell me more about what you're experiencing?",
                    "It takes courage to talk about these things. Would you like to explore some coping strategies?",
                    "I hear you. Remember that it's okay to not be okay sometimes."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'bot');
            }
            
            // Add high-risk bot response with visualization and handoff options
            function addHighRiskResponse(userMessage) {
                // Main response
                addMessage("I'm concerned about what you're sharing. Your message has triggered our risk assessment system.", 'bot');
                
                // Risk indicator visualization
                setTimeout(() => {
                    const riskDiv = document.createElement('div');
                    riskDiv.classList.add('message', 'bot-message');
                    riskDiv.innerHTML = `
                        <div class="risk-indicator risk-high">
                            <i class="fas fa-exclamation-triangle"></i>
                            <div>
                                <strong>Risk Level: High</strong>
                                <div class="risk-gauge">
                                    <div class="gauge-fill" style="width: 85%"></div>
                                </div>
                            </div>
                        </div>
                    `;
                    chatMessages.appendChild(riskDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 300);
                
                // Handoff options
                setTimeout(() => {
                    const handoffDiv = document.createElement('div');
                    handoffDiv.classList.add('message', 'bot-message');
                    handoffDiv.innerHTML = `
                        <strong>PsycheBot:</strong> Your wellbeing is our priority. Here are immediate support options:
                        <div class="handoff-options">
                            <button class="sos-button">
                                <i class="fas fa-phone-alt"></i> SOS Helpline: 1-800-273-8255
                            </button>
                            <button class="book-button" id="bookCounsellor">
                                <i class="fas fa-calendar-check"></i> Book a Counsellor Session
                            </button>
                        </div>
                    `;
                    chatMessages.appendChild(handoffDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Add event listener to booking button
                    document.getElementById('bookCounsellor').addEventListener('click', function() {
                        alert('Redirecting to counsellor booking page... (This would connect to your booking system in a full implementation)');
                    });
                }, 600);
            }
            
            // Event listeners
            sendButton.addEventListener('click', sendMessage);
            
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            // Suggested messages
            document.querySelectorAll('.suggestion').forEach(button => {
                button.addEventListener('click', function() {
                    messageInput.value = this.getAttribute('data-message');
                    messageInput.focus();
                });
            });
            
            // Demo high-risk message after a delay to showcase functionality
            setTimeout(() => {
                messageInput.value = "I feel overwhelmed and can't sleep because of my exams.";
                sendMessage();
            }, 3000);
        });