/**
 * CHICAGO HIGHLANDS CLUB
 * Interactive animations and effects
 */

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('cursor');
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // ===================================
    // CUSTOM CURSOR
    // ===================================
    
    if (cursor && window.innerWidth > 1024) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.12;
            cursorY += (mouseY - cursorY) * 0.12;
            cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover states
        const hoverElements = document.querySelectorAll('a, button, .amenity-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // ===================================
    // NAVIGATION
    // ===================================
    
    const handleScroll = () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleScroll);
    });

    // Mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===================================
    // SMOOTH SCROLL
    // ===================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes
    const animateElements = document.querySelectorAll(
        '.about-intro, .about-content, .highlight, .golf-content, .amenity-card, .membership-content, .contact-info, .contact-item'
    );

    const style = document.createElement('style');
    style.textContent = `
        .animate-ready {
            opacity: 0;
            transform: translateY(50px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                        transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-in { opacity: 1; transform: translateY(0); }
        .highlight.animate-ready { transition-delay: calc(var(--index, 0) * 0.1s); }
        .amenity-card.animate-ready { transition-delay: calc(var(--index, 0) * 0.08s); }
        .contact-item.animate-ready { transition-delay: calc(var(--index, 0) * 0.15s); }
    `;
    document.head.appendChild(style);

    animateElements.forEach(el => {
        el.classList.add('animate-ready');
        animateOnScroll.observe(el);
    });

    // Stagger delays
    document.querySelectorAll('.highlight').forEach((el, i) => el.style.setProperty('--index', i));
    document.querySelectorAll('.amenity-card').forEach((el, i) => el.style.setProperty('--index', i));
    document.querySelectorAll('.contact-item').forEach((el, i) => el.style.setProperty('--index', i));

    // ===================================
    // IMAGE LAZY LOADING
    // ===================================
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';
        img.addEventListener('load', () => img.style.opacity = '1');
        if (img.complete) img.style.opacity = '1';
    });

    // ===================================
    // PARALLAX EFFECT (Hero)
    // ===================================
    
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroHeight = window.innerHeight;
            
            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight) * 1.2;
                const translate = scrolled * 0.4;
                heroContent.style.transform = `translateY(${translate}px)`;
                heroContent.style.opacity = Math.max(opacity, 0);
            }
        });
    }

    // ===================================
    // COUNTER ANIMATION
    // ===================================
    
    const animateValue = (el) => {
        const text = el.textContent;
        const match = text.match(/\d+/);
        if (!match) return;

        const target = parseInt(match[0]);
        const duration = 2000;
        const start = performance.now();

        const update = (time) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = text.replace(/\d+/, Math.floor(target * eased));
            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-value, .feature-number').forEach(el => {
        counterObserver.observe(el);
    });

    // ===================================
    // KEYBOARD NAVIGATION
    // ===================================
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ===================================
    // AMENITY CARDS TILT EFFECT
    // ===================================
    
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.amenity-card:not(.featured)').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    console.log('%cChicago Highlands Club', 'font-family: "Playfair Display"; font-size: 24px; color: #c9a962;');
    console.log('%cWhere links-style golf meets Chicago skyline views', 'font-family: Inter; font-size: 12px; color: #6b6b6b;');
});
