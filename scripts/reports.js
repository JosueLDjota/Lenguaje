// Módulo de Reportes Premium - Sistema de Restaurante
function renderReportsScreen() {
    const reportsScreen = document.getElementById('reports');
    
    if (!reportsScreen) {
        console.error('No se encontró el elemento reports');
        return;
    }

    console.log('📊 Renderizando módulo de reportes premium...');

    // Verificar autenticación
    if (!window.authManager || !window.authManager.isAuthenticated) {
        reportsScreen.innerHTML = `
            <div class="access-denied-container">
                <div class="access-denied-card">
                    <div class="access-denied-icon">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <h2>Acceso Denegado</h2>
                    <p>Debes iniciar sesión para acceder a los reportes</p>
                    <button onclick="showScreen('login')" class="btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Ir al Login
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const user = window.authManager.currentUser;

    reportsScreen.innerHTML = `
        <div class="reports-container">
            <!-- Header del Módulo -->
            <header class="reports-header">
                <div class="header-content">
                    <div class="header-info">
                        <h1 class="reports-title">
                            <i class="fas fa-chart-line"></i>
                            Reportes & Analytics
                        </h1>
                        <p class="reports-subtitle">Análisis detallado del rendimiento del restaurante</p>
                    </div>
                    <div class="header-actions">
                        <div class="export-actions">
                            <button class="btn-export" onclick="exportToPDF()">
                                <i class="fas fa-file-pdf"></i> PDF
                            </button>
                            <button class="btn-export" onclick="exportToExcel()">
                                <i class="fas fa-file-excel"></i> Excel
                            </button>
                            <button class="btn-export" onclick="exportToCSV()">
                                <i class="fas fa-file-csv"></i> CSV
                            </button>
                        </div>
                        <button class="btn-schedule" onclick="showScheduleModal()">
                            <i class="fas fa-calendar-plus"></i> Programar
                        </button>
                    </div>
                </div>
            </header>

            <!-- Filtros Avanzados -->
            <section class="filters-section">
                <div class="filters-header">
                    <h3>Filtros de Reporte</h3>
                    <button class="btn-clear-filters" onclick="clearFilters()">
                        <i class="fas fa-eraser"></i> Limpiar
                    </button>
                </div>
                <div class="filters-grid">
                    <div class="filter-group">
                        <label>Rango de Fechas</label>
                        <select class="filter-select" id="dateRange" onchange="updateDateRange()">
                            <option value="today">Hoy</option>
                            <option value="yesterday">Ayer</option>
                            <option value="week" selected>Esta Semana</option>
                            <option value="lastWeek">Semana Pasada</option>
                            <option value="month">Este Mes</option>
                            <option value="lastMonth">Mes Pasado</option>
                            <option value="quarter">Este Trimestre</option>
                            <option value="custom">Personalizado</option>
                        </select>
                    </div>
                    <div class="filter-group" id="customDateRange" style="display: none;">
                        <label>Fecha Personalizada</label>
                        <div class="date-inputs">
                            <input type="date" class="date-input" id="startDate">
                            <span>a</span>
                            <input type="date" class="date-input" id="endDate">
                        </div>
                    </div>
                    <div class="filter-group">
                        <label>Categoría</label>
                        <select class="filter-select" id="categoryFilter">
                            <option value="all">Todas las Categorías</option>
                            <option value="food">Comida</option>
                            <option value="beverages">Bebidas</option>
                            <option value="desserts">Postres</option>
                            <option value="specials">Especiales</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Mesero</label>
                        <select class="filter-select" id="waiterFilter">
                            <option value="all">Todos los Meseros</option>
                            <option value="waiter1">Carlos Rodríguez</option>
                            <option value="waiter2">María González</option>
                            <option value="waiter3">Juan Pérez</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Tipo de Reporte</label>
                        <select class="filter-select" id="reportType" onchange="toggleReportSections()">
                            <option value="overview">Resumen General</option>
                            <option value="sales">Ventas</option>
                            <option value="inventory">Inventario</option>
                            <option value="staff">Personal</option>
                            <option value="customers">Clientes</option>
                            <option value="detailed">Detallado</option>
                        </select>
                    </div>
                    <div class="filter-actions">
                        <button class="btn-generate" onclick="generateReport()">
                            <i class="fas fa-play"></i> Generar Reporte
                        </button>
                    </div>
                </div>
            </section>

            <!-- KPIs Principales -->
            <section class="kpi-section">
                <div class="section-header">
                    <h2>Métricas Clave</h2>
                    <div class="time-indicator">
                        <i class="fas fa-sync-alt"></i>
                        Actualizado: ${new Date().toLocaleTimeString('es-ES')}
                    </div>
                </div>
                <div class="kpi-grid">
                    <div class="kpi-card kpi-revenue">
                        <div class="kpi-icon">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-value">L 45,820</div>
                            <div class="kpi-label">Ventas Totales</div>
                            <div class="kpi-trend trend-positive">
                                <i class="fas fa-arrow-up"></i> 12.5% vs período anterior
                            </div>
                        </div>
                    </div>
                    <div class="kpi-card kpi-orders">
                        <div class="kpi-icon">
                            <i class="fas fa-utensils"></i>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-value">324</div>
                            <div class="kpi-label">Total Órdenes</div>
                            <div class="kpi-trend trend-positive">
                                <i class="fas fa-arrow-up"></i> 8.3% vs período anterior
                            </div>
                        </div>
                    </div>
                    <div class="kpi-card kpi-customers">
                        <div class="kpi-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-value">892</div>
                            <div class="kpi-label">Clientes Atendidos</div>
                            <div class="kpi-trend trend-positive">
                                <i class="fas fa-arrow-up"></i> 15.2% vs período anterior
                            </div>
                        </div>
                    </div>
                    <div class="kpi-card kpi-average">
                        <div class="kpi-icon">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <div class="kpi-content">
                            <div class="kpi-value">L 141.42</div>
                            <div class="kpi-label">Ticket Promedio</div>
                            <div class="kpi-trend trend-positive">
                                <i class="fas fa-arrow-up"></i> 4.1% vs período anterior
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Gráficas y Visualizaciones -->
            <section class="charts-section">
                <div class="charts-header">
                    <h2>Análisis Visual</h2>
                    <div class="chart-controls">
                        <button class="chart-control active" data-chart="sales">
                            <i class="fas fa-shopping-cart"></i> Ventas
                        </button>
                        <button class="chart-control" data-chart="products">
                            <i class="fas fa-utensils"></i> Productos
                        </button>
                        <button class="chart-control" data-chart="hours">
                            <i class="fas fa-clock"></i> Horarios
                        </button>
                        <button class="chart-control" data-chart="comparison">
                            <i class="fas fa-balance-scale"></i> Comparación
                        </button>
                    </div>
                </div>
                
                <div class="charts-grid">
                    <!-- Gráfica de Ventas por Día -->
                    <div class="chart-container large">
                        <div class="chart-header">
                            <h3>Ventas Diarias</h3>
                            <select class="chart-metric" onchange="updateSalesChart()">
                                <option value="revenue">Ingresos</option>
                                <option value="orders">Órdenes</option>
                                <option value="customers">Clientes</option>
                            </select>
                        </div>
                        <div class="chart-wrapper">
                            <div class="chart-placeholder animated">
                                <div class="chart-bars">
                                    ${generateChartBars([12000, 8500, 15200, 9800, 13400, 16800, 14500], 'L ')}
                                </div>
                                <div class="chart-labels">
                                    <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
                                </div>
                            </div>
                        </div>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <span class="legend-color" style="background: #3b82f6"></span>
                                <span>Ventas Actuales</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background: #d1d5db"></span>
                                <span>Período Anterior</span>
                            </div>
                        </div>
                    </div>

                    <!-- Gráfica de Productos Más Vendidos -->
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3>Productos Populares</h3>
                            <select class="chart-metric" onchange="updateProductsChart()">
                                <option value="quantity">Cantidad</option>
                                <option value="revenue">Ingresos</option>
                            </select>
                        </div>
                        <div class="chart-wrapper">
                            <div class="products-chart">
                                ${generateProductsChart()}
                            </div>
                        </div>
                    </div>

                    <!-- Gráfica de Ventas por Hora -->
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3>Ventas por Hora</h3>
                            <select class="chart-metric" onchange="updateHoursChart()">
                                <option value="today">Hoy</option>
                                <option value="average">Promedio</option>
                            </select>
                        </div>
                        <div class="chart-wrapper">
                            <div class="hours-chart">
                                ${generateHoursChart()}
                            </div>
                        </div>
                    </div>

                    <!-- Gráfica de Comparación por Mesero -->
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3>Rendimiento por Mesero</h3>
                            <select class="chart-metric" onchange="updateWaitersChart()">
                                <option value="sales">Ventas</option>
                                <option value="orders">Órdenes</option>
                                <option value="tips">Propinas</option>
                            </select>
                        </div>
                        <div class="chart-wrapper">
                            <div class="waiters-chart">
                                ${generateWaitersChart()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Tablas de Datos Detallados -->
            <section class="tables-section">
                <div class="section-header">
                    <h2>Datos Detallados</h2>
                    <div class="table-actions">
                        <button class="btn-table-action" onclick="toggleTableView()">
                            <i class="fas fa-table"></i> Vista Tabla
                        </button>
                        <button class="btn-table-action" onclick="toggleCardView()">
                            <i class="fas fa-th"></i> Vista Tarjetas
                        </button>
                    </div>
                </div>

                <div class="data-tabs">
                    <div class="tab-headers">
                        <button class="tab-header active" data-tab="orders">Órdenes</button>
                        <button class="tab-header" data-tab="products">Productos</button>
                        <button class="tab-header" data-tab="customers">Clientes</button>
                        <button class="tab-header" data-tab="inventory">Inventario</button>
                    </div>

                    <div class="tab-content active" id="orders-tab">
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>ID Orden</th>
                                        <th>Fecha/Hora</th>
                                        <th>Mesero</th>
                                        <th>Mesa</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${generateOrdersTable()}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="tab-content" id="products-tab">
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Vendidos</th>
                                        <th>Ingresos</th>
                                        <th>% del Total</th>
                                        <th>Tendencia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${generateProductsTable()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Reportes Guardados y Programados -->
            <section class="saved-reports-section">
                <div class="section-header">
                    <h2>Reportes Guardados</h2>
                    <button class="btn-save-report" onclick="showSaveReportModal()">
                        <i class="fas fa-save"></i> Guardar Configuración
                    </button>
                </div>
                <div class="saved-reports-grid">
                    ${generateSavedReports()}
                </div>
            </section>
        </div>

        <!-- Modal de Programación -->
        <div id="scheduleModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Programar Reporte</h3>
                    <button class="modal-close" onclick="closeScheduleModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Nombre del Reporte</label>
                        <input type="text" class="form-input" placeholder="Ej: Reporte Semanal de Ventas">
                    </div>
                    <div class="form-group">
                        <label>Frecuencia</label>
                        <select class="form-select">
                            <option value="daily">Diario</option>
                            <option value="weekly" selected>Semanal</option>
                            <option value="monthly">Mensual</option>
                            <option value="custom">Personalizado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Formato de Exportación</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" checked> PDF
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox"> Excel
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox"> CSV
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Enviar a</label>
                        <input type="email" class="form-input" placeholder="correo@ejemplo.com" multiple>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeScheduleModal()">Cancelar</button>
                    <button class="btn-primary" onclick="scheduleReport()">Programar Reporte</button>
                </div>
            </div>
        </div>
    `;

    // Inicializar eventos
    initializeReportEvents();
    loadReportData();
}

// Funciones auxiliares para generar contenido dinámico
function generateChartBars(data, prefix = '') {
    const maxValue = Math.max(...data);
    return data.map(value => {
        const height = (value / maxValue) * 100;
        return `
            <div class="chart-bar-container">
                <div class="chart-bar" style="height: ${height}%">
                    <div class="chart-bar-value">${prefix}${value.toLocaleString()}</div>
                </div>
            </div>
        `;
    }).join('');
}

function generateProductsChart() {
    const products = [
        { name: 'Pizza Especial', value: 45, color: '#3b82f6' },
        { name: 'Hamburguesa', value: 38, color: '#10b981' },
        { name: 'Pasta Alfredo', value: 32, color: '#f59e0b' },
        { name: 'Ensalada César', value: 28, color: '#ef4444' },
        { name: 'Sopa del Día', value: 22, color: '#8b5cf6' }
    ];

    return `
        <div class="products-chart-container">
            ${products.map(product => `
                <div class="product-item">
                    <div class="product-info">
                        <span class="product-name">${product.name}</span>
                        <span class="product-value">${product.value} unidades</span>
                    </div>
                    <div class="product-bar">
                        <div class="product-bar-fill" style="width: ${product.value}%; background: ${product.color}"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function generateHoursChart() {
    const hours = Array.from({length: 14}, (_, i) => i + 10); // 10:00 - 23:00
    const data = hours.map(hour => Math.floor(Math.random() * 8000) + 2000);
    
    return `
        <div class="hours-chart-container">
            ${hours.map((hour, index) => {
                const value = data[index];
                const height = (value / Math.max(...data)) * 100;
                return `
                    <div class="hour-bar">
                        <div class="hour-bar-fill" style="height: ${height}%"></div>
                        <span class="hour-label">${hour}:00</span>
                        <div class="hour-value">L ${value.toLocaleString()}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function generateWaitersChart() {
    const waiters = [
        { name: 'Carlos R.', sales: 12500, orders: 45, color: '#3b82f6' },
        { name: 'María G.', sales: 11800, orders: 52, color: '#10b981' },
        { name: 'Juan P.', sales: 9800, orders: 38, color: '#f59e0b' },
        { name: 'Ana M.', sales: 14200, orders: 48, color: '#ef4444' }
    ];

    const maxSales = Math.max(...waiters.map(w => w.sales));

    return `
        <div class="waiters-chart-container">
            ${waiters.map(waiter => {
                const width = (waiter.sales / maxSales) * 100;
                return `
                    <div class="waiter-item">
                        <div class="waiter-info">
                            <span class="waiter-name">${waiter.name}</span>
                            <span class="waiter-stats">${waiter.orders} órdenes</span>
                        </div>
                        <div class="waiter-bar">
                            <div class="waiter-bar-fill" style="width: ${width}%; background: ${waiter.color}">
                                <span class="waiter-sales">L ${waiter.sales.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function generateOrdersTable() {
    const orders = [
        { id: 'ORD-001', date: '2024-01-15 12:30', waiter: 'Carlos R.', table: 'Mesa 5', total: 1250, status: 'Completado' },
        { id: 'ORD-002', date: '2024-01-15 13:15', waiter: 'María G.', table: 'Mesa 8', total: 890, status: 'Completado' },
        { id: 'ORD-003', date: '2024-01-15 14:00', waiter: 'Juan P.', table: 'Mesa 3', total: 1560, status: 'Completado' },
        { id: 'ORD-004', date: '2024-01-15 19:30', waiter: 'Ana M.', table: 'Mesa 12', total: 2340, status: 'Completado' },
        { id: 'ORD-005', date: '2024-01-15 20:45', waiter: 'Carlos R.', table: 'Mesa 7', total: 1780, status: 'Completado' }
    ];

    return orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.date}</td>
            <td>${order.waiter}</td>
            <td>${order.table}</td>
            <td><strong>L ${order.total.toLocaleString()}</strong></td>
            <td><span class="status-badge status-completed">${order.status}</span></td>
            <td>
                <button class="btn-action" onclick="viewOrderDetails('${order.id}')" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action" onclick="reprintOrder('${order.id}')" title="Reimprimir">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function generateProductsTable() {
    const products = [
        { name: 'Pizza Especial', category: 'Comida', sold: 45, revenue: 22500, percentage: 18.5 },
        { name: 'Hamburguesa Gourmet', category: 'Comida', sold: 38, revenue: 15200, percentage: 12.4 },
        { name: 'Pasta Alfredo', category: 'Comida', sold: 32, revenue: 12800, percentage: 10.5 },
        { name: 'Cerveza Artesanal', category: 'Bebidas', sold: 56, revenue: 8400, percentage: 6.9 },
        { name: 'Vino Tinto', category: 'Bebidas', sold: 28, revenue: 12600, percentage: 10.3 }
    ];

    return products.map(product => `
        <tr>
            <td><strong>${product.name}</strong></td>
            <td><span class="category-tag">${product.category}</span></td>
            <td>${product.sold}</td>
            <td><strong>L ${product.revenue.toLocaleString()}</strong></td>
            <td>
                <div class="percentage-bar">
                    <div class="percentage-fill" style="width: ${product.percentage}%"></div>
                    <span class="percentage-text">${product.percentage}%</span>
                </div>
            </td>
            <td>
                <span class="trend-indicator trend-positive">
                    <i class="fas fa-arrow-up"></i> 12%
                </span>
            </td>
        </tr>
    `).join('');
}

function generateSavedReports() {
    const reports = [
        { name: 'Reporte Semanal Ventas', type: 'Ventas', lastRun: '2024-01-15', schedule: 'Semanal' },
        { name: 'Análisis Mensual Productos', type: 'Productos', lastRun: '2024-01-01', schedule: 'Mensual' },
        { name: 'Rendimiento Personal', type: 'Personal', lastRun: '2024-01-14', schedule: 'Diario' },
        { name: 'Inventario Crítico', type: 'Inventario', lastRun: '2024-01-13', schedule: 'Personalizado' }
    ];

    return reports.map(report => `
        <div class="saved-report-card">
            <div class="report-icon">
                <i class="fas fa-chart-bar"></i>
            </div>
            <div class="report-content">
                <h4>${report.name}</h4>
                <div class="report-meta">
                    <span class="report-type">${report.type}</span>
                    <span class="report-schedule">${report.schedule}</span>
                </div>
                <div class="report-last-run">
                    Última ejecución: ${report.lastRun}
                </div>
            </div>
            <div class="report-actions">
                <button class="btn-action" onclick="runSavedReport('${report.name}')" title="Ejecutar">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn-action" onclick="editSavedReport('${report.name}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action" onclick="deleteSavedReport('${report.name}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Funciones de control del módulo
function initializeReportEvents() {
    // Eventos de pestañas
    document.querySelectorAll('.tab-header').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Eventos de controles de gráficas
    document.querySelectorAll('.chart-control').forEach(control => {
        control.addEventListener('click', () => {
            const chartType = control.getAttribute('data-chart');
            switchChart(chartType);
        });
    });

    // Evento de rango de fechas personalizado
    document.getElementById('dateRange').addEventListener('change', function() {
        updateDateRange();
    });
}

function switchTab(tabName) {
    // Remover clase active de todas las pestañas
    document.querySelectorAll('.tab-header').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Activar pestaña seleccionada
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function switchChart(chartType) {
    document.querySelectorAll('.chart-control').forEach(control => control.classList.remove('active'));
    document.querySelector(`[data-chart="${chartType}"]`).classList.add('active');
    
    // Aquí iría la lógica para actualizar las gráficas principales
    window.authManager.showNotification(`Mostrando gráfica de ${chartType}`, 'info');
}

function updateDateRange() {
    const dateRange = document.getElementById('dateRange').value;
    const customRange = document.getElementById('customDateRange');
    
    if (dateRange === 'custom') {
        customRange.style.display = 'block';
    } else {
        customRange.style.display = 'none';
    }
}

function loadReportData() {
    // Simular carga de datos
    console.log('📈 Cargando datos del reporte...');
    setTimeout(() => {
        window.authManager.showNotification('Datos del reporte actualizados', 'success');
    }, 1000);
}

// Funciones de exportación
function exportToPDF() {
    window.authManager.showNotification('Generando reporte PDF...', 'info');
    setTimeout(() => {
        window.authManager.showNotification('Reporte PDF generado exitosamente', 'success');
    }, 2000);
}

function exportToExcel() {
    window.authManager.showNotification('Exportando a Excel...', 'info');
    setTimeout(() => {
        window.authManager.showNotification('Archivo Excel descargado', 'success');
    }, 2000);
}

function exportToCSV() {
    window.authManager.showNotification('Exportando a CSV...', 'info');
    setTimeout(() => {
        window.authManager.showNotification('Archivo CSV descargado', 'success');
    }, 1500);
}

// Funciones de modal
function showScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'block';
}

function closeScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'none';
}

function scheduleReport() {
    window.authManager.showNotification('Reporte programado exitosamente', 'success');
    closeScheduleModal();
}

function showSaveReportModal() {
    window.authManager.showNotification('Funcionalidad de guardar configuración en desarrollo', 'info');
}

function clearFilters() {
    document.getElementById('dateRange').value = 'week';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('waiterFilter').value = 'all';
    document.getElementById('reportType').value = 'overview';
    document.getElementById('customDateRange').style.display = 'none';
    
    window.authManager.showNotification('Filtros limpiados', 'info');
}

function generateReport() {
    window.authManager.showNotification('Generando reporte con los filtros aplicados...', 'info');
    setTimeout(() => {
        window.authManager.showNotification('Reporte generado exitosamente', 'success');
    }, 1500);
}

// Funciones específicas de tablas
function toggleTableView() {
    window.authManager.showNotification('Cambiando a vista de tabla', 'info');
}

function toggleCardView() {
    window.authManager.showNotification('Cambiando a vista de tarjetas', 'info');
}

// Funciones de reportes guardados
function runSavedReport(reportName) {
    window.authManager.showNotification(`Ejecutando reporte: ${reportName}`, 'info');
}

function editSavedReport(reportName) {
    window.authManager.showNotification(`Editando reporte: ${reportName}`, 'info');
}

function deleteSavedReport(reportName) {
    if (confirm(`¿Estás seguro de que quieres eliminar el reporte "${reportName}"?`)) {
        window.authManager.showNotification(`Reporte "${reportName}" eliminado`, 'success');
    }
}

// Funciones de órdenes
function viewOrderDetails(orderId) {
    window.authManager.showNotification(`Viendo detalles de ${orderId}`, 'info');
}

function reprintOrder(orderId) {
    window.authManager.showNotification(`Reimprimiendo ${orderId}`, 'info');
}

// Actualizadores de gráficas
function updateSalesChart() {
    window.authManager.showNotification('Actualizando gráfica de ventas', 'info');
}

function updateProductsChart() {
    window.authManager.showNotification('Actualizando gráfica de productos', 'info');
}

function updateHoursChart() {
    window.authManager.showNotification('Actualizando gráfica por horas', 'info');
}

function updateWaitersChart() {
    window.authManager.showNotification('Actualizando gráfica de meseros', 'info');
}

function toggleReportSections() {
    const reportType = document.getElementById('reportType').value;
    window.authManager.showNotification(`Cambiando a modo: ${reportType}`, 'info');
}

// Registrar el renderizador
window.screenRenderers = window.screenRenderers || {};
window.screenRenderers.reports = renderReportsScreen;

console.log('✅ Módulo de Reportes Premium cargado correctamente');