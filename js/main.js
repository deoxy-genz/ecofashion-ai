// Main JavaScript functionality for EcoFashion AI

// Global variables
let currentPage = '';
let isLoading = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupAnimations();
    setupNavigation();
});

// Initialize application
function initializeApp() {
    currentPage = getCurrentPage();
    console.log('EcoFashion AI initialized');
    
    // Add scroll reveal animations
    setupScrollReveal();
    
    // Initialize progress bars if present
    animateProgressBars();
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page.replace('.html', '');
}

// Setup scroll reveal animations
function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Setup navigation
function setupNavigation() {
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// Navigation function
function navigateToPage(url) {
    if (isLoading) return;
    
    isLoading = true;
    showLoading();
    
    setTimeout(() => {
        window.location.href = url;
        isLoading = false;
    }, 500);
}

// Show loading indicator
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-overlay';
    loadingDiv.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    document.body.appendChild(loadingDiv);
    
    setTimeout(() => {
        if (document.body.contains(loadingDiv)) {
            document.body.removeChild(loadingDiv);
        }
    }, 1000);
}

// Setup animations
function setupAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.feature-card');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
        el.classList.add('fade-in');
    });
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress') || '0';
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 500);
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// Utility functions
function generateRandomScore(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

function getScoreCategory(score) {
    if (score > 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
}

function getScoreLabel(category) {
    const labels = {
        high: 'High Sustainability',
        medium: 'Medium Sustainability',
        low: 'Low Sustainability'
    };
    return labels[category] || 'Unknown';
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('ripple') || e.target.closest('.ripple')) {
        const button = e.target.classList.contains('ripple') ? e.target : e.target.closest('.ripple');
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            left: ${x}px;
            top: ${y}px;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading states to forms
function addLoadingState(element) {
    element.disabled = true;
    element.innerHTML = '<div class="loading-spinner"></div> Processing...';
}

function removeLoadingState(element, originalText) {
    element.disabled = false;
    element.innerHTML = originalText;
}

// Network status monitoring
function setupNetworkMonitoring() {
    function updateNetworkStatus() {
        const isOnline = navigator.onLine;
        const statusElement = document.getElementById('network-status');
        
        if (!statusElement) {
            const status = document.createElement('div');
            status.id = 'network-status';
            status.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                padding: 10px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                z-index: 1000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(status);
        }
        
        const statusElement2 = document.getElementById('network-status');
        if (isOnline) {
            statusElement2.style.background = '#d4edda';
            statusElement2.style.color = '#155724';
            statusElement2.textContent = '🟢 Online';
        } else {
            statusElement2.style.background = '#f8d7da';
            statusElement2.style.color = '#721c24';
            statusElement2.textContent = '🔴 Offline';
        }
    }
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus();
}

// Initialize network monitoring
document.addEventListener('DOMContentLoaded', setupNetworkMonitoring);

// Export enhanced functions for use in other files
window.EcoFashionAI = {
    navigateToPage,
    showNotification,
    generateRandomScore,
    formatNumber,
    getScoreCategory,
    getScoreLabel,
    addLoadingState,
    removeLoadingState
};