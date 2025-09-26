class PsycheTechDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.charts = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeCharts();
        this.loadDashboardData();
    }

    bindEvents() {
        // Sidebar navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('href').substring(1);
                this.switchSection(target);
            });
        });

        // Time range filter
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.updateCharts(e.target.value);
        });

        // Risk filters
        document.getElementById('riskLevelFilter').addEventListener('change', () => {
            this.filterRiskTable();
        });

        document.getElementById('timeFrameFilter').addEventListener('change', () => {
            this.filterRiskTable();
        });

        // Close modal
        document.querySelector('.btn-close-modal').addEventListener('click', () => {
            this.closeModal();
        });
    }

    switchSection(sectionName) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionName}"]`).classList.add('active');

        // Show corresponding section
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;

        // Initialize section-specific components
        if (sectionName === 'risk') {
            this.initializeRiskTable();
        }
    }

    initializeCharts() {
        this.createRiskChart();
        this.createEngagementChart();
    }

    createRiskChart() {
        const ctx = document.getElementById('riskChart').getContext('2d');
        
        this.charts.risk = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Low Risk', 'Medium Risk', 'High Risk'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(220, 53, 69, 0.8)'
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(255, 193, 7, 1)',
                        'rgba(220, 53, 69, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    createEngagementChart() {
        const ctx = document.getElementById('engagementChart').getContext('2d');
        
        this.charts.engagement = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Active Users',
                    data: [120, 150, 180, 200, 170, 140, 160],
                    borderColor: 'rgba(67, 97, 238, 1)',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateCharts(timeRange) {
        // Simulate data update based on time range
        const data = this.getChartData(timeRange);
        
        if (this.charts.risk) {
            this.charts.risk.data.datasets[0].data = data.risk;
            this.charts.risk.update();
        }
        
        if (this.charts.engagement) {
            this.charts.engagement.data.datasets[0].data = data.engagement;
            this.charts.engagement.update();
        }
    }

    getChartData(timeRange) {
        // Mock data for different time ranges
        const data = {
            today: {
                risk: [70, 20, 10],
                engagement: [50, 75, 100, 120, 90, 70, 80]
            },
            week: {
                risk: [65, 25, 10],
                engagement: [120, 150, 180, 200, 170, 140, 160]
            },
            month: {
                risk: [60, 28, 12],
                engagement: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320]
            },
            quarter: {
                risk: [58, 30, 12],
                engagement: [80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300]
            }
        };
        
        return data[timeRange] || data.week;
    }

    initializeRiskTable() {
        // Add event listeners to action buttons
        document.querySelectorAll('.risk-table .btn-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const userId = row.querySelector('td:first-child').textContent;
                this.handleRiskAction(userId, e.target.closest('.btn-action'));
            });
        });
    }

    filterRiskTable() {
        const riskLevel = document.getElementById('riskLevelFilter').value;
        const timeFrame = document.getElementById('timeFrameFilter').value;
        
        const rows = document.querySelectorAll('.risk-table tbody tr');
        
        rows.forEach(row => {
            let showRow = true;
            
            // Filter by risk level
            if (riskLevel !== 'all') {
                const rowRiskLevel = row.classList.contains(`risk-${riskLevel}`);
                if (!rowRiskLevel) showRow = false;
            }
            
            // Filter by time frame (simulated)
            if (timeFrame !== 'all') {
                // In a real implementation, this would filter based on actual timestamps
                const timeText = row.querySelector('td:nth-child(4)').textContent;
                if (!this.matchesTimeFrame(timeText, timeFrame)) {
                    showRow = false;
                }
            }
            
            row.style.display = showRow ? '' : 'none';
        });
    }

    matchesTimeFrame(timeText, timeFrame) {
        // Simple simulation - in real implementation, use actual dates
        const timeFrames = {
            '24h': ['hours ago', 'today'],
            '7d': ['days ago', 'hours ago', 'today'],
            '30d': ['days ago', 'weeks ago', 'hours ago', 'today']
        };
        
        return timeFrames[timeFrame].some(unit => timeText.includes(unit));
    }

    handleRiskAction(userId, button) {
        const action = button.querySelector('i').className;
        
        if (action.includes('fa-eye')) {
            this.viewRiskDetails(userId);
        } else if (action.includes('fa-flag')) {
            this.flagRiskCase(userId);
        } else if (action.includes('fa-user-md')) {
            this.assignCounselor(userId);
        } else if (action.includes('fa-comment')) {
            this.sendFollowUp(userId);
        } else if (action.includes('fa-file-medical')) {
            this.createCaseReport(userId);
        }
    }

    viewRiskDetails(userId) {
        // Simulate loading risk details
        const modal = document.getElementById('riskDetailModal');
        const content = document.querySelector('.risk-detail-content');
        
        content.innerHTML = `
            <div class="risk-detail-header">
                <h4>Risk Case Details - ${userId}</h4>
                <div class="risk-level-display">
                    <span class="risk-badge high">High Risk</span>
                    <span class="status-badge pending">Pending Review</span>
                </div>
            </div>
            
            <div class="risk-detail-info">
                <div class="info-section">
                    <h5>Case Information</h5>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>User ID:</label>
                            <span>${userId}</span>
                        </div>
                        <div class="info-item">
                            <label>Risk Level:</label>
                            <span>High</span>
                        </div>
                        <div class="info-item">
                            <label>Trigger:</label>
                            <span>Suicidal ideation expressed in chat</span>
                        </div>
                        <div class="info-item">
                            <label>Detection Time:</label>
                            <span>2 hours ago</span>
                        </div>
                    </div>
                </div>
                
                <div class="info-section">
                    <h5>Recent Activity</h5>
                    <div class="activity-timeline">
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <strong>High-risk message detected</strong>
                                <span>2 hours ago</span>
                                <p>User message contained phrases indicating severe distress</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <strong>AI response generated</strong>
                                <span>2 hours ago</span>
                                <p>Emergency support options presented to user</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="risk-actions">
                <button class="btn-primary">
                    <i class="fas fa-user-md"></i>
                    Assign Counselor
                </button>
                <button class="btn-outline">
                    <i class="fas fa-phone"></i>
                    Emergency Contact
                </button>
                <button class="btn-outline">
                    <i class="fas fa-file-medical"></i>
                    Create Case Report
                </button>
            </div>
        `;
        
        modal.classList.add('show');
    }

    flagRiskCase(userId) {
        if (confirm(`Flag ${userId} for priority review?`)) {
            // Simulate API call
            this.showNotification(`Case ${userId} flagged successfully`, 'success');
        }
    }

    assignCounselor(userId) {
        // Simulate counselor assignment
        this.showNotification(`Counselor assigned to ${userId}`, 'success');
    }

    sendFollowUp(userId) {
        // Simulate follow-up message
        this.showNotification(`Follow-up message sent to ${userId}`, 'success');
    }

    createCaseReport(userId) {
        // Simulate report creation
        this.showNotification(`Case report created for ${userId}`, 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            border-left: 4px solid var(--primary);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 300px;
        `;
        
        if (type === 'success') {
            notification.style.borderLeftColor = 'var(--success)';
        } else if (type === 'danger') {
            notification.style.borderLeftColor = 'var(--danger)';
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    closeModal() {
        document.getElementById('riskDetailModal').classList.remove('show');
    }

    loadDashboardData() {
        // Simulate loading data from API
        setTimeout(() => {
            this.updateMetrics();
        }, 1000);
    }

    updateMetrics() {
        // In a real implementation, this would update metrics from live data
        console.log('Dashboard data loaded');
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new PsycheTechDashboard();
    
    // Close modal when clicking outside
    document.getElementById('riskDetailModal').addEventListener('click', (e) => {
        if (e.target.id === 'riskDetailModal') {
            window.dashboard.closeModal();
        }
    });
});