// 1. Three.js Immersive Background (Luxury Particle Flow)
let mouseX = 0;
let mouseY = 0;

const initThree = () => {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle Setup
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.005,
        color: 0xA6BD8F, // Sage Green
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse Tracking
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        
        // Gentle auto-rotation
        particlesMesh.rotation.y += 0.001;
        
        // Mouse-based movement (Parallax)
        const targetRotationX = mouseY * 0.5;
        const targetRotationY = mouseX * 0.5;
        
        particlesMesh.rotation.x += 0.05 * (targetRotationX - particlesMesh.rotation.x);
        particlesMesh.rotation.y += 0.05 * (targetRotationY - particlesMesh.rotation.y);
        
        renderer.render(scene, camera);
    };

    // 2. Scroll Parallax for Particles
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            gsap.to(particlesMesh.position, {
                y: self.progress * 3,
                duration: 0.5,
                ease: "power1.out"
            });
        }
    });

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// 2. GSAP & Scroll Management
const initGSAP = () => {
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Scroll Transition
    const nav = document.querySelector('nav');
    ScrollTrigger.create({
        start: 'top -50',
        onUpdate: (self) => {
            if (self.direction === 1) nav.classList.add('scrolled');
            else if (window.scrollY < 50) nav.classList.remove('scrolled');
        }
    });

    // Universal Mouse Parallax Engine
    const parallaxElements = document.querySelectorAll('[data-mouse-parallax]');
    if (parallaxElements.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-mouse-parallax')) || 30;
                const x = (centerX - clientX) / speed;
                const y = (centerY - clientY) / speed;

                gsap.to(el, {
                    duration: 1.2,
                    x: x,
                    y: y,
                    ease: "power2.out"
                });
            });
        });
    }

    // Universal Scroll Parallax Engine
    gsap.utils.toArray('[data-scroll-parallax]').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-scroll-parallax')) || 100;
        gsap.to(el, {
            y: speed,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Parallax Effect for Images (Specific)
    gsap.utils.toArray('section img:not([data-scroll-parallax])').forEach(img => {
        gsap.to(img, {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Scroll Dot Animation
    gsap.to('#scroll-dot', {
        y: 56,
        repeat: -1,
        duration: 1.5,
        ease: "power2.inOut"
    });
};

// 3. UI Components & Carousels
const initUI = () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Hero Swiper
    new Swiper('.hero-slider', {
        loop: true,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: { delay: 6000, disableOnInteraction: false },
        speed: 2500
    });

    // Testimonial Swiper
    new Swiper('.testimonialSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: { el: '.swiper-pagination', clickable: true },
        autoplay: { delay: 5000 },
        breakpoints: {
            1024: { slidesPerView: 2 }
        }
    });

    // AOS
    AOS.init({
        duration: 1200,
        once: true,
        offset: 100
    });

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Functional Buttons (Click feedback)
    const btnLUX = document.querySelectorAll('.btn-lux');
    btnLUX.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.getAttribute('href') === '#contact') return;
            console.log('Premium interaction tracked: ' + btn.innerText);
        });
    });

    // Form Mockup
    const contactBtn = document.querySelector('.contact-form button');
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Your premium inquiry has been received. Our concierge will contact you shortly.');
        });
    }
};

// 4. High-Performance Mouse Glow (Spotlight)
const initMouseGlow = () => {
    const glow = document.querySelector('.mouse-glow');
    if (!glow) return;

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        
        // Use CSS variables for hardware-accelerated performance
        glow.style.setProperty('--mouse-x', `${clientX}px`);
        glow.style.setProperty('--mouse-y', `${clientY}px`);
    });

    // Fade in/out when entering/leaving window
    document.addEventListener('mouseenter', () => glow.style.opacity = '1');
    document.addEventListener('mouseleave', () => glow.style.opacity = '0');
};

// Initialize All
document.addEventListener('DOMContentLoaded', () => {
    initThree();
    initGSAP();
    initUI();
    initMouseGlow();
});
