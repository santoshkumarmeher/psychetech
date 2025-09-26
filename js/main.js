// Universal PsycheTech JavaScript - Works on All Pages
document.addEventListener('DOMContentLoaded', function() {
    console.log('PsycheTech App Initialized - Page: ' + window.location.pathname);
    
    // Initialize features that exist on the current page
    initUniversalFeatures();
    initPageSpecificFeatures();
});

// Features that work on ALL pages
function initUniversalFeatures() {
    initMobileNavigation();
    initSmoothScrolling();
    initButtonLoadingStates();
    initFormHandling();
    initNotifications();
}

// Features specific to certain pages
function initPageSpecificFeatures() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index.html':
        case '':
        case '/':
            initHomePageFeatures();
            break;
        case 'chat.html':
            initChatPageFeatures();
            break;
        case 'assessment.html':
            initAssessmentPageFeatures();
            break;
        case 'dashboard.html':
            initDashboardPageFeatures();
            break;
        case 'resources.html':
            initResourcesPageFeatures();
            break;
        case 'booking.html':
            initBookingPageFeatures();
            break;
        default:
            console.log('No specific features for page: ' + currentPage);
    }
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    return path.split('/').pop() || 'index.html';
}

// Universal Mobile Navigation - Works on all pages
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!hamburger || !mobileMenu) {
        console.log('Mobile navigation elements not found on this page');
        return;
    }

    // Create backdrop if it doesn't exist
    let backdrop = document.querySelector('.mobile-menu-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';
        document.body.appendChild(backdrop);
    }

    // Hamburger click event
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Backdrop click event
    backdrop.addEventListener('click', function() {
        closeMobileMenu();
    });

    // Close menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) {
            closeMobileMenu();
        }
    });

    function toggleMobileMenu() {
        const isActive = mobileMenu.classList.contains('active');
        isActive ? closeMobileMenu() : openMobileMenu();
    }

    function openMobileMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        backdrop.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// Smooth Scrolling for all pages
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
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

// Button loading states for all pages
function initButtonLoadingStates() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Only add loading for buttons with href (navigation)
            if (this.href && !this.classList.contains('no-loading')) {
                addButtonLoadingState(this);
            }
        });
    });
}

function addButtonLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 1500);
}

// Form handling for all pages
function initFormHandling() {
    document.querySelectorAll('form').forEach(form => {
        // Only prevent default for demo forms
        if (form.id === 'login-form' || form.id === 'register-form') {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmit(this);
            });
        }
    });
}

function handleFormSubmit(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;
    
    // Simulate form processing
    setTimeout(() => {
        if (form.id === 'login-form') {
            showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else if (form.id === 'register-form') {
            showNotification('Registration successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Notification system for all pages
function initNotifications() {
    // CSS for notifications
    const notificationStyles = `
        .custom-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #4361ee;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .custom-notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left-color: #4cc9f0;
        }
        
        .notification-error {
            border-left-color: #e63946;
        }
        
        .notification-warning {
            border-left-color: #f8961e;
        }
        
        .notification-info {
            border-left-color: #4361ee;
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
            color: #6c757d;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification-close:hover {
            background: #e9ecef;
        }
        
        @media (max-width: 768px) {
            .custom-notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;

    // Inject styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'notification-styles';
        styleElement.textContent = notificationStyles;
        document.head.appendChild(styleElement);
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
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
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            removeNotification(notification);
        }
    }, 5000);
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 300);
}

// Page-specific feature initializers
function initHomePageFeatures() {
    console.log('Initializing home page features');
    initStatsCounter();
    initFloatingCards();
}

function initChatPageFeatures() {
    console.log('Initializing chat page features');
    // Chat-specific features will be handled by chat.js
}

function initAssessmentPageFeatures() {
    console.log('Initializing assessment page features');
    // Assessment-specific features will be handled by assessment.js
}

function initDashboardPageFeatures() {
    console.log('Initializing dashboard page features');
    // Dashboard-specific features will be handled by dashboard.js
}

function initResourcesPageFeatures() {
    console.log('Initializing resources page features');
    // Resources-specific features will be handled by resources.js
}

function initBookingPageFeatures() {
    console.log('Initializing booking page features');
    // Booking-specific features will be handled by booking.js
}

// Home page specific features
function initStatsCounter() {
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count')) || 0;
        const duration = 2000;
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                stat.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(start).toLocaleString();
            }
        }, 16);
    });
}

function initFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Make notification function globally available
window.showNotification = showNotification;