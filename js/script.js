// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');

    // Mobile menu initialization
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mainNav.classList.toggle('active');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                if (mainNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('active')) {
                if (!mainNav.contains(e.target) && !menuBtn.contains(e.target)) {
                    mainNav.classList.remove('active');
                    const icon = menuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });

        // Close menu when clicking a nav link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // If it's the home link (empty hash or just #), scroll to top
            if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // Otherwise scroll to the section
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Form will be handled by Formspree
            // The button state will be reset after submission
            setTimeout(() => {
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;
            }, 2000);
        });
    }

    // Add animation class to elements when they come into view
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all service cards and portfolio items
    document.querySelectorAll('.service-card, .portfolio-item').forEach(el => {
        observer.observe(el);
    });

    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.service-card, .pricing-card, .portfolio-item, h2');
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
    });

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Update the animate value function to handle formatted numbers
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            // Format the number with comma
            element.innerHTML = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Update the price observer to handle formatted numbers
    const priceElements = document.querySelectorAll('.amount');
    const priceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove commas before parsing
                const targetPrice = parseInt(entry.target.innerHTML.replace(/,/g, ''));
                animateValue(entry.target, 0, targetPrice, 2000);
                priceObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    priceElements.forEach(element => {
        priceObserver.observe(element);
    });

    // Initialize Matrix effect
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        console.log('Hero background found, starting Matrix effect...');
        createMatrixEffect(heroBackground);
    }

    // Track page views and interactions
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }

    // Track clicks on CTA buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'CTA',
                    'event_label': this.textContent
                });
            }
        });
    });

    // Theme toggle functionality with Brave browser compatibility
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('i');
    
    // Try to get theme from multiple sources
    function getInitialTheme() {
        try {
            // Try localStorage first
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) return savedTheme;
            
            // Try system preferences
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        } catch (e) {
            console.warn('Error accessing theme preferences:', e);
        }
        
        // Default to dark theme if all else fails
        return 'dark';
    }
    
    // Apply theme with fallback options
    function applyTheme(theme) {
        try {
            // Apply to HTML element
            document.documentElement.setAttribute('data-theme', theme);
            
            // Apply to body as fallback
            document.body.setAttribute('data-theme', theme);
            
            // Force theme on all elements that might need it
            const themedElements = document.querySelectorAll('header, nav, main, footer, .pricing-card, .service-card');
            themedElements.forEach(element => {
                element.setAttribute('data-theme', theme);
            });
            
            // Update icon
            if (themeIcon) {
                themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
            
            // Try to save preference
            try {
                localStorage.setItem('theme', theme);
            } catch (e) {
                console.warn('Unable to save theme preference');
            }
            
            // Force repaint
            document.body.style.display = 'none';
            document.body.offsetHeight;
            document.body.style.display = '';
            
        } catch (e) {
            console.error('Error applying theme:', e);
        }
    }
    
    // Initial theme application
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);
    
    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        applyTheme(newTheme);
        
        // Animation
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'none';
        }, 300);
    });
});

function createMatrixEffect(container) {
    if (window.matrixInterval) {
        clearInterval(window.matrixInterval);
    }
    
    const isMobile = window.innerWidth <= 768;
    let isScrolling = false;
    let scrollTimeout;
    
    // Throttle scroll events
    window.addEventListener('scroll', () => {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    }, { passive: true });
    
    window.matrixInterval = setInterval(() => {
        // Skip creating new elements while scrolling
        if (isScrolling) return;
        
        // Limit total number of active elements
        const activeElements = container.getElementsByClassName('binary-text');
        if (activeElements.length > (isMobile ? 15 : 25)) return;
        
        for (let i = 0; i < (isMobile ? 1 : 2); i++) {
            const binaryText = document.createElement('div');
            binaryText.className = 'binary-text';
            
            binaryText.style.left = `${Math.random() * 100}%`;
            binaryText.textContent = Math.random() > 0.5 ? '1' : '0';
            
            const size = Math.random() * (isMobile ? 6 : 15) + (isMobile ? 12 : 25);
            binaryText.style.fontSize = `${size}px`;
            
            const duration = Math.random() * (isMobile ? 5 : 3) + (isMobile ? 8 : 5);
            binaryText.style.animationDuration = `${duration}s`;
            
            // Use transform instead of top position for better performance
            binaryText.style.willChange = 'transform';
            
            container.appendChild(binaryText);
            
            setTimeout(() => {
                if (binaryText.parentNode) {
                    binaryText.remove();
                }
            }, duration * 1000);
        }
    }, isMobile ? 600 : 400);
}

const navLinks = document.querySelectorAll('.nav-link');

// Update active tab based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}); 