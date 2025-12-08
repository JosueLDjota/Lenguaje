// Sistema de Autenticación Premium para Restaurantes
class PremiumAuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.pendingAuthorization = false;
        this.registeredCustomers = new Map(); // Almacena clientes registrados
        this.init();
    }

    init() {
        this.checkStoredSession();
        this.loadRegisteredCustomers();
        this.setupGlobalEventListeners();
    }

    setupGlobalEventListeners() {
        // Listener global para cierre de sesión
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="logout"]')) {
                e.preventDefault();
                this.logout();
            }
            
            // Abrir modal de registro
            if (e.target.closest('[data-action="open-register"]')) {
                e.preventDefault();
                this.showRegistrationModal();
            }
            
            // Solicitar autorización especial
            if (e.target.closest('[data-action="request-access"]')) {
                e.preventDefault();
                this.showAccessRequestModal();
            }
        });
    }

    checkStoredSession() {
        try {
            const storedUser = localStorage.getItem('restaurantUser') || sessionStorage.getItem('restaurantUser');
            const storedToken = localStorage.getItem('restaurantToken') || sessionStorage.getItem('restaurantToken');
            
            if (storedUser && storedToken) {
                this.currentUser = JSON.parse(storedUser);
                this.isAuthenticated = true;
                this.updateUIForAuth();
                
                // Verificar si necesita autorización adicional
                if (this.currentUser.requiresAuthorization && !this.currentUser.authorized) {
                    this.showAuthorizationModal();
                }
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            this.clearStorage();
        }
    }

    loadRegisteredCustomers() {
        try {
            const storedCustomers = localStorage.getItem('restaurantCustomers');
            if (storedCustomers) {
                const customers = JSON.parse(storedCustomers);
                customers.forEach(customer => {
                    this.registeredCustomers.set(customer.email, customer);
                });
            }
        } catch (error) {
            console.error('Error cargando clientes registrados:', error);
        }
    }

    saveRegisteredCustomers() {
        const customers = Array.from(this.registeredCustomers.values());
        localStorage.setItem('restaurantCustomers', JSON.stringify(customers));
    }

    clearStorage() {
        localStorage.removeItem('restaurantUser');
        localStorage.removeItem('restaurantToken');
        sessionStorage.removeItem('restaurantUser');
        sessionStorage.removeItem('restaurantToken');
    }

    async login(username, password, rememberMe = false) {
        try {
            // Validar campos - PARA CLIENTES NO REQUERIMOS CONTRASEÑA
            if (!username) {
                throw new Error('Por favor ingresa un nombre de usuario o email');
            }

            // Para clientes, la contraseña es opcional
            const isCustomer = username.toLowerCase().includes('cliente') || username.includes('@');
            
            if (!isCustomer && !password) {
                throw new Error('Para usuarios del sistema, se requiere contraseña');
            }

            const user = this.validateCredentials(username, password);
            
            if (user) {
                // SIEMPRE AUTORIZAR CLIENTES DIRECTAMENTE
                if (user.role === 'customer') {
                    user.requiresAuthorization = false;
                    user.authorized = true;
                }

                this.currentUser = user;
                this.isAuthenticated = true;
                
                const token = this.generateToken();
                
                // Limpiar almacenamiento previo
                this.clearStorage();
                
                if (rememberMe) {
                    localStorage.setItem('restaurantUser', JSON.stringify(user));
                    localStorage.setItem('restaurantToken', token);
                } else {
                    sessionStorage.setItem('restaurantUser', JSON.stringify(user));
                    sessionStorage.setItem('restaurantToken', token);
                }
                
                this.updateUIForAuth();
                this.showNotification('¡Inicio de sesión exitoso!', 'success');

                // Redirigir SIEMPRE al menú si es cliente
                setTimeout(() => {
                    if (typeof showScreen === 'function') {
                        const user = this.currentUser;
                        
                        if (user.role === 'customer') {
                            // CLIENTES VAN DIRECTAMENTE AL MENÚ
                            showScreen('menu');
                            this.showNotification(`¡Bienvenido ${user.name}!`, 'success');
                        } else {
                            // Para otros usuarios, mantener lógica original
                            switch(user.role) {
                                case 'admin':
                                    showScreen('dashboard');
                                    break;
                                case 'waiter':
                                    showScreen('reservation');
                                    break;
                                case 'kitchen':
                                    showScreen('kitchen');
                                    break;
                                default:
                                    showScreen('welcome');
                            }
                            this.showNotification(`Bienvenido ${user.name}`, 'success');
                        }
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
        const normalizedUsername = username.toLowerCase().trim();
        
        // ACCESO DIRECTO PARA CLIENTES - NO REQUIERE CONTRASEÑA
        if (normalizedUsername === 'cliente' || normalizedUsername.includes('cliente')) {
            // Acceso directo para clientes
            return {
                username: normalizedUsername,
                name: 'Cliente Invitado',
                role: 'customer',
                loginTime: new Date().toISOString(),
                permissions: this.getUserPermissions('customer'),
                authorized: true,
                requiresAuthorization: false,
                isGuest: true
            };
        }

        // También permitir acceso con cualquier email
        if (username.includes('@')) {
            return {
                username: normalizedUsername,
                name: username.split('@')[0],
                role: 'customer',
                loginTime: new Date().toISOString(),
                permissions: this.getUserPermissions('customer'),
                authorized: true,
                requiresAuthorization: false,
                isGuest: true
            };
        }

        // Usuarios del sistema (requieren contraseña)
        const systemUsers = {
            'admin': { password: 'admin123', role: 'admin', name: 'Administrador' },
            'mesero': { password: 'mesero123', role: 'waiter', name: 'Juan Mesero' },
            'cocina': { password: 'cocina123', role: 'kitchen', name: 'María Cocina' }
        };

        const systemUser = systemUsers[normalizedUsername];
        if (systemUser && systemUser.password === password) {
            return {
                username: normalizedUsername,
                name: systemUser.name,
                role: systemUser.role,
                loginTime: new Date().toISOString(),
                permissions: this.getUserPermissions(systemUser.role),
                authorized: true,
                isDemo: true
            };
        }

        // Verificar clientes registrados
        const customer = this.registeredCustomers.get(normalizedUsername);
        if (customer && customer.password === password) {
            return {
                username: normalizedUsername,
                name: customer.name,
                email: customer.email,
                role: 'customer',
                loginTime: new Date().toISOString(),
                permissions: this.getUserPermissions('customer'),
                phone: customer.phone,
                isRegistered: true,
                authorized: true,
                requiresAuthorization: false
            };
        }

        return null;
    }

    async registerCustomer(userData) {
        try {
            // Validar datos
            if (!userData.email || !userData.password || !userData.name) {
                throw new Error('Todos los campos son requeridos');
            }

            if (userData.password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            if (!this.isValidEmail(userData.email)) {
                throw new Error('Ingresa un email válido');
            }

            // Verificar si el usuario ya existe
            const normalizedEmail = userData.email.toLowerCase().trim();
            if (this.registeredCustomers.has(normalizedEmail)) {
                throw new Error('Este email ya está registrado');
            }

            // Crear cliente
            const customer = {
                email: normalizedEmail,
                username: normalizedEmail.split('@')[0],
                password: userData.password,
                name: userData.name,
                phone: userData.phone || '',
                registrationDate: new Date().toISOString(),
                authorized: true, // Ahora autorizamos automáticamente
                requiresAuthorization: false
            };

            // Guardar cliente
            this.registeredCustomers.set(normalizedEmail, customer);
            this.saveRegisteredCustomers();

            this.showNotification('¡Registro exitoso! Ya puedes acceder al menú.', 'success');
            
            // Ahora ir directamente al login automático
            setTimeout(() => {
                this.login(normalizedEmail, userData.password, true);
            }, 1500);
            
            return customer;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    requestSpecialAccess(email, reason, contactInfo) {
        return new Promise((resolve, reject) => {
            // Simular solicitud de autorización
            setTimeout(() => {
                try {
                    // Ya no se necesita autorización, pero mantenemos la función
                    this.showNotification('¡Acceso autorizado automáticamente! Ya puedes usar el sistema.', 'success');
                    
                    // Autorizar automáticamente
                    const customer = this.registeredCustomers.get(email.toLowerCase());
                    if (customer) {
                        customer.authorized = true;
                        customer.requiresAuthorization = false;
                        this.saveRegisteredCustomers();
                    }
                    
                    resolve({
                        success: true,
                        message: 'Acceso autorizado automáticamente.'
                    });
                } catch (error) {
                    reject(error);
                }
            }, 1500);
        });
    }

    saveAccessRequest(request) {
        try {
            const requests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
            requests.push(request);
            localStorage.setItem('accessRequests', JSON.stringify(requests));
        } catch (error) {
            console.error('Error guardando solicitud:', error);
        }
    }

    authorizeCustomer(email) {
        const customer = this.registeredCustomers.get(email);
        if (customer) {
            customer.authorized = true;
            customer.requiresAuthorization = false;
            customer.authorizationDate = new Date().toISOString();
            
            this.saveRegisteredCustomers();
            
            // Si el usuario está actualmente logeado, actualizar su sesión
            if (this.isAuthenticated && this.currentUser.email === email) {
                this.currentUser.authorized = true;
                this.currentUser.requiresAuthorization = false;
                
                // Actualizar almacenamiento
                const token = localStorage.getItem('restaurantToken') || sessionStorage.getItem('restaurantToken');
                if (token) {
                    const storage = localStorage.getItem('restaurantUser') ? localStorage : sessionStorage;
                    storage.setItem('restaurantUser', JSON.stringify(this.currentUser));
                }
                
                this.showNotification('¡Acceso autorizado!', 'success');
                
                // Redirigir al menú
                if (typeof showScreen === 'function') {
                    setTimeout(() => showScreen('menu'), 1000);
                }
            }
            
            return true;
        }
        return false;
    }

    getUserPermissions(role) {
        const permissions = {
            'admin': ['all', 'manage_users', 'view_reports', 'authorize_customers'],
            'waiter': ['view_menu', 'take_orders', 'view_tables', 'manage_reservations'],
            'kitchen': ['view_orders', 'update_order_status', 'view_inventory'],
            'customer': ['view_menu', 'place_order', 'view_orders', 'make_reservation']
        };
        return permissions[role] || [];
    }

    generateToken() {
        return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    logout() {
        const userName = this.currentUser?.name || 'Usuario';
        this.currentUser = null;
        this.isAuthenticated = false;
        this.pendingAuthorization = false;
        
        this.clearStorage();
        
        this.updateUIForAuth();
        this.showNotification(`Sesión cerrada. ¡Hasta pronto, ${userName}!`, 'info');
        
        if (typeof showScreen === 'function') {
            showScreen('welcome');
        }
    }

    updateUIForAuth() {
        // Actualizar elementos de autenticación
        const authElements = document.querySelectorAll('[data-auth]');
        authElements.forEach(element => {
            const authState = element.getAttribute('data-auth');
            if (authState === 'required') {
                element.style.display = this.isAuthenticated ? 'block' : 'none';
            } else if (authState === 'unauthorized') {
                element.style.display = this.isAuthenticated ? 'none' : 'block';
            } else if (authState === 'authorized-only') {
                const isAuthorized = this.isAuthenticated && 
                    (!this.currentUser.requiresAuthorization || this.currentUser.authorized);
                element.style.display = isAuthorized ? 'block' : 'none';
            }
        });

        // Actualizar información del usuario
        const userInfoElements = document.querySelectorAll('[data-user-info]');
        userInfoElements.forEach(element => {
            const infoType = element.getAttribute('data-user-info');
            if (this.isAuthenticated && this.currentUser) {
                element.textContent = this.currentUser[infoType] || this.currentUser.name;
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });

        // Actualizar estado de autorización
        const authStatusElements = document.querySelectorAll('[data-auth-status]');
        authStatusElements.forEach(element => {
            if (this.isAuthenticated && this.currentUser) {
                // TODOS LOS CLIENTES ESTÁN AUTORIZADOS AHORA
                element.textContent = 'Cliente Autorizado';
                element.className = element.className.replace(/\bauth-\S+/g, '') + ' auth-approved';
            }
        });
    }

    showNotification(message, type = 'info') {
        // Usar el sistema de notificaciones global si existe
        if (window.showNotification) {
            window.showNotification(message, type);
            return;
        }

        // Fallback básico
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Cerrar notificación">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        const autoRemove = setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
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

    // MODALES
    showRegistrationModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content auth-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-user-plus"></i> Registro de Cliente</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="registrationForm" class="auth-form">
                        <div class="form-group">
                            <label for="registerName">
                                <i class="fas fa-user"></i> Nombre Completo
                            </label>
                            <input type="text" 
                                   id="registerName" 
                                   class="form-input" 
                                   placeholder="Tu nombre completo" 
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="registerEmail">
                                <i class="fas fa-envelope"></i> Email
                            </label>
                            <input type="email" 
                                   id="registerEmail" 
                                   class="form-input" 
                                   placeholder="tu@email.com" 
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="registerPhone">
                                <i class="fas fa-phone"></i> Teléfono (Opcional)
                            </label>
                            <input type="tel" 
                                   id="registerPhone" 
                                   class="form-input" 
                                   placeholder="+52 123 456 7890">
                        </div>
                        
                        <div class="form-group">
                            <label for="registerPassword">
                                <i class="fas fa-lock"></i> Contraseña
                            </label>
                            <input type="password" 
                                   id="registerPassword" 
                                   class="form-input" 
                                   placeholder="Mínimo 6 caracteres" 
                                   minlength="6"
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="registerConfirmPassword">
                                <i class="fas fa-lock"></i> Confirmar Contraseña
                            </label>
                            <input type="password" 
                                   id="registerConfirmPassword" 
                                   class="form-input" 
                                   placeholder="Repite tu contraseña" 
                                   required>
                        </div>
                        
                        <div class="form-footer">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-check"></i> Registrar y Acceder
                            </button>
                            <button type="button" class="btn btn-secondary close-modal">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animación de entrada
        setTimeout(() => modal.classList.add('show'), 10);

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal(modal));
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Submit del formulario
        modal.querySelector('#registrationForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('registerName').value.trim(),
                email: document.getElementById('registerEmail').value.trim(),
                phone: document.getElementById('registerPhone').value.trim(),
                password: document.getElementById('registerPassword').value
            };
            
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            if (formData.password !== confirmPassword) {
                this.showNotification('Las contraseñas no coinciden', 'error');
                return;
            }
            
            try {
                await this.registerCustomer(formData);
                this.closeModal(modal);
            } catch (error) {
                console.error('Error en registro:', error);
            }
        });
    }

    showAuthorizationModal() {
        // YA NO SE NECESITA - LOS CLIENTES SON AUTORIZADOS AUTOMÁTICAMENTE
        this.showNotification('¡Ya estás autorizado! Acceso directo al menú.', 'success');
        
        // Redirigir al menú
        if (typeof showScreen === 'function') {
            setTimeout(() => showScreen('menu'), 1000);
        }
    }

    showAuthorizationPendingModal(userName) {
        // Modificado para mostrar éxito inmediato
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content auth-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle"></i> ¡Registro Completado!</h3>
                </div>
                <div class="modal-body">
                    <div class="auth-message">
                        <i class="fas fa-check-circle auth-icon success"></i>
                        <h4>¡Bienvenido ${userName}!</h4>
                        <p>Tu cuenta ha sido creada exitosamente y ya tienes acceso completo al menú.</p>
                        
                        <div class="auth-steps">
                            <div class="auth-step completed">
                                <span class="step-number">✓</span>
                                <span class="step-text">Registro completado</span>
                            </div>
                            <div class="auth-step completed">
                                <span class="step-number">✓</span>
                                <span class="step-text">Acceso autorizado automáticamente</span>
                            </div>
                            <div class="auth-step current">
                                <span class="step-number">→</span>
                                <span class="step-text">Redirigiendo al menú...</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary close-modal">
                            <i class="fas fa-check"></i> Ir al Menú Ahora
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal(modal);
            if (typeof showScreen === 'function') {
                showScreen('menu');
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
                if (typeof showScreen === 'function') {
                    showScreen('menu');
                }
            }
        });
    }

    showAccessRequestModal() {
        // Modificado para mostrar que no se necesita autorización
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content auth-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-user-check"></i> Acceso Directo Disponible</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="auth-message">
                        <i class="fas fa-info-circle auth-icon info"></i>
                        <h4>¡No se necesita autorización!</h4>
                        <p>Puedes acceder directamente al menú usando:</p>
                        
                        <div class="access-options">
                            <div class="access-option">
                                <strong>Usuario:</strong> <code>cliente</code>
                                <small>(No requiere contraseña)</small>
                            </div>
                            <div class="access-option">
                                <strong>O cualquier email</strong>
                                <small>(ejemplo: usuario@email.com)</small>
                            </div>
                        </div>
                        
                        <p class="access-note">El sistema autoriza automáticamente a todos los clientes.</p>
                        
                        <div class="form-footer">
                            <button class="btn btn-primary close-modal">
                                <i class="fas fa-check"></i> Entendido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // Métodos de utilidad
    hasPermission(permission) {
        if (!this.isAuthenticated || !this.currentUser) return false;
        if (this.currentUser.role === 'admin') return true;
        return this.currentUser.permissions.includes(permission);
    }

    isAuthorized() {
        // TODOS LOS CLIENTES ESTÁN AUTORIZADOS
        return this.isAuthenticated && this.currentUser;
    }

    getUserInfo() {
        return this.isAuthenticated ? { ...this.currentUser } : null;
    }

    // Función para simular aprobación de autorización (para testing)
    simulateAuthorization(email) {
        return this.authorizeCustomer(email);
    }
}

// Instancia global de autenticación premium
const premiumAuthManager = new PremiumAuthManager();

// Renderizar pantalla de login mejorada
function renderPremiumLoginScreen() {
    const loginScreen = document.getElementById('login');
    
    if (!loginScreen) {
        console.error('Elemento login no encontrado');
        return;
    }

    loginScreen.innerHTML = generatePremiumLoginHTML();
    setupPremiumLoginEventListeners();
    premiumAuthManager.updateUIForAuth();
}

function generatePremiumLoginHTML() {
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
                        <p>Acceso Directo al Menú</p>
                    </div>

                    <div class="auth-status" id="authStatus" style="display: none;">
                        <div class="auth-status-content">
                            <i class="fas fa-user-check"></i>
                            <span>Cliente Autorizado</span>
                        </div>
                    </div>

                    <form class="login-form" id="loginForm" novalidate>
                        <div class="form-group">
                            <label for="username" class="form-label">
                                <i class="fas fa-user"></i> Usuario o Email
                            </label>
                            <div class="input-group">
                                <div class="input-icon">
                                    <i class="fas fa-user" aria-hidden="true"></i>
                                </div>
                                <input type="text" 
                                       id="username" 
                                       class="form-input username-input" 
                                       placeholder="Escribe 'cliente' o tu email" 
                                       required
                                       autocomplete="username"
                                       aria-describedby="usernameError">
                            </div>
                            <div class="form-error hidden" id="usernameError" role="alert"></div>
                            <div class="form-hint">

                              
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="password" class="form-label">
                                <i class="fas fa-lock"></i> Contraseña (Opcional para clientes)
                            </label>
                            <div class="input-group">
                                <div class="input-icon">
                                    <i class="fas fa-lock" aria-hidden="true"></i>
                                </div>
                                <input type="password" 
                                       id="password" 
                                       class="form-input password-input" 
                                       placeholder="Solo para admin, mesero o cocina"
                                       autocomplete="current-password"
                                       aria-describedby="passwordError">
                                <button type="button" class="toggle-password" aria-label="Mostrar contraseña" tabindex="-1">
                                    <i class="fas fa-eye" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div class="form-error hidden" id="passwordError" role="alert"></div>
                            <div class="form-hint">
                            
                            </div>
                        </div>

                        <div class="form-options">
                            <label class="remember-me">
                                <input type="checkbox" class="remember-checkbox" id="rememberMe">
                                <span class="remember-label">Recordar sesión</span>
                            </label>
                        </div>

                        <button type="submit" class="login-btn" id="loginBtn" aria-live="polite">
                            <span>Acceder al Menú</span>
                            <i class="fas fa-arrow-right" aria-hidden="true"></i>
                        </button>
                        
                        <div class="quick-access">
                        </div>
                    </form>

                    <div class="demo-accounts">
                        <h3><i class="fas fa-key"></i> Accesos:</h3>
                        <div class="demo-grid">
                            <div class="demo-account demo-customer" data-username="cliente" data-password="" role="button" tabindex="0">
                                <strong>Cliente</strong>
                                <small>Acceso directo sin contraseña</small>
                            </div>
                            <div class="demo-account" data-username="admin" data-password="admin123" role="button" tabindex="0">
                                <strong>Administrador</strong>
                                <small>Acceso completo</small>
                            </div>
                            <div class="demo-account" data-username="mesero" data-password="mesero123" role="button" tabindex="0">
                                <strong>Mesero</strong>
                                <small>Gestión de mesas</small>
                            </div>
                            <div class="demo-account" data-username="cocina" data-password="cocina123" role="button" tabindex="0">
                                <strong>Cocina</strong>
                                <small>Preparación pedidos</small>
                            </div>
                        </div>
                        <p class="demo-hint">Clientes: Solo escribe "cliente" y presiona Acceder</p>
                    </div>

                    <div class="login-divider">
                        <div class="divider-line"></div>
                        <div class="divider-text">
                            <span>¿Primera vez aquí?</span>
                        </div>
                    </div>

                    <div class="login-actions">
                        <button class="action-btn btn-register" id="registerBtn" data-action="open-register">
                            <i class="fas fa-user-plus"></i> Registrarse como Cliente
                        </button>
                    </div>
                    <br>
                    <br>
                    <div class="login-footer">
                        <p class="footer-text">© 2025 Sabor & Arte - Sistema de Acceso Directo</p>
                        <p class="footer-version">v2.1.0 | Acceso Automático para Clientes</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupPremiumLoginEventListeners() {
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

        togglePassword.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePassword.click();
            }
        });
    }
    
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handlePremiumLogin);
        
        // Permitir Enter en cualquier campo
        loginForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    loginForm.dispatchEvent(new Event('submit'));
                }
            });
        });
    }
    
    // Botón de acceso rápido para cliente
    document.getElementById('quickClientBtn')?.addEventListener('click', () => {
        document.getElementById('username').value = 'cliente';
        document.getElementById('password').value = '';
        document.getElementById('rememberMe').checked = true;
        
        // Enviar formulario automáticamente
        if (loginForm) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Cuentas de demo
    document.querySelectorAll('.demo-account').forEach(account => {
        const handleDemoClick = () => {
            const username = account.dataset.username;
            const password = account.dataset.password || '';
            
            document.getElementById('username').value = username;
            document.getElementById('password').value = password;
            document.getElementById('rememberMe').checked = true;
            
            // Para clientes, no necesitan contraseña
            if (username === 'cliente') {
                document.getElementById('password').value = '';
            }
            
            document.getElementById('loginBtn').focus();
            
            premiumAuthManager.showNotification(`Cuenta ${username} cargada`, 'info');
        };

        account.addEventListener('click', handleDemoClick);
        account.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDemoClick();
            }
        });
    });
    
    // Botones de acción
    document.getElementById('registerBtn')?.addEventListener('click', () => {
        premiumAuthManager.showRegistrationModal();
    });
    
    document.getElementById('accessBtn')?.addEventListener('click', () => {
        premiumAuthManager.showAccessRequestModal();
    });
    
    // Auto-enfocar el campo de usuario
    setTimeout(() => {
        document.getElementById('username')?.focus();
    }, 100);
}

async function handlePremiumLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginBtn = document.getElementById('loginBtn');
    
    // Validación mínima
    if (!username) {
        premiumAuthManager.showNotification('Por favor ingresa un nombre de usuario o email', 'warning');
        document.getElementById('username').focus();
        return;
    }
    
    // Mostrar estado de carga
    setPremiumLoginButtonState(loginBtn, 'loading');
    
    try {
        const success = await premiumAuthManager.login(username, password, rememberMe);
        
        if (!success) {
            setPremiumLoginButtonState(loginBtn, 'error');
            setTimeout(() => {
                setPremiumLoginButtonState(loginBtn, 'default');
            }, 2000);
        }
    } catch (error) {
        console.error('Login error:', error);
        setPremiumLoginButtonState(loginBtn, 'error');
        setTimeout(() => {
            setPremiumLoginButtonState(loginBtn, 'default');
        }, 2000);
    }
}

function setPremiumLoginButtonState(button, state) {
    const states = {
        loading: {
            html: '<div class="button-spinner"></div><span>Accediendo al menú...</span>',
            disabled: true,
            ariaLabel: 'Accediendo al sistema, por favor espere'
        },
        error: {
            html: '<i class="fas fa-exclamation-circle"></i><span>Error de acceso</span>',
            disabled: false,
            ariaLabel: 'Error en las credenciales'
        },
        default: {
            html: '<span>Acceder al Menú</span><i class="fas fa-arrow-right"></i>',
            disabled: false,
            ariaLabel: 'Iniciar sesión'
        }
    };
    
    const buttonState = states[state] || states.default;
    button.innerHTML = buttonState.html;
    button.disabled = buttonState.disabled;
    button.setAttribute('aria-label', buttonState.ariaLabel);
    
    button.classList.remove('loading', 'error');
    if (state !== 'default') {
        button.classList.add(state);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Registrar renderizador
    window.screenRenderers = window.screenRenderers || {};
    window.screenRenderers.login = renderPremiumLoginScreen;
    
    // Renderizar si está activo
    const loginElement = document.getElementById('login');
    if (loginElement && loginElement.classList.contains('active')) {
        renderPremiumLoginScreen();
    }
});

// Exportar para uso global
window.authManager = premiumAuthManager;
window.renderLoginScreen = renderPremiumLoginScreen;
window.premiumAuthManager = premiumAuthManager;

// Función para acceso directo automático (opcional)
window.autoLoginAsClient = function() {
    premiumAuthManager.login('cliente', '', false);
};

// Auto-login opcional (descomentar si quieres acceso automático)
// setTimeout(() => {
//     if (!premiumAuthManager.isAuthenticated && window.location.hash !== '#dashboard') {
//         window.autoLoginAsClient();
//     }
// }, 1000);