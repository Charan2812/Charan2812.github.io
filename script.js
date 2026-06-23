/* ==========================================================================
   Antigravity Premium Redesign JavaScript - "The Cognitive Insights Lab"
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // Theme Toggle Logic (Light / Dark)
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme preference
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggleBtn) {
            themeToggleBtn.querySelector('i').className = 'fas fa-sun';
        }
    } else {
        document.body.classList.remove('light-theme');
        if (themeToggleBtn) {
            themeToggleBtn.querySelector('i').className = 'fas fa-moon';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            
            // Save preference
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Update icon
            themeToggleBtn.querySelector('i').className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // --------------------------------------------------------------------------
    // Scroll Progress Bar & Sticky Header
    // --------------------------------------------------------------------------
    const scrollBar = document.getElementById('scroll-bar');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        // Sticky Header scroll class
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar percentage calculation
        if (scrollBar) {
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (documentHeight > 0) {
                const scrolledPercentage = (window.scrollY / documentHeight) * 100;
                scrollBar.style.width = `${scrolledPercentage}%`;
            }
        }
    });

    // --------------------------------------------------------------------------
    // Mobile Navigation Drawer Toggle
    // --------------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close drawer when mobile links are clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --------------------------------------------------------------------------
    // Active Navbar Section Highlighting while scrolling
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Highlight a bit early when section comes in view
            if (window.scrollY >= (sectionTop - 250)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --------------------------------------------------------------------------
    // Loop Typewriter Animation (Multi-word)
    // --------------------------------------------------------------------------
    const typewriterText = document.getElementById('typewriter-text');
    const words = ["Data Analyst", "MCA Post Graduate", "Dashboard Developer", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function handleTypewriter() {
        if (!typewriterText) return;
        
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 1600; // Pause at completion
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Brief delay before next word
        }

        setTimeout(handleTypewriter, typeSpeed);
    }
    
    // Start typing animation
    if (typewriterText) {
        setTimeout(handleTypewriter, 1000);
    }

    // --------------------------------------------------------------------------
    // Terminal Window Tab Switcher
    // --------------------------------------------------------------------------
    const termTabButtons = document.querySelectorAll('.terminal-tab-btn');
    
    termTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            termTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const targetTab = btn.getAttribute('data-term-tab');
            
            document.querySelectorAll('.term-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`term-tab-${targetTab}`).classList.add('active');
        });
    });

    // --------------------------------------------------------------------------
    // Interactive Insights Sandbox (Signal Filter Math Simulation)
    // --------------------------------------------------------------------------
    const noiseSlider = document.getElementById('noise-slider');
    const filterSlider = document.getElementById('filter-slider');
    const noiseValue = document.getElementById('noise-value');
    const filterValue = document.getElementById('filter-value');
    
    const rawPathEl = document.getElementById('sandbox-path-raw');
    const smoothPathEl = document.getElementById('sandbox-path-smooth');
    const insightNode = document.getElementById('sandbox-insight-node');
    const consoleOutput = document.getElementById('console-output');
    const statusLed = document.querySelector('.chart-status-led');

    // Base coordinate trend representing retail sales cycle
    const basePoints = [
        { x: 10, y: 140 },
        { x: 50, y: 155 },
        { x: 90, y: 110 },
        { x: 130, y: 125 },
        { x: 170, y: 80 },
        { x: 210, y: 95 },
        { x: 250, y: 55 },
        { x: 290, y: 65 },
        { x: 330, y: 35 },
        { x: 380, y: 25 }
    ];

    function updateSandboxChart() {
        if (!noiseSlider || !filterSlider) return;

        const noise = parseInt(noiseSlider.value, 10);
        const filter = parseInt(filterSlider.value, 10);

        noiseValue.textContent = `${noise}%`;
        filterValue.textContent = `${filter}%`;

        // Step 1: Generate Raw Path with pseudo-random jitter offsets depending on noise level
        const rawPoints = basePoints.map((p, idx) => {
            if (idx === 0 || idx === basePoints.length - 1) {
                return { ...p }; // keep boundary points static
            }
            // Generate stable but noise-proportional offsets using trigonometric waves + random offsets
            const waveOffset = Math.sin(p.x * 0.15) * (noise * 0.5);
            const randomOffset = ((idx % 2 === 0 ? 1 : -1) * (noise * 0.35));
            return { x: p.x, y: Math.max(10, Math.min(170, p.y + waveOffset + randomOffset)) };
        });

        // Step 2: Smooth raw points using sliding window filter depending on filter level
        const smoothPoints = [];
        const smoothingFactor = filter / 100; // 0 to 1

        for (let i = 0; i < rawPoints.length; i++) {
            if (i === 0 || i === rawPoints.length - 1) {
                smoothPoints.push({ ...rawPoints[i] });
            } else {
                // Moving average math: blend raw coordinate with its immediate neighbors
                const prevSmooth = smoothPoints[i - 1];
                const raw = rawPoints[i];
                const next = rawPoints[i + 1];
                
                const neighborhoodAverage = (prevSmooth.y + raw.y + next.y) / 3;
                const smoothedY = (raw.y * (1 - smoothingFactor)) + (neighborhoodAverage * smoothingFactor);
                
                smoothPoints.push({ x: raw.x, y: smoothedY });
            }
        }

        // Step 3: Draw SVG Path lines
        const rawPathString = rawPoints.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
        const smoothPathString = smoothPoints.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

        rawPathEl.setAttribute('d', rawPathString);
        smoothPathEl.setAttribute('d', smoothPathString);

        // Step 4: Verify Optimization threshold
        // Criteria: Noise is low (< 20%) and filter smoothing is high (> 80%)
        if (noise < 20 && filter > 80) {
            // Uncover the glowing Signal Amber Node at the last local peak coordinate
            const signalPeak = smoothPoints[smoothPoints.length - 2];
            insightNode.setAttribute('cx', signalPeak.x);
            insightNode.setAttribute('cy', signalPeak.y);
            insightNode.style.display = 'block';

            if (statusLed) {
                statusLed.className = 'chart-status-led success';
            }
            consoleOutput.innerHTML = '<span class="text-emerald">DECODED:</span> Signal isolated! Sales correlation verified. Prediction: +18% Q3.';
        } else {
            insightNode.style.display = 'none';
            if (statusLed) {
                statusLed.className = 'chart-status-led';
            }

            if (noise >= 20 && filter <= 80) {
                consoleOutput.textContent = 'Console: Cluttered dataset. Increase filter parameter to isolate.';
            } else if (noise >= 20 && filter > 80) {
                consoleOutput.textContent = 'Console: Over-filtering noise causes loss. Reduce raw noise first.';
            } else {
                consoleOutput.textContent = 'Console: Clean data base. Adjust filter parameters to lock-on.';
            }
        }
    }

    // Attach listeners to sliders
    if (noiseSlider && filterSlider) {
        noiseSlider.addEventListener('input', updateSandboxChart);
        filterSlider.addEventListener('input', updateSandboxChart);
        
        // Initialize graph render on load
        updateSandboxChart();
    }

    // --------------------------------------------------------------------------
    // Animated Stats Counters
    // --------------------------------------------------------------------------
    let statCountersAnimated = false;
    
    const animateStats = () => {
        if (statCountersAnimated) return;
        statCountersAnimated = true;

        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000; // Animation total time in ms
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;

            const incrementTimer = setInterval(() => {
                if (target <= 20) {
                    current += 1;
                } else {
                    current += Math.ceil(target / (duration / stepTime));
                }

                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(incrementTimer);
                } else {
                    counter.textContent = current;
                }
            }, stepTime);
        });
    };

    // --------------------------------------------------------------------------
    // Skill Bars Progress Animation
    // --------------------------------------------------------------------------
    let skillBarsAnimated = false;

    const animateSkillProgress = () => {
        if (skillBarsAnimated) return;
        skillBarsAnimated = true;

        const skillBars = document.querySelectorAll('.toolkit-bar-fill');
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    };

    // --------------------------------------------------------------------------
    // Intersection Observer for Section Transitions
    // --------------------------------------------------------------------------
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger section-specific visual animations
                if (entry.target.id === 'frameworks') {
                    animateStats();
                }
                if (entry.target.id === 'skills') {
                    animateSkillProgress();
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('fade-in');
        sectionObserver.observe(section);
    });

    // --------------------------------------------------------------------------
    // Lab Notebook Cards (Internal Tab Switcher)
    // --------------------------------------------------------------------------
    const nbTabButtons = document.querySelectorAll('.nb-tab-btn');

    nbTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.project-notebook');
            if (!card) return;

            const tabName = btn.getAttribute('data-nb-tab');

            // Toggle active state on buttons inside this specific card
            card.querySelectorAll('.nb-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle active state on content pane inside this specific card
            card.querySelectorAll('.nb-content').forEach(c => {
                c.classList.remove('active');
                if (c.getAttribute('data-content') === tabName) {
                    c.classList.add('active');
                }
            });
        });
    });

    // --------------------------------------------------------------------------
    // Projects Filter Menu Layout (All / Power BI / Python & SQL / Web Apps)
    // --------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.projects-tabs .tab-btn');
    const projectWrappers = document.querySelectorAll('#projects-grid .project-card-wrapper');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectWrappers.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // --------------------------------------------------------------------------
    // Scroll Back to Top Button
    // --------------------------------------------------------------------------
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Keyboard support: Escape closes mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    console.log('Cognitive Insights Laboratory Portfolio loaded successfully! 🧠🚀');
});
