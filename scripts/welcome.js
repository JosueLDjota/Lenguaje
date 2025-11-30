// Pantalla de Bienvenida Mejorada
function renderWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome');
    
    welcomeScreen.innerHTML = `
        <div class="welcome-container">
            <!-- Banner de información del desarrollador -->
            <div class="dev-banner">
                <div class="dev-banner-content">
                    <span class="dev-badge">💻 Proyecto Developer</span>
                    <p>Este proyecto fue realizado por Josue Daniel Hernandez. Código original en React, migrado a JavaScrips.</p>
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
                    
                    <!-- Menú de navegación superior -->
                    <nav class="welcome-nav">
                        <button class="nav-link" data-screen="menu">
                            <i class="fas fa-utensils"></i>
                            <span>Menú</span>
                        </button>
                        <button class="nav-link" data-screen="reservation">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Reservas</span>
                        </button>
                        <button class="nav-link" data-screen="login">
                            <i class="fas fa-user"></i>
                            <span>Cuenta</span>
                        </button><br>
                    </nav>
                </header>
                <main class="welcome-main">
                    <div class="welcome-hero">
                        <br><!-- Contador de visitantes -->
                        <div class="visitor-counter">
                            <div class="counter-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="counter-content">
                                <span class="counter-number">1,247</span>
                                <span class="counter-label">Visitantes hoy</span>
                            </div>
                        </div>

                        <div class="welcome-title">
                            <h1>
                                Bienvenido a una
                                <br>
                                <span class="gradient-text">experiencia única</span>
                            </h1>
                            <p>
                                Descubre los mejores sabores de la cocina contemporánea en un ambiente sofisticado
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
                                    <span>4.8/5 Google Reviews</span>
                                </div>
                                <div class="rating-item">
                                    <i class="fas fa-award"></i>
                                    <span>Premio Excelencia 2024</span>
                                </div>
                            </div>
                        </div>

                        <div class="welcome-buttons">
                            <button class="welcome-btn screen-btn" data-screen="menu">
                                <div class="welcome-btn-content">
                                    <div class="welcome-btn-icon">
                                        <div class="icon-bg">
                                            <i class="fas fa-utensils"></i>
                                        </div>
                                    </div>
                                    <div class="welcome-btn-text">
                                        <h3>Ver Menú</h3>
                                        <p>Explora nuestra carta de especialidades</p>
                                        <span class="btn-badge">+50 platos</span>
                                    </div>
                                </div>
                                <div class="btn-arrow">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </button>

                            <button class="welcome-btn reservation screen-btn" data-screen="reservation">
                                <div class="welcome-btn-content">
                                    <div class="welcome-btn-icon">
                                        <div class="icon-bg">
                                            <i class="fas fa-calendar-alt"></i>
                                        </div>
                                    </div>
                                    <div class="welcome-btn-text">
                                        <h3>Reservar Mesa</h3>
                                        <p>Asegura tu lugar en momentos especiales</p>
                                        <span class="btn-badge">Reserva rápida</span>
                                    </div>
                                </div>
                                <div class="btn-arrow">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </button>

                            <button class="welcome-btn screen-btn" data-screen="login">
                                <div class="welcome-btn-content">
                                    <div class="welcome-btn-icon">
                                        <div class="icon-bg">
                                            <i class="fas fa-user"></i>
                                        </div>
                                    </div>
                                    <div class="welcome-btn-text">
                                        <h3>Iniciar Sesión</h3>
                                        <p>Accede a tu cuenta y beneficios</p>
                                        <span class="btn-badge">Clientes VIP</span>
                                    </div>
                                </div>
                                <div class="btn-arrow">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </button>
                        </div>

                        <!-- Carousel de especialidades -->
                        <div class="specialties-carousel">
                            <h3>Especialidades del Chef</h3>
                            <div class="carousel-track">
                                <div class="carousel-item">
                                    <img src="https://images.unsplash.com/photo-1676300185292-e23bb3db50fa?ixlib=rb-4.0.0&auto=format&fit=crop&w=150&q=80" alt="Filete Premium">
                                    <span>Filete Premium</span>
                                </div>
                                <div class="carousel-item">
                                    <img src="https://images.unsplash.com/photo-1707322540604-f69bd7b2cb4c?ixlib=rb-4.0.0&auto=format&fit=crop&w=150&q=80" alt="Pasta Carbonara">
                                    <span>Pasta Carbonara</span>
                                </div>
                                <div class="carousel-item">
                                    <img src="https://images.unsplash.com/photo-1736840334919-aac2d5af73e4?ixlib=rb-4.0.0&auto=format&fit=crop&w=150&q=80" alt="Lava Cake">
                                    <span>Lava Cake</span>
                                </div>
                                <div class="carousel-item">
                                    <img src="https://images.unsplash.com/photo-1611250188496-e966043a0629?ixlib=rb-4.0.0&auto=format&fit=crop&w=150&q=80" alt="Tacos Camarón">
                                    <span>Tacos Camarón</span>
                                </div>
                            </div>
                        </div>

                        <div class="welcome-info">
                            <div class="info-card">
                                <div class="info-card-content">
                                    <i class="fas fa-clock"></i>
                                    <div>
                                        <p>Horario</p>
                                        <p>Lun - Dom: 12:00 - 23:00</p>
                                    </div>
                                </div>
                                <div class="info-card-badge">Abierto ahora</div>
                            </div>

                            <div class="info-card">
                                <div class="info-card-content">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <div>
                                        <p>Ubicación</p>
                                        <p>Centro de la ciudad</p>
                                    </div>
                                </div>
                                <button class="location-btn">
                                    <i class="fas fa-directions"></i>
                                </button>
                            </div>

                            <div class="info-card">
                                <div class="info-card-content">
                                    <i class="fas fa-utensils"></i>
                                    <div>
                                        <p>Especialidad</p>
                                        <p>Cocina Fusión</p>
                                    </div>
                                </div>
                                <div class="info-card-badge">Nuevo</div>
                            </div>
                        </div>

                        <!-- Testimonios rápidos -->
                        <div class="testimonials-preview">
                            <div class="testimonial-item">
                                <div class="testimonial-avatar">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="testimonial-content">
                                    <p>"La mejor experiencia gastronómica de la ciudad"</p>
                                    <span>- María G.</span>
                                </div>
                            </div>
                            <div class="testimonial-item">
                                <div class="testimonial-avatar">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="testimonial-content">
                                    <p>"Platos exquisitos y servicio impecable"</p>
                                    <span>- Carlos R.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer class="welcome-footer">
                    <div class="footer-content">
                        <p>© 2025 Sabor & Arte. Una experiencia gastronómica inolvidable</p>
                        <div class="footer-links">
                            <button class="footer-link" data-action="about">Sobre Nosotros</button>
                            <button class="footer-link" data-action="contact">Contacto</button>
                            <button class="footer-link" data-action="credits">Créditos</button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    `;
    
    // Configurar event listeners
    setupWelcomeEventListeners();
    
    // Iniciar animaciones
    startWelcomeAnimations();
}

function setupWelcomeEventListeners() {
    // Navegación principal
    document.querySelectorAll('.screen-btn, .nav-link').forEach(button => {
        button.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            if (screenId) {
                showScreen(screenId);
            }
        });
    });
    
    // Cerrar banner de desarrollador
    const closeBanner = document.querySelector('.dev-banner-close');
    if (closeBanner) {
        closeBanner.addEventListener('click', function() {
            const banner = document.querySelector('.dev-banner');
            banner.style.transform = 'translateY(-100%)';
            setTimeout(() => banner.remove(), 300);
        });
    }
    
    // Botón de ubicación
    const locationBtn = document.querySelector('.location-btn');
    if (locationBtn) {
        locationBtn.addEventListener('click', function() {
            alert('📍 Dirección: Av. Principal #123, Centro de la Ciudad\n\nAbrir en Google Maps...');
        });
    }
    
    // Enlaces del footer
    document.querySelectorAll('.footer-link').forEach(link => {
        link.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleFooterAction(action);
        });
    });
}

function startWelcomeAnimations() {
    // Animación de elementos flotantes
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 2}s`;
    });
    
    // Contador animado
    animateVisitorCounter();
    
    // Auto-play carousel
    startCarousel();
}

function animateVisitorCounter() {
    const counter = document.querySelector('.counter-number');
    if (!counter) return;
    
    let count = 0;
    const target = 1247;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(count).toLocaleString();
    }, 16);
}

function startCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;
    
    let position = 0;
    const items = track.children.length;
    const itemWidth = 180; // Ancho aproximado de cada item
    
    setInterval(() => {
        position -= 1;
        if (position < -((items - 3) * itemWidth)) {
            position = 0;
        }
        track.style.transform = `translateX(${position}px)`;
    }, 50);
}

function handleFooterAction(action) {
    switch(action) {
        case 'about':
            showAboutModal();
            break;
        case 'contact':
            showContactModal();
            break;
        case 'credits':
            showCreditsModal();
            break;
    }
}

function showAboutModal() {
    const modal = document.createElement('div');
    modal.className = 'welcome-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
            <h3>Sobre Sabor & Arte</h3>
            <p>Fundado en 2018, Sabor & Arte combina tradición culinaria con innovación gastronómica. Nuestro equipo de chefs internacionales crea experiencias únicas para cada comensal.</p>
            <div class="modal-features">
                <div class="feature">
                    <i class="fas fa-seedling"></i>
                    <span>Ingredientes locales</span>
                </div>
                <div class="feature">
                    <i class="fas fa-heart"></i>
                    <span>Pasíon culinaria</span>
                </div>
                <div class="feature">
                    <i class="fas fa-award"></i>
                    <span>Premios internacionales</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModal(modal);
}

function showContactModal() {
    const modal = document.createElement('div');
    modal.className = 'welcome-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
            <h3>Contacto</h3>
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>+1 (555) 123-4567</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>info@saboryarte.com</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Av. Principal #123, Centro</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModal(modal);
}

function showCreditsModal() {
    const modal = document.createElement('div');
    modal.className = 'welcome-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
            <h3>Créditos del Proyecto</h3>
            <div class="credits-content">
                <div class="credit-item">
                    <strong>Desarrollador:</strong>
                    <span>Josue Daniel Hernandez</span>
                </div>
                <div class="credit-item">
                    <strong>Tecnología Original:</strong>
                    <span>React.js</span>
                </div>
                <div class="credit-item">
                    <strong>Versión Actual:</strong>
                    <span>HTML5, CSS3, JavaScript Vanilla</span>
                </div>
                <div class="credit-item">
                    <strong>Imágenes:</strong>
                    <span>Unsplash</span>
                </div>
                <div class="credit-item">
                    <strong>Iconos:</strong>
                    <span>Font Awesome</span>
                </div>
            </div>
            <div class="credits-note">
                <p>Proyecto educativo demostrativo - Todos los derechos reservados</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModal(modal);
}

function setupModal(modal) {
    const closeModal = () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Cerrar con ESC
    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKeydown);
    
    // Remover event listener cuando se cierra el modal
    modal.addEventListener('animationend', function handler() {
        if (modal.style.animationName === 'fadeOut') {
            document.removeEventListener('keydown', handleKeydown);
            modal.removeEventListener('animationend', handler);
        }
    });

}
