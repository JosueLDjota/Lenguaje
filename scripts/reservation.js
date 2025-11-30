// Pantalla de Reservas Mejorada
function renderReservationScreen() {
    const reservationScreen = document.getElementById('reservation');
    
    reservationScreen.innerHTML = `
        <div class="reservation-container">
            <header class="reservation-header">
                <div class="reservation-header-content">
                    <div class="reservation-header-left">
                        <button class="reservation-back-btn screen-btn" data-screen="welcome">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <div class="reservation-logo">
                            <div class="reservation-logo-icon">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <div class="reservation-logo-text">
                                <h1>Reserva tu Mesa</h1>
                                <p>Selecciona tu ubicación preferida</p>
                            </div>
                        </div>
                    </div>

                    <div class="reservation-stats">
                        <div class="stat">
                            <div class="stat-indicator available"></div>
                            <span class="stat-text"><span class="available-count">0</span> Disponibles</span>
                        </div>
                        <div class="stat">
                            <div class="stat-indicator reserved"></div>
                            <span class="stat-text"><span class="reserved-count">0</span> Reservadas</span>
                        </div>
                        <div class="stat">
                            <div class="stat-indicator occupied"></div>
                            <span class="stat-text"><span class="occupied-count">0</span> Ocupadas</span>
                        </div>
                    </div>
                </div>
            </header>

            <div class="reservation-content">
                <div class="reservation-grid">
                    <div class="restaurant-map">
                        <div class="map-header">
                            <h2>Plano del Restaurante</h2>
                            <p>Haz clic en una mesa disponible para ver más detalles</p>
                        </div>

                        <div class="map-container">
                            <!-- Elementos del restaurante -->
                            <div class="restaurant-elements">
                                <div class="windows"></div>
                                <div class="bar-area"></div>
                                <div class="kitchen"></div>
                                <div class="entrance"></div>
                            </div>

                            <!-- Grid de mesas -->
                            <div class="tables-grid"></div>
                        </div>
                    </div>

                    <div class="reservation-sidebar">
                        <div class="legend-card">
                            <h3 class="legend-header">Leyenda de Estados</h3>
                            <div class="legend-items">
                                <div class="legend-item available" data-status="available">
                                    <div class="legend-color available"></div>
                                    <div class="legend-text">
                                        <p>Disponible</p>
                                        <p>Seleccionable</p>
                                    </div>
                                </div>

                                <div class="legend-item reserved" data-status="reserved">
                                    <div class="legend-color reserved"></div>
                                    <div class="legend-text">
                                        <p>Reservada</p>
                                        <p>No disponible</p>
                                    </div>
                                </div>

                                <div class="legend-item occupied" data-status="occupied">
                                    <div class="legend-color occupied"></div>
                                    <div class="legend-text">
                                        <p>Ocupada</p>
                                        <p>Temporalmente</p>
                                    </div>
                                </div>

                                <div class="legend-item selected" data-status="selected">
                                    <div class="legend-color selected"></div>
                                    <div class="legend-text">
                                        <p>Seleccionada</p>
                                        <p>Tu elección</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="selected-table-card hidden">
                            <h3 class="selected-table-header">
                                <i class="fas fa-check-circle"></i>
                                Mesa Seleccionada
                            </h3>
                            <div class="selected-table-details">
                                <div class="table-detail">
                                    <p class="table-detail-label">Número de Mesa</p>
                                    <p class="table-detail-value table-number">0</p>
                                </div>
                                <div class="table-detail">
                                    <p class="table-detail-label">Capacidad</p>
                                    <p class="table-detail-value capacity">
                                        <i class="fas fa-users"></i>
                                        <span class="table-capacity">0</span> personas
                                    </p>
                                </div>
                                <div class="table-detail">
                                    <p class="table-detail-label">Ubicación</p>
                                    <p class="table-detail-value location">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <span class="table-location">-</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="reservation-actions">
                            <button class="confirm-reservation-btn" disabled>
                                <i class="fas fa-check-circle"></i>
                                <span>Confirmar Reserva</span>
                            </button>

                            <button class="back-to-menu-btn screen-btn" data-screen="welcome">
                                <i class="fas fa-arrow-left"></i>
                                <span>Volver al Menú Principal</span>
                            </button>
                        </div>

                        <div class="info-card">
                            <div class="info-content">
                                <i class="fas fa-clock info-icon"></i>
                                <div class="info-text">
                                    <p>Horarios disponibles</p>
                                    <p>12:00 PM - 11:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Configurar event listeners
    setupReservationEventListeners();
    
    // Renderizar mesas
    renderTables();
    
    // Iniciar animaciones
    startReservationAnimations();
}

function setupReservationEventListeners() {
    // Navegación
    document.querySelectorAll('.screen-btn').forEach(button => {
        button.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            if (screenId) {
                showScreen(screenId);
            }
        });
    });
    
    // Confirmar reserva
    const confirmBtn = document.querySelector('.confirm-reservation-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmReservation);
    }
    
    // Leyenda interactiva
    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            highlightTablesByStatus(status);
        });
    });
}

function startReservationAnimations() {
    // Animación de flotado para las mesas disponibles
    const availableTables = document.querySelectorAll('.table-btn.available');
    availableTables.forEach((table, index) => {
        table.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Efecto de partículas para el fondo
    createParticles();
}

function createParticles() {
    const container = document.querySelector('.reservation-container');
    const particlesCount = 15;
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float-particle ${8 + Math.random() * 4}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        const keyframes = `
            @keyframes float-particle {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }
        `;
        
        // Agregar keyframes si no existen
        if (!document.querySelector('#particle-animations')) {
            const style = document.createElement('style');
            style.id = 'particle-animations';
            style.textContent = keyframes;
            document.head.appendChild(style);
        }
        
        container.appendChild(particle);
    }
}

function renderTables() {
    const tablesContainer = document.querySelector('.tables-grid');
    const availableCount = document.querySelector('.available-count');
    const reservedCount = document.querySelector('.reserved-count');
    const occupiedCount = document.querySelector('.occupied-count');
    
    // Contar mesas por estado
    const availableTables = AppState.tables.filter(table => table.status === 'available').length;
    const reservedTables = AppState.tables.filter(table => table.status === 'reserved').length;
    const occupiedTables = AppState.tables.filter(table => table.status === 'occupied').length;
    
    // Actualizar contadores
    if (availableCount) availableCount.textContent = availableTables;
    if (reservedCount) reservedCount.textContent = reservedTables;
    if (occupiedCount) occupiedCount.textContent = occupiedTables;
    
    // Renderizar mesas
    if (tablesContainer) {
        tablesContainer.innerHTML = '';
        
        // Agrupar mesas por fila
        const tablesByRow = {};
        AppState.tables.forEach(table => {
            if (!tablesByRow[table.position.y]) {
                tablesByRow[table.position.y] = [];
            }
            tablesByRow[table.position.y].push(table);
        });
        
        // Renderizar cada fila
        Object.keys(tablesByRow).sort().forEach(row => {
            const rowTables = tablesByRow[row].sort((a, b) => a.position.x - b.position.x);
            
            rowTables.forEach(table => {
                const colSpan = table.shape === "rectangular" ? 2 : 1;
                const tableElement = document.createElement('div');
                tableElement.className = `table-container ${colSpan === 2 ? 'double' : ''}`;
                
                tableElement.innerHTML = `
                    <button class="table-btn ${getTableClasses(table)}" data-id="${table.id}">
                        <span class="table-number">${table.tableNumber}</span>
                        <div class="table-capacity">
                            <i class="fas fa-users"></i>
                            <span>${table.capacity}</span>
                        </div>
                        ${table.status === "available" && AppState.selectedTable?.id !== table.id ? `
                            <div class="available-indicator"></div>
                        ` : ''}
                        ${AppState.selectedTable?.id === table.id ? `
                            <div class="selected-indicator">
                                <span>✓</span>
                            </div>
                        ` : ''}
                    </button>
                `;
                
                tablesContainer.appendChild(tableElement);
            });
        });
        
        // Agregar event listeners a las mesas
        document.querySelectorAll('.table-btn').forEach(button => {
            button.addEventListener('click', function() {
                const tableId = parseInt(this.getAttribute('data-id'));
                selectTable(tableId);
            });
            
            // Efectos hover avanzados
            button.addEventListener('mouseenter', function() {
                if (this.classList.contains('available')) {
                    this.style.transform = 'scale(1.1) rotate(2deg)';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                if (this.classList.contains('available') && !this.classList.contains('selected')) {
                    this.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    // Actualizar panel de mesa seleccionada
    updateSelectedTablePanel();
}

function getTableClasses(table) {
    let classes = table.shape;
    
    if (AppState.selectedTable?.id === table.id) {
        classes += ' selected';
    } else {
        classes += ' ' + table.status;
    }
    
    return classes;
}

function selectTable(tableId) {
    const table = AppState.tables.find(t => t.id === tableId);
    
    if (table && table.status === 'available') {
        // Animación de deselección si hay una mesa seleccionada
        if (AppState.selectedTable) {
            const previousTable = document.querySelector(`.table-btn[data-id="${AppState.selectedTable.id}"]`);
            if (previousTable) {
                previousTable.classList.remove('selected');
            }
        }
        
        AppState.selectedTable = table;
        
        // Animación de selección
        const selectedTableElement = document.querySelector(`.table-btn[data-id="${tableId}"]`);
        if (selectedTableElement) {
            selectedTableElement.classList.add('selected');
            
            // Efecto de confeti
            createConfetti(selectedTableElement);
        }
        
        // Habilitar botón de confirmar reserva
        const confirmBtn = document.querySelector('.confirm-reservation-btn');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.classList.add('pulse');
            setTimeout(() => confirmBtn.classList.remove('pulse'), 2000);
        }
        
        // Mostrar popup de información
        showTablePopup(table);
        
        // Actualizar panel
        updateSelectedTablePanel();
    }
}

function highlightTablesByStatus(status) {
    const allTables = document.querySelectorAll('.table-btn');
    
    allTables.forEach(table => {
        table.classList.remove('highlighted');
        
        if (status === 'all' || table.classList.contains(status)) {
            table.classList.add('highlighted');
            
            // Efecto de resaltado
            const originalTransform = table.style.transform;
            table.style.transform = originalTransform + ' scale(1.15)';
            
            setTimeout(() => {
                if (!table.classList.contains('highlighted')) {
                    table.style.transform = originalTransform;
                }
            }, 1000);
        }
    });
    
    // Remover resaltado después de 2 segundos
    setTimeout(() => {
        allTables.forEach(table => {
            table.classList.remove('highlighted');
            if (!table.classList.contains('selected')) {
                table.style.transform = '';
            }
        });
    }, 2000);
}

function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const colors = ['#667eea', '#764ba2', '#48bb78', '#ed8936', '#f56565'];
    const confettiCount = 12;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${color};
            border-radius: 1px;
            pointer-events: none;
            z-index: 1000;
            left: ${centerX}px;
            top: ${centerY}px;
            animation: confetti-fall ${1 + Math.random()}s ease-out forwards;
        `;
        
        const angle = (i * 360) / confettiCount;
        const distance = 50 + Math.random() * 50;
        const radians = (angle * Math.PI) / 180;
        const endX = centerX + Math.cos(radians) * distance;
        const endY = centerY + Math.sin(radians) * distance;
        
        const keyframes = `
            @keyframes confetti-fall {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translate(${endX - centerX}px, ${endY - centerY}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.querySelector('#confetti-animation')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation';
            style.textContent = keyframes;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 2000);
    }
}

function updateSelectedTablePanel() {
    const selectedTablePanel = document.querySelector('.selected-table-card');
    const tableNumber = document.querySelector('.table-number');
    const tableCapacity = document.querySelector('.table-capacity');
    const tableLocation = document.querySelector('.table-location');
    
    if (selectedTablePanel && tableNumber && tableCapacity && tableLocation) {
        if (AppState.selectedTable) {
            selectedTablePanel.classList.remove('hidden');
            tableNumber.textContent = AppState.selectedTable.tableNumber;
            tableCapacity.textContent = AppState.selectedTable.capacity;
            tableLocation.textContent = AppState.selectedTable.location;
            
            // Animación de entrada
            selectedTablePanel.style.animation = 'slideInRight 0.5s ease';
        } else {
            selectedTablePanel.classList.add('hidden');
        }
    }
}

function showTablePopup(table) {
    // Crear popup
    const popup = document.createElement('div');
    popup.className = 'table-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <button class="popup-close">
                <i class="fas fa-times"></i>
            </button>

            <div class="popup-header">
                <div class="popup-icon">
                    <span>${table.tableNumber}</span>
                </div>
                <h2>Mesa #${table.tableNumber}</h2>
                <p>Información de la mesa</p>
            </div>

            <div class="popup-details">
                <div class="popup-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <p class="detail-label">Ubicación</p>
                        <p class="detail-value">${table.location}</p>
                    </div>
                </div>

                <div class="popup-detail">
                    <i class="fas fa-users"></i>
                    <div>
                        <p class="detail-label">Capacidad</p>
                        <p class="detail-value">${table.capacity} personas</p>
                    </div>
                </div>

                <div class="popup-detail available">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <p class="detail-label">Estado</p>
                        <p class="detail-value available">Disponible ahora</p>
                    </div>
                </div>
            </div>

            <button class="popup-close-btn">
                <i class="fas fa-check"></i>
                Seleccionar esta mesa
            </button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Configurar event listeners del popup
    const closePopup = () => {
        popup.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    };
    
    popup.querySelector('.popup-close').addEventListener('click', closePopup);
    
    popup.querySelector('.popup-close-btn').addEventListener('click', () => {
        closePopup();
        // Aquí podrías agregar lógica adicional al confirmar la selección
    });
    
    // Cerrar popup al hacer clic fuera
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });
    
    // Efecto de teclado - ESC para cerrar
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            closePopup();
            document.removeEventListener('keydown', handleKeydown);
        }
    };
    document.addEventListener('keydown', handleKeydown);
}

function confirmReservation() {
    if (!AppState.selectedTable) {
        showNotification('Por favor selecciona una mesa primero', 'error');
        return;
    }
    
    // Mostrar modal de confirmación mejorado
    showReservationModal();
}

function showReservationModal() {
    const modal = document.createElement('div');
    modal.className = 'table-popup';
    modal.innerHTML = `
        <div class="popup-content" style="max-width: 500px;">
            <button class="popup-close">
                <i class="fas fa-times"></i>
            </button>

            <div class="popup-header">
                <div class="popup-icon" style="background: linear-gradient(135deg, #48bb78, #38a169);">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <h2>Confirmar Reserva</h2>
                <p>¿Estás seguro de que quieres reservar esta mesa?</p>
            </div>

            <div class="popup-details">
                <div class="popup-detail">
                    <i class="fas fa-chair"></i>
                    <div>
                        <p class="detail-label">Mesa Seleccionada</p>
                        <p class="detail-value">Mesa #${AppState.selectedTable.tableNumber}</p>
                    </div>
                </div>

                <div class="popup-detail">
                    <i class="fas fa-users"></i>
                    <div>
                        <p class="detail-label">Capacidad</p>
                        <p class="detail-value">${AppState.selectedTable.capacity} personas</p>
                    </div>
                </div>

                <div class="popup-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <p class="detail-label">Ubicación</p>
                        <p class="detail-value">${AppState.selectedTable.location}</p>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 1rem;">
                <button class="popup-close-btn" style="background: linear-gradient(135deg, #a0aec0, #718096); flex: 1;">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
                <button class="popup-close-btn" id="final-confirm" style="flex: 1;">
                    <i class="fas fa-check"></i>
                    Confirmar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeModal = () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    };
    
    modal.querySelector('.popup-close').addEventListener('click', closeModal);
    
    modal.querySelector('.popup-close-btn:not(#final-confirm)').addEventListener('click', closeModal);
    
    modal.querySelector('#final-confirm').addEventListener('click', () => {
        // Procesar reserva
        processReservation();
        closeModal();
    });
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function processReservation() {
    // Simular procesamiento de reserva
    const confirmBtn = document.querySelector('.confirm-reservation-btn');
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Procesando...</span>';
    confirmBtn.disabled = true;
    
    setTimeout(() => {
        showNotification(`¡Reserva confirmada para la mesa ${AppState.selectedTable.tableNumber}!`, 'success');
        
        // Actualizar estado de la mesa
        const tableIndex = AppState.tables.findIndex(t => t.id === AppState.selectedTable.id);
        if (tableIndex !== -1) {
            AppState.tables[tableIndex].status = 'reserved';
        }
        
        // Limpiar selección
        AppState.selectedTable = null;
        
        // Actualizar visualización
        renderTables();
        
        // Volver a la pantalla de bienvenida después de 2 segundos
        setTimeout(() => {
            showScreen('welcome');
        }, 2000);
        
    }, 1500);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos para las notificaciones
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification i {
        font-size: 1.25rem;
    }
`;

if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = notificationStyles;
    document.head.appendChild(style);
}