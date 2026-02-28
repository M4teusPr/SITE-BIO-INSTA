/* ========================================
   🎨 RETROWAVE PORTFOLIO - JAVASCRIPT PURO
   Funcionalidades: Menu Mobile, Carrosséis, Animações
======================================== */

// ========================================
// 1️⃣ MENU HAMBURGUER MOBILE
// ========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========================================
// 2️⃣ NAVBAR SCROLL EFFECT
// ========================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = '0 5px 30px rgba(236, 72, 153, 0.3)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// 3️⃣ SISTEMA DE CARROSSEL (3 CARROSSÉIS)
// ========================================

class Carousel {
    constructor(name) {
        this.name = name;
        this.track = document.querySelector(`[data-track=\"${name}\"]`);
        this.items = this.track.querySelectorAll('.carousel-item');
        this.prevBtn = document.querySelector(`[data-carousel=\"${name}\"].carousel-btn-prev`);
        this.nextBtn = document.querySelector(`[data-carousel=\"${name}\"].carousel-btn-next`);
        this.indicators = document.querySelector(`[data-indicators=\"${name}\"]`);
        this.indicatorDots = this.indicators.querySelectorAll('.indicator');
        
        this.currentIndex = 0;
        this.itemsCount = this.items.length;
        this.autoPlayInterval = null;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Indicadores clicáveis
        this.indicatorDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-play
        this.startAutoPlay();
        
        // Pausar auto-play no hover
        this.track.parentElement.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.track.parentElement.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Touch events para mobile
        this.initTouchEvents();
    }
    
    goToSlide(index) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;
        
        // Calcular transform
        const itemWidth = this.items[0].offsetWidth;
        const gap = 32; // 2rem gap
        const offset = -(itemWidth + gap) * this.currentIndex;
        
        this.track.style.transform = `translateX(${offset}px)`;
        
        // Atualizar indicadores
        this.updateIndicators();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    next() {
        let nextIndex = this.currentIndex + 1;
        
        // Loop infinito
        if (nextIndex >= this.itemsCount) {
            nextIndex = 0;
        }
        
        this.goToSlide(nextIndex);
    }
    
    prev() {
        let prevIndex = this.currentIndex - 1;
        
        // Loop infinito
        if (prevIndex < 0) {
            prevIndex = this.itemsCount - 1;
        }
        
        this.goToSlide(prevIndex);
    }
    
    updateIndicators() {
        this.indicatorDots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 4000); // 4 segundos
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
    
    // Touch events para swipe em mobile
    initTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.track.parentElement.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.track.parentElement.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50; // Mínimo de pixels para considerar swipe
        
        if (startX - endX > threshold) {
            // Swipe left
            this.next();
        } else if (endX - startX > threshold) {
            // Swipe right
            this.prev();
        }
    }
}

// Inicializar os 3 carrosséis
const carouselSocial = new Carousel('social');
const carouselThumb = new Carousel('thumb');
const carouselArtes = new Carousel('artes');

// ========================================
// 4️⃣ ANIMAÇÕES AO SCROLL (Intersection Observer)
// ========================================
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elementos para animar
const animatedElements = document.querySelectorAll('.project-card, .carousel-section, .about-content');

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// ========================================
// 5️⃣ SMOOTH SCROLL (fallback para navegadores antigos)
// ========================================
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 6️⃣ RESIZE HANDLER (Ajustar carrosséis)
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reposicionar carrosséis ao redimensionar
        carouselSocial.goToSlide(carouselSocial.currentIndex);
        carouselThumb.goToSlide(carouselThumb.currentIndex);
        carouselArtes.goToSlide(carouselArtes.currentIndex);
    }, 250);
});

// ========================================
// 7️⃣ LOADING COMPLETO
// ========================================
window.addEventListener('load', () => {
    console.log('🎨 Retrowave Portfolio carregado com sucesso!');
    
    // Adicionar classe para animações iniciais
    document.body.classList.add('loaded');
});

// ========================================
// 8️⃣ EASTER EGG - Konami Code (Opcional)
// ========================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateRetrowaveMode();
        konamiCode = [];
    }
});

function activateRetrowaveMode() {
    // Intensificar efeitos neon
    document.body.style.filter = 'saturate(1.5) brightness(1.1)';
    console.log('🌟 MODO RETROWAVE ATIVADO!');
    
    setTimeout(() => {
        document.body.style.filter = '';
    }, 5000);
}

// 
// ========================================
// 🎯 FIM DO SCRIPT
// ========================================
console.log('%c🎨 RETROWAVE PORTFOLIO', 'font-size: 20px; color: #ec4899; font-weight: bold;');
console.log('%c✨ Desenvolvido com HTML5, CSS3 e JavaScript Puro', 'color: #a855f7;');