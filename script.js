/* ============================================
   S.I.M. RUHAN — Portfolio JS
   GSAP Animations + Interactions
   ============================================ */

// ---- Register GSAP Plugins ----
gsap.registerPlugin(ScrollTrigger);

// ---- DOM References ----
const header       = document.getElementById('header');
const menuBtn      = document.getElementById('menu-icon');
const navbar       = document.getElementById('navbar');
const cursor       = document.getElementById('cursor');
const cursorFollow = document.getElementById('cursorFollower');
const sections     = document.querySelectorAll('section');
const navLinks     = document.querySelectorAll('.nav-link');

// ============================================
// CUSTOM CURSOR
// ============================================
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    }
});

(function followCursor() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    if (cursorFollow) {
        cursorFollow.style.left = followerX + 'px';
        cursorFollow.style.top  = followerY + 'px';
    }
    requestAnimationFrame(followCursor);
})();

document.querySelectorAll('a, button, .btn, .project-card, .service-card, .stat').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (!cursor || !cursorFollow) return;
        cursor.style.width  = '16px';
        cursor.style.height = '16px';
        cursorFollow.style.width  = '56px';
        cursorFollow.style.height = '56px';
        cursorFollow.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
        if (!cursor || !cursorFollow) return;
        cursor.style.width  = '10px';
        cursor.style.height = '10px';
        cursorFollow.style.width  = '36px';
        cursorFollow.style.height = '36px';
        cursorFollow.style.opacity = '0.5';
    });
});

// ============================================
// HEADER — scroll effect + active links
// ============================================
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);

    // Close menu on scroll
    menuBtn.classList.remove('open');
    navbar.classList.remove('active');

    // Active nav link
    const scrollY = window.scrollY;
    sections.forEach(sec => {
        const offset = sec.offsetTop - 200;
        const height = sec.offsetHeight;
        const id     = sec.getAttribute('id');
        if (scrollY >= offset && scrollY < offset + height) {
            navLinks.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${id}"]`);
            if (active) active.classList.add('active');
        }
    });
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    navbar.classList.toggle('active');
});

navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        navbar.classList.remove('active');
    });
});

// ============================================
// TYPED.JS
// ============================================
new Typed('.multiple-text', {
    strings: [
        'Frontend Developer',
        'Backend Developer',
        'MERN Stack Developer',
        'Web Designer',
    ],
    typeSpeed: 70,
    backSpeed: 50,
    backDelay: 1600,
    loop: true,
    cursorChar: '|',
});

// ============================================
// GSAP — Hero entrance animation
//
// KEY FIX: .home-img opacity is NEVER touched
// by GSAP. It is always 1 (set in CSS).
// We only animate its x position (slide in).
// This means the image is always visible —
// even before JS runs or if the image is cached.
// ============================================
function runHeroTimeline() {
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    heroTl
        // bg watermark
        .from('.home-bg-text', {
            opacity: 0, scale: 0.92,
            duration: 1.4, ease: 'power2.out'
        })
        // text content block — was hidden via CSS opacity:0
        .to('.home-content', {
            opacity: 1, duration: 0.01
        }, 0)
        .from('.home-tag',       { opacity: 0, y: 28, duration: 0.65 }, 0.1)
        .from('.home-greeting',  { opacity: 0, y: 28, duration: 0.6  }, 0.25)
        .from('.home-name',      { opacity: 0, y: 36, duration: 0.75 }, 0.35)
        .from('.home-role',      { opacity: 0, y: 24, duration: 0.6  }, 0.5)
        .from('.home-desc',      { opacity: 0, y: 20, duration: 0.55 }, 0.62)
        .from('.home-actions',   { opacity: 0, y: 18, duration: 0.5  }, 0.72)
        .from('.social-media a', {
            stagger: 0.07, duration: 0.45
        }, 0.8)
        // Image: slide in from right ONLY — opacity stays at 1
        .fromTo('.home-img',
            { x: 70 },
            { x: 0, duration: 1.0, ease: 'power4.out' },
        0.15)
        // Rings fade in after image is in place
        .from('.ring-1', { opacity: 0, scale: 0.7, duration: 0.7 }, 0.55)
        .from('.ring-2', { opacity: 0, scale: 0.7, duration: 0.7 }, 0.7)
        .from('.img-badge',        { opacity: 0, y: 18, duration: 0.5 }, 0.85)
        .from('.scroll-indicator', { opacity: 0, x: -18, duration: 0.5 }, 0.9);
}

// Run immediately — do NOT wait for image load event.
// The image is visible in CSS; the timeline only slides it in.
// If GSAP or fonts haven't loaded yet, DOMContentLoaded covers us.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runHeroTimeline);
} else {
    runHeroTimeline();
}

// ============================================
// GSAP — Scroll-triggered animations
// ============================================

// fade-up (section headers)
gsap.utils.toArray('[data-gsap="fade-up"]').forEach(el => {
    gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        }
    );
});

// fade from right (about-img, etc.)
gsap.utils.toArray('[data-gsap="fade-right"]').forEach(el => {
    gsap.fromTo(el,
        { opacity: 0, x: -60 },
        {
            opacity: 1, x: 0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%' }
        }
    );
});

// fade from left — only about & contact sections (NOT home-img)
gsap.utils.toArray('.about [data-gsap="fade-left"], .contact [data-gsap="fade-left"]').forEach(el => {
    gsap.fromTo(el,
        { opacity: 0, x: 60 },
        {
            opacity: 1, x: 0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%' }
        }
    );
});

// Stagger cards (services + projects)
gsap.utils.toArray('.services-grid, .projects-grid').forEach(grid => {
    const cards = grid.querySelectorAll('[data-gsap="stagger"]');
    gsap.fromTo(cards,
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: grid, start: 'top 80%' }
        }
    );
});

// ============================================
// COUNTER ANIMATION (About stats)
// ============================================
function animateCount(el, target) {
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const interval = setInterval(() => {
        count += step;
        if (count >= target) {
            count = target;
            clearInterval(interval);
        }
        el.textContent = count;
    }, 35);
}

const statsSection = document.querySelector('.about-stats');
let countersStarted = false;

if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
            countersStarted = true;
            document.querySelectorAll('.stat-num').forEach(el => {
                const target = parseInt(el.getAttribute('data-count'));
                animateCount(el, target);
            });
        }
    }, { threshold: 0.5 });
    observer.observe(statsSection);
}

// ============================================
// CONTACT FORM — button feedback
// ============================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function () {
        const btn = contactForm.querySelector('[type="submit"]');
        if (btn) {
            btn.innerHTML = '<span>Sending…</span> <i class="bx bx-loader-alt bx-spin"></i>';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';
        }
    });
}

// ============================================
// PARALLAX — home bg watermark text
// ============================================
const bgText = document.querySelector('.home-bg-text');
if (bgText) {
    window.addEventListener('scroll', () => {
        bgText.style.transform =
            `translate(-50%, calc(-50% + ${window.scrollY * 0.15}px))`;
    }, { passive: true });
}

// ============================================
// 3D TILT — service cards
// ============================================
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform =
            `translateY(-10px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});