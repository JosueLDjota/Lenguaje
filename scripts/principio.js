// Sistema de Autenticación
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.checkStoredSession();
        this.setupEventListeners();
    }

    checkStoredSession() {
        const storedUser = localStorage.getItem('restaurantUser');
        const storedToken = localStorage.getItem('restaurantToken');
        
        if (storedUser && storedToken) {
            this.currentUser = JSON.parse(storedUser);
            this.isAuthenticated = true;
            this.updateUIForAuth();
            showScreen('dashboard');
        }
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('login')) {
                this.renderLoginScreen();
            }
        });
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
                
                setTimeout(() => {
                    showScreen('dashboard');
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
            'admin': { 
                password: 'admin123', 
                role: 'admin', 
                name: 'Administrador',
                avatar: 'A'
            },
            'mesero': { 
                password: 'mesero123', 
                role: 'waiter', 
                name: 'Juan Mesero',
                avatar: 'JM'
            },
            'cocina': { 
                password: 'cocina123', 
                role: 'kitchen', 
                name: 'María Cocina',
                avatar: 'MC'
            },
            'cliente': { 
                password: 'cliente123', 
                role: 'customer', 
                name: 'Carlos Cliente',
                avatar: 'CC'
            }
        };

        const user = users[username];
        if (user && user.password === password) {
            return {
                username: username,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
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
        
        showScreen('login');
    }

    updateUIForAuth() {
        const authElements = document.querySelectorAll('[data-auth]');
        authElements.forEach(element => {
            const authState = element.getAttribute('data-auth');
            if (authState === 'required' && this.isAuthenticated) {
                element.style.display = 'block';
            } else if (authState === 'required' && !this.isAuthenticated) {
                element.style.display = 'none';
            }
        });

        if (this.isAuthenticated && this.currentUser) {
            // Actualizar información del usuario en el dashboard
            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');
            const userRole = document.getElementById('userRole');
            
            if (userAvatar) userAvatar.textContent = this.currentUser.avatar;
            if (userName) userName.textContent = this.currentUser.name;
            if (userRole) userRole.textContent = this.getRoleDisplayName(this.currentUser.role);
            
            // Aplicar clase de rol al body para estilos específicos
            document.body.className = `role-${this.currentUser.role}`;
            
            // Actualizar dashboard según el rol
            this.updateDashboardForRole();
        }
    }

    getRoleDisplayName(role) {
        const roles = {
            'admin': 'Administrador',
            'waiter': 'Mesero',
            'kitchen': 'Cocina',
            'customer': 'Cliente'
        };
        return roles[role] || role;
    }

    updateDashboardForRole() {
        const contentArea = document.getElementById('contentArea');
        if (!contentArea) return;

        const role = this.currentUser.role;
        let dashboardContent = '';

        switch (role) {
            case 'admin':
                dashboardContent = this.generateAdminDashboard();
                break;
            case 'waiter':
                dashboardContent = this.generateWaiterDashboard();
                break;
            case 'kitchen':
                dashboardContent = this.generateKitchenDashboard();
                break;
            case 'customer':
                dashboardContent = this.generateCustomerDashboard();
                break;
            default:
                dashboardContent = '<p>Dashboard no disponible para este rol.</p>';
        }

        contentArea.innerHTML = dashboardContent;
        this.setupDashboardEventListeners();
    }

    generateAdminDashboard() {
        return `
            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Resumen General</h3>
                    </div>
                    <div class="card-body">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon primary">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">156</div>
                                    <div class="stat-label">Clientes Hoy</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon success">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">$2,450</div>
                                    <div class="stat-label">Ventas Hoy</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon warning">
                                    <i class="fas fa-utensils"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">89</div>
                                    <div class="stat-label">Órdenes Activas</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon info">
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">4.8</div>
                                    <div class="stat-label">Rating Promedio</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Órdenes Recientes</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th># Orden</th>
                                        <th>Mesa</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#00125</td>
                                        <td>Mesa 5</td>
                                        <td>$85.00</td>
                                        <td><span class="badge success">Completada</span></td>
                                        <td>
                                            <button class="btn btn-outline">
                                                <i class="fas fa-eye"></i>
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>#00124</td>
                                        <td>Mesa 12</td>
                                        <td>$120.50</td>
                                        <td><span class="badge warning">En Proceso</span></td>
                                        <td>
                                            <button class="btn btn-outline">
                                                <i class="fas fa-eye"></i>
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>#00123</td>
                                        <td>Mesa 8</td>
                                        <td>$65.75</td>
                                        <td><span class="badge error">Cancelada</span></td>
                                        <td>
                                            <button class="btn btn-outline">
                                                <i class="fas fa-eye"></i>
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Gestión de Personal</h3>
                    </div>
                    <div class="card-body">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon primary">
                                    <i class="fas fa-user-tie"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">8</div>
                                    <div class="stat-label">Meseros Activos</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon success">
                                    <i class="fas fa-chef-hat"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">5</div>
                                    <div class="stat-label">Chefs Activos</div>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-primary" style="margin-top: 1rem;">
                            <i class="fas fa-plus"></i>
                            Agregar Personal
                        </button>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Reportes Rápidos</h3>
                    </div>
                    <div class="card-body">
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <button class="btn btn-outline">
                                <i class="fas fa-chart-bar"></i>
                                Reporte de Ventas
                            </button>
                            <button class="btn btn-outline">
                                <i class="fas fa-utensils"></i>
                                Productos Más Vendidos
                            </button>
                            <button class="btn btn-outline">
                                <i class="fas fa-clock"></i>
                                Horarios Pico
                            </button>
                            <button class="btn btn-outline">
                                <i class="fas fa-user-check"></i>
                                Desempeño de Personal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateWaiterDashboard() {
        return `
            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Mis Mesas</h3>
                    </div>
                    <div class="card-body">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon primary">
                                    <i class="fas fa-chair"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">6</div>
                                    <div class="stat-label">Mesas Asignadas</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon warning">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">3</div>
                                    <div class="stat-label">Órdenes Pendientes</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon success">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">$420</div>
                                    <div class="stat-label">Ventas Hoy</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Órdenes Activas</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Mesa</th>
                                        <th>Orden</th>
                                        <th>Tiempo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Mesa 5</td>
                                        <td>#00125</td>
                                        <td>15 min</td>
                                        <td><span class="badge warning">Preparando</span></td>
                                        <td>
                                            <button class="btn btn-primary">
                                                <i class="fas fa-utensils"></i>
                                                Servir
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Mesa 8</td>
                                        <td>#00126</td>
                                        <td>5 min</td>
                                        <td><span class="badge info">Lista</span></td>
                                        <td>
                                            <button class="btn btn-primary">
                                                <i class="fas fa-check"></i>
                                                Entregar
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Mesas Disponibles</h3>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        ${[1,2,3,4,5,6,7,8,9,10].map(table => `
                            <div class="stat-card" style="cursor: pointer; text-align: center;">
                                <div class="stat-icon ${table % 3 === 0 ? 'warning' : 'success'}">
                                    <i class="fas fa-chair"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">Mesa ${table}</div>
                                    <div class="stat-label">${table % 3 === 0 ? 'Ocupada' : 'Disponible'}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    generateKitchenDashboard() {
        return `
            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Órdenes en Cocina</h3>
                    </div>
                    <div class="card-body">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon warning">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">8</div>
                                    <div class="stat-label">Pendientes</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon primary">
                                    <i class="fas fa-fire"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">5</div>
                                    <div class="stat-label">En Preparación</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon success">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">12</div>
                                    <div class="stat-label">Completadas Hoy</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Órdenes Prioritarias</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th># Orden</th>
                                        <th>Mesa</th>
                                        <th>Items</th>
                                        <th>Tiempo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#00128</td>
                                        <td>Mesa 3</td>
                                        <td>2x Pizza, 1x Ensalada</td>
                                        <td>8 min</td>
                                        <td>
                                            <button class="btn btn-primary">
                                                <i class="fas fa-check"></i>
                                                Lista
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>#00127</td>
                                        <td>Mesa 7</td>
                                        <td>1x Pasta, 2x Postre</td>
                                        <td>12 min</td>
                                        <td>
                                            <button class="btn btn-primary">
                                                <i class="fas fa-check"></i>
                                                Lista
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Inventario de Ingredientes</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Ingrediente</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Tomates</td>
                                    <td>15 kg</td>
                                    <td><span class="badge success">Suficiente</span></td>
                                    <td>
                                        <button class="btn btn-outline">
                                            <i class="fas fa-sync"></i>
                                            Reordenar
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Queso Mozzarella</td>
                                    <td>3 kg</td>
                                    <td><span class="badge warning">Bajo</span></td>
                                    <td>
                                        <button class="btn btn-primary">
                                            <i class="fas fa-truck"></i>
                                            Pedir
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Carne de Res</td>
                                    <td>8 kg</td>
                                    <td><span class="badge success">Suficiente</span></td>
                                    <td>
                                        <button class="btn btn-outline">
                                            <i class="fas fa-sync"></i>
                                            Reordenar
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    generateCustomerDashboard() {
        return `
            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Mi Experiencia</h3>
                    </div>
                    <div class="card-body">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon primary">
                                    <i class="fas fa-utensils"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">12</div>
                                    <div class="stat-label">Visitas Totales</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon success">
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">4.5</div>
                                    <div class="stat-label">Mi Rating</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon info">
                                    <i class="fas fa-percent"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">15%</div>
                                    <div class="stat-label">Descuento Actual</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Reserva Actual</h3>
                    </div>
                    <div class="card-body">
                        <div style="text-align: center; padding: 2rem;">
                            <div class="stat-icon success" style="margin: 0 auto 1rem; width: 4rem; height: 4rem;">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <h3 style="margin-bottom: 0.5rem; color: var(--gray-800);">Reserva Confirmada</h3>
                            <p style="color: var(--gray-600); margin-bottom: 1rem;">
                                Hoy, 7:30 PM - Mesa para 4 personas
                            </p>
                            <button class="btn btn-primary">
                                <i class="fas fa-edit"></i>
                                Modificar Reserva
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Menú Recomendado</h3>
                    </div>
                    <div class="card-body">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                            <div class="stat-card" style="cursor: pointer; text-align: center;">
                                <div class="stat-icon primary">
                                    <i class="fas fa-pizza-slice"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">Pizza Especial</div>
                                    <div class="stat-label">$18.99</div>
                                </div>
                            </div>
                            <div class="stat-card" style="cursor: pointer; text-align: center;">
                                <div class="stat-icon success">
                                    <i class="fas fa-fish"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">Salmón Grill</div>
                                    <div class="stat-label">$24.50</div>
                                </div>
                            </div>
                            <div class="stat-card" style="cursor: pointer; text-align: center;">
                                <div class="stat-icon warning">
                                    <i class="fas fa-ice-cream"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">Postre del Chef</div>
                                    <div class="stat-label">$8.99</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Mi Orden Actual</h3>
                    </div>
                    <div class="card-body">
                        <div style="text-align: center; padding: 1rem;">
                            <p style="color: var(--gray-600); margin-bottom: 1rem;">
                                No tienes órdenes activas en este momento
                            </p>
                            <button class="btn btn-primary">
                                <i class="fas fa-plus"></i>
                                Hacer Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupDashboardEventListeners() {
        // Aquí puedes agregar event listeners específicos del dashboard
        console.log('Dashboard event listeners configurados');
    }

    renderLoginScreen() {
        const loginScreen = document.getElementById('login');
        if (!loginScreen) return;

        loginScreen.innerHTML = this.generateLoginHTML();
        this.setupLoginEventListeners();
    }

    generateLoginHTML() {
        return `
            <div class="login-container">
                <div class="login-bg">
                    <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
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

    setupLoginEventListeners() {
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
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
        
        // Cuentas de demo
        document.querySelectorAll('.demo-account').forEach(account => {
            account.addEventListener('click', () => {
                const username = account.dataset.username;
                const password = account.dataset.password;
                
                document.getElementById('username').value = username;
                document.getElementById('password').value = password;
                document.getElementById('rememberMe').checked = true;
                
                this.showNotification(`Cuenta ${username} cargada`, 'info');
            });
        });
        
        // Botones de ayuda
        document.getElementById('helpLink')?.addEventListener('click', () => {
            this.showNotification('Soporte: soporte@saboryarte.com | Tel: +1-234-567-8900', 'info');
        });
        
        document.getElementById('registerLink')?.addEventListener('click', () => {
            this.showNotification('Sistema de registro en desarrollo - próximamente', 'info');
        });
        
        document.getElementById('forgotPassword')?.addEventListener('click', () => {
            this.showNotification('Función de recuperación en desarrollo', 'info');
        });
        
        // Validación en tiempo real
        document.getElementById('username')?.addEventListener('input', this.validateField.bind(this));
        document.getElementById('password')?.addEventListener('input', this.validateField.bind(this));
    }

    validateField(e) {
        const field = e.target;
        const errorElement = document.getElementById(field.id + 'Error');
        
        if (field.value.trim() === '') {
            this.showFieldError(errorElement, 'Este campo es requerido');
        } else {
            this.clearFieldError(errorElement);
        }
    }

    showFieldError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    clearFieldError(errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;
        const loginBtn = document.getElementById('loginBtn');
        
        // Validación de campos
        if (!this.validateForm(username, password)) {
            return;
        }
        
        // Mostrar estado de carga
        this.setLoginButtonState(loginBtn, 'loading');
        
        try {
            const success = await this.login(username, password, rememberMe);
            
            if (!success) {
                this.setLoginButtonState(loginBtn, 'error');
                setTimeout(() => {
                    this.setLoginButtonState(loginBtn, 'default');
                }, 2000);
            }
        } catch (error) {
            this.setLoginButtonState(loginBtn, 'error');
            setTimeout(() => {
                this.setLoginButtonState(loginBtn, 'default');
            }, 2000);
        }
    }

    validateForm(username, password) {
        let isValid = true;
        
        // Validar username
        if (!username) {
            this.showFieldError(document.getElementById('usernameError'), 'El usuario es requerido');
            isValid = false;
        } else if (username.length < 3) {
            this.showFieldError(document.getElementById('usernameError'), 'El usuario debe tener al menos 3 caracteres');
            isValid = false;
        }
        
        // Validar password
        if (!password) {
            this.showFieldError(document.getElementById('passwordError'), 'La contraseña es requerida');
            isValid = false;
        } else if (password.length < 6) {
            this.showFieldError(document.getElementById('passwordError'), 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        }
        
        return isValid;
    }

    setLoginButtonState(button, state) {
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

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Cerrar manualmente
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

// Sistema de Navegación
class NavigationManager {
    constructor() {
        this.currentScreen = 'login';
        this.init();
    }

    init() {
        this.setupNavigationListeners();
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 60000);
    }

    setupNavigationListeners() {
        // Navegación del sidebar
        document.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item');
            if (navItem && navItem.dataset.screen) {
                this.showScreen(navItem.dataset.screen);
                
                // Actualizar estado activo
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                navItem.classList.add('active');
            }
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            authManager.logout();
        });
    }

    updateCurrentTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
}

// Función global para cambiar pantallas
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.add('hidden');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
    
    // Actualizar título de página
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = {
            'dashboard': 'Dashboard',
            'orders': 'Órdenes',
            'menu': 'Menú',
            'tables': 'Mesas',
            'reports': 'Reportes',
            'settings': 'Configuración'
        };
        pageTitle.textContent = titles[screenId] || 'Dashboard';
    }
    
    // Si es dashboard, actualizar contenido según rol
    if (screenId === 'dashboard' && authManager.isAuthenticated) {
        authManager.updateDashboardForRole();
    }
}

// Inicialización del sistema
const authManager = new AuthManager();
const navigationManager = new NavigationManager();

// Exportar para uso global
window.authManager = authManager;
window.showScreen = showScreen;