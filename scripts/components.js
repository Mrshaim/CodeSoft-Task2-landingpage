// Reusable components and utilities
class ComponentManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupModal();
        this.setupTooltips();
        this.setupImageLazyLoading();
        this.setupScrollToTop();
        this.setupThemeToggle();
    }

    // Modal functionality
    setupModal() {
        // Create modal structure
        const modal = document.createElement('div');
        modal.id = 'modal';
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all var(--transition-normal);
            z-index: var(--z-modal);
            backdrop-filter: blur(5px);
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                background: var(--white);
                border-radius: var(--radius-xl);
                padding: var(--space-2xl);
                max-width: 90vw;
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.8);
                transition: transform var(--transition-normal);
                position: relative;
            ">
                <button class="modal-close" style="
                    position: absolute;
                    top: var(--space-lg);
                    right: var(--space-lg);
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--gray-500);
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-md);
                    transition: all var(--transition-fast);
                ">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body"></div>
            </div>
        `;

        document.body.appendChild(modal);

        // Modal controls
        const modalElement = modal;
        const modalContent = modal.querySelector('.modal-content');
        const modalClose = modal.querySelector('.modal-close');
        const modalBody = modal.querySelector('.modal-body');

        // Close modal function
        const closeModal = () => {
            modalElement.style.opacity = '0';
            modalElement.style.visibility = 'hidden';
            modalContent.style.transform = 'scale(0.8)';
            document.body.style.overflow = '';
        };

        // Open modal function
        window.openModal = (content) => {
            modalBody.innerHTML = content;
            modalElement.style.opacity = '1';
            modalElement.style.visibility = 'visible';
            modalContent.style.transform = 'scale(1)';
            document.body.style.overflow = 'hidden';
        };

        // Close modal events
        modalClose.addEventListener('click', closeModal);
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) closeModal();
        });

        // Keyboard escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalElement.style.visibility === 'visible') {
                closeModal();
            }
        });

        // Make closeModal globally available
        window.closeModal = closeModal;

        // Portfolio modal triggers
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('p').textContent;
                const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent);
                const image = item.querySelector('img').src;

                const modalContent = `
                    <div class="portfolio-modal">
                        <img src="${image}" alt="${title}" style="
                            width: 100%;
                            max-height: 400px;
                            object-fit: cover;
                            border-radius: var(--radius-lg);
                            margin-bottom: var(--space-lg);
                        ">
                        <h2 style="margin-bottom: var(--space-md); color: var(--gray-900);">${title}</h2>
                        <p style="color: var(--gray-600); margin-bottom: var(--space-lg); line-height: 1.6;">${description}</p>
                        <div class="portfolio-tags" style="
                            display: flex;
                            flex-wrap: wrap;
                            gap: var(--space-sm);
                            margin-bottom: var(--space-lg);
                        ">
                            ${tags.map(tag => `
                                <span style="
                                    padding: var(--space-xs) var(--space-md);
                                    background: var(--primary-color);
                                    color: var(--white);
                                    border-radius: var(--radius-full);
                                    font-size: 0.875rem;
                                ">${tag}</span>
                            `).join('')}
                        </div>
                        <div class="portfolio-actions" style="
                            display: flex;
                            gap: var(--space-md);
                            justify-content: center;
                        ">
                            <button class="btn btn-primary">
                                <span>View Live</span>
                                <i class="fas fa-external-link-alt"></i>
                            </button>
                            <button class="btn btn-secondary" style="
                                background: var(--gray-100);
                                color: var(--gray-700);
                                border: 2px solid var(--gray-300);
                            ">
                                <span>View Code</span>
                                <i class="fab fa-github"></i>
                            </button>
                        </div>
                    </div>
                `;

                openModal(modalContent);
            });
        });
    }

    // Tooltip system
    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: var(--gray-900);
                color: var(--white);
                padding: var(--space-sm) var(--space-md);
                border-radius: var(--radius-md);
                font-size: 0.875rem;
                opacity: 0;
                pointer-events: none;
                transition: opacity var(--transition-fast);
                z-index: var(--z-tooltip);
                white-space: nowrap;
                transform: translateX(-50%);
            `;
            
            element.style.position = 'relative';
            element.appendChild(tooltip);
            
            element.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
            
            // Position tooltip
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                tooltip.style.left = '50%';
                tooltip.style.top = `-${tooltip.offsetHeight + 8}px`;
            });
        });
    }

    // Lazy loading for images
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                        
                        // Add fade in effect
                        img.style.opacity = '0';
                        img.onload = () => {
                            img.style.transition = 'opacity var(--transition-normal)';
                            img.style.opacity = '1';
                        };
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Scroll to top button
    setupScrollToTop() {
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: var(--space-xl);
            right: var(--space-xl);
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: var(--white);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all var(--transition-normal);
            z-index: var(--z-fixed);
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(scrollToTopBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        });
        
        // Scroll to top functionality
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover effects
        scrollToTopBtn.addEventListener('mouseenter', () => {
            scrollToTopBtn.style.transform = 'translateY(-3px) scale(1.1)';
            scrollToTopBtn.style.boxShadow = 'var(--shadow-xl)';
        });
        
        scrollToTopBtn.addEventListener('mouseleave', () => {
            scrollToTopBtn.style.transform = 'translateY(0) scale(1)';
            scrollToTopBtn.style.boxShadow = 'var(--shadow-lg)';
        });
    }

    // Theme toggle functionality
    setupThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.cssText = `
            position: fixed;
            top: 50%;
            right: var(--space-lg);
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: var(--white);
            color: var(--gray-700);
            border: 2px solid var(--gray-200);
            border-radius: 50%;
            cursor: pointer;
            transition: all var(--transition-normal);
            z-index: var(--z-fixed);
            box-shadow: var(--shadow-md);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(themeToggle);
        
        // Check for saved theme preference
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // Update button icon
        const updateIcon = (theme) => {
            themeToggle.innerHTML = theme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        };
        
        updateIcon(currentTheme);
        
        // Theme toggle functionality
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
        
        // Add dark theme CSS
        const darkThemeStyles = `
            [data-theme="dark"] {
                --white: #111827;
                --gray-50: #1f2937;
                --gray-100: #374151;
                --gray-200: #4b5563;
                --gray-800: #f9fafb;
                --gray-900: #ffffff;
            }
            
            [data-theme="dark"] .navbar {
                background: rgba(17, 24, 39, 0.95);
                border-color: var(--gray-200);
            }
            
            [data-theme="dark"] .service-card,
            [data-theme="dark"] .contact-form {
                background: var(--gray-50);
                border: 1px solid var(--gray-200);
            }
        `;
        
        const darkStyleSheet = document.createElement('style');
        darkStyleSheet.textContent = darkThemeStyles;
        document.head.appendChild(darkStyleSheet);
    }
}

// Utility functions
class Utils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static getRandomColor() {
        const colors = [
            'var(--primary-color)',
            'var(--secondary-color)',
            'var(--accent-color)',
            'var(--success-color)',
            'var(--warning-color)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    static copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    }
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    new ComponentManager();
    
    // Make Utils globally available
    window.Utils = Utils;
});