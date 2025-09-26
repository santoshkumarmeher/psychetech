// Main JavaScript file for PsycheTech application
class PsycheTechApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
        this.initializeComponents();
    }

    bindEvents() {
        // Global event listeners
        document.addEventListener('DOMContentLoaded', this.handleDOMReady.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Prevent form submission for demo purposes
        document.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        // Add loading states to buttons
        document.addEventListener('click', this.handleButtonClicks.bind(this));
    }

    handleDOMReady() {
        console.log('PsycheTech App Initialized');
        
        // Initialize mobile navigation
        this.initMobileNavigation();
        
        // Initialize stats counter animation
        this.initStatsAnimation();
        
        // Initialize smooth scrolling
        this.initSmoothScrolling();
        
        // Check if user is logged in (demo purposes)
        this.checkLoginStatus();
        
        // Add any page-specific initializations
        this.initPageSpecificFeatures();
    }

    handleResize() {
        // Handle responsive behaviors on resize
        this.debounce(() => {
            this.handleMobileMenuResize();
        }, 250)();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleMobileMenuResize() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (window.innerWidth >= 1024 && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    initMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (!hamburger) return;

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu when clicking on links
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }

    toggleMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    initStatsAnimation() {
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count')) || 0;
            const duration = 2000;
            const steps = 60;
            const step = target / steps;
            let current = 0;
            let stepCount = 0;
            
            const timer = setInterval(() => {
                current += step;
                stepCount++;
                
                if (stepCount >= steps) {
                    stat.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }, duration / steps);
        });
    }

    initSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    checkLoginStatus() {
        // Check if user is logged in (demo - would be from backend in real app)
        const userData = localStorage.getItem('psychetech_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUIForLoggedInUser();
        }
    }

    updateUIForLoggedInUser() {
        // Update navigation for logged in users
        const navAuth = document.querySelector('.nav-auth');
        const mobileAuth = document.querySelector('.mobile-auth');
        const navUser = document.querySelector('.nav-user');
        
        if (navAuth) navAuth.style.display = 'none';
        if (mobileAuth) mobileAuth.style.display = 'none';
        if (navUser) navUser.style.display = 'flex';
        
        // Update user name if available
        if (this.currentUser && this.currentUser.name) {
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(element => {
                element.textContent = `Hello, ${this.currentUser.name.split(' ')[0]}`;
            });
        }
    }

    handleFormSubmit(e) {
        const form = e.target;
        
        // Demo form handling - prevent actual submission
        if (form.id === 'login-form' || form.id === 'register-form') {
            e.preventDefault();
            this.handleAuthFormSubmit(form);
        }
    }

    handleAuthFormSubmit(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            if (form.id === 'login-form') {
                this.handleLogin(formData);
            } else if (form.id === 'register-form') {
                this.handleRegistration(formData);
            }
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    handleLogin(formData) {
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Demo login - in real app, this would call an API
        if (email && password) {
            const userData = {
                id: 1,
                name: 'Demo User',
                email: email,
                role: 'student'
            };
            
            localStorage.setItem('psychetech_user', JSON.stringify(userData));
            this.currentUser = userData;
            
            // Show success message and redirect
            this.showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            this.showNotification('Please fill in all fields', 'error');
        }
    }

    handleRegistration(formData) {
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const password = formData.get('password');
        
        if (firstName && lastName && email && password) {
            const userData = {
                id: Date.now(),
                name: `${firstName} ${lastName}`,
                email: email,
                role: 'student',
                joined: new Date().toISOString()
            };
            
            localStorage.setItem('psychetech_user', JSON.stringify(userData));
            this.currentUser = userData;
            
            this.showNotification('Registration successful! Welcome to PsycheTech.', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            this.showNotification('Please fill in all required fields', 'error');
        }
    }

    handleButtonClicks(e) {
        const button = e.target.closest('.btn');
        if (!button) return;
        
        // Add loading state for buttons that navigate
        if (button.href && !button.href.includes('javascript')) {
            this.addButtonLoadingState(button);
        }
        
        // Handle specific button actions
        if (button.classList.contains('btn-sos')) {
            e.preventDefault();
            this.handleSOSButton();
        }
    }

    addButtonLoadingState(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }

    handleSOSButton() {
        // Emergency SOS functionality
        if (confirm('Are you in immediate danger? This will connect you to emergency services.')) {
            // In a real app, this would initiate emergency protocols
            this.showNotification('Emergency services alerted. Help is on the way.', 'emergency');
            
            // Simulate calling emergency number
            setTimeout(() => {
                window.open('tel:1-800-273-8255');
            }, 1000);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            emergency: 'fa-life-ring'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            border-left: 4px solid var(--primary);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            transform: translateX(150%);
            transition: transform 0.3s ease;
        `;
        
        // Set border color based on type
        const colors = {
            success: 'var(--success)',
            error: 'var(--danger)',
            warning: 'var(--warning)',
            info: 'var(--primary)',
            emergency: 'var(--danger)'
        };
        
        notification.style.borderLeftColor = colors[type] || 'var(--primary)';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                this.removeNotification(notification);
            }
        }, 5000);
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    initPageSpecificFeatures() {
        // Initialize features specific to the current page
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        
        switch(page) {
            case 'index.html':
                this.initHomePage();
                break;
            case 'chat.html':
                // Chat specific initialization
                break;
            case 'assessment.html':
                // Assessment specific initialization
                break;
            case 'dashboard.html':
                // Dashboard specific initialization
                break;
        }
    }

    initHomePage() {
        // Home page specific initializations
        this.initFloatingCards();
        this.initFeatureCards();
    }

    initFloatingCards() {
        // Add hover effects to floating cards
        const floatingCards = document.querySelectorAll('.floating-card');
        
        floatingCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    initFeatureCards() {
        // Add interactive effects to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const featureType = card.querySelector('h3').textContent.toLowerCase();
                this.navigateToFeature(featureType);
            });
        });
    }

    navigateToFeature(featureType) {
        const featureMap = {
            'ai chat support': 'chat.html',
            'clinical assessments': 'assessment.html',
            'professional connection': 'booking.html',
            'emergency support': 'resources.html'
        };
        
        const targetPage = featureMap[featureType];
        if (targetPage) {
            window.location.href = targetPage;
        }
    }

    initializeComponents() {
        // Initialize any third-party components or libraries
        this.initTooltips();
        this.initModals();
    }

    initTooltips() {
        // Simple tooltip implementation
        const elementsWithTooltip = document.querySelectorAll('[data-tooltip]');
        
        elementsWithTooltip.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltipText = element.getAttribute('data-tooltip');
                this.showTooltip(e, tooltipText);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(e, text) {
        let tooltip = document.querySelector('.custom-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        tooltip.style.display = 'block';
        
        const x = e.clientX + 10;
        const y = e.clientY + 10;
        
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }

    hideTooltip() {
        const tooltip = document.querySelector('.custom-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    initModals() {
        // Global modal handling
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
            
            if (e.target.classList.contains('btn-close-modal')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('show');
                }
            }
        });
    }

    // Utility methods
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // API simulation methods (for demo purposes)
    async simulateAPICall(endpoint, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: { ...data, id: Date.now() } });
            }, 1000);
        });
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.psycheTechApp = new PsycheTechApp();
});

// Add CSS for notifications and tooltips
const additionalStyles = `
    .notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--gray);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: var(--transition);
    }
    
    .notification-close:hover {
        background: var(--light-gray);
    }
    
    .custom-tooltip {
        position: fixed;
        background: var(--dark);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius);
        font-size: 0.9rem;
        z-index: 10001;
        pointer-events: none;
        display: none;
    }
    
    .custom-tooltip::after {
        content: '';
        position: absolute;
        top: -5px;
        left: 10px;
        width: 10px;
        height: 10px;
        background: var(--dark);
        transform: rotate(45deg);
    }
    
    /* Loading animation */
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .fa-spin {
        animation: spin 1s linear infinite;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);