// Main JavaScript functionality for EcoFashion AI

// Global variables
let currentPage = '';
let isLoading = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupAnimations();
    setupNavigation();
    setupRealTimeFeatures();
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

// Real-time features setup
function setupRealTimeFeatures() {
    // Auto-save form data to localStorage
    setupFormAutoSave();
    
    // Real-time data updates
    setupDataSync();
    
    // Performance monitoring
    setupPerformanceMonitoring();
    
    // User interaction tracking
    setupInteractionTracking();
}

// Auto-save form data
function setupFormAutoSave() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const formId = form.id || `form-${Math.random().toString(36).substr(2, 9)}`;
        
        // Load saved data
        const savedData = localStorage.getItem(`form-data-${formId}`);
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                Object.keys(formData).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input && input.type !== 'submit') {
                        input.value = formData[key];
                    }
                });
            } catch (e) {
                console.warn('Failed to restore form data:', e);
            }
        }
        
        // Save data on change
        form.addEventListener('input', (e) => {
            if (e.target.type !== 'submit') {
                saveFormData(form, formId);
            }
        });
        
        // Clear saved data on successful submit
        form.addEventListener('submit', () => {
            localStorage.removeItem(`form-data-${formId}`);
        });
    });
}

function saveFormData(form, formId) {
    const formData = {};
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.name && input.type !== 'submit') {
            formData[input.name] = input.value;
        }
    });
    localStorage.setItem(`form-data-${formId}`, JSON.stringify(formData));
}

// Real-time data synchronization
function setupDataSync() {
    // Sync sustainability scores with IndexedDB for offline access
    if ('indexedDB' in window) {
        initializeIndexedDB();
    }
    
    // Check for updates every 5 minutes
    setInterval(checkForUpdates, 5 * 60 * 1000);
}

function initializeIndexedDB() {
    const request = indexedDB.open('EcoFashionAI', 1);
    
    request.onerror = () => {
        console.warn('IndexedDB not available');
    };
    
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create stores for different data types
        if (!db.objectStoreNames.contains('designs')) {
            db.createObjectStore('designs', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('scores')) {
            db.createObjectStore('scores', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('predictions')) {
            db.createObjectStore('predictions', { keyPath: 'id', autoIncrement: true });
        }
    };
    
    request.onsuccess = (event) => {
        window.ecoFashionDB = event.target.result;
        console.log('IndexedDB initialized successfully');
    };
}

function checkForUpdates() {
    // Check for new features or data updates
    fetch('./version.json')
        .then(response => response.json())
        .then(data => {
            const currentVersion = localStorage.getItem('appVersion') || '1.0.0';
            if (data.version !== currentVersion) {
                showUpdateNotification(data);
            }
        })
        .catch(() => {
            // Silently handle missing version file
        });
}

function showUpdateNotification(updateData) {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <h4>🎉 New Update Available!</h4>
            <p>Version ${updateData.version} is available with new features and improvements.</p>
            <button onclick="refreshApp()" class="update-btn">Update Now</button>
            <button onclick="dismissUpdate()" class="dismiss-btn">Later</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 10000);
}

function refreshApp() {
    localStorage.setItem('appVersion', '1.0.1');
    window.location.reload();
}

function dismissUpdate() {
    const notification = document.querySelector('.update-notification');
    if (notification) {
        document.body.removeChild(notification);
    }
}

// Performance monitoring
function setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        
        if (loadTime > 3000) {
            console.warn(`Slow page load detected: ${loadTime}ms`);
        }
        
        // Store performance data
        const perfStats = JSON.parse(localStorage.getItem('performanceStats') || '[]');
        perfStats.push({
            page: window.location.pathname,
            loadTime,
            timestamp: Date.now()
        });
        
        // Keep only last 50 entries
        if (perfStats.length > 50) {
            perfStats.splice(0, perfStats.length - 50);
        }
        
        localStorage.setItem('performanceStats', JSON.stringify(perfStats));
    });
}

// User interaction tracking for UX improvements
function setupInteractionTracking() {
    let interactionData = {
        clicks: 0,
        formSubmissions: 0,
        timeSpent: Date.now(),
        features: new Set()
    };
    
    // Track clicks
    document.addEventListener('click', (e) => {
        interactionData.clicks++;
        
        // Track feature usage
        if (e.target.closest('.feature-card')) {
            const feature = e.target.closest('.feature-card').querySelector('h3')?.textContent;
            if (feature) {
                interactionData.features.add(feature);
            }
        }
    });
    
    // Track form submissions
    document.addEventListener('submit', () => {
        interactionData.formSubmissions++;
    });
    
    // Save interaction data periodically
    setInterval(() => {
        const sessionData = {
            ...interactionData,
            features: Array.from(interactionData.features),
            timeSpent: Date.now() - interactionData.timeSpent,
            page: window.location.pathname
        };
        
        localStorage.setItem('userInteractionData', JSON.stringify(sessionData));
    }, 30000); // Save every 30 seconds
}

// Enhanced utility functions
function saveToIndexedDB(storeName, data) {
    if (!window.ecoFashionDB) return Promise.reject('Database not available');
    
    return new Promise((resolve, reject) => {
        const transaction = window.ecoFashionDB.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add({
            ...data,
            timestamp: Date.now()
        });
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function getFromIndexedDB(storeName, limit = 10) {
    if (!window.ecoFashionDB) return Promise.resolve([]);
    
    return new Promise((resolve, reject) => {
        const transaction = window.ecoFashionDB.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => {
            const results = request.result
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, limit);
            resolve(results);
        };
        
        request.onerror = () => reject(request.error);
    });
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
    removeLoadingState,
    saveToIndexedDB,
    getFromIndexedDB,
    saveFormData,
    refreshApp,
    dismissUpdate
};