// Pantalla del Carrito - Versión Mejorada
class CartManager {
    constructor() {
        this.selectors = {
            cart: '#cart',
            cartItemsCount: '.cart-items-count',
            cartEmpty: '.cart-empty',
            cartWithItems: '.cart-with-items',
            cartItemsList: '.cart-items-list',
            subtotal: '.subtotal',
            discount: '.discount',
            tax: '.tax',
            totalValue: '.total-value',
            discountRow: '.discount-row',
            promoSuccess: '.promo-success',
            promoInput: '.promo-input',
            promoBtn: '.promo-btn',
            confirmOrderBtn: '.confirm-order-btn'
        };
        
        this.events = {
            screenBtn: 'screen-btn',
            removeItem: 'remove-item-btn',
            decreaseQuantity: 'decrease-quantity',
            increaseQuantity: 'increase-quantity'
        };
        
        this.init();
    }
    
    init() {
        this.setupEventDelegation();
    }
    
    setupEventDelegation() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Navegación entre pantallas
            if (target.closest(`.${this.events.screenBtn}`)) {
                this.handleScreenNavigation(target);
            }
            
            // Eliminar item del carrito
            if (target.closest(`.${this.events.removeItem}`)) {
                this.handleRemoveItem(target);
            }
            
            // Control de cantidad
            if (target.closest(`.${this.events.decreaseQuantity}`)) {
                this.handleQuantityChange(target, -1);
            }
            
            if (target.closest(`.${this.events.increaseQuantity}`)) {
                this.handleQuantityChange(target, 1);
            }
        });
        
        // Eventos de input
        document.addEventListener('input', (e) => {
            if (e.target.matches(this.selectors.promoInput)) {
                this.handlePromoInput(e.target);
            }
        });
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.matches(this.selectors.promoInput)) {
                this.applyPromoCode();
            }
        });
    }
    
    handleScreenNavigation(target) {
        const button = target.closest(`.${this.events.screenBtn}`);
        const screenId = button?.dataset.screen;
        
        if (screenId && typeof showScreen === 'function') {
            showScreen(screenId);
        }
    }
    
    handleRemoveItem(target) {
        const button = target.closest(`.${this.events.removeItem}`);
        const itemId = parseInt(button?.dataset.id);
        
        if (itemId) {
            this.removeFromCart(itemId);
        }
    }
    
    handleQuantityChange(target, change) {
        const button = target.closest(`.${this.events.decreaseQuantity}, .${this.events.increaseQuantity}`);
        const itemId = parseInt(button?.dataset.id);
        
        if (itemId) {
            this.updateQuantity(itemId, change);
        }
    }
    
    handlePromoInput(input) {
        const promoBtn = document.querySelector(this.selectors.promoBtn);
        if (promoBtn) {
            promoBtn.textContent = 'Aplicar';
            promoBtn.classList.remove('applied');
        }
    }
}

// Instancia global del gestor del carrito
const cartManager = new CartManager();

// Pantalla del Carrito
function renderCartScreen() {
    const cartScreen = document.getElementById('cart');
    
    if (!cartScreen) {
        console.error('Elemento cart no encontrado');
        return;
    }
    
    cartScreen.innerHTML = this.generateCartHTML();
    
    // Configurar event listeners específicos
    this.setupCartEventListeners();
    
    // Actualizar visualización del carrito
    this.updateCartDisplay();
}

function generateCartHTML() {
    return `
        <div class="cart-container">
            <header class="cart-header">
                <div class="cart-header-content">
                    <div class="cart-header-left">
                        <button class="cart-back-btn screen-btn" data-screen="menu" 
                                aria-label="Volver al menú">
                            <i class="fas fa-arrow-left" aria-hidden="true"></i>
                        </button>
                        <div class="cart-logo">
                            <div class="cart-logo-icon" aria-hidden="true">
                                <i class="fas fa-shopping-cart"></i>
                            </div>
                            <div class="cart-logo-text">
                                <h1>Mi Carrito</h1>
                                <p><span class="cart-items-count">0</span> productos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div class="cart-content">
                ${this.generateEmptyCartHTML()}
                ${this.generateCartWithItemsHTML()}
            </div>
        </div>
    `;
}

function generateEmptyCartHTML() {
    return `
        <div class="cart-empty">
            <div class="cart-empty-icon" aria-hidden="true">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega algunos platillos deliciosos para empezar</p>
            <button class="cart-empty-btn screen-btn" data-screen="menu">
                Ver Menú
            </button>
        </div>
    `;
}

function generateCartWithItemsHTML() {
    return `
        <div class="cart-with-items hidden">
            <div class="cart-items-section">
                <div class="cart-items-card">
                    <h2>Productos en tu carrito</h2>
                    <div class="cart-items-list" role="list" aria-label="Lista de productos en el carrito"></div>
                </div>

                ${this.generatePromoCardHTML()}
            </div>

            ${this.generateOrderSummaryHTML()}
        </div>
    `;
}

function generatePromoCardHTML() {
    return `
        <div class="promo-card">
            <h3 class="promo-header">
                <i class="fas fa-tag" aria-hidden="true"></i>
                ¿Tienes un código promocional?
            </h3>
            <div class="promo-form">
                <input type="text" class="promo-input" 
                       placeholder="Ingresa tu código"
                       aria-label="Código promocional">
                <button class="promo-btn" aria-label="Aplicar código promocional">
                    Aplicar
                </button>
            </div>
            <p class="promo-success hidden" role="alert">
                ✓ Código aplicado: 10% de descuento
            </p>
        </div>
    `;
}

function generateOrderSummaryHTML() {
    return `
        <div class="order-summary-card">
            <h2>Resumen del pedido</h2>

            <div class="order-summary-details">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span class="value">L <span class="subtotal">0.00</span></span>
                </div>

                <div class="summary-row discount-row hidden">
                    <span>Descuento (10%)</span>
                    <span class="discount-value">-L <span class="discount">0.00</span></span>
                </div>

                <div class="summary-row">
                    <span>Impuesto (15%)</span>
                    <span class="value">L <span class="tax">0.00</span></span>
                </div>

                <div class="summary-divider">
                    <div class="summary-total">
                        <span class="total-label">Total a pagar</span>
                        <div class="total-amount">
                            <span class="total-currency">L</span>
                            <span class="total-value">0.00</span>
                        </div>
                    </div>
                </div>
            </div>

            <button class="confirm-order-btn" aria-label="Confirmar pedido">
                <i class="fas fa-credit-card" aria-hidden="true"></i>
                <span>Confirmar Pedido</span>
            </button>

            ${this.generateOrderFeaturesHTML()}
            ${this.generateOrderTipHTML()}
        </div>
    `;
}

function generateOrderFeaturesHTML() {
    return `
        <div class="order-features">
            <div class="feature">
                <i class="fas fa-check" aria-hidden="true"></i>
                <span>Pago seguro</span>
            </div>
            <div class="feature">
                <i class="fas fa-check" aria-hidden="true"></i>
                <span>Envío rápido</span>
            </div>
            <div class="feature">
                <i class="fas fa-check" aria-hidden="true"></i>
                <span>Garantía de frescura</span>
            </div>
        </div>
    `;
}

function generateOrderTipHTML() {
    return `
        <div class="order-tip">
            <p><span class="tip-highlight">💡 Tip:</span> Agrega L 100 más para obtener envío gratis</p>
        </div>
    `;
}

function setupCartEventListeners() {
    // Código promocional
    const promoBtn = document.querySelector('.promo-btn');
    if (promoBtn) {
        promoBtn.addEventListener('click', () => this.applyPromoCode());
    }
    
    // Confirmar pedido
    const confirmOrderBtn = document.querySelector('.confirm-order-btn');
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', () => this.confirmOrder());
    }
}

function updateCartDisplay() {
    const cartItems = this.getCartItems();
    this.updateCartVisibility(cartItems);
    
    if (cartItems.length > 0) {
        this.renderCartItems(cartItems);
        this.updateOrderSummary();
    }
}

function getCartItems() {
    if (!AppState?.cart || !AppState?.menuItems) {
        console.warn('AppState no está definido correctamente');
        return [];
    }
    
    return Object.keys(AppState.cart)
        .map(id => {
            const itemId = parseInt(id);
            const menuItem = AppState.menuItems.find(item => item.id === itemId);
            
            if (!menuItem) {
                console.warn(`Item con ID ${itemId} no encontrado en el menú`);
                return null;
            }
            
            return {
                ...menuItem,
                quantity: AppState.cart[itemId]
            };
        })
        .filter(item => item !== null);
}

function updateCartVisibility(cartItems) {
    const cartEmpty = document.querySelector('.cart-empty');
    const cartWithItems = document.querySelector('.cart-with-items');
    const cartItemsCount = document.querySelector('.cart-items-count');
    
    // Actualizar contador de productos
    if (cartItemsCount) {
        cartItemsCount.textContent = cartItems.length;
        cartItemsCount.setAttribute('aria-live', 'polite');
    }
    
    // Mostrar estado apropiado
    const isEmpty = cartItems.length === 0;
    
    if (cartEmpty) {
        cartEmpty.classList.toggle('hidden', !isEmpty);
    }
    
    if (cartWithItems) {
        cartWithItems.classList.toggle('hidden', isEmpty);
    }
}

function renderCartItems(cartItems) {
    const cartItemsContainer = document.querySelector('.cart-items-list');
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = cartItems.map(item => 
        this.generateCartItemHTML(item)
    ).join('');
}

function generateCartItemHTML(item) {
    const total = (item.price * item.quantity).toFixed(2);
    
    return `
        <div class="cart-item" data-item-id="${item.id}" role="listitem">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${this.escapeHTML(item.name)}" 
                     onerror="this.onerror=null; this.src=''; this.classList.add('image-fallback'); this.innerHTML='<i class=\\'fas fa-utensils\\' aria-hidden=\\'true\\'></i>';"
                     loading="lazy">
            </div>

            <div class="cart-item-info">
                <h3 class="cart-item-name">${this.escapeHTML(item.name)}</h3>
                <p class="cart-item-description">${this.escapeHTML(item.description)}</p>
                <div class="cart-item-price">
                    <span class="cart-item-price-currency">L</span>
                    <span class="cart-item-price-value">${item.price.toFixed(2)}</span>
                </div>
            </div>

            <div class="cart-item-controls">
                <button class="remove-item-btn" data-id="${item.id}" 
                        aria-label="Eliminar ${this.escapeHTML(item.name)} del carrito">
                    <i class="fas fa-trash" aria-hidden="true"></i>
                </button>

                <div class="quantity-controls" aria-label="Cantidad de ${this.escapeHTML(item.name)}">
                    <button class="quantity-btn decrease-quantity" data-id="${item.id}"
                            aria-label="Disminuir cantidad">
                        <i class="fas fa-minus" aria-hidden="true"></i>
                    </button>
                    <span class="quantity-display" aria-live="polite">${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-id="${item.id}"
                            aria-label="Aumentar cantidad">
                        <i class="fas fa-plus" aria-hidden="true"></i>
                    </button>
                </div>

                <div class="cart-item-total">
                    <span class="cart-item-total-currency">L</span>
                    <span class="cart-item-total-value">${total}</span>
                </div>
            </div>
        </div>
    `;
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function removeFromCart(itemId) {
    if (AppState.cart && AppState.cart[itemId]) {
        delete AppState.cart[itemId];
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Producto eliminado del carrito', 'success');
        
        // Actualizar menú si está visible
        if (document.getElementById('menu')?.classList.contains('active')) {
            renderMenuItems?.();
        }
    }
}

function updateQuantity(itemId, change) {
    if (!AppState.cart || !AppState.cart[itemId]) return;
    
    AppState.cart[itemId] += change;
    
    if (AppState.cart[itemId] <= 0) {
        this.removeFromCart(itemId);
    } else {
        this.updateCartDisplay();
        this.updateCartCount();
        
        // Actualizar menú si está visible
        if (document.getElementById('menu')?.classList.contains('active')) {
            renderMenuItems?.();
        }
    }
}

function updateOrderSummary() {
    const { subtotal, discount, tax, total } = this.calculateOrderTotals();
    
    this.updateSummaryElements(subtotal, discount, tax, total);
    this.updatePromoVisibility();
}

function calculateOrderTotals() {
    const cartItems = this.getCartItems();
    const subtotal = cartItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
    );
    
    const discount = AppState.appliedPromo ? subtotal * 0.1 : 0;
    const tax = (subtotal - discount) * 0.15;
    const total = subtotal - discount + tax;
    
    return { subtotal, discount, tax, total };
}

function updateSummaryElements(subtotal, discount, tax, total) {
    const elements = {
        subtotal: document.querySelector('.subtotal'),
        discount: document.querySelector('.discount'),
        tax: document.querySelector('.tax'),
        total: document.querySelector('.total-value')
    };
    
    Object.entries(elements).forEach(([key, element]) => {
        if (element) {
            const value = { subtotal, discount, tax, total }[key];
            element.textContent = value.toFixed(2);
        }
    });
}

function updatePromoVisibility() {
    const discountRow = document.querySelector('.discount-row');
    const promoSuccess = document.querySelector('.promo-success');
    
    if (discountRow && promoSuccess) {
        const isVisible = !!AppState.appliedPromo;
        discountRow.classList.toggle('hidden', !isVisible);
        promoSuccess.classList.toggle('hidden', !isVisible);
    }
}

function applyPromoCode() {
    const promoInput = document.querySelector('.promo-input');
    const promoBtn = document.querySelector('.promo-btn');
    
    if (!promoInput || !promoInput.value.trim()) {
        this.showNotification('Por favor ingresa un código promocional', 'error');
        return;
    }
    
    // Simular validación del código
    const isValid = this.validatePromoCode(promoInput.value.trim());
    
    if (isValid) {
        AppState.appliedPromo = true;
        promoBtn.textContent = '✓';
        promoBtn.classList.add('applied');
        this.updateOrderSummary();
        this.showNotification('Código promocional aplicado correctamente', 'success');
    } else {
        this.showNotification('Código promocional inválido', 'error');
    }
}

function validatePromoCode(code) {
    // En una aplicación real, esto haría una validación con el servidor
    const validCodes = ['DESCUENTO10', 'PROMO2024', 'BIENVENIDO'];
    return validCodes.includes(code.toUpperCase());
}

function confirmOrder() {
    const cartItems = this.getCartItems();
    
    if (cartItems.length === 0) {
        this.showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    // Simular proceso de confirmación
    this.processOrderConfirmation();
}

function processOrderConfirmation() {
    const { total } = this.calculateOrderTotals();
    
    // Mostrar confirmación
    if (confirm(`¿Confirmar pedido por L ${total.toFixed(2)}?`)) {
        this.showNotification('¡Pedido confirmado! Gracias por tu compra.', 'success');
        
        // Limpiar carrito
        AppState.cart = {};
        AppState.appliedPromo = false;
        
        // Actualizar interfaz
        this.updateCartDisplay();
        this.updateCartCount();
        
        // Volver al menú
        if (typeof showScreen === 'function') {
            setTimeout(() => showScreen('menu'), 1500);
        }
    }
}

function showNotification(message, type = 'info') {
    // Implementación básica - puedes reemplazar con tu sistema de notificaciones
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Ejemplo de notificación visual
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateCartCount() {
    // Actualizar contador global del carrito si existe
    const globalCartCount = document.querySelector('.global-cart-count');
    if (globalCartCount) {
        const totalItems = Object.values(AppState.cart || {}).reduce((sum, qty) => sum + qty, 0);
        globalCartCount.textContent = totalItems;
        globalCartCount.classList.toggle('hidden', totalItems === 0);
    }
}

// Exportar funciones para uso global
window.CartScreen = {
    renderCartScreen,
    updateCartDisplay,
    removeFromCart,
    updateQuantity,
    applyPromoCode,
    confirmOrder
};