// Sistema de Autenticación Profesional con Roles
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.roleRoutes = {
            'admin': 'dashboard',
            'waiter': 'reservation',
            'kitchen': 'kitchen',
            'customer': 'menu'
        };
        this.init();
    }

    init() {
        this.checkStoredSession();
        this.setupRoleBasedNavigation();
    }

    checkStoredSession() {
        const storedUser = localStorage.getItem('restaurantUser');
        const storedToken = localStorage.getItem('restaurantToken');
        
        if (storedUser && storedToken) {
            this.currentUser = JSON.parse(storedUser);
            this.isAuthenticated = true;
            this.updateUIForAuth();
            this.redirectToRoleArea();
        }
    }

    setupRoleBasedNavigation() {
        // Sobreescribir la función showScreen para manejar roles
        const originalShowScreen = window.showScreen;
        window.showScreen = (screenId) => {
            if (this.isAuthenticated && this.currentUser) {
                const userRole = this.currentUser.role;
                const allowedScreens = this.getAllowedScreens(userRole);
                
                if (!allowedScreens.includes(screenId) && screenId !== 'login') {
                    this.showNotification('No tienes acceso a esta área', 'warning');
                    return this.redirectToRoleArea();
                }
            }
            
            if (originalShowScreen) {
                originalShowScreen(screenId);
            }
        };
    }

    getAllowedScreens(role) {
        const rolePermissions = {
            'admin': ['dashboard', 'reports', 'settings', 'users', 'inventory', 'menu'],
            'waiter': ['reservation', 'tables', 'orders', 'customers', 'menu'],
            'kitchen': ['kitchen', 'orders', 'inventory', 'menu'],
            'customer': ['menu', 'orders', 'profile', 'reservation']
        };
        return rolePermissions[role] || ['menu'];
    }

    async login(username, password, rememberMe = false) {
        try {
            const user = this.validateCredentials(username, password);
            
            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
                
                const token = this.generateToken();
                const storage = rememberMe ? localStorage : sessionStorage;
                
                storage.setItem('restaurantUser', JSON.stringify(user));
                storage.setItem('restaurantToken', token);
                
                this.updateUIForAuth();
                this.showNotification(`¡Bienvenido ${user.name}!`, 'success');
                
                // Redirigir según el rol
                setTimeout(() => this.redirectToRoleArea(), 800);
                
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
            'admin': { 
                password: 'admin123', 
                role: 'admin', 
                name: 'Admin Principal',
                department: 'Administración',
                permissions: ['all']
            },
            'mesero': { 
                password: 'mesero123', 
                role: 'waiter', 
                name: 'Juan Pérez',
                department: 'Servicio',
                section: 'Sala Principal'
            },
            'cocina': { 
                password: 'cocina123', 
                role: 'kitchen', 
                name: 'María García',
                department: 'Cocina',
                position: 'Chef Principal'
            },
            'cliente': { 
                password: 'cliente123', 
                role: 'customer', 
                name: 'Carlos López',
                membership: 'Premium',
                preferences: ['italiana', 'postres']
            }
        };

        const user = users[username];
        if (user && user.password === password) {
            return {
                username: username,
                name: user.name,
                role: user.role,
                department: user.department,
                loginTime: new Date().toISOString(),
                sessionId: this.generateSessionId(),
                ...user
            };
        }
        return null;
    }

    generateToken() {
        return 'rest_token_' + Math.random().toString(36).substr(2, 12) + '_' + Date.now();
    }

    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substr(2, 9);
    }

    redirectToRoleArea() {
        if (!this.currentUser || !window.showScreen) return;
        
        const targetScreen = this.roleRoutes[this.currentUser.role];
        
        // Pequeño delay para mejor UX
        setTimeout(() => {
            window.showScreen(targetScreen || 'menu');
            
            // Mostrar mensaje de bienvenida específico
            const welcomeMessages = {
                'admin': `Panel de Control - ${this.currentUser.department}`,
                'waiter': `Sistema de Reservas - ${this.currentUser.section}`,
                'kitchen': `Área de Cocina - ${this.currentUser.position}`,
                'customer': `Menú Digital - Cliente ${this.currentUser.membership}`
            };
            
            const message = welcomeMessages[this.currentUser.role];
            if (message) {
                setTimeout(() => {
                    this.showNotification(message, 'info');
                }, 500);
            }
        }, 300);
    }

    logout() {
        const userName = this.currentUser?.name || 'Usuario';
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Limpiar almacenamiento
        localStorage.removeItem('restaurantUser');
        localStorage.removeItem('restaurantToken');
        sessionStorage.removeItem('restaurantUser');
        sessionStorage.removeItem('restaurantToken');
        
        this.updateUIForAuth();
        this.showNotification(`Hasta pronto, ${userName}`, 'info');
        
        // Redirigir a login
        setTimeout(() => {
            if (typeof showScreen === 'function') {
                showScreen('login');
            }
        }, 1000);
    }

    updateUIForAuth() {
        // Actualizar navegación basada en roles
        this.updateNavigationBasedOnRole();
        
        // Actualizar información del usuario
        this.updateUserInfo();
        
        // Actualizar estado de autenticación
        this.updateAuthState();
    }

    updateNavigationBasedOnRole() {
        const navItems = document.querySelectorAll('[data-role]');
        navItems.forEach(item => {
            const requiredRole = item.getAttribute('data-role');
            const shouldShow = this.isAuthenticated && 
                (requiredRole === 'all' || 
                 this.currentUser?.role === requiredRole ||
                 requiredRole.split(',').includes(this.currentUser?.role));
            
            item.style.display = shouldShow ? 'flex' : 'none';
        });
    }

    updateUserInfo() {
        const userInfoElements = document.querySelectorAll('[data-user]');
        if (this.isAuthenticated && this.currentUser) {
            userInfoElements.forEach(element => {
                const infoType = element.getAttribute('data-user');
                const value = this.currentUser[infoType] || 
                             this.currentUser.name || 
                             this.currentUser.role;
                
                element.textContent = value;
                element.classList.add('authenticated');
                
                // Añadir ícono según rol
                const roleIcons = {
                    'admin': 'fa-crown',
                    'waiter': 'fa-concierge-bell',
                    'kitchen': 'fa-utensils',
                    'customer': 'fa-user-tie'
                };
                
                if (infoType === 'role' && roleIcons[this.currentUser.role]) {
                    element.innerHTML = `<i class="fas ${roleIcons[this.currentUser.role]}"></i> ${value}`;
                }
            });
        } else {
            userInfoElements.forEach(element => {
                element.classList.remove('authenticated');
            });
        }
    }

    updateAuthState() {
        document.body.classList.toggle('authenticated', this.isAuthenticated);
        document.body.setAttribute('data-user-role', this.currentUser?.role || 'guest');
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        if (this.currentUser.role === 'admin') return true;
        return this.currentUser.permissions?.includes(permission) || false;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
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

        // Auto-remover después de 5 segundos
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

// Instancia global
const authManager = new AuthManager();

// Exportar para uso global
window.authManager = authManager;