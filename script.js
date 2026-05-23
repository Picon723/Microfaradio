/* ========================================================
   ElectroFix — Interactive JavaScript
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Header Scroll Effect ── */
    const header = document.getElementById('main-header');
    const handleHeaderScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    /* ── Mobile Navigation ── */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        mobileToggle.classList.toggle('active', isOpen);
        mobileToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('open');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    /* ── Active Link on Scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const updateActiveLink = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    };
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* ── Hero Particles ── */
    const particleContainer = document.getElementById('hero-particles');
    if (particleContainer) {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            const colors = ['var(--accent-neon)', 'var(--accent-blue)', 'var(--accent-purple)'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particleContainer.appendChild(particle);
        }
    }

    /* ── Scroll Reveal Animation ── */
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

    /* ── Animated Counters ── */
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounter = (element) => {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(target * easedProgress);

            element.textContent = current.toLocaleString('es-CO');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                counters.forEach(counter => animateCounter(counter));

                // Animate timeline
                const timeline = document.querySelector('.timeline');
                if (timeline) timeline.classList.add('animated');
            }
        });
    }, { threshold: 0.3 });

    const statsRow = document.querySelector('.stats-row');
    if (statsRow) counterObserver.observe(statsRow);

    /* ── Testimonial Slider ── */
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        let slidesVisible = window.innerWidth >= 768 ? 2 : 1;

        const totalSlides = Math.ceil(cards.length / slidesVisible);

        // Create dots
        const createDots = () => {
            dotsContainer.innerHTML = '';
            const dotsCount = Math.ceil(cards.length / slidesVisible);
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('testimonial-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        };

        const goToSlide = (index) => {
            const maxSlide = Math.ceil(cards.length / slidesVisible) - 1;
            currentSlide = Math.max(0, Math.min(index, maxSlide));
            const offset = currentSlide * (100 / slidesVisible) * slidesVisible;
            track.style.transform = `translateX(-${offset}%)`;

            dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        };

        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

        // Auto-play
        let autoPlay = setInterval(() => {
            const maxSlide = Math.ceil(cards.length / slidesVisible) - 1;
            goToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1);
        }, 5000);

        track.addEventListener('mouseenter', () => clearInterval(autoPlay));
        track.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                const maxSlide = Math.ceil(cards.length / slidesVisible) - 1;
                goToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1);
            }, 5000);
        });

        // Handle resize
        const handleResize = () => {
            const newSlidesVisible = window.innerWidth >= 768 ? 2 : 1;
            if (newSlidesVisible !== slidesVisible) {
                slidesVisible = newSlidesVisible;
                currentSlide = 0;
                createDots();
                goToSlide(0);
            }
        };

        window.addEventListener('resize', handleResize);
        createDots();

        // Touch support
        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goToSlide(currentSlide + 1);
                else goToSlide(currentSlide - 1);
            }
        }, { passive: true });
    }

    /* ── FAQ Accordion ── */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ── Contact Form Validation ── */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const fields = {
            name: {
                element: document.getElementById('contact-name'),
                error: document.getElementById('error-name'),
                validate: (val) => val.trim().length >= 3 ? '' : 'Ingresa tu nombre completo (mínimo 3 caracteres)'
            },
            phone: {
                element: document.getElementById('contact-phone'),
                error: document.getElementById('error-phone'),
                validate: (val) => /^[\d\s\+\-()]{7,15}$/.test(val.trim()) ? '' : 'Ingresa un número de teléfono válido'
            },
            equipment: {
                element: document.getElementById('contact-equipment'),
                error: document.getElementById('error-equipment'),
                validate: (val) => val ? '' : 'Selecciona el tipo de equipo'
            },
            message: {
                element: document.getElementById('contact-message'),
                error: document.getElementById('error-message'),
                validate: (val) => val.trim().length >= 10 ? '' : 'Describe el problema con al menos 10 caracteres'
            }
        };

        // Live validation
        Object.values(fields).forEach(field => {
            field.element.addEventListener('blur', () => {
                const errorMsg = field.validate(field.element.value);
                field.error.textContent = errorMsg;
                field.element.classList.toggle('error', !!errorMsg);
            });

            field.element.addEventListener('input', () => {
                if (field.element.classList.contains('error')) {
                    const errorMsg = field.validate(field.element.value);
                    field.error.textContent = errorMsg;
                    field.element.classList.toggle('error', !!errorMsg);
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            Object.values(fields).forEach(field => {
                const errorMsg = field.validate(field.element.value);
                field.error.textContent = errorMsg;
                field.element.classList.toggle('error', !!errorMsg);
                if (errorMsg) isValid = false;
            });

            if (!isValid) return;

            // Simulate submission
            const submitBtn = document.getElementById('form-submit-btn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                contactForm.reset();
                document.getElementById('form-success').classList.add('show');

                Object.values(fields).forEach(field => {
                    field.error.textContent = '';
                    field.element.classList.remove('error');
                });

                setTimeout(() => {
                    document.getElementById('form-success').classList.remove('show');
                }, 6000);
            }, 1500);
        });
    }

    /* ── Back to Top ── */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ── Smooth Scroll for Anchor Links ── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ── Service Card Shine Effect ── */
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            const shine = card.querySelector('.service-card-shine');
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0, 232, 143, 0.08), transparent 50%)`;
                shine.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            const shine = card.querySelector('.service-card-shine');
            if (shine) shine.style.opacity = '0';
        });
    });

    /* ── Parallax Effect on Hero ── */
    const heroImage = document.querySelector('.hero-image-wrapper');
    if (heroImage && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
            }
        }, { passive: true });
    }

    /* ── Animate Timeline on Scroll ── */
    const timelineEl = document.querySelector('.timeline');
    if (timelineEl) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineEl.classList.add('animated');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        timelineObserver.observe(timelineEl);
    }

});
