// ==================== CONEXIÓN ENTRE TUS ARCHIVOS EXISTENTES ====================
// Este archivo conecta todos tus módulos sin cambiar tu código

// ==================== VARIABLES GLOBALES DE CONEXIÓN ====================

// 1. SISTEMA DE RESERVAS → MENÚ
window.reservationToMenu = {
    // Cuando se confirma una reserva, guardarla para el menú
    activeReservation: null,
    
    setActiveReservation: function(reservation) {
        this.activeReservation = reservation;
        localStorage.setItem('activeReservation', JSON.stringify(reservation));
        
        // Notificar al sistema de menú
        if (window.menuSystem) {
            window.menuSystem.setReservation(reservation);
        }
        
        // Mostrar notificación
        this.showNotification(`Reserva confirmada para Mesa ${reservation.tableNumber}`, 'success');
        
        // Redirigir automáticamente al menú si es cliente
        if (window.authManager?.currentUser?.role === 'customer') {
            setTimeout(() => {
                if (typeof showScreen === 'function') {
                    showScreen('menu');
                }
            }, 1500);
        }
    },
    
    getActiveReservation: function() {
        if (!this.activeReservation) {
            const saved = localStorage.getItem('activeReservation');
            if (saved) {
                this.activeReservation = JSON.parse(saved);
            }
        }
        return this.activeReservation;
    },
    
    clearReservation: function() {
        this.activeReservation = null;
        localStorage.removeItem('activeReservation');
    },
    
    showNotification: function(message, type) {
        if (window.showStableNotification) {
            window.showStableNotification(message, type, 3000);
        }
    }
};

// 2. MENÚ → CARRITO → COCINA
window.menuToKitchen = {
    // Conectar el pedido del menú a la cocina
    currentOrder: null,
    
    sendOrderToKitchen: function(order) {
        this.currentOrder = order;
        
        // Guardar en localStorage
        localStorage.setItem('kitchenOrders', JSON.stringify(
            JSON.parse(localStorage.getItem('kitchenOrders') || '[]').concat([order])
        ));
        
        // Crear notificación para cocina
        const notification = {
            id: Date.now(),
            type: 'new_order',
            orderId: order.id,
            tableNumber: order.tableNumber,
            message: `Nuevo pedido para Mesa ${order.tableNumber}`,
            items: order.items.length,
            time: new Date().toLocaleTimeString(),
            read: false
        };
        
        // Guardar notificación
        const notifications = JSON.parse(localStorage.getItem('kitchenNotifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('kitchenNotifications', JSON.stringify(notifications));
        
        // Notificar si la cocina está activa
        if (window.kitchenSystem) {
            window.kitchenSystem.addOrder(order);
            window.kitchenSystem.addNotification(notification);
        }
        
        // Mostrar notificación
        this.showNotification(`Pedido enviado a cocina`, 'success');
    },
    
    getKitchenOrders: function() {
        return JSON.parse(localStorage.getItem('kitchenOrders') || '[]');
    },
    
    getKitchenNotifications: function() {
        return JSON.parse(localStorage.getItem('kitchenNotifications') || '[]');
    },
    
    markNotificationRead: function(notificationId) {
        let notifications = this.getKitchenNotifications();
        notifications = notifications.map(n => {
            if (n.id === notificationId) {
                n.read = true;
            }
            return n;
        });
        localStorage.setItem('kitchenNotifications', JSON.stringify(notifications));
    },
    
    updateOrderStatus: function(orderId, status) {
        let orders = this.getKitchenOrders();
        orders = orders.map(order => {
            if (order.id === orderId) {
                order.status = status;
                
                // Notificar al cliente si el pedido está listo
                if (status === 'ready' && window.showStableNotification) {
                    const reservation = window.reservationToMenu.getActiveReservation();
                    if (reservation && reservation.tableNumber === order.tableNumber) {
                        window.showStableNotification(
                            `¡Tu pedido para Mesa ${order.tableNumber} está listo!`,
                            'success',
                            5000
                        );
                    }
                }
            }
            return order;
        });
        localStorage.setItem('kitchenOrders', JSON.stringify(orders));
    },
    
    showNotification: function(message, type) {
        if (window.showStableNotification) {
            window.showStableNotification(message, type, 3000);
        }
    }
};

// 3. COCINA → CLIENTE (Verificación de tiempo)
window.kitchenToClient = {
    // Sistema de verificación de tiempo de entrega
    pendingVerifications: [],
    
    requestTimeVerification: function(orderId, tableNumber, estimatedTime, actualTime) {
        const verification = {
            id: Date.now(),
            orderId,
            tableNumber,
            estimatedTime,
            actualTime,
            onTime: actualTime <= estimatedTime,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        this.pendingVerifications.push(verification);
        localStorage.setItem('timeVerifications', JSON.stringify(this.pendingVerifications));
        
        // Mostrar notificación al cliente
        if (window.showStableNotification) {
            const message = verification.onTime 
                ? `¡Tu pedido llegó a tiempo! (${actualTime} min)`
                : `Pedido llegó con retraso: ${actualTime} min (estimado: ${estimatedTime} min)`;
            
            window.showStableNotification(message, verification.onTime ? 'success' : 'warning', 5000);
        }
        
        return verification;
    },
    
    getPendingVerifications: function() {
        return JSON.parse(localStorage.getItem('timeVerifications') || '[]');
    },
    
    confirmDeliveryTime: function(verificationId, confirmed) {
        let verifications = this.getPendingVerifications();
        verifications = verifications.map(v => {
            if (v.id === verificationId) {
                v.status = confirmed ? 'confirmed' : 'rejected';
                v.confirmedAt = new Date().toISOString();
                
                // Si el cliente rechaza (dice que no llegó a tiempo)
                if (!confirmed) {
                    // Enviar notificación a cocina
                    const kitchenNotification = {
                        id: Date.now(),
                        type: 'time_dispute',
                        orderId: v.orderId,
                        tableNumber: v.tableNumber,
                        message: `Cliente disputó tiempo de entrega: ${v.actualTime} min vs ${v.estimatedTime} min estimados`,
                        requiresAction: true
                    };
                    
                    let notifications = JSON.parse(localStorage.getItem('kitchenNotifications') || '[]');
                    notifications.push(kitchenNotification);
                    localStorage.setItem('kitchenNotifications', JSON.stringify(notifications));
                }
            }
            return v;
        });
        
        localStorage.setItem('timeVerifications', JSON.stringify(verifications));
        
        return true;
    }
};

// 4. DASHBOARD → REPORTES (Conexión de datos)
window.dashboardToReports = {
    // Conectar datos del dashboard a los reportes
    statistics: {
        dailySales: 0,
        totalOrders: 0,
        averagePreparationTime: 0,
        customerSatisfaction: 0,
        popularItems: [],
        peakHours: []
    },
    
    collectData: function() {
        // Recolectar datos de todos los sistemas
        const orders = window.menuToKitchen.getKitchenOrders();
        const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        const verifications = window.kitchenToClient.getPendingVerifications();
        
        // Calcular estadísticas
        this.statistics = {
            dailySales: this.calculateDailySales(orders),
            totalOrders: orders.length,
            averagePreparationTime: this.calculateAverageTime(orders),
            customerSatisfaction: this.calculateSatisfaction(verifications),
            popularItems: this.getPopularItems(orders),
            peakHours: this.getPeakHours(orders),
            totalReservations: reservations.length,
            availableTables: this.getAvailableTables(),
            revenueToday: this.calculateRevenueToday(orders)
        };
        
        localStorage.setItem('dashboardStats', JSON.stringify(this.statistics));
        return this.statistics;
    },
    
    calculateDailySales: function(orders) {
        const today = new Date().toDateString();
        return orders
            .filter(order => new Date(order.createdAt).toDateString() === today)
            .reduce((sum, order) => sum + (order.total || 0), 0);
    },
    
    calculateAverageTime: function(orders) {
        const completedOrders = orders.filter(o => o.status === 'ready');
        if (completedOrders.length === 0) return 0;
        
        const totalTime = completedOrders.reduce((sum, order) => {
            return sum + (order.items?.reduce((itemSum, item) => 
                itemSum + (item.actualTime || 0), 0) || 0);
        }, 0);
        
        return Math.round(totalTime / completedOrders.length);
    },
    
    calculateSatisfaction: function(verifications) {
        const confirmed = verifications.filter(v => v.status === 'confirmed' && v.onTime);
        if (verifications.length === 0) return 100;
        return Math.round((confirmed.length / verifications.length) * 100);
    },
    
    getPopularItems: function(orders) {
        const itemCount = {};
        orders.forEach(order => {
            order.items?.forEach(item => {
                itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
            });
        });
        
        return Object.entries(itemCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));
    },
    
    getPeakHours: function(orders) {
        const hourCount = {};
        orders.forEach(order => {
            const hour = new Date(order.createdAt).getHours();
            hourCount[hour] = (hourCount[hour] || 0) + 1;
        });
        
        return Object.entries(hourCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([hour]) => `${hour}:00`);
    },
    
    getAvailableTables: function() {
        const tables = JSON.parse(localStorage.getItem('tables') || '[]');
        return tables.filter(table => table.status === 'available').length;
    },
    
    calculateRevenueToday: function(orders) {
        const today = new Date().toDateString();
        return orders
            .filter(order => new Date(order.createdAt).toDateString() === today)
            .reduce((sum, order) => sum + (order.total || 0), 0);
    },
    
    generateReport: function() {
        const stats = this.collectData();
        const report = {
            date: new Date().toLocaleDateString('es-ES'),
            time: new Date().toLocaleTimeString('es-ES'),
            statistics: stats,
            summary: this.generateSummary(stats)
        };
        
        localStorage.setItem('lastReport', JSON.stringify(report));
        return report;
    },
    
    generateSummary: function(stats) {
        return `Reporte del ${new Date().toLocaleDateString('es-ES')}
        
Ventas del día: L ${stats.dailySales.toFixed(2)}
Total de pedidos: ${stats.totalOrders}
Tiempo promedio de preparación: ${stats.averagePreparationTime} min
Satisfacción del cliente: ${stats.customerSatisfaction}%
Mesas disponibles: ${stats.availableTables}
Horas pico: ${stats.peakHours.join(', ')}
        
Productos más populares:
${stats.popularItems.map((item, i) => `${i+1}. ${item.name}: ${item.count} unidades`).join('\n')}`;
    },
    
    exportToPDF: function() {
        const report = this.generateReport();
        
        // Crear contenido para PDF
        const content = `
            <h1>Reporte del Restaurante</h1>
            <p>Fecha: ${report.date} ${report.time}</p>
            <hr>
            <h2>Estadísticas</h2>
            <p>Ventas del día: L ${report.statistics.dailySales.toFixed(2)}</p>
            <p>Total de pedidos: ${report.statistics.totalOrders}</p>
            <p>Tiempo promedio: ${report.statistics.averagePreparationTime} min</p>
            <p>Satisfacción: ${report.statistics.customerSatisfaction}%</p>
            <p>Mesas disponibles: ${report.statistics.availableTables}</p>
            <h3>Productos populares:</h3>
            <ul>
                ${report.statistics.popularItems.map(item => 
                    `<li>${item.name}: ${item.count} unidades</li>`
                ).join('')}
            </ul>
        `;
        
        // Aquí iría la lógica real para generar PDF
        // Por ahora solo mostramos una notificación
        if (window.showStableNotification) {
            window.showStableNotification('Reporte generado para PDF', 'success', 3000);
        }
        
        return content;
    }
};

// ==================== INICIALIZACIÓN DE CONEXIONES ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 Conectando todos los módulos del restaurante...');
    
    // 1. Verificar si hay reserva activa y mostrar en menú
    const activeReservation = window.reservationToMenu.getActiveReservation();
    if (activeReservation) {
        console.log('📅 Reserva activa encontrada:', activeReservation);
        
        // Si estamos en el menú, mostrar mensaje de reserva
        if (document.getElementById('menu')?.classList.contains('active')) {
            setTimeout(() => {
                if (window.showStableNotification) {
                    window.showStableNotification(
                        `Bienvenido a Mesa ${activeReservation.tableNumber}`,
                        'info',
                        4000
                    );
                }
            }, 1000);
        }
    }
    
    // 2. Verificar pedidos pendientes en cocina
    const kitchenOrders = window.menuToKitchen.getKitchenOrders();
    const pendingOrders = kitchenOrders.filter(o => o.status !== 'ready');
    if (pendingOrders.length > 0) {
        console.log('👨‍🍳 Pedidos pendientes en cocina:', pendingOrders.length);
    }
    
    // 3. Cargar estadísticas para dashboard
    if (document.getElementById('dashboard')?.classList.contains('active')) {
        setTimeout(() => {
            const stats = window.dashboardToReports.collectData();
            console.log('📊 Estadísticas cargadas:', stats);
        }, 500);
    }
    
    // 4. Configurar eventos de comunicación
    setupCommunicationEvents();
});

function setupCommunicationEvents() {
    // Evento para cuando se confirma una reserva
    document.addEventListener('reservationConfirmed', function(e) {
        const reservation = e.detail;
        window.reservationToMenu.setActiveReservation(reservation);
    });
    
    // Evento para cuando se envía un pedido
    document.addEventListener('orderSentToKitchen', function(e) {
        const order = e.detail;
        window.menuToKitchen.sendOrderToKitchen(order);
    });
    
    // Evento para actualizar estado de pedido
    document.addEventListener('orderStatusUpdated', function(e) {
        const { orderId, status } = e.detail;
        window.menuToKitchen.updateOrderStatus(orderId, status);
        
        // Si el pedido está listo, crear verificación de tiempo
        if (status === 'ready') {
            const orders = window.menuToKitchen.getKitchenOrders();
            const order = orders.find(o => o.id === orderId);
            if (order) {
                // Calcular tiempo total
                const totalTime = order.items?.reduce((sum, item) => 
                    sum + (item.actualTime || item.estimatedTime), 0) || 0;
                
                window.kitchenToClient.requestTimeVerification(
                    orderId,
                    order.tableNumber,
                    order.items?.[0]?.estimatedTime || 20,
                    totalTime
                );
            }
        }
    });
    
    // Evento para generar reporte
    document.addEventListener('generateReport', function() {
        const report = window.dashboardToReports.generateReport();
        console.log('📈 Reporte generado:', report);
    });
}

// ==================== FUNCIONES DE AYUDA PARA TUS ARCHIVOS ====================

// Para reservation.js - Cuando se confirma una reserva
function connectReservationToMenu(reservationData) {
    // Disparar evento
    const event = new CustomEvent('reservationConfirmed', {
        detail: reservationData
    });
    document.dispatchEvent(event);
    
    // También guardar directamente
    window.reservationToMenu.setActiveReservation(reservationData);
}

// Para menu.js - Cuando se hace un pedido
function connectMenuToKitchen(orderData) {
    // Disparar evento
    const event = new CustomEvent('orderSentToKitchen', {
        detail: orderData
    });
    document.dispatchEvent(event);
}

// Para kitchen.js - Cuando se actualiza el estado
function connectKitchenToClient(orderId, status) {
    // Disparar evento
    const event = new CustomEvent('orderStatusUpdated', {
        detail: { orderId, status }
    });
    document.dispatchEvent(event);
}

// Para dashboard.js - Obtener datos conectados
function getConnectedDashboardData() {
    return window.dashboardToReports.collectData();
}

// ==================== INYECTAR FUNCIONES EN TUS ARCHIVOS ====================
// Estas funciones estarán disponibles en todos tus archivos

window.connectReservationToMenu = connectReservationToMenu;
window.connectMenuToKitchen = connectMenuToKitchen;
window.connectKitchenToClient = connectKitchenToClient;
window.getConnectedDashboardData = getConnectedDashboardData;
window.exportReportToPDF = () => window.dashboardToReports.exportToPDF();

console.log('✅ Sistema de conexión cargado - Todos los módulos están conectados');