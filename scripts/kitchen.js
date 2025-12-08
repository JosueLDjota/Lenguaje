// ==================== SISTEMA DE COCINA PREMIUM ====================
function renderKitchenScreen() {
    const screen = document.getElementById('kitchen');
    if (!screen) return;

    // Verificar permisos
    if (!AppState.auth.isAuthenticated || !['admin', 'kitchen'].includes(AppState.auth.currentUser.role)) {
        screen.innerHTML = `
            <div class="access-denied-container">
                <div class="access-denied-card">
                    <div class="access-denied-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h2>Acceso Restringido</h2>
                    <p>Solo personal de cocina puede acceder a esta área</p>
                    <button onclick="showScreen('login')" class="btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                    </button>
                </div>
            </div>
        `;
        return;
    }

    // 1. CARGAR PEDIDOS DESDE LOCALSTORAGE (NUEVA FUNCIONALIDAD)
    cargarPedidosCocina();
    
    const user = AppState.auth.currentUser;
    const orders = AppState.kitchen.activeOrders.filter(o => o.status !== 'ready');
    const notifications = AppState.kitchen.notifications.filter(n => !n.read);
    const stats = AppState.kitchen.preparationStats;

    screen.innerHTML = `
        <div class="kitchen-container">
            <!-- Header -->
            <header class="kitchen-header">
                <div class="header-content">
                    <div class="header-info">
                        <h1 class="kitchen-title">
                            <i class="fas fa-utensils"></i>
                            Área de Cocina
                        </h1>
                        <p class="kitchen-subtitle">Bienvenido, ${user.name}</p>
                    </div>
                    <div class="header-stats">
                        <div class="stat-badge">
                            <i class="fas fa-clock"></i>
                            <span>${stats.averageTime} min</span>
                            <small>Promedio</small>
                        </div>
                        <div class="stat-badge ${stats.onTimePercentage > 80 ? 'success' : stats.onTimePercentage > 60 ? 'warning' : 'danger'}">
                            <i class="fas fa-check-circle"></i>
                            <span>${stats.onTimePercentage}%</span>
                            <small>En tiempo</small>
                        </div>
                        <div class="stat-badge">
                            <i class="fas fa-bell"></i>
                            <span class="notification-count">${notifications.length}</span>
                            <small>Alertas</small>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Contenido Principal -->
            <main class="kitchen-main">
                <div class="kitchen-grid">
                    <!-- SECCIÓN DE PEDIDOS DESDE LOCALSTORAGE -->
                    <section class="orders-section">
                        <div class="section-header">
                            <h2>Pedidos del Sistema (${orders.length})</h2>
                            <button class="btn-refresh" onclick="cargarPedidosCocina(); renderKitchenScreen()">
                                <i class="fas fa-sync-alt"></i> Actualizar
                            </button>
                        </div>
                        
                        ${orders.length === 0 ? `
                            <div class="empty-state">
                                <div class="empty-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <h3>No hay pedidos pendientes</h3>
                                <p>Todos los pedidos están completos</p>
                            </div>
                        ` : `
                            <div class="orders-grid">
                                ${orders.map(order => renderKitchenOrder(order)).join('')}
                            </div>
                        `}
                    </section>

                    <!-- SECCIÓN DE PEDIDOS CARGADOS -->
                    <section class="loaded-orders-section">
                        <div class="section-header">
                            <h2><i class="fas fa-database"></i> Pedidos Cargados</h2>
                            <button class="btn-refresh" onclick="cargarPedidosCocina()">
                                <i class="fas fa-redo"></i> Recargar
                            </button>
                        </div>
                        <div class="pedidos-container" id="pedidosContainer">
                            <!-- Aquí se cargarán los pedidos -->
                        </div>
                    </section>

                    <!-- Panel de Control -->
                    <section class="control-section">
                        <!-- Estado de Chefs -->
                        <div class="chefs-card">
                            <h3>Estado del Personal</h3>
                            <div class="chefs-list">
                                ${AppState.kitchen.chefs.map(chef => `
                                    <div class="chef-item ${chef.status}">
                                        <div class="chef-avatar">
                                            ${chef.name.charAt(0)}
                                        </div>
                                        <div class="chef-info">
                                            <h4>${chef.name}</h4>
                                            <p class="chef-status">${chef.status === 'available' ? 'Disponible' : 'Preparando pedido'}</p>
                                            ${chef.currentOrder ? `
                                                <p class="chef-order">Orden #${chef.currentOrder}</p>
                                            ` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Notificaciones -->
                        ${notifications.length > 0 ? `
                            <div class="notifications-card">
                                <h3>Alertas (${notifications.length})</h3>
                                <div class="notifications-list">
                                    ${notifications.map(notification => renderKitchenNotification(notification)).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Acciones Rápidas -->
                        <div class="quick-actions">
                            <h3>Acciones Rápidas</h3>
                            <div class="actions-grid">
                                <button class="action-btn" onclick="showAllOrders()">
                                    <i class="fas fa-list"></i>
                                    <span>Ver Todos</span>
                                </button>
                                <button class="action-btn" onclick="markAllNotificationsRead()">
                                    <i class="fas fa-check-double"></i>
                                    <span>Marcar Leídos</span>
                                </button>
                                <button class="action-btn" onclick="printKitchenReport()">
                                    <i class="fas fa-print"></i>
                                    <span>Imprimir</span>
                                </button>
                                <button class="action-btn" onclick="cargarPedidosCocina(); window.showStableNotification('Pedidos recargados', 'success')">
                                    <i class="fas fa-sync-alt"></i>
                                    <span>Recargar Pedidos</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <!-- Barra de Estado -->
            <footer class="kitchen-footer">
                <div class="footer-content">
                    <div class="time-display">
                        <i class="fas fa-clock"></i>
                        <span id="kitchen-time">${new Date().toLocaleTimeString('es-ES')}</span>
                    </div>
                    <div class="order-counter">
                        <i class="fas fa-utensils"></i>
                        <span>${orders.length} pedidos en proceso</span>
                    </div>
                    ${window.kitchenSystem.getUrgentOrders().length > 0 ? `
                        <div class="urgent-alerts">
                            <div class="urgent-badge pulse">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span>${window.kitchenSystem.getUrgentOrders().length} urgentes</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </footer>
        </div>
    `;

    // Cargar pedidos al renderizar
    setTimeout(() => {
        cargarPedidosCocina();
    }, 100);

    // Inicializar reloj
    updateKitchenTime();
    initializeKitchenEvents();
}

// ==================== FUNCIONES PARA CARGAR PEDIDOS DESDE LOCALSTORAGE ====================
function cargarPedidosCocina() {
    // 1. Cargar pedidos desde localStorage
    const pedidosGuardados = JSON.parse(localStorage.getItem('pedidosCocina') || '[]');
    
    // 2. Mostrar en la pantalla de cocina
    const contenedor = document.getElementById('pedidosContainer');
    
    if (contenedor && pedidosGuardados.length > 0) {
        contenedor.innerHTML = pedidosGuardados.map(pedido => `
            <div class="pedido-cocina" id="pedido-${pedido.id}">
                <div class="pedido-header">
                    <h3>🍽️ Pedido ${pedido.id}</h3>
                    <div class="pedido-status">
                        <span class="status-badge status-${pedido.estado || 'pendiente'}">
                            ${pedido.estado || 'Pendiente'}
                        </span>
                    </div>
                </div>
                
                <div class="pedido-info">
                    <div class="info-row">
                        <i class="fas fa-chair"></i>
                        <span><strong>Mesa:</strong> ${pedido.mesaNumero}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-user"></i>
                        <span><strong>Cliente:</strong> ${pedido.cliente}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-clock"></i>
                        <span><strong>Hora:</strong> ${pedido.hora}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-money-bill-wave"></i>
                        <span><strong>Total:</strong> L ${pedido.total.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="items-pedido">
                    <h4>Items del Pedido:</h4>
                    ${pedido.items.map(item => `
                        <div class="item-pedido">
                            <div class="item-info">
                                <span class="item-nombre">${item.nombre}</span>
                                <span class="item-cantidad">${item.cantidad}x</span>
                            </div>
                            <div class="item-subtotal">
                                L ${item.total.toFixed(2)}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                ${pedido.notas ? `
                    <div class="pedido-notas">
                        <i class="fas fa-sticky-note"></i>
                        <span>${pedido.notas}</span>
                    </div>
                ` : ''}
                
                <div class="acciones-cocina">
                    <button class="btn-preparar" onclick="prepararPedido('${pedido.id}')">
                        <i class="fas fa-fire"></i> Preparar
                    </button>
                    <button class="btn-listo" onclick="pedidoListo('${pedido.id}')">
                        <i class="fas fa-check"></i> Listo
                    </button>
                    <button class="btn-detalles" onclick="verDetallesPedido('${pedido.id}')">
                        <i class="fas fa-eye"></i> Detalles
                    </button>
                </div>
                
                <div class="pedido-timestamp">
                    <small>
                        <i class="fas fa-calendar"></i>
                        ${new Date(pedido.timestamp || new Date()).toLocaleString('es-ES')}
                    </small>
                </div>
            </div>
        `).join('');
        
        // Actualizar contador en la interfaz
        const contadorElemento = document.querySelector('.pedido-counter');
        if (contadorElemento) {
            contadorElemento.textContent = `(${pedidosGuardados.length})`;
        }
    } else if (contenedor) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-inbox"></i>
                </div>
                <h3>No hay pedidos cargados</h3>
                <p>Los pedidos aparecerán aquí cuando se realicen desde el menú</p>
                <button class="btn-primary" onclick="simularPedidoPrueba()">
                    <i class="fas fa-plus"></i> Crear Pedido de Prueba
                </button>
            </div>
        `;
    }
}

// FUNCIONES PARA LA COCINA - NUEVAS FUNCIONES
function prepararPedido(pedidoId) {
    showNotification(`👨‍🍳 Preparando pedido ${pedidoId}`, 'info');
    
    // Actualizar estado en localStorage
    const pedidos = JSON.parse(localStorage.getItem('pedidosCocina') || '[]');
    const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);
    
    if (pedidoIndex !== -1) {
        pedidos[pedidoIndex].estado = 'preparando';
        pedidos[pedidoIndex].inicioPreparacion = new Date().toISOString();
        localStorage.setItem('pedidosCocina', JSON.stringify(pedidos));
        
        // Actualizar interfaz
        const pedidoElement = document.getElementById(`pedido-${pedidoId}`);
        if (pedidoElement) {
            const statusBadge = pedidoElement.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = 'Preparando';
                statusBadge.className = 'status-badge status-preparando';
            }
        }
    }
    
    // Guardar en notificaciones del sistema
    const notificacion = {
        id: Date.now(),
        tipo: 'preparacion',
        mensaje: `Pedido ${pedidoId} en preparación`,
        hora: new Date().toLocaleTimeString(),
        pedidoId: pedidoId
    };
    
    // Guardar en datos compartidos
    if (window.datosCompartidos) {
        window.datosCompartidos.notificaciones = window.datosCompartidos.notificaciones || [];
        window.datosCompartidos.notificaciones.push(notificacion);
    }
    
    // También guardar en AppState
    if (AppState.kitchen && AppState.kitchen.notifications) {
        AppState.kitchen.notifications.push({
            id: notificacion.id,
            type: 'new_order',
            message: notificacion.mensaje,
            time: notificacion.hora,
            read: false,
            orderId: pedidoId
        });
    }
}

function pedidoListo(pedidoId) {
    showNotification(`✅ Pedido ${pedidoId} listo para servir`, 'success');
    
    // Actualizar estado en localStorage
    const pedidos = JSON.parse(localStorage.getItem('pedidosCocina') || '[]');
    const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);
    
    if (pedidoIndex !== -1) {
        pedidos[pedidoIndex].estado = 'listo';
        pedidos[pedidoIndex].finPreparacion = new Date().toISOString();
        pedidos[pedidoIndex].tiempoPreparacion = 
            Math.round((new Date(pedidos[pedidoIndex].finPreparacion) - 
                       new Date(pedidos[pedidoIndex].inicioPreparacion || new Date())) / 60000);
        localStorage.setItem('pedidosCocina', JSON.stringify(pedidos));
        
        // Actualizar interfaz
        const pedidoElement = document.getElementById(`pedido-${pedidoId}`);
        if (pedidoElement) {
            const statusBadge = pedidoElement.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = 'Listo';
                statusBadge.className = 'status-badge status-listo';
            }
            
            // Deshabilitar botones
            const botones = pedidoElement.querySelectorAll('.acciones-cocina button');
            botones.forEach(boton => {
                if (!boton.classList.contains('btn-detalles')) {
                    boton.disabled = true;
                    boton.style.opacity = '0.5';
                }
            });
        }
    }
    
    // Crear notificación para el cliente
    const notificacionCliente = {
        id: Date.now(),
        tipo: 'pedido_listo',
        mensaje: `Tu pedido ${pedidoId} está listo`,
        hora: new Date().toLocaleTimeString(),
        pedidoId: pedidoId,
        mesa: pedidos[pedidoIndex]?.mesaNumero || 'Desconocida'
    };
    
    // Guardar para el cliente
    localStorage.setItem('ultimaNotificacion', JSON.stringify(notificacionCliente));
    
    // También en notificaciones del sistema
    const notificacionesSistema = JSON.parse(localStorage.getItem('notificacionesSistema') || '[]');
    notificacionesSistema.push({
        ...notificacionCliente,
        tipo: 'pedido_listo_cocina',
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('notificacionesSistema', JSON.stringify(notificacionesSistema));
    
    // Emitir evento para actualizar otras pantallas
    document.dispatchEvent(new CustomEvent('pedidoListo', {
        detail: { pedidoId, notificacion: notificacionCliente }
    }));
}

function verDetallesPedido(pedidoId) {
    const pedidos = JSON.parse(localStorage.getItem('pedidosCocina') || '[]');
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    if (!pedido) {
        showNotification('Pedido no encontrado', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content pedido-detalles-modal">
            <div class="modal-header">
                <h3><i class="fas fa-info-circle"></i> Detalles del Pedido ${pedidoId}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="detalles-grid">
                    <div class="detalle-item">
                        <i class="fas fa-id-card"></i>
                        <div>
                            <strong>ID del Pedido</strong>
                            <p>${pedido.id}</p>
                        </div>
                    </div>
                    <div class="detalle-item">
                        <i class="fas fa-chair"></i>
                        <div>
                            <strong>Mesa</strong>
                            <p>${pedido.mesaNumero}</p>
                        </div>
                    </div>
                    <div class="detalle-item">
                        <i class="fas fa-user"></i>
                        <div>
                            <strong>Cliente</strong>
                            <p>${pedido.cliente}</p>
                        </div>
                    </div>
                    <div class="detalle-item">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <strong>Fecha y Hora</strong>
                            <p>${pedido.hora}</p>
                        </div>
                    </div>
                    <div class="detalle-item">
                        <i class="fas fa-tag"></i>
                        <div>
                            <strong>Estado</strong>
                            <p><span class="status-badge status-${pedido.estado || 'pendiente'}">${pedido.estado || 'Pendiente'}</span></p>
                        </div>
                    </div>
                    <div class="detalle-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <div>
                            <strong>Total</strong>
                            <p>L ${pedido.total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                
                <div class="detalles-items">
                    <h4><i class="fas fa-utensils"></i> Items del Pedido</h4>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pedido.items.map(item => `
                                <tr>
                                    <td>${item.nombre}</td>
                                    <td>${item.cantidad}</td>
                                    <td>L ${(item.total / item.cantidad).toFixed(2)}</td>
                                    <td>L ${item.total.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3"><strong>Total</strong></td>
                                <td><strong>L ${pedido.total.toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                ${pedido.notas ? `
                    <div class="detalles-notas">
                        <h4><i class="fas fa-sticky-note"></i> Notas Especiales</h4>
                        <p>${pedido.notas}</p>
                    </div>
                ` : ''}
                
                ${pedido.inicioPreparacion ? `
                    <div class="detalles-tiempo">
                        <h4><i class="fas fa-clock"></i> Tiempos de Preparación</h4>
                        <div class="tiempos-grid">
                            <div class="tiempo-item">
                                <strong>Inicio:</strong>
                                <span>${new Date(pedido.inicioPreparacion).toLocaleTimeString()}</span>
                            </div>
                            ${pedido.finPreparacion ? `
                                <div class="tiempo-item">
                                    <strong>Fin:</strong>
                                    <span>${new Date(pedido.finPreparacion).toLocaleTimeString()}</span>
                                </div>
                                <div class="tiempo-item">
                                    <strong>Duración:</strong>
                                    <span>${pedido.tiempoPreparacion || 0} minutos</span>
                                </div>
                            ` : `
                                <div class="tiempo-item">
                                    <strong>Tiempo transcurrido:</strong>
                                    <span>${Math.round((new Date() - new Date(pedido.inicioPreparacion)) / 60000)} minutos</span>
                                </div>
                            `}
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i> Cerrar
                </button>
                ${pedido.estado !== 'listo' ? `
                    <button class="btn-primary" onclick="pedidoListo('${pedidoId}'); this.closest('.modal-overlay').remove()">
                        <i class="fas fa-check"></i> Marcar como Listo
                    </button>
                ` : ''}
                <button class="btn-info" onclick="imprimirPedido('${pedidoId}')">
                    <i class="fas fa-print"></i> Imprimir
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('show'), 10);
    
    const closeModalHandler = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModalHandler);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
}

function imprimirPedido(pedidoId) {
    const pedidos = JSON.parse(localStorage.getItem('pedidosCocina') || '[]');
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    if (!pedido) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Pedido ${pedidoId} - Cocina</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
                .info-item { margin-bottom: 10px; }
                .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .items-table th { background-color: #f4f4f4; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
                .timestamp { font-size: 11px; color: #999; margin-top: 5px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Sabor & Arte - Cocina</h1>
                <h2>Pedido: ${pedidoId}</h2>
                <div class="timestamp">Impreso: ${new Date().toLocaleString()}</div>
            </div>
            
            <div class="info-grid">
                <div class="info-item"><strong>Mesa:</strong> ${pedido.mesaNumero}</div>
                <div class="info-item"><strong>Cliente:</strong> ${pedido.cliente}</div>
                <div class="info-item"><strong>Hora:</strong> ${pedido.hora}</div>
                <div class="info-item"><strong>Estado:</strong> ${pedido.estado}</div>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${pedido.items.map(item => `
                        <tr>
                            <td>${item.nombre}</td>
                            <td>${item.cantidad}</td>
                            <td>L ${item.total.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2"><strong>TOTAL</strong></td>
                        <td><strong>L ${pedido.total.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
            
            ${pedido.notas ? `
                <div class="notas">
                    <h3>Notas Especiales:</h3>
                    <p>${pedido.notas}</p>
                </div>
            ` : ''}
            
            <div class="footer">
                <p>Sabor & Arte Restaurante</p>
                <p>Sistema de Cocina - Impresión ${new Date().getFullYear()}</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function simularPedidoPrueba() {
    const pedidoPrueba = {
        id: 'PED-' + Date.now(),
        mesaNumero: Math.floor(Math.random() * 20) + 1,
        cliente: 'Cliente de Prueba',
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        total: Math.random() * 500 + 50,
        estado: 'pendiente',
        timestamp: new Date().toISOString(),
        items: [
            {
                nombre: 'Filete Mignon',
                cantidad: 2,
                total: 120.00
            },
            {
                nombre: 'Ensalada César',
                cantidad: 1,
                total: 35.50
            },
            {
                nombre: 'Vino Tinto',
                cantidad: 1,
                total: 45.75
            }
        ],
        notas: 'Sin cebolla, bien cocido'
    };
    
    // Guardar el pedido
    const pedidos = JSON.parse(localStorage.getItem('pedidosCocina') || '[]');
    pedidos.push(pedidoPrueba);
    localStorage.setItem('pedidosCocina', JSON.stringify(pedidos));
    
    showNotification(`Pedido de prueba ${pedidoPrueba.id} creado`, 'success');
    cargarPedidosCocina();
}

// ==================== FUNCIONALIDADES ORIGINALES ====================
function renderKitchenOrder(order) {
    const completedItems = order.items.filter(i => i.status === 'ready').length;
    const totalItems = order.items.length;
    const progress = Math.round((completedItems / totalItems) * 100);

    return `
        <div class="kitchen-order-card" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-meta">
                    <h3 class="order-title">Orden #${order.id}</h3>
                    <span class="order-time">${new Date(order.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="order-status">
                    <span class="status-badge status-${order.status}">${order.status}</span>
                </div>
            </div>
            
            <div class="order-info">
                <div class="order-table">
                    <i class="fas fa-chair"></i>
                    <span>Mesa ${order.tableNumber}</span>
                </div>
                <div class="order-customer">
                    <i class="fas fa-user"></i>
                    <span>${order.customerName}</span>
                </div>
            </div>
            
            <!-- Barra de Progreso -->
            <div class="order-progress">
                <div class="progress-header">
                    <span>Progreso: ${progress}%</span>
                    <span>${completedItems}/${totalItems}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            
            <!-- Items -->
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item ${item.status}" data-item-id="${item.id}">
                        <div class="item-header">
                            <div class="item-info">
                                <h4>${item.name}</h4>
                                <div class="item-meta">
                                    <span class="item-quantity">${item.quantity}x</span>
                                    <span class="item-time">${item.estimatedTime} min</span>
                                </div>
                            </div>
                            <div class="item-actions">
                                ${item.status === 'pending' ? `
                                    <button class="btn-start" onclick="startItemPreparation('${order.id}', ${item.id})">
                                        <i class="fas fa-play"></i> Iniciar
                                    </button>
                                ` : item.status === 'preparing' ? `
                                    <button class="btn-ready" onclick="markItemReady('${order.id}', ${item.id})">
                                        <i class="fas fa-check"></i> Listo
                                    </button>
                                    <button class="btn-extend" onclick="showTimeExtensionModal('${order.id}', ${item.id})">
                                        <i class="fas fa-clock"></i> Extender
                                    </button>
                                ` : `
                                    <span class="item-ready">
                                        <i class="fas fa-check-circle"></i> Listo
                                    </span>
                                `}
                            </div>
                        </div>
                        
                        ${item.specialRequests ? `
                            <div class="item-notes">
                                <i class="fas fa-sticky-note"></i>
                                <span>${item.specialRequests}</span>
                            </div>
                        ` : ''}
                        
                        ${item.status === 'preparing' ? `
                            <div class="item-timer">
                                <i class="fas fa-hourglass-half"></i>
                                <span>Tiempo: ${Math.floor((new Date() - new Date(item.startTime)) / 60000)} min</span>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            
            <!-- Acciones -->
            <div class="order-actions">
                <button class="btn-assign" onclick="assignOrderToChef('${order.id}')">
                    <i class="fas fa-user-chef"></i> Asignar Chef
                </button>
            </div>
        </div>
    `;
}

function renderKitchenNotification(notification) {
    let icon = 'fa-bell';
    let color = '#3b82f6';
    
    switch(notification.type) {
        case 'new_order': icon = 'fa-utensils'; color = '#10b981'; break;
        case 'delivery_delay': icon = 'fa-exclamation-triangle'; color = '#ef4444'; break;
        case 'time_extension_request': icon = 'fa-clock'; color = '#f59e0b'; break;
    }
    
    return `
        <div class="kitchen-notification" data-id="${notification.id}">
            <div class="notification-icon" style="background: ${color}20; color: ${color};">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-content">
                <p class="notification-message">${notification.message}</p>
                <div class="notification-meta">
                    <span class="notification-time">${notification.time}</span>
                </div>
            </div>
            <div class="notification-actions">
                <button class="btn-action-small" onclick="handleNotification(${notification.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `;
}

// ==================== FUNCIONALIDADES ORIGINALES ====================
function startItemPreparation(orderId, itemId) {
    window.kitchenSystem.startItemPreparation(orderId, itemId);
    renderKitchenScreen();
}

function markItemReady(orderId, itemId) {
    window.kitchenSystem.markItemReady(orderId, itemId);
    renderKitchenScreen();
}

function assignOrderToChef(orderId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content chef-modal">
            <div class="modal-header">
                <h3>Asignar Orden a Chef</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Selecciona un chef para la orden #${orderId}</p>
                <div class="chefs-selection">
                    ${AppState.kitchen.chefs.map(chef => `
                        <div class="chef-option ${chef.status === 'available' ? 'available' : 'busy'}" 
                             onclick="${chef.status === 'available' ? `assignChef('${orderId}', ${chef.id})` : ''}">
                            <div class="chef-avatar-lg">${chef.name.charAt(0)}</div>
                            <div class="chef-details">
                                <h4>${chef.name}</h4>
                                <p class="chef-status">${chef.status === 'available' ? '✅ Disponible' : '⏳ Ocupado'}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function assignChef(orderId, chefId) {
    if (window.kitchenSystem.assignToChef(orderId, chefId)) {
        document.querySelector('.modal-overlay')?.remove();
        renderKitchenScreen();
    }
}

function showTimeExtensionModal(orderId, itemId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content extension-modal">
            <div class="modal-header">
                <h3>Solicitar Extensión de Tiempo</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Minutos adicionales:</label>
                    <input type="number" id="extensionMinutes" class="form-input" min="5" max="60" value="15">
                </div>
                <div class="form-group">
                    <label>Razón:</label>
                    <textarea id="extensionReason" class="form-textarea" placeholder="Explicación..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                <button class="btn-primary" onclick="requestTimeExtension('${orderId}', ${itemId})">Solicitar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function requestTimeExtension(orderId, itemId) {
    const minutes = parseInt(document.getElementById('extensionMinutes').value);
    const reason = document.getElementById('extensionReason').value;
    
    if (!minutes || minutes < 5 || !reason.trim()) {
        window.showStableNotification('Completa todos los campos', 'error');
        return;
    }
    
    window.kitchenSystem.requestTimeExtension(orderId, itemId, minutes, reason);
    document.querySelector('.modal-overlay')?.remove();
    renderKitchenScreen();
}

function handleNotification(notificationId) {
    const notification = AppState.kitchen.notifications.find(n => n.id === notificationId);
    if (!notification) return;
    
    if (notification.type === 'delivery_delay') {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content delay-modal">
                <div class="modal-header">
                    <h3>Retraso Reportado</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="alert-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Mesa ${notification.tableNumber} reportó retraso en el pedido.</p>
                    </div>
                    
                    <div class="response-options">
                        <h4>¿Cuál es la situación?</h4>
                        <div class="option-group">
                            <label class="option-label">
                                <input type="radio" name="delayResponse" value="confirmed">
                                <span>✅ Confirmado - Hubo retraso</span>
                            </label>
                            <label class="option-label">
                                <input type="radio" name="delayResponse" value="false_alarm">
                                <span>⚠️ Falsa alarma</span>
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label>Comentarios:</label>
                            <textarea id="chefComments" class="form-textarea"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cerrar</button>
                    <button class="btn-primary" onclick="submitDelayResponse(${notificationId})">Enviar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    window.kitchenSystem.markNotificationRead(notificationId);
}

function submitDelayResponse(notificationId) {
    const response = document.querySelector('input[name="delayResponse"]:checked');
    const comments = document.getElementById('chefComments').value;
    
    if (!response) {
        window.showStableNotification('Selecciona una opción', 'error');
        return;
    }
    
    document.querySelector('.modal-overlay')?.remove();
    window.showStableNotification('Respuesta enviada', 'success');
}

function markAllNotificationsRead() {
    AppState.kitchen.notifications.forEach(n => n.read = true);
    window.kitchenSystem.saveKitchenData();
    renderKitchenScreen();
}

function printKitchenReport() {
    const report = {
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES'),
        chef: AppState.auth.currentUser.name,
        activeOrders: AppState.kitchen.activeOrders.filter(o => o.status !== 'ready').length,
        completedToday: AppState.menu.orderHistory.filter(o => 
            new Date(o.deliveredAt).toDateString() === new Date().toDateString()
        ).length,
        averageTime: AppState.kitchen.preparationStats.averageTime,
        onTimePercentage: AppState.kitchen.preparationStats.onTimePercentage,
        // Añadir datos de pedidos cargados
        pedidosCargados: JSON.parse(localStorage.getItem('pedidosCocina') || '[]').length,
        pedidosListos: JSON.parse(localStorage.getItem('pedidosCocina') || '[]').filter(p => p.estado === 'listo').length,
        pedidosEnProceso: JSON.parse(localStorage.getItem('pedidosCocina') || '[]').filter(p => p.estado === 'preparando').length
    };
    
    // Simular impresión
    window.showStableNotification('Reporte generado para impresión', 'success');
    console.log('📊 Reporte de cocina:', report);
}

function updateKitchenTime() {
    const timeElement = document.getElementById('kitchen-time');
    if (timeElement) {
        setInterval(() => {
            timeElement.textContent = new Date().toLocaleTimeString('es-ES');
        }, 1000);
    }
}

function initializeKitchenEvents() {
    document.querySelectorAll('.kitchen-order-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                const orderId = this.getAttribute('data-order-id');
                showOrderDetails(orderId);
            }
        });
    });
}

function showOrderDetails(orderId) {
    const order = AppState.kitchen.activeOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content order-details-modal">
            <div class="modal-header">
                <h3>Detalles de Orden #${order.id}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="order-summary">
                    <div class="summary-row">
                        <span>Mesa:</span>
                        <strong>${order.tableNumber}</strong>
                    </div>
                    <div class="summary-row">
                        <span>Cliente:</span>
                        <strong>${order.customerName}</strong>
                    </div>
                    <div class="summary-row">
                        <span>Total:</span>
                        <strong>${formatCurrency(order.total)}</strong>
                    </div>
                </div>
                
                <div class="order-items-details">
                    <h4>Items:</h4>
                    ${order.items.map(item => `
                        <div class="item-detail ${item.status}">
                            <div class="item-header">
                                <span class="item-name">${item.name}</span>
                                <span class="item-status">${item.status === 'pending' ? '🔄' : 
                                                         item.status === 'preparing' ? '👨‍🍳' : 
                                                         '✅'}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showAllOrders() {
    const pedidosCargados = JSON.parse(localStorage.getItem('pedidosCocina') || '[]');
    const ordenesSistema = AppState.kitchen.activeOrders;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content all-orders-modal">
            <div class="modal-header">
                <h3>Todos los Pedidos</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="tabs">
                    <button class="tab-btn active" onclick="switchTab(this, 'sistema')">Sistema (${ordenesSistema.length})</button>
                    <button class="tab-btn" onclick="switchTab(this, 'cargados')">Cargados (${pedidosCargados.length})</button>
                </div>
                
                <div id="tab-sistema" class="tab-content active">
                    <div class="orders-list">
                        ${ordenesSistema.map(order => `
                            <div class="order-list-item">
                                <div class="list-item-header">
                                    <span class="order-id">#${order.id}</span>
                                    <span class="order-status">${order.status}</span>
                                </div>
                                <div class="list-item-body">
                                    <span>Mesa ${order.tableNumber}</span>
                                    <span>${order.items.length} items</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div id="tab-cargados" class="tab-content">
                    <div class="orders-list">
                        ${pedidosCargados.map(pedido => `
                            <div class="order-list-item">
                                <div class="list-item-header">
                                    <span class="order-id">${pedido.id}</span>
                                    <span class="order-status status-${pedido.estado || 'pendiente'}">${pedido.estado || 'Pendiente'}</span>
                                </div>
                                <div class="list-item-body">
                                    <span>Mesa ${pedido.mesaNumero}</span>
                                    <span>${pedido.items?.length || 0} items</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Función para cambiar tabs
    window.switchTab = function(button, tabId) {
        // Remover active de todos los botones
        modal.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        // Remover active de todos los contenidos
        modal.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Activar el seleccionado
        button.classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    };
}

// Exportar funciones
window.renderKitchenScreen = renderKitchenScreen;
window.cargarPedidosCocina = cargarPedidosCocina;
window.prepararPedido = prepararPedido;
window.pedidoListo = pedidoListo;
window.verDetallesPedido = verDetallesPedido;
window.imprimirPedido = imprimirPedido;
window.simularPedidoPrueba = simularPedidoPrueba;

console.log('✅ Sistema de Cocina Cargado con Pedidos desde LocalStorage');