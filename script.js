/**
 * Aromas del Alma - Scripts
 * Página de Aceites Esenciales
 * Los videos son solo de visualización para el público
 */

// ================================
// MENÚ MÓVIL
// ================================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');

    // Toggle menú móvil
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ================================
    // FUNCIONALIDAD DE VIDEOS
    // ================================
    initializeVideos();

    // ================================
    // SCROLL SUAVE
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================
    // ANIMACIONES EN SCROLL
    // ================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    document.querySelectorAll('.benefit-card, .feature, .video-card, .oil-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

/**
 * Inicializar funcionalidad de videos
 * Los videos están configurados para SOLO VISUALIZACIÓN
 */
function initializeVideos() {
    // Video principal destacado
    const featuredVideo = document.getElementById('featured-video');
    const featuredSource = document.getElementById('featured-source');
    const videoPlaceholder = document.getElementById('video-placeholder');

    // Si hay un video configurado, ocultamos el placeholder
    if (featuredSource && featuredSource.src && featuredSource.src !== window.location.href) {
        if (videoPlaceholder) {
            videoPlaceholder.style.display = 'none';
        }
        if (featuredVideo) {
            featuredVideo.style.display = 'block';
        }
    }

    // Videos en grid
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach((card, index) => {
        const videoSrc = card.getAttribute('data-video-src');
        const video = card.querySelector('video');
        const source = card.querySelector('source');
        const placeholder = card.querySelector('.video-placeholder-small');
        const preview = card.querySelector('.video-preview');

        // Si hay video configurado, mostrar controles de solo reproducción
        if (videoSrc && videoSrc.trim() !== '') {
            if (source) {
                source.src = videoSrc;
            }
            if (video) {
                video.load();
                
                // Solo permitir reproducción, sin controles de edición
                video.addEventListener('loadeddata', function() {
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                    video.style.display = 'block';
                });
            }
        }

        // Click en la tarjeta para reproducir/pausar el video
        if (video) {
            const thumbnail = card.querySelector('.video-thumbnail');
            
            thumbnail.addEventListener('click', function() {
                if (video.paused) {
                    // Pausar otros videos primero
                    pauseAllVideos();
                    video.play().catch(e => {
                        console.log('Reproducción automática bloqueada por el navegador');
                    });
                } else {
                    video.pause();
                }
            });
        }
    });
}

/**
 * Pausar todos los videos en la página
 */
function pauseAllVideos() {
    document.querySelectorAll('video').forEach(v => {
        v.pause();
    });
}

// ================================
// CONFIGURACIÓN DE VIDEOS (ADMIN)
// ================================
// Para agregar videos, usa la consola del navegador o modifica el HTML
// Formato: data-video-src="ruta/del/video.mp4"

/**
 * Ejemplo de cómo configurar videos programáticamente:
 * 
 * // Para el video principal:
 * document.getElementById('featured-source').src = 'videos/principal.mp4';
 * document.getElementById('featured-video').load();
 * document.getElementById('video-placeholder').style.display = 'none';
 * 
 * // Para videos del grid (por índice 0-5):
 * const videoCards = document.querySelectorAll('.video-card');
 * videoCards[0].setAttribute('data-video-src', 'videos/video1.mp4');
 * 
 */

/**
 * Para usuarios con permisos de administrador,
 * se puede acceder al panel de administración
 */
function openAdminPanel() {
    // Redirigir al panel de administración
    window.location.href = '#admin';
    // Aquí se integraría la autenticación de admin
}

// ================================
// UTILIDADES
// ================================

/**
 * Lazy loading para videos futuros
 */
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    if (video.dataset.src) {
                        video.src = video.dataset.src;
                        video.load();
                        videoObserver.unobserve(video);
                    }
                }
            });
        });

        document.querySelectorAll('video[data-src]').forEach(video => {
            videoObserver.observe(video);
        });
    }
}

// Inicializar lazy loading
setupLazyLoading();

// ================================
// ESTILOS DINÁMICOS PARA ANIMACIONES
// ================================
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
    }
`;
document.head.appendChild(style);

console.log('%c🌿 Aromas del Alma', 'font-size: 20px; color: #7c9a6e;');
console.log('%cPágina de Aceites Esenciales - Modo Solo Lectura', 'font-size: 12px; color: #666;');
console.log('%cPara agregar videos, edita el atributo data-video-src en cada .video-card o el src del video principal.', 'font-size: 11px; color: #888;');