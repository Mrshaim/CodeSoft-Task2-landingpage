// Advanced animations and interactions
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupParallax();
        this.setupTextAnimations();
        this.setupHoverEffects();
        this.setupScrollAnimations();
        this.setupBackgroundAnimations();
    }

    // Parallax effects
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
        
        if (parallaxElements.length === 0) return;

        let ticking = false;

        const updateParallax = () => {
            const scrollTop = window.pageYOffset;

            parallaxElements.forEach(element => {
                const speed = element.classList.contains('parallax-slow') ? 0.2 :
                             element.classList.contains('parallax-medium') ? 0.5 : 0.8;
                
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    // Text animations
    setupTextAnimations() {
        this.animateHeroText();
        this.setupTypewriter();
    }

    animateHeroText() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const lines = heroTitle.querySelectorAll('.title-line');
        
        lines.forEach((line, index) => {
            // Split text into spans for character animation
            const text = line.textContent;
            line.innerHTML = '';
            
            [...text].forEach((char, charIndex) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(50px) rotateX(-90deg);
                    animation: charReveal 0.6s ease-out forwards;
                    animation-delay: ${(index * 0.3) + (charIndex * 0.02)}s;
                `;
                line.appendChild(span);
            });
        });

        // Add character reveal animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes charReveal {
                to {
                    opacity: 1;
                    transform: translateY(0) rotateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid';
            
            let index = 0;
            const typeInterval = setInterval(() => {
                element.textContent += text[index];
                index++;
                
                if (index >= text.length) {
                    clearInterval(typeInterval);
                    // Remove cursor after typing is done
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }, 100);
        });
    }

    // Advanced hover effects
    setupHoverEffects() {
        this.setupMagneticButtons();
        this.setup3DCardEffects();
        this.setupGlowEffects();
    }

    setupMagneticButtons() {
        const magneticElements = document.querySelectorAll('.btn, .service-card, .portfolio-item');
        
        magneticElements.forEach(element => {
            let isHovering = false;
            
            element.addEventListener('mouseenter', () => {
                isHovering = true;
            });
            
            element.addEventListener('mouseleave', () => {
                isHovering = false;
                element.style.transform = '';
            });
            
            element.addEventListener('mousemove', (e) => {
                if (!isHovering) return;
                
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = 0.1;
                element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
        });
    }

    setup3DCardEffects() {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateZ(10px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    setupGlowEffects() {
        const glowElements = document.querySelectorAll('.btn-primary');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = `
                    0 0 20px rgba(102, 126, 234, 0.4),
                    0 0 40px rgba(102, 126, 234, 0.2),
                    0 10px 30px rgba(0, 0, 0, 0.2)
                `;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = '';
            });
        });
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        this.setupProgressBar();
        this.setupScrollTriggers();
    }

    setupProgressBar() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            z-index: var(--z-tooltip);
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        // Update progress on scroll
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        });
    }

    setupScrollTriggers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe animated elements
        const animatedElements = document.querySelectorAll('[class*="animate-"]');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Background animations
    setupBackgroundAnimations() {
        this.animateFloatingShapes();
        this.setupGradientShift();
    }

    animateFloatingShapes() {
        const shapes = document.querySelectorAll('.floating-shapes .shape');
        
        shapes.forEach((shape, index) => {
            // Add random movement
            const randomX = (Math.random() - 0.5) * 100;
            const randomY = (Math.random() - 0.5) * 100;
            const randomDelay = Math.random() * 2;
            
            shape.style.animationDelay = `${randomDelay}s`;
            
            // Add mouse interaction
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth) * 20;
                const y = (e.clientY / window.innerHeight) * 20;
                
                shape.style.transform = `
                    translate(${randomX + x}px, ${randomY + y}px)
                `;
            });
        });
    }

    setupGradientShift() {
        const gradientElements = document.querySelectorAll('.hero-background');
        
        gradientElements.forEach(element => {
            let hue = 0;
            
            const shiftGradient = () => {
                hue = (hue + 1) % 360;
                element.style.filter = `hue-rotate(${hue}deg)`;
                requestAnimationFrame(shiftGradient);
            };
            
            // Start gradient animation with reduced motion check
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                // shiftGradient();
            }
        });
    }
}

// Page transition effects
class PageTransitions {
    constructor() {
        // Page transitions can be added here if needed
    }
}

// Initialize animation systems
document.addEventListener('DOMContentLoaded', () => {
    new AnimationManager();
    new PageTransitions();
});