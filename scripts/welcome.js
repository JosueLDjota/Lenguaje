// ==============================================
// PANTALLA DE BIENVENIDA PROFESIONAL - RESTAURANTE
// Versión corregida y optimizada
// ==============================================

// 🔥 NUEVA FUNCIÓN DE LIMPIEZA (AGREGAR AL PRINCIPIO)
function cleanupWelcomeScreen() {
    console.log('🧹 Limpiando pantalla welcome...');
    
    // Remover estilos dinámicos si existen
    const oldStyle = document.querySelector('style[data-welcome-styles]');
    if (oldStyle) {
        oldStyle.remove();
    }
    
    // Limpiar intervalos si existen
    if (window.welcomeInterval) {
        clearInterval(window.welcomeInterval);
        delete window.welcomeInterval;
    }
    
    // Limpiar event listeners del header
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn && loginBtn._clickHandler) {
        loginBtn.removeEventListener('click', loginBtn._clickHandler);
    }
}

// Pantalla de Bienvenida Mejorada
function renderWelcomeScreen() {
    console.log('🎬 Renderizando welcome screen...');
    
    // Primero limpiar lo anterior
    cleanupWelcomeScreen();
    
    const welcomeScreen = document.getElementById('welcome');
    if (!welcomeScreen) {
        console.error('❌ Elemento #welcome no encontrado');
        return;
    }
    
    // LIMPIAR la pantalla antes de agregar contenido
    welcomeScreen.innerHTML = '';
    
    // Contador de visitas real usando localStorage - CORREGIDO
    const storedCount = localStorage.getItem('visitCount');
    const visitCount = storedCount ? parseInt(storedCount) : 0;
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');
    
    let newCount = visitCount;
    if (lastVisit !== today) {
        newCount++;
        localStorage.setItem('visitCount', newCount);
        localStorage.setItem('lastVisit', today);
    }
    
    welcomeScreen.innerHTML = `
        <div class="welcome-container">
            <!-- Banner de información del desarrollador -->
            <div class="dev-banner">
                <div class="dev-banner-content">
                    <span class="dev-badge">💻 Proyecto Developer</span>
                    <p>Este proyecto fue realizado por Josue Daniel Hernandez. Código original en React, migrado a JavaScript.</p>
                    <button class="dev-banner-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div class="welcome-bg">
                <img src="https://images.unsplash.com/photo-1667388968964-4aa652df0a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRpbmluZ3xlbnwxfHx8fDE3NjQwMjE0MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Restaurant ambiance">
                <div class="welcome-overlay"></div>
                
                <!-- Elementos decorativos animados -->
                <div class="floating-elements">
                    <div class="floating-element element-1">🍝</div>
                    <div class="floating-element element-2">🍷</div>
                    <div class="floating-element element-3">🍰</div>
                    <div class="floating-element element-4">☕</div>
                </div>
            </div>

            <div class="welcome-content">
                <header class="welcome-header">
                    <div class="welcome-logo">
                        <div class="welcome-logo-icon">
                            <i class="fas fa-utensils"></i>
                        </div>
                        <div class="welcome-logo-text">
                            <h2>Sabor & Arte</h2>
                            <p>Restaurante Gourmet</p>
                        </div>
                    </div>
                    
                    <!-- Solo el botón de login en el header -->
                    <div class="login-btn-wrapper">
                        <button class="login-btn" data-screen="login">
                            <i class="fas fa-user-circle"></i>
                            <span>Iniciar Sesión</span>
                            <div class="login-btn-hover">
                            </div>
                        </button>
                    </div>
                </header>
                
                <main class="welcome-main">
                    <div class="welcome-hero">
                        <!-- Contador de visitantes mejorado -->
                        <div class="visitor-counter">
                            <div class="counter-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="counter-content">
                                <span class="counter-number">${newCount.toLocaleString()}</span>
                                <span class="counter-label">Visitas Totales</span>
                            </div>
                            <div class="counter-stats">
                                <span class="stat-today">
                                    <i class="fas fa-eye"></i>
                                    <span id="today-visits">${Math.floor(Math.random() * 50) + 100}</span> hoy
                                </span>
                            </div>
                        </div>

                        <div class="welcome-title">
                            <h1>
                                Bienvenido a una
                                <br>
                                <span class="gradient-text">experiencia culinaria única</span>
                            </h1>
                            <p class="welcome-subtitle">
                                Donde cada plato es una obra de arte y cada momento, un recuerdo inolvidable
                            </p>
                            
                            <!-- Ratings y premios -->
                            <div class="welcome-ratings">
                                <div class="rating-item">
                                    <div class="stars">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star-half-alt"></i>
                                    </div>
                                    <span>4.9/5 Google Reviews</span>
                                </div>
                                <div class="rating-item">
                                    <i class="fas fa-award"></i>
                                    <span>Premio Excelencia 2024</span>
                                </div>
                                <div class="rating-item">
                                    <i class="fas fa-users"></i>
                                    <span>+5,000 Clientes Satisfechos</span>
                                </div>
                            </div>
                        </div>

                        <!-- Sección de acceso principal -->
                        <div class="access-section">
                            <div class="access-card">
                                <div class="access-card-icon">
                                    <i class="fas fa-lock"></i>
                                </div>
                                <div class="access-card-content">
                                    <h3>Acceso Exclusivo</h3>
                                    <p>Para clientes registrados: reservas prioritarias, ofertas especiales y seguimiento de pedidos</p>
                                </div>
                                <button class="access-btn" data-screen="login">
                                    Acceder Ahora
                                    <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Carousel de especialidades -->
                        <div class="specialties-section">
                            <h3>Nuestras Especialidades</h3>
                            <div class="specialties-grid">
                                <div class="specialty-card">
                                    <div class="specialty-img">
                                        <img src="https://images.unsplash.com/photo-1676300185292-e23bb3db50fa?ixlib=rb-4.0.0&auto=format&fit=crop&w=200&q=80" alt="Filete Premium">
                                    </div>
                                    <div class="specialty-content">
                                        <h4>Filete Premium</h4>
                                        <p>Corte Angus 200g con salsa especial</p>
                                        <span class="specialty-price">$28.99</span>
                                    </div>
                                </div>
                                <div class="specialty-card">
                                    <div class="specialty-img">
                                        <img src="https://images.unsplash.com/photo-1707322540604-f69bd7b2cb4c?ixlib=rb-4.0.0&auto=format&fit=crop&w=200&q=80" alt="Pasta Carbonara">
                                    </div>
                                    <div class="specialty-content">
                                        <h4>Pasta Carbonara</h4>
                                        <p>Con tocino italiano y queso pecorino</p>
                                        <span class="specialty-price">$18.50</span>
                                    </div>
                                </div>
                                <div class="specialty-card">
                                    <div class="specialty-img">
                                        <img src="https://images.unsplash.com/photo-1736840334919-aac2d5af73e4?ixlib=rb-4.0.0&auto=format&fit=crop&w=200&q=80" alt="Lava Cake">
                                    </div>
                                    <div class="specialty-content">
                                        <h4>Lava Cake</h4>
                                        <p>Postre de chocolate con centro fundido</p>
                                        <span class="specialty-price">$12.99</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Información del restaurante -->
                        <div class="restaurant-info">
                            <div class="info-card">
                                <div class="info-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="info-content">
                                    <h4>Horario</h4>
                                    <p>Lun - Vie: 12:00 - 23:00</p>
                                    <p>Sáb - Dom: 11:00 - 00:00</p>
                                </div>
                            </div>
                            <div class="info-card">
                                <div class="info-icon">
                                    <i class="fas fa-map-marker-alt"></i>
                                </div>
                                <div class="info-content">
                                    <h4>Ubicación</h4>
                                    <p>Av. Gourmet 123</p>
                                    <p>Centro de la Ciudad</p>
                                </div>
                            </div>
                            <div class="info-card">
                                <div class="info-icon">
                                    <i class="fas fa-phone"></i>
                                </div>
                                <div class="info-content">
                                    <h4>Reservaciones</h4>
                                    <p>+1 (555) 123-4567</p>
                                    <p>info@saboryarte.com</p>
                                </div>
                            </div>
                        </div>

                        <!-- Testimonios -->
                        <div class="testimonials-section">
                            <h3>Lo que dicen nuestros clientes</h3>
                            <div class="testimonials-slider">
                                <div class="testimonial-card">
                                    <div class="testimonial-header">
                                        <div class="client-avatar">
                                            <i class="fas fa-user"></i>
                                        </div>
                                        <div class="client-info">
                                            <h4>María González</h4>
                                            <div class="client-rating">
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <p class="testimonial-text">"La mejor experiencia gastronómica de mi vida. Cada plato es una delicia y el servicio es excepcional."</p>
                                </div>
                                <div class="testimonial-card">
                                    <div class="testimonial-header">
                                        <div class="client-avatar">
                                            <i class="fas fa-user"></i>
                                        </div>
                                        <div class="client-info">
                                            <h4>Carlos Rodríguez</h4>
                                            <div class="client-rating">
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star-half-alt"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <p class="testimonial-text">"Ambiente perfecto para ocasiones especiales. La atención al detalle es increíble."</p>
                                </div>
                            </div>
                        </div>

                        <!-- CTA Final con login -->
                        <div class="final-cta">
                            <div class="cta-content">
                                <h3>¿Listo para vivir la experiencia?</h3>
                                <p>Accede a tu cuenta para reservar, ver tu historial y recibir ofertas exclusivas</p>

                                <button class="cta-login-btn" data-screen="login">
                                    <i class="fas fa-user-circle"></i>
                                    <span>Ingresar</span>
                                    <div class="cta-btn-effect"></div>
                                </button>

                            </div> <!-- CIERRE REAL del cta-content -->
                        </div>
                    </div>
                </main>

                <footer class="welcome-footer">
                    <div class="footer-content">
                        <div class="footer-logo">
                            <i class="fas fa-utensils"></i>
                            <span>Sabor & Arte</span>
                        </div>
                        <p class="footer-text">© 2024 Sabor & Arte Restaurante. Todos los derechos reservados.</p>
                        <div class="footer-credits">
                            <p>Desarrollado por <strong>Josue Daniel Hernandez</strong></p>
                            <p>Proyecto educativo - Versión JavaScript Vanilla</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    `;
    
    // Configurar event listeners
    setupWelcomeEventListeners();
    
    // Iniciar animaciones básicas
    startWelcomeAnimations();
    
    // 🔥 AGREGAR ESTILOS DINÁMICOS INMEDIATAMENTE
    addDynamicStyles();
    
    // Marcar como cargado
    const container = document.querySelector('.welcome-container');
    if (container) {
        container.classList.add('loaded');
    }
}

function setupWelcomeEventListeners() {
    // Cerrar banner de desarrollador
    const closeBanner = document.querySelector('.dev-banner-close');
    if (closeBanner) {
        closeBanner.addEventListener('click', function() {
            const banner = document.querySelector('.dev-banner');
            if (banner) {
                banner.style.transform = 'translateY(-100%)';
                banner.style.opacity = '0';
                setTimeout(() => {
                    if (banner.parentNode) {
                        banner.parentNode.removeChild(banner);
                    }
                }, 500);
            }
        });
    }
    
    // 🔥 ACTUALIZAR: Usar la navegación de main.js para los botones
    document.querySelectorAll('[data-screen="login"]').forEach(button => {
        button.addEventListener('click', function() {
            if (typeof showScreen === 'function') {
                showScreen('login');
            } else {
                console.log('Redirigiendo a login...');
            }
        });
    });
    
    // Actualizar contador de visitas del día
    updateTodayVisits();
    
    // Efectos hover en tarjetas
    document.querySelectorAll('.specialty-card, .info-card, .testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
    });
}

function startWelcomeAnimations() {
    // Animación de elementos flotantes
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 1.5}s`;
        element.classList.add('animate');
    });
    
    // Animación entrada de elementos con Intersection Observer
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.specialty-card, .info-card, .testimonial-card, .rating-item, .access-card').forEach(el => {
            observer.observe(el);
        });
    }
}

function updateTodayVisits() {
    // Simular visitas en tiempo real
    const todayVisits = document.getElementById('today-visits');
    if (!todayVisits) return;
    
    let count = parseInt(todayVisits.textContent) || 100;
    
    // Usar window.welcomeInterval para poder limpiarlo después
    window.welcomeInterval = setInterval(() => {
        if (count < 150) {
            count += Math.floor(Math.random() * 3);
            todayVisits.textContent = count;
            
            // Actualizar contador principal
            const mainCounter = document.querySelector('.counter-number');
            if (mainCounter) {
                const currentText = mainCounter.textContent.replace(/,/g, '');
                const current = parseInt(currentText) || 0;
                if (!isNaN(current)) {
                    mainCounter.textContent = (current + 1).toLocaleString();
                    localStorage.setItem('visitCount', current + 1);
                }
            }
        } else {
            if (window.welcomeInterval) clearInterval(window.welcomeInterval);
        }
    }, 10000);
}

// 🔥 FUNCIÓN MODIFICADA: Ahora usa showScreen en lugar de loadLoginScreen
function loadLoginScreen() {
    if (typeof showScreen === 'function') {
        showScreen('login');
    } else {
        console.error('showScreen no está definida');
    }
}

// Función para inicializar la pantalla
function initWelcomeScreen() {
    renderWelcomeScreen();
}

function addDynamicStyles() {
    // Verificar si los estilos ya fueron agregados
    const existingStyle = document.querySelector('style[data-welcome-styles]');
    if (existingStyle) {
        return; // Ya existen los estilos
    }
    
    const style = document.createElement('style');
    style.setAttribute('data-welcome-styles', 'true');
    style.textContent = `
        /* ===== ESTILOS DINÁMICOS MEJORADOS ===== */
        .welcome-container {
            position: relative;
            min-height: 100vh;
            background: linear-gradient(135deg, #0a0a0f 0%, #141824 30%, #1e293b 100%);
            overflow: hidden;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .welcome-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        
        .welcome-bg img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(0.35) saturate(1.3) contrast(1.1);
            animation: cinematicFloat 40s infinite alternate ease-in-out;
            will-change: transform;
        }
        
        .welcome-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                linear-gradient(135deg, 
                    rgba(10, 10, 15, 0.98) 0%, 
                    rgba(20, 24, 36, 0.92) 30%, 
                    rgba(30, 41, 59, 0.88) 70%,
                    rgba(102, 126, 234, 0.12) 100%);
            z-index: 2;
        }
        
        .welcome-content {
            position: relative;
            z-index: 3;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            animation: contentFadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Animaciones flotantes mejoradas */
        .floating-elements {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 3;
            overflow: hidden;
        }
        
        .floating-element {
            position: absolute;
            font-size: 2.8rem;
            opacity: 0;
            filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4));
            animation: sophisticatedFloat 12s infinite ease-in-out;
            text-shadow: 
                0 0 20px currentColor,
                0 0 40px rgba(255, 255, 255, 0.2);
        }
        
        .floating-element.animate {
            opacity: 0.85;
        }
        
        .element-1 { 
            top: 15%; 
            left: 8%; 
            animation-delay: 0s; 
            color: #ff6b6b;
            animation-duration: 15s;
        }
        .element-2 { 
            top: 25%; 
            right: 12%; 
            animation-delay: 1.5s; 
            color: #4ecdc4;
            animation-duration: 18s;
        }
        .element-3 { 
            bottom: 35%; 
            left: 12%; 
            animation-delay: 3s; 
            color: #ffe66d;
            animation-duration: 16s;
        }
        .element-4 { 
            bottom: 20%; 
            right: 8%; 
            animation-delay: 4.5s; 
            color: #95e1d3;
            animation-duration: 14s;
        }
        
        /* Partículas flotantes adicionales */
        .floating-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 2;
        }
        
        /* Header mejorado */
        .welcome-header {
            padding: 1.8rem 3rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(10, 10, 15, 0.7);
            backdrop-filter: blur(25px) saturate(180%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            position: sticky;
            top: 0;
            z-index: 100;
            animation: slideDownHeader 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 
                0 4px 30px rgba(0, 0, 0, 0.1),
                0 1px 0 rgba(255, 255, 255, 0.03);
        }
        
        .welcome-logo {
            display: flex;
            align-items: center;
            gap: 1.2rem;
            transition: transform 0.3s ease;
        }
        
        .welcome-logo:hover {
            transform: translateY(-2px);
        }
        
        .welcome-logo-icon {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            width: 56px;
            height: 56px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: white;
            animation: logoPulse 4s infinite cubic-bezier(0.4, 0, 0.6, 1);
            box-shadow: 
                0 10px 30px rgba(102, 126, 234, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
        }
        
        .welcome-logo-icon::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                45deg,
                transparent,
                rgba(255, 255, 255, 0.1),
                transparent
            );
            transform: rotate(45deg);
            animation: shineEffect 3s infinite;
        }
        
        .welcome-logo-text h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2.2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .welcome-logo-text p {
            color: #94a3b8;
            font-size: 0.95rem;
            margin: 0.3rem 0 0 0;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        
        /* Botón de Login premium */
        .login-btn-wrapper {
            position: relative;
        }
        
        .login-btn {
            background: linear-gradient(135deg, 
                rgba(59, 130, 246, 0.95) 0%, 
                rgba(29, 78, 216, 0.9) 100%);
            color: white;
            border: none;
            padding: 1rem 2.2rem;
            border-radius: 16px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 
                0 12px 32px rgba(59, 130, 246, 0.35),
                0 4px 12px rgba(59, 130, 246, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            letter-spacing: 0.3px;
            text-transform: uppercase;
            font-size: 0.95rem;
            white-space: nowrap;
            min-width: max-content;
        }
        
        .login-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            transition: left 0.7s;
        }
        
        .login-btn:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 
                0 20px 45px rgba(59, 130, 246, 0.5),
                0 8px 20px rgba(59, 130, 246, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.25);
            background: linear-gradient(135deg, 
                rgba(59, 130, 246, 1) 0%, 
                rgba(29, 78, 216, 0.95) 100%);
        }
        
        .login-btn:hover::before {
            left: 100%;
        }
        
        .login-btn:active {
            transform: translateY(-1px) scale(0.98);
            transition: all 0.1s ease;
        }
        
        .login-btn i {
            font-size: 1.3rem;
            transition: transform 0.3s ease;
        }
        
        .login-btn:hover i {
            transform: rotate(15deg) scale(1.1);
        }
        
        .login-btn-hover {
            position: absolute;
            right: 1.8rem;
            opacity: 0;
            transform: translateX(-15px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
        }
        
        .login-btn:hover .login-btn-hover {
            opacity: 1;
            transform: translateX(0) rotate(-10deg);
        }
        
        /* Contador de visitas mejorado */
        .visitor-counter {
            position: absolute;
            top: 1.8rem;
            right: 3rem;
            background: rgba(255, 255, 255, 0.07);
            backdrop-filter: blur(25px) saturate(180%);
            padding: 1rem 1.5rem;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 1.2rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: counterSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
            box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
            z-index: 10;
            transition: all 0.3s ease;
        }
        
        .visitor-counter:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
            box-shadow: 
                0 12px 40px rgba(0, 0, 0, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        
        .counter-icon {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.3rem;
            box-shadow: 
                0 6px 20px rgba(16, 185, 129, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .counter-content {
            display: flex;
            flex-direction: column;
        }
        
        .counter-number {
            font-size: 1.8rem;
            font-weight: 800;
            background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            font-feature-settings: "tnum";
            letter-spacing: -0.5px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .counter-label {
            font-size: 0.8rem;
            color: #94a3b8;
            margin-top: 0.3rem;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        
        .counter-stats {
            margin-left: 1.2rem;
            padding-left: 1.2rem;
            border-left: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .stat-today {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            font-size: 0.9rem;
            color: #cbd5e1;
            font-weight: 500;
        }
        
        .stat-today i {
            color: #f59e0b;
        }
        
        /* Contenido principal mejorado */
        .welcome-main {
            flex: 1;
            padding: 4rem 3rem;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
            animation: mainContentFadeIn 1s ease-out 0.2s both;
        }
        
        .welcome-title {
            text-align: center;
            margin-bottom: 5rem;
            position: relative;
            padding-bottom: 3rem;
        }
        
        .welcome-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 2px;
            opacity: 0.7;
        }
        
        .welcome-title h1 {
            font-family: 'Playfair Display', serif;
            font-size: 4.5rem;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 1.8rem;
            background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 30%, #94a3b8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -1px;
            text-shadow: 
                0 4px 8px rgba(0, 0, 0, 0.2),
                0 2px 4px rgba(0, 0, 0, 0.1);
            animation: titleFadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
        }
        
        .gradient-text {
            background: linear-gradient(135deg, 
                #f59e0b 0%, 
                #d97706 25%, 
                #b45309 50%, 
                #92400e 75%, 
                #78350f 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 200% 200%;
            animation: gradientShift 4s ease-in-out infinite;
            position: relative;
            display: inline-block;
        }
        
        .gradient-text::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #f59e0b, #b45309);
            border-radius: 2px;
            opacity: 0.6;
            animation: underlinePulse 2s ease-in-out infinite;
        }
        
        .welcome-subtitle {
            font-size: 1.4rem;
            color: #cbd5e1;
            max-width: 700px;
            margin: 0 auto 2.5rem;
            line-height: 1.7;
            font-weight: 300;
            letter-spacing: 0.3px;
            animation: subtitleFadeIn 1s ease-out 0.6s both;
        }
        
        .welcome-ratings {
            display: flex;
            gap: 2.5rem;
            justify-content: center;
            flex-wrap: wrap;
            animation: ratingsFadeIn 1s ease-out 0.8s both;
        }
        
        .rating-item {
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem 1.8rem;
            border-radius: 14px;
            display: flex;
            align-items: center;
            gap: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .rating-item:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .stars {
            color: #fbbf24;
            font-size: 1.1rem;
            letter-spacing: 2px;
        }
        
        .rating-item span {
            color: #e2e8f0;
            font-size: 1rem;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        
        .rating-item i.fa-award {
            color: #fbbf24;
            font-size: 1.2rem;
        }
        
        /* Sección de acceso mejorada */
        .access-section {
            margin: 5rem 0;
            animation: sectionFadeIn 1s ease-out 1s both;
        }
        
        .access-card {
            background: linear-gradient(135deg, 
                rgba(59, 130, 246, 0.15) 0%, 
                rgba(29, 78, 216, 0.1) 100%);
            border: 1px solid rgba(59, 130, 246, 0.25);
            border-radius: 24px;
            padding: 2.5rem 3rem;
            display: flex;
            align-items: center;
            gap: 2.5rem;
            max-width: 900px;
            margin: 0 auto;
            backdrop-filter: blur(20px) saturate(180%);
            position: relative;
            overflow: hidden;
            box-shadow: 
                0 20px 60px rgba(59, 130, 246, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .access-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(
                circle at center,
                rgba(59, 130, 246, 0.1) 0%,
                transparent 70%
            );
            animation: cardGlow 8s linear infinite;
        }
        
        .access-card-icon {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            width: 70px;
            height: 70px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: white;
            box-shadow: 
                0 10px 30px rgba(59, 130, 246, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            position: relative;
            z-index: 2;
            flex-shrink: 0;
        }
        
        .access-card-content {
            flex: 1;
            position: relative;
            z-index: 2;
        }
        
        .access-card-content h3 {
            font-size: 1.8rem;
            margin-bottom: 0.8rem;
            color: white;
            font-weight: 700;
            letter-spacing: -0.3px;
        }
        
        .access-card-content p {
            color: #cbd5e1;
            margin: 0;
            line-height: 1.6;
            font-size: 1.1rem;
        }
        
        .access-btn {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            border: none;
            padding: 1.2rem 2.5rem;
            border-radius: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 
                0 10px 30px rgba(59, 130, 246, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            z-index: 2;
            font-size: 1.1rem;
            letter-spacing: 0.5px;
        }
        
        .access-btn:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 
                0 15px 40px rgba(59, 130, 246, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }
        
        .access-btn:active {
            transform: translateY(-1px) scale(0.98);
        }
        
        /* Especialidades mejoradas */
        .specialties-section {
            margin: 5rem 0;
            animation: sectionFadeIn 1s ease-out 1.2s both;
        }
        
        .specialties-section h3 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: white;
            font-weight: 800;
            letter-spacing: -0.5px;
            position: relative;
            display: inline-block;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .specialties-section h3::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #8b5cf6, #7c3aed);
            border-radius: 2px;
            opacity: 0.7;
        }
        
        .specialties-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2.5rem;
        }
        
        .specialty-card {
            background: rgba(255, 255, 255, 0.04);
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            position: relative;
        }
        
        .specialty-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            background: linear-gradient(
                to bottom,
                transparent,
                rgba(255, 255, 255, 0.02)
            );
            z-index: 1;
        }
        
        .specialty-card:hover {
            transform: translateY(-10px) scale(1.02);
            background: rgba(255, 255, 255, 0.07);
            box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.3),
                0 10px 20px rgba(0, 0, 0, 0.2);
            border-color: rgba(255, 255, 255, 0.15);
        }
        
        .specialty-img {
            position: relative;
            overflow: hidden;
            height: 220px;
        }
        
        .specialty-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .specialty-card:hover .specialty-img img {
            transform: scale(1.1) rotate(2deg);
        }
        
        .specialty-img::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60%;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
        }
        
        .specialty-content {
            padding: 2rem;
            position: relative;
            z-index: 2;
        }
        
        .specialty-content h4 {
            font-size: 1.4rem;
            margin-bottom: 0.8rem;
            color: white;
            font-weight: 700;
        }
        
        .specialty-content p {
            color: #94a3b8;
            font-size: 1rem;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        
        .specialty-price {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 20px;
            font-weight: 700;
            font-size: 1.1rem;
            display: inline-block;
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
        }
        
        /* Información mejorada */
        .restaurant-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin: 5rem 0;
            animation: sectionFadeIn 1s ease-out 1.4s both;
        }
        
        .info-card {
            background: rgba(255, 255, 255, 0.04);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
        }
        
        .info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #8b5cf6, #7c3aed);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.4s ease;
        }
        
        .info-card:hover {
            transform: translateY(-8px);
            background: rgba(255, 255, 255, 0.07);
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.25),
                0 8px 16px rgba(0, 0, 0, 0.15);
        }
        
        .info-card:hover::before {
            transform: scaleX(1);
        }
        
        .info-icon {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            width: 60px;
            height: 60px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
            margin-bottom: 1.5rem;
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
        }
        
        .info-content h4 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: white;
            font-weight: 700;
        }
        
        .info-content p {
            color: #94a3b8;
            font-size: 1rem;
            margin: 0.5rem 0;
            line-height: 1.5;
        }
        
        /* Testimonios mejorados */
        .testimonials-section {
            margin: 5rem 0;
            animation: sectionFadeIn 1s ease-out 1.6s both;
        }
        
        .testimonials-section h3 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: white;
            font-weight: 800;
            letter-spacing: -0.5px;
            position: relative;
            display: inline-block;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .testimonials-section h3::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #f59e0b, #d97706);
            border-radius: 2px;
            opacity: 0.7;
        }
        
        .testimonials-slider {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2.5rem;
            max-width: 900px;
            margin: 0 auto;
        }
        
        .testimonial-card {
            background: rgba(255, 255, 255, 0.04);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
        }
        
        .testimonial-card:hover {
            transform: translateY(-8px);
            background: rgba(255, 255, 255, 0.07);
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.25),
                0 8px 16px rgba(0, 0, 0, 0.15);
        }
        
        .testimonial-card::before {
            content: '"';
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 8rem;
            color: rgba(255, 255, 255, 0.03);
            font-family: 'Playfair Display', serif;
            line-height: 1;
            z-index: 1;
        }
        
        .testimonial-header {
            display: flex;
            align-items: center;
            gap: 1.2rem;
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 2;
        }
        
        .client-avatar {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
            flex-shrink: 0;
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
        }
        
        .client-info h4 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            color: white;
            font-weight: 700;
        }
        
        .client-rating {
            color: #fbbf24;
            font-size: 1.1rem;
            letter-spacing: 2px;
        }
        
        .testimonial-text {
            color: #cbd5e1;
            font-style: italic;
            line-height: 1.7;
            font-size: 1.1rem;
            position: relative;
            z-index: 2;
        }
        
        .testimonial-text::before {
            content: "\\201C";
            font-size: 3rem;
            color: rgba(255, 255, 255, 0.1);
            position: absolute;
            top: -15px;
            left: -10px;
            font-family: 'Playfair Display', serif;
        }
        
        /* CTA Final mejorado */
        .final-cta {
            margin: 6rem 0;
            animation: sectionFadeIn 1s ease-out 1.8s both;
            text-align: center;
        }
        
        .cta-content {
            background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.15) 0%, 
                rgba(124, 58, 237, 0.1) 100%);
            border: 1px solid rgba(139, 92, 246, 0.25);
            border-radius: 30px;
            padding: 4rem;
            max-width: 800px;
            margin: 0 auto;
            backdrop-filter: blur(25px) saturate(180%);
            position: relative;
            overflow: hidden;
            box-shadow: 
                0 30px 80px rgba(139, 92, 246, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .cta-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%);
            animation: ctaGlow 10s ease-in-out infinite alternate;
        }
        
        .cta-content h3 {
            font-size: 2.8rem;
            margin-bottom: 1.5rem;
            color: white;
            font-weight: 800;
            letter-spacing: -0.5px;
            position: relative;
            z-index: 2;
        }
        
        .cta-content p {
            color: #cbd5e1;
            margin-bottom: 3rem;
            font-size: 1.3rem;
            line-height: 1.7;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            z-index: 2;
        }
        
        .cta-login-btn {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
        border: none;
        padding: 1.5rem 3.5rem;
        border-radius: 20px;
        font-size: 1.3rem;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 1.2rem;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        box-shadow: 
            0 20px 50px rgba(139, 92, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        z-index: 2;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        font-size: 1.1rem;

        /* 🟣 LAS DOS LÍNEAS QUE TE SALVAN LA VIDA */
        white-space: nowrap;
        min-width: max-content;
    }

        
        .cta-login-btn:hover {
            transform: translateY(-6px) scale(1.05);
            box-shadow: 
                0 30px 70px rgba(139, 92, 246, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }
        
        .cta-login-btn:active {
            transform: translateY(-2px) scale(0.98);
        }
        
        .cta-btn-effect {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
            );
            transition: left 0.8s;
        }
        
        .cta-login-btn:hover .cta-btn-effect {
            left: 100%;
        }
        
        .cta-login-btn i {
            font-size: 1.5rem;
            transition: transform 0.4s ease;
        }
        
        .cta-login-btn:hover i {
            transform: rotate(20deg) scale(1.2);
        }
        
        /* Footer mejorado */
        .welcome-footer {
            margin-top: auto;
            padding: 3rem;
            background: rgba(10, 10, 15, 0.8);
            backdrop-filter: blur(25px) saturate(180%);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            animation: footerFadeIn 1s ease-out 2s both;
            box-shadow: 
                0 -4px 30px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }
        
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }
        
        .footer-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.8rem;
            font-size: 1.4rem;
            margin-bottom: 1.5rem;
            color: #94a3b8;
            font-weight: 600;
            letter-spacing: 1px;
        }
        
        .footer-logo i {
            color: #667eea;
            font-size: 1.6rem;
        }
        
        .footer-text {
            color: #64748b;
            margin-bottom: 1.5rem;
            font-size: 1rem;
            line-height: 1.6;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .footer-credits {
            color: #64748b;
            font-size: 0.95rem;
            line-height: 1.6;
        }
        
        .footer-credits strong {
            color: #94a3b8;
            font-weight: 600;
        }
        
        /* Banner desarrollador mejorado */
        .dev-banner {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, 
                rgba(102, 126, 234, 0.98) 0%, 
                rgba(118, 75, 162, 0.95) 100%);
            color: white;
            padding: 1rem 2rem;
            z-index: 9999;
            box-shadow: 0 6px 30px rgba(0, 0, 0, 0.25);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            animation: bannerSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .dev-banner-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
        }
        
        .dev-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.6rem 1.2rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            border: 1px solid rgba(255, 255, 255, 0.3);
            letter-spacing: 0.5px;
            text-transform: uppercase;
            backdrop-filter: blur(10px);
        }
        
        .dev-banner p {
            margin: 0;
            font-size: 0.95rem;
            flex: 1;
            text-align: center;
            line-height: 1.5;
            font-weight: 500;
        }
        
        .dev-banner-close {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            cursor: pointer;
            padding: 0.8rem;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            flex-shrink: 0;
        }
        
        .dev-banner-close:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: rotate(90deg) scale(1.1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        /* Loading overlay mejorado */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 10, 15, 0.98);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            animation: overlayFadeIn 0.5s ease-out;
        }
        
        .loading-spinner {
            text-align: center;
            position: relative;
        }
        
        .loading-spinner i {
            font-size: 5rem;
            color: #8b5cf6;
            animation: 
                spin 2s linear infinite,
                colorShift 3s ease-in-out infinite;
            margin-bottom: 1.5rem;
            display: block;
        }
        
        .loading-spinner p {
            color: #cbd5e1;
            font-size: 1.2rem;
            letter-spacing: 1px;
            font-weight: 300;
            animation: textPulse 2s ease-in-out infinite;
            text-transform: uppercase;
        }
        
        /* ===== ANIMACIONES MEJORADAS ===== */
        @keyframes cinematicFloat {
            0% { 
                transform: scale(1) translateY(0px) rotate(0deg);
                filter: brightness(0.35) saturate(1.3) contrast(1.1) blur(0px);
            }
            33% { 
                transform: scale(1.05) translateY(-10px) rotate(0.5deg);
                filter: brightness(0.4) saturate(1.4) contrast(1.15) blur(0.5px);
            }
            66% { 
                transform: scale(1.08) translateY(10px) rotate(-0.5deg);
                filter: brightness(0.38) saturate(1.35) contrast(1.12) blur(0.3px);
            }
            100% { 
                transform: scale(1.1) translateY(0px) rotate(0deg);
                filter: brightness(0.42) saturate(1.5) contrast(1.2) blur(0px);
            }
        }
        
        @keyframes sophisticatedFloat {
            0%, 100% { 
                transform: translate(0, 0) rotate(0deg) scale(1);
                opacity: 0.85;
            }
            25% { 
                transform: translate(20px, -30px) rotate(5deg) scale(1.1);
                opacity: 0.9;
            }
            50% { 
                transform: translate(-15px, 20px) rotate(-3deg) scale(0.95);
                opacity: 0.8;
            }
            75% { 
                transform: translate(10px, -20px) rotate(2deg) scale(1.05);
                opacity: 0.9;
            }
        }
        
        @keyframes logoPulse {
            0%, 100% { 
                transform: scale(1);
                box-shadow: 
                    0 10px 30px rgba(102, 126, 234, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
            50% { 
                transform: scale(1.08);
                box-shadow: 
                    0 15px 40px rgba(102, 126, 234, 0.6),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }
        }
        
        @keyframes shineEffect {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        @keyframes underlinePulse {
            0%, 100% { 
                opacity: 0.6;
                transform: scaleX(1);
            }
            50% { 
                opacity: 0.9;
                transform: scaleX(1.1);
            }
        }
        
        @keyframes cardGlow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes ctaGlow {
            0% { 
                opacity: 0.5;
                transform: scale(1);
            }
            100% { 
                opacity: 0.8;
                transform: scale(1.1);
            }
        }
        
        @keyframes contentFadeIn {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideDownHeader {
            from { 
                transform: translateY(-100%);
                opacity: 0;
            }
            to { 
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes counterSlideIn {
            from { 
                transform: translateX(50px);
                opacity: 0;
            }
            to { 
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes mainContentFadeIn {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes titleFadeIn {
            from { 
                opacity: 0;
                transform: translateY(40px) scale(0.95);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes subtitleFadeIn {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes ratingsFadeIn {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes sectionFadeIn {
            from { 
                opacity: 0;
                transform: translateY(50px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes footerFadeIn {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes bannerSlideIn {
            from { 
                transform: translateY(-100%);
            }
            to { 
                transform: translateY(0);
            }
        }
        
        @keyframes overlayFadeIn {
            from { 
                opacity: 0;
                backdrop-filter: blur(0px);
            }
            to { 
                opacity: 1;
                backdrop-filter: blur(20px);
            }
        }
        
        @keyframes colorShift {
            0%, 100% { color: #8b5cf6; }
            33% { color: #3b82f6; }
            66% { color: #10b981; }
        }
        
        @keyframes textPulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
        
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* ===== RESPONSIVE MEJORADO ===== */
        @media (max-width: 1200px) {
            .welcome-title h1 {
                font-size: 4rem;
            }
            
            .specialties-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            }
        }
        
        @media (max-width: 992px) {
            .welcome-header {
                padding: 1.5rem 2rem;
            }
            
            .welcome-main {
                padding: 3rem 2rem;
            }
            
            .welcome-title h1 {
                font-size: 3.5rem;
            }
            
            .access-card {
                flex-direction: column;
                text-align: center;
                gap: 2rem;
                padding: 2rem;
            }
            
            .visitor-counter {
                position: relative;
                top: 0;
                right: 0;
                margin: 1.5rem auto;
                justify-content: center;
                max-width: 400px;
            }
        }
        
        @media (max-width: 768px) {
            .welcome-header {
                flex-direction: column;
                gap: 1.5rem;
                padding: 1.2rem;
            }
            
            .welcome-title h1 {
                font-size: 3rem;
            }
            
            .welcome-subtitle {
                font-size: 1.2rem;
                padding: 0 1rem;
            }
            
            .welcome-ratings {
                gap: 1.5rem;
            }
            
            .rating-item {
                padding: 0.8rem 1.2rem;
            }
            
            .specialties-grid {
                grid-template-columns: 1fr;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .restaurant-info {
                grid-template-columns: 1fr;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .testimonials-slider {
                grid-template-columns: 1fr;
            }
            
            .cta-content {
                padding: 3rem 1.5rem;
            }
            
            .cta-content h3 {
                font-size: 2.2rem;
            }
            
            .cta-content p {
                font-size: 1.1rem;
            }
            
            .dev-banner-content {
                flex-direction: column;
                text-align: center;
                gap: 1rem;
            }
            
            .floating-element {
                font-size: 2rem;
            }
        }
        
        @media (max-width: 480px) {
            .welcome-title h1 {
                font-size: 2.5rem;
            }
            
            .welcome-subtitle {
                font-size: 1.1rem;
            }
            
            .welcome-ratings {
                flex-direction: column;
                align-items: center;
            }
            
            .login-btn {
                padding: 0.8rem 1.5rem;
                font-size: 0.9rem;
            }
            
            .cta-login-btn {
                padding: 1.2rem 2rem;
                font-size: 1rem;
            }
            
            .welcome-logo-text h2 {
                font-size: 1.8rem;
            }
            
            .specialties-section h3,
            .testimonials-section h3 {
                font-size: 2rem;
            }
            
            .floating-element {
                font-size: 1.8rem;
            }
        }
        
        /* Prevenir flash de contenido no estilizado */
        .welcome-container:not(.loaded) * {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .welcome-container.loaded * {
            opacity: 1;
        }
        
        /* Clase para animaciones de entrada */
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
}

function startAdvancedAnimations() {
    // Crear partículas flotantes
    createFloatingParticles();
    
    // Animar elementos con Intersection Observer
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar todos los elementos animables
        const animatedElements = document.querySelectorAll('.specialty-card, .info-card, .testimonial-card, .rating-item, .access-card');
        animatedElements.forEach(el => {
            if (el) observer.observe(el);
        });
    }
    
    // Efecto de parallax en el fondo
    const handleParallax = () => {
        const bg = document.querySelector('.welcome-bg img');
        if (bg) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            bg.style.transform = `translateY(${rate}px) scale(${1 + scrolled * 0.0001})`;
        }
    };
    
    // Optimización de rendimiento para parallax
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Efecto hover mejorado en botones
    document.querySelectorAll('.login-btn, .access-btn, .cta-login-btn').forEach(btn => {
        if (!btn) return;
        
        btn.addEventListener('mouseenter', function() {
            const currentTransform = this.style.transform || '';
            this.style.transform = currentTransform.replace(/scale\([^)]+\)/, '') + ' scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            const currentTransform = this.style.transform || '';
            this.style.transform = currentTransform.replace(/scale\([^)]+\)/, '') + ' scale(1)';
        });
    });
    
    // Marcar como cargado cuando todo esté listo
    const container = document.querySelector('.welcome-container');
    if (container) {
        container.classList.add('loaded');
    }
}

function createFloatingParticles() {
    const container = document.querySelector('.welcome-container');
    if (!container) return;
    
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Posición aleatoria
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Tamaño aleatorio
        const size = Math.random() * 3 + 1;
        
        // Color aleatorio
        const colors = [
            'rgba(102, 126, 234, 0.4)',
            'rgba(139, 92, 246, 0.4)',
            'rgba(59, 130, 246, 0.4)',
            'rgba(245, 158, 11, 0.4)',
            'rgba(16, 185, 129, 0.4)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Estilos de partícula
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${left}%;
            top: ${top}%;
            pointer-events: none;
            z-index: 2;
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        container.appendChild(particle);
    }
}

// 🔥 REGISTRAR FUNCIONES GLOBALMENTE PARA main.js
window.screenRenderers = window.screenRenderers || {};
window.screenRenderers.welcome = renderWelcomeScreen;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que no hay conflictos
    if (typeof initWelcomeScreen === 'function') {
        console.log('✅ welcome.js cargado correctamente');
    } else {
        console.error('❌ initWelcomeScreen no está definida');
    }
});

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error en Welcome Screen:', e.message, e.filename, e.lineno);
});

// Exportar para módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        renderWelcomeScreen, 
        initWelcomeScreen, 
        loadLoginScreen,
        setupWelcomeEventListeners,
        startWelcomeAnimations,
        updateTodayVisits,
        cleanupWelcomeScreen
    };
}