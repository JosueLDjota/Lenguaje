// Dashboard del Sistema de Restaurante - Versión Premium
function renderDashboardScreen() {
    const dashboardScreen = document.getElementById('dashboard');
    
    if (!dashboardScreen) {
        console.error('No se encontró el elemento dashboard');
        return;
    }

    console.log('🔧 Renderizando dashboard premium...');

    // Verificar si el usuario está autenticado
    if (!window.authManager || !window.authManager.isAuthenticated) {
        dashboardScreen.innerHTML = `
            <div class="access-denied-container">
                <div class="access-denied-card">
                    <div class="access-denied-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h2>Acceso Denegado</h2>
                    <p>Debes iniciar sesión para acceder al dashboard</p>
                    <button onclick="showScreen('login')" class="btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Ir al Login
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const user = window.authManager.currentUser;
    console.log('👤 Usuario en dashboard:', user);

    // Contenido PREMIUM con diseño corporativo
    dashboardScreen.innerHTML = `
        <div class="dashboard-container">
            <!-- Header Superior -->
            <header class="dashboard-header">
                <div class="header-content">
                    <div class="header-info">
                        <h1 class="dashboard-title">Dashboard - ${getRoleDisplayName(user.role)}</h1>
                        <p class="dashboard-subtitle">Bienvenido, ${user.name}</p>
                    </div>
                    <div class="header-actions">
                        <div class="time-display">
                            <i class="fas fa-clock"></i>
                            <span id="current-time">${new Date().toLocaleTimeString('es-ES')}</span>
                        </div>
                        <div class="user-menu">
                            <button class="btn-notification" onclick="showNotifications()">
                                <i class="fas fa-bell"></i>
                                <span class="notification-badge">3</span>
                            </button>
                            <button onclick="window.authManager.logout()" class="btn-logout">
                                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Contenido Principal -->
            <main class="dashboard-main">
                <div class="dashboard-grid">
                    ${generateRoleContent(user)}
                </div>
            </main>

            <!-- Barra Lateral Móvil -->
            <nav class="mobile-nav">
                <button class="nav-item active" onclick="showScreen('dashboard')">
                    <i class="fas fa-home"></i>
                    <span>Dashboard</span>
                </button>
                <button class="nav-item" onclick="showScreen('menu')">
                    <i class="fas fa-utensils"></i>
                    <span>Menú</span>
                </button>
                <button class="nav-item" onclick="showScreen('reservation')">
                    <i class="fas fa-chair"></i>
                    <span>Mesas</span>
                </button>
                <button class="nav-item" onclick="showReports()">
                    <i class="fas fa-chart-bar"></i>
                    <span>Reportes</span>
                </button>
            </nav>
        </div>
    `;

    // Iniciar actualización de hora en tiempo real
    updateCurrentTime();
}

function getRoleDisplayName(role) {
    const roles = {
        'admin': 'Administrador',
        'waiter': 'Mesero', 
        'kitchen': 'Cocina',
        'customer': 'Cliente'
    };
    return roles[role] || role;
}

function generateRoleContent(user) {
    switch(user.role) {
        case 'admin':
            return generateAdminContent(user);
        case 'waiter':
            return generateWaiterContent(user);
        case 'kitchen':
            return generateKitchenContent(user);
        case 'customer':
            return generateCustomerContent(user);
        default:
            return generateDefaultContent(user);
    }
}

function generateAdminContent(user) {
    return `
        <!-- Tarjetas de Métricas Principales -->
        <section class="metrics-section">
            <div class="section-header">
                <h2 class="section-title">Resumen General</h2>
                <div class="section-actions">
                    <button class="btn-filter" onclick="toggleDateFilter()">
                        <i class="fas fa-calendar-alt"></i> Hoy
                    </button>
                </div>
            </div>
            <div class="metrics-grid">
                <div class="metric-card metric-primary">
                    <div class="metric-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value">12</div>
                        <div class="metric-label">Clientes Hoy</div>
                        <div class="metric-trend trend-positive">
                            <i class="fas fa-arrow-up"></i> 15%
                        </div>
                    </div>
                </div>
                <div class="metric-card metric-success">
                    <div class="metric-icon">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value">L 2,450</div>
                        <div class="metric-label">Ventas Hoy</div>
                        <div class="metric-trend trend-positive">
                            <i class="fas fa-arrow-up"></i> 8%
                        </div>
                    </div>
                </div>
                <div class="metric-card metric-warning">
                    <div class="metric-icon">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value">8</div>
                        <div class="metric-label">Órdenes Activas</div>
                        <div class="metric-trend trend-negative">
                            <i class="fas fa-arrow-down"></i> 5%
                        </div>
                    </div>
                </div>
                <div class="metric-card metric-danger">
                    <div class="metric-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value">3</div>
                        <div class="metric-label">Alertas</div>
                        <div class="metric-trend trend-neutral">
                            <i class="fas fa-minus"></i> 0%
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Acciones Rápidas y Estado de Mesas -->
        <section class="actions-section">
            <div class="section-header">
                <h2 class="section-title">Acciones Rápidas</h2>
            </div>
            <div class="actions-grid">
                <button onclick="showScreen('menu')" class="action-card action-orange">
                    <div class="action-icon">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <div class="action-content">
                        <h3>Gestionar Menú</h3>
                        <p>Administrar platillos y categorías</p>
                    </div>
                    <div class="action-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </button>
                <button onclick="showScreen('reservation')" class="action-card action-blue">
                    <div class="action-icon">
                        <i class="fas fa-chair"></i>
                    </div>
                    <div class="action-content">
                        <h3>Ver Mesas</h3>
                        <p>Estado y reservaciones</p>
                    </div>
                    <div class="action-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </button>
                <button onclick="showReports()" class="action-card action-green">
                    <div class="action-icon">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <div class="action-content">
                        <h3>Ver Reportes</h3>
                        <p>Análisis y estadísticas</p>
                    </div>
                    <div class="action-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </button>
                <button onclick="showSettings()" class="action-card action-gray">
                    <div class="action-icon">
                        <i class="fas fa-cog"></i>
                    </div>
                    <div class="action-content">
                        <h3>Configuración</h3>
                        <p>Ajustes del sistema</p>
                    </div>
                    <div class="action-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </button>
            </div>
        </section>

        <!-- Estado de Mesas y Gráficas -->
        <section class="tables-section">
            <div class="section-header">
                <h2 class="section-title">Estado de Mesas</h2>
                <div class="view-options">
                    <button class="view-option active" data-view="grid">
                        <i class="fas fa-th"></i>
                    </button>
                    <button class="view-option" data-view="list">
                        <i class="fas fa-list"></i>
                    </button>
                </div>
            </div>
            <div class="tables-grid">
                <div class="table-status-card status-available">
                    <div class="status-indicator"></div>
                    <div class="table-content">
                        <div class="table-count">6</div>
                        <div class="table-label">Disponibles</div>
                    </div>
                    <div class="table-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
                <div class="table-status-card status-occupied">
                    <div class="status-indicator"></div>
                    <div class="table-content">
                        <div class="table-count">8</div>
                        <div class="table-label">Ocupadas</div>
                    </div>
                    <div class="table-icon">
                        <i class="fas fa-users"></i>
                    </div>
                </div>
                <div class="table-status-card status-reserved">
                    <div class="status-indicator"></div>
                    <div class="table-content">
                        <div class="table-count">3</div>
                        <div class="table-label">Reservadas</div>
                    </div>
                    <div class="table-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                </div>
                <div class="table-status-card status-maintenance">
                    <div class="status-indicator"></div>
                    <div class="table-content">
                        <div class="table-count">2</div>
                        <div class="table-label">Mantenimiento</div>
                    </div>
                    <div class="table-icon">
                        <i class="fas fa-tools"></i>
                    </div>
                </div>
            </div>
        </section>

        <!-- Gráficas y Estadísticas -->
        <section class="charts-section">
            <div class="chart-container">
                <div class="chart-header">
                    <h3>Ventas del Día</h3>
                    <select class="chart-filter">
                        <option>Hoy</option>
                        <option>Esta Semana</option>
                        <option>Este Mes</option>
                    </select>
                </div>
                <div class="chart-placeholder">
                    <i class="fas fa-chart-line"></i>
                    <p>Gráfica de ventas en tiempo real</p>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-header">
                    <h3>Productos Populares</h3>
                    <select class="chart-filter">
                        <option>Hoy</option>
                        <option>Esta Semana</option>
                        <option>Este Mes</option>
                    </select>
                </div>
                <div class="chart-placeholder">
                    <i class="fas fa-chart-pie"></i>
                    <p>Distribución de productos</p>
                </div>
            </div>
        </section>
    `;
}

function generateWaiterContent(user) {
    return `
        <section class="waiter-dashboard">
            <div class="hero-card">
                <div class="hero-content">
                    <h1>Bienvenido, ${user.name}</h1>
                    <p class="hero-subtitle">Mesero Principal</p>
                    <div class="hero-stats">
                        <div class="hero-stat">
                            <div class="stat-value">6</div>
                            <div class="stat-label">Mesas Asignadas</div>
                        </div>
                        <div class="hero-stat">
                            <div class="stat-value">3</div>
                            <div class="stat-label">Órdenes Pendientes</div>
                        </div>
                    </div>
                </div>
                <div class="hero-actions">
                    <button onclick="showScreen('menu')" class="btn-hero btn-primary">
                        <i class="fas fa-utensils"></i> Tomar Pedido
                    </button>
                    <button onclick="showScreen('reservation')" class="btn-hero btn-secondary">
                        <i class="fas fa-calendar-alt"></i> Ver Reservas
                    </button>
                </div>
            </div>

            <div class="waiter-grid">
                <div class="order-card">
                    <h3>Órdenes Pendientes</h3>
                    <div class="order-list">
                        <div class="order-item">
                            <div class="order-info">
                                <span class="order-table">Mesa 5</span>
                                <span class="order-time">Hace 5 min</span>
                            </div>
                            <button class="btn-process">Procesar</button>
                        </div>
                        <div class="order-item">
                            <div class="order-info">
                                <span class="order-table">Mesa 8</span>
                                <span class="order-time">Hace 12 min</span>
                            </div>
                            <button class="btn-process">Procesar</button>
                        </div>
                    </div>
                </div>

                <div class="assigned-tables">
                    <h3>Mis Mesas</h3>
                    <div class="tables-mini-grid">
                        <div class="table-mini available">M1</div>
                        <div class="table-mini occupied">M2</div>
                        <div class="table-mini available">M3</div>
                        <div class="table-mini reserved">M4</div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function generateKitchenContent(user) {
    return `
        <section class="kitchen-dashboard">
            <div class="kitchen-hero">
                <h1>Panel de Cocina</h1>
                <p>Bienvenido, ${user.name}</p>
                
                <div class="kitchen-stats">
                    <div class="kitchen-stat">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">8</div>
                            <div class="stat-label">Órdenes Pendientes</div>
                        </div>
                    </div>
                    <div class="kitchen-stat">
                        <div class="stat-icon">
                            <i class="fas fa-fire"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">5</div>
                            <div class="stat-label">En Preparación</div>
                        </div>
                    </div>
                    <div class="kitchen-stat">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">12</div>
                            <div class="stat-label">Completadas Hoy</div>
                        </div>
                    </div>
                </div>

                <button onclick="showKitchenOrders()" class="btn-kitchen">
                    <i class="fas fa-list"></i> Ver Todas las Órdenes
                </button>
            </div>

            <div class="orders-preview">
                <h3>Próximas Órdenes</h3>
                <div class="order-cards">
                    <div class="kitchen-order urgent">
                        <div class="order-header">
                            <span class="order-id">#ORD-001</span>
                            <span class="order-priority">Urgente</span>
                        </div>
                        <div class="order-details">
                            <span class="order-table">Mesa 2</span>
                            <span class="order-time">15 min</span>
                        </div>
                    </div>
                    <div class="kitchen-order normal">
                        <div class="order-header">
                            <span class="order-id">#ORD-002</span>
                            <span class="order-priority">Normal</span>
                        </div>
                        <div class="order-details">
                            <span class="order-table">Mesa 5</span>
                            <span class="order-time">25 min</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function generateCustomerContent(user) {
    return `
        <section class="customer-dashboard">
            <div class="customer-hero">
                <div class="customer-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="customer-info">
                    <h1>${user.name}</h1>
                    <p class="customer-membership">Cliente Premium</p>
                </div>
            </div>

            <div class="customer-stats">
                <div class="customer-stat">
                    <div class="stat-icon">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">12</div>
                        <div class="stat-label">Visitas Totales</div>
                    </div>
                </div>
                <div class="customer-stat">
                    <div class="stat-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">4.5</div>
                        <div class="stat-label">Mi Rating</div>
                    </div>
                </div>
                <div class="customer-stat">
                    <div class="stat-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">3</div>
                        <div class="stat-label">Recompensas</div>
                    </div>
                </div>
            </div>

            <div class="customer-actions">
                <button onclick="showScreen('menu')" class="btn-customer btn-primary">
                    <i class="fas fa-utensils"></i> Ver Menú
                </button>
                <button onclick="showScreen('reservation')" class="btn-customer btn-secondary">
                    <i class="fas fa-calendar-alt"></i> Hacer Reserva
                </button>
                <button class="btn-customer btn-outline">
                    <i class="fas fa-history"></i> Historial
                </button>
            </div>

            <div class="recent-activity">
                <h3>Actividad Reciente</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <i class="fas fa-utensils activity-icon"></i>
                        <div class="activity-content">
                            <p>Cena en Mesa 4</p>
                            <span class="activity-time">Ayer, 8:30 PM</span>
                        </div>
                        <span class="activity-amount">L 450</span>
                    </div>
                    <div class="activity-item">
                        <i class="fas fa-star activity-icon"></i>
                        <div class="activity-content">
                            <p>Calificación enviada</p>
                            <span class="activity-time">15 Sep, 2:15 PM</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function generateDefaultContent(user) {
    return `
        <section class="default-dashboard">
            <div class="default-card">
                <div class="default-icon">
                    <i class="fas fa-user"></i>
                </div>
                <h2>Dashboard</h2>
                <p>Bienvenido, ${user.name}</p>
                <p class="role-badge">Rol: ${user.role}</p>
                <button onclick="window.authManager.logout()" class="btn-logout">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
            </div>
        </section>
    `;
}

// Funciones auxiliares mejoradas
function updateCurrentTime() {
    setInterval(() => {
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = new Date().toLocaleTimeString('es-ES');
        }
    }, 1000);
}

function toggleDateFilter() {
    window.authManager.showNotification('Filtro de fecha activado', 'info');
}

function showReports() {
    window.authManager.showNotification('Sistema de reportes premium en desarrollo', 'info');
}

function showSettings() {
    window.authManager.showNotification('Panel de configuración avanzada en desarrollo', 'info');
}

function showKitchenOrders() {
    window.authManager.showNotification('Sistema de órdenes de cocina premium en desarrollo', 'info');
}

function showNotifications() {
    window.authManager.showNotification('Tienes 3 notificaciones nuevas', 'info');
}

// Registrar el renderizador
window.screenRenderers = window.screenRenderers || {};
window.screenRenderers.dashboard = renderDashboardScreen;

console.log('✅ Dashboard Premium cargado correctamente');