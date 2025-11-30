// Sistema de Autenticación para tu estructura existente
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.checkStoredSession();
    }

    checkStoredSession() {
        const storedUser = localStorage.getItem('restaurantUser');
        const storedToken = localStorage.getItem('restaurantToken');
        
        if (storedUser && storedToken) {
            this.currentUser = JSON.parse(storedUser);
            this.isAuthenticated = true;
            this.updateUIForAuth();
        }
    }

    async login(username, password, rememberMe = false) {
        try {
            const user = this.validateCredentials(username, password);
            
            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
                
                const token = this.generateToken();
                
                if (rememberMe) {
                    localStorage.setItem('restaurantUser', JSON.stringify(user));
                    localStorage.setItem('restaurantToken', token);
                } else {
                    sessionStorage.setItem('restaurantUser', JSON.stringify(user));
                    sessionStorage.setItem('restaurantToken', token);
                }
                
                this.updateUIForAuth();
                this.showNotification('¡Inicio de sesión exitoso!', 'success');

                // Redirigir a diferentes áreas según el rol
                setTimeout(() => {
                    if (typeof showScreen === 'function') {
                        const user = this.currentUser;
                        
                        switch(user.role) {
                            case 'admin':
                                showScreen('dashboard');
                                break;
                            case 'waiter':
                                showScreen('menu');
                                break;
                            case 'kitchen':
                                showScreen('menu');
                                break;
                            case 'customer':
                                showScreen('welcome');
                                break;
                            default:
                                showScreen('welcome');
                        }
                        
                        this.showNotification(`Bienvenido ${user.name} (${user.role})`, 'success');
                    }
                }, 1000);
                
                return true;
            } else {
                throw new Error('Credenciales inválidas');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
            return false;
        }
    }

    validateCredentials(username, password) {
        const users = {
            'admin': { password: 'admin123', role: 'admin', name: 'Administrador' },
            'mesero': { password: 'mesero123', role: 'waiter', name: 'Juan Mesero' },
            'cocina': { password: 'cocina123', role: 'kitchen', name: 'María Cocina' },
            'cliente': { password: 'cliente123', role: 'customer', name: 'Carlos Cliente' }
        };

        const user = users[username];
        if (user && user.password === password) {
            return {
                username: username,
                name: user.name,
                role: user.role,
                loginTime: new Date().toISOString()
            };
        }
        return null;
    }

    generateToken() {
        return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        
        localStorage.removeItem('restaurantUser');
        localStorage.removeItem('restaurantToken');
        sessionStorage.removeItem('restaurantUser');
        sessionStorage.removeItem('restaurantToken');
        
        this.updateUIForAuth();
        this.showNotification('Sesión cerrada correctamente', 'info');
        
        if (typeof showScreen === 'function') {
            showScreen('login');
        }
    }

    updateUIForAuth() {
        // Actualizar navegación según autenticación
        const authElements = document.querySelectorAll('[data-auth]');
        authElements.forEach(element => {
            const authState = element.getAttribute('data-auth');
            if (authState === 'required' && this.isAuthenticated) {
                element.style.display = 'block';
            } else if (authState === 'required' && !this.isAuthenticated) {
                element.style.display = 'none';
            }
        });

        // Actualizar información del usuario
        const userInfoElements = document.querySelectorAll('[data-user-info]');
        if (this.isAuthenticated && this.currentUser) {
            userInfoElements.forEach(element => {
                const infoType = element.getAttribute('data-user-info');
                element.textContent = this.currentUser[infoType] || this.currentUser.name;
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Instancia global de autenticación
const authManager = new AuthManager();

// Renderizar pantalla de login
function renderLoginScreen() {
    const loginScreen = document.getElementById('login');
    
    if (!loginScreen) {
        console.error('Elemento login no encontrado');
        return;
    }

    loginScreen.innerHTML = generateLoginHTML();
    setupLoginEventListeners();
}

function generateLoginHTML() {
    return `
        <div class="login-container">
            <div class="login-bg">
                <img src="https://images.unsplash.com/photo-1759419038843-29749ac4cd2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZWxlZ2FudCUyMGludGVyaW9yfGVufDF8fHx8MTc2NDAzMTAwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                     alt="Interior elegante del restaurante" 
                     loading="lazy">
                <div class="login-overlay"></div>
            </div>

            <div class="login-content">
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-logo">
                            <i class="fas fa-utensils" aria-hidden="true"></i>
                        </div>
                        <h1>Bienvenido a Sabor & Arte</h1>
                        <p>Inicia sesión para continuar</p>
                    </div>

                    <form class="login-form" id="loginForm">
                        <div class="form-group">
                            <label for="username" class="form-label">Usuario</label>
                            <div class="input-group">
                                <div class="input-icon">
                                    <i class="fas fa-user" aria-hidden="true"></i>
                                </div>
                                <input type="text" 
                                       id="username" 
                                       class="form-input username-input" 
                                       placeholder="Ingresa tu usuario" 
                                       required
                                       autocomplete="username">
                            </div>
                            <div class="form-error hidden" id="usernameError"></div>
                        </div>

                        <div class="form-group">
                            <label for="password" class="form-label">Contraseña</label>
                            <div class="input-group">
                                <div class="input-icon">
                                    <i class="fas fa-lock" aria-hidden="true"></i>
                                </div>
                                <input type="password" 
                                       id="password" 
                                       class="form-input password-input" 
                                       placeholder="Ingresa tu contraseña" 
                                       required
                                       autocomplete="current-password">
                                <button type="button" class="toggle-password" aria-label="Mostrar contraseña">
                                    <i class="fas fa-eye" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div class="form-error hidden" id="passwordError"></div>
                        </div>

                        <div class="form-options">
                            <label class="remember-me">
                                <input type="checkbox" class="remember-checkbox" id="rememberMe">
                                <span class="remember-label">Recordar sesión</span>
                            </label>
                            <button type="button" class="forgot-password" id="forgotPassword">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        <button type="submit" class="login-btn" id="loginBtn">
                            <span>Iniciar Sesión</span>
                            <i class="fas fa-arrow-right" aria-hidden="true"></i>
                        </button>
                    </form>

                    <div class="demo-accounts">
                        <h3>Cuentas de Demo:</h3>
                        <div class="demo-grid">
                            <div class="demo-account" data-username="admin" data-password="admin123">
                                <strong>Admin</strong><br>admin123
                            </div>
                            <div class="demo-account" data-username="mesero" data-password="mesero123">
                                <strong>Mesero</strong><br>mesero123
                            </div>
                            <div class="demo-account" data-username="cocina" data-password="cocina123">
                                <strong>Cocina</strong><br>cocina123
                            </div>
                            <div class="demo-account" data-username="cliente" data-password="cliente123">
                                <strong>Cliente</strong><br>cliente123
                            </div>
                        </div>
                    </div>

                    <div class="login-divider">
                        <div class="divider-line"></div>
                        <div class="divider-text">
                            <span>¿Primera vez aquí?</span>
                        </div>
                    </div>

                    <div class="login-register">
                        <p class="register-text">
                            ¿No tienes una cuenta?{" "}
                            <button class="register-link" id="registerLink">Crear cuenta</button>
                        </p>
                    </div>
                </div>

                <div class="login-help">
                    <p class="help-text">
                        <span>¿Necesitas ayuda?</span>{" "}
                        <button class="help-link" id="helpLink">Contacta con soporte</button>
                    </p>
                </div>

                <div class="login-footer">
                    <p class="footer-text">© 2025 Sabor & Arte Restaurante - Todos los derechos reservados</p>
                </div>
            </div>
        </div>
    `;
}

function setupLoginEventListeners() {
    // Toggle de visibilidad de contraseña
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('.password-input');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            this.innerHTML = isPassword ? 
                '<i class="fas fa-eye-slash" aria-hidden="true"></i>' : 
                '<i class="fas fa-eye" aria-hidden="true"></i>';
            this.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
        });
    }
    
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Cuentas de demo
    document.querySelectorAll('.demo-account').forEach(account => {
        account.addEventListener('click', () => {
            const username = account.dataset.username;
            const password = account.dataset.password;
            
            document.getElementById('username').value = username;
            document.getElementById('password').value = password;
            document.getElementById('rememberMe').checked = true;
            
            authManager.showNotification(`Cuenta ${username} cargada`, 'info');
        });
    });
    
    // Botones de ayuda
    document.getElementById('helpLink')?.addEventListener('click', () => {
        authManager.showNotification('Soporte: soporte@saboryarte.com | Tel: +1-234-567-8900', 'info');
    });
    
    document.getElementById('registerLink')?.addEventListener('click', () => {
        authManager.showNotification('Sistema de registro en desarrollo - próximamente', 'info');
    });
    
    document.getElementById('forgotPassword')?.addEventListener('click', () => {
        authManager.showNotification('Función de recuperación en desarrollo', 'info');
    });
    
    // Validación en tiempo real
    document.getElementById('username')?.addEventListener('input', validateField);
    document.getElementById('password')?.addEventListener('input', validateField);
}

function validateField(e) {
    const field = e.target;
    const errorElement = document.getElementById(field.id + 'Error');
    
    if (field.value.trim() === '') {
        showFieldError(errorElement, 'Este campo es requerido');
    } else {
        clearFieldError(errorElement);
    }
}

function showFieldError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function clearFieldError(errorElement) {
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginBtn = document.getElementById('loginBtn');
    
    // Validación de campos
    if (!validateForm(username, password)) {
        return;
    }
    
    // Mostrar estado de carga
    setLoginButtonState(loginBtn, 'loading');
    
    try {
        const success = await authManager.login(username, password, rememberMe);
        
        if (!success) {
            setLoginButtonState(loginBtn, 'error');
            setTimeout(() => {
                setLoginButtonState(loginBtn, 'default');
            }, 2000);
        }
    } catch (error) {
        setLoginButtonState(loginBtn, 'error');
        setTimeout(() => {
            setLoginButtonState(loginBtn, 'default');
        }, 2000);
    }
}

function validateForm(username, password) {
    let isValid = true;
    
    // Validar username
    if (!username) {
        showFieldError(document.getElementById('usernameError'), 'El usuario es requerido');
        isValid = false;
    } else if (username.length < 3) {
        showFieldError(document.getElementById('usernameError'), 'El usuario debe tener al menos 3 caracteres');
        isValid = false;
    }
    
    // Validar password
    if (!password) {
        showFieldError(document.getElementById('passwordError'), 'La contraseña es requerida');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError(document.getElementById('passwordError'), 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function setLoginButtonState(button, state) {
    const states = {
        loading: {
            html: '<div class="button-spinner"></div><span>Iniciando sesión...</span>',
            disabled: true
        },
        error: {
            html: '<i class="fas fa-exclamation-circle"></i><span>Error</span>',
            disabled: false
        },
        default: {
            html: '<span>Iniciar Sesión</span><i class="fas fa-arrow-right"></i>',
            disabled: false
        }
    };
    
    const buttonState = states[state] || states.default;
    button.innerHTML = buttonState.html;
    button.disabled = buttonState.disabled;
    
    // Actualizar clases CSS
    button.classList.remove('loading', 'error');
    if (state !== 'default') {
        button.classList.add(state);
    }
}

// Inicializar login cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function() {
    // Registrar la función de renderizado para cuando se muestre la pantalla de login
    window.screenRenderers = window.screenRenderers || {};
    window.screenRenderers.login = renderLoginScreen;
    
    // Si ya estamos en la pantalla de login, renderizar inmediatamente
    if (document.getElementById('login').classList.contains('active')) {
        renderLoginScreen();
    }
});

// Exportar para uso global
window.authManager = authManager;
window.renderLoginScreen = renderLoginScreen;