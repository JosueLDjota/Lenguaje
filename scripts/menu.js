// Pantalla del Menú Mejorada
function renderMenuScreen() {
    const menuScreen = document.getElementById('menu');
    
    menuScreen.innerHTML = `
        <div class="menu-container">
            <!-- Header Mejorado -->
            <header class="menu-header">
                <div class="menu-header-content">
                    <div class="menu-header-left">
                        <button class="menu-back-btn screen-btn" data-screen="welcome">
                            <i class="fas fa-arrow-left"></i>
                            <span>Volver</span>
                        </button>
                        <div class="menu-logo">
                            <div class="menu-logo-icon">
                                <i class="fas fa-utensils"></i>
                            </div>
                            <div class="menu-logo-text">
                                <h1>Nuestro Menú</h1>
                                <p>Sabor & Arte · Gastronomía Premium</p>
                            </div>
                        </div>
                    </div>

                    <div class="menu-header-right">
                        <!-- Contador de items y precio total -->
                        <div class="cart-summary">
                            <div class="cart-stats">
                                <span class="items-count">${getCartTotalItems()} items</span>
                                <span class="total-price">L ${getCartTotalPrice().toFixed(2)}</span>
                            </div>
                            <button class="menu-cart-btn screen-btn" data-screen="cart">
                                <i class="fas fa-shopping-cart"></i>
                                <span>Ver Carrito</span>
                                <span class="cart-count ${getCartTotalItems() === 0 ? 'hidden' : ''}">${getCartTotalItems()}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Hero Section del Menú -->
            <section class="menu-hero">
                <div class="hero-content">
                    <h2>Descubre Nuestra Experiencia Gastronómica</h2>
                    <p>Platos elaborados con ingredientes frescos y técnicas culinarias innovadoras</p>
                    <div class="hero-stats">
                        <div class="stat">
                            <i class="fas fa-star"></i>
                            <span>4.9 Rating</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-clock"></i>
                            <span>15-25 min</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-utensils"></i>
                            <span>50+ Platos</span>
                        </div>
                    </div>
                </div>
            </section>

            <div class="menu-content">
                <!-- Barra de búsqueda y filtros mejorada -->
                <div class="menu-controls">
                    <div class="search-section">
                        <div class="search-container">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" class="search-input" placeholder="Buscar platillos, ingredientes...">
                            <button class="search-clear">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="search-filters">
                            <button class="filter-btn active" data-filter="all">
                                <i class="fas fa-th-large"></i>
                                Todos
                            </button>
                            <button class="filter-btn" data-filter="featured">
                                <i class="fas fa-fire"></i>
                                Destacados
                            </button>
                            <button class="filter-btn" data-filter="new">
                                <i class="fas fa-certificate"></i>
                                Nuevos
                            </button>
                        </div>
                    </div>

                    <!-- Filtros de categoría mejorados -->
                    <div class="categories-section">
                        <div class="categories-scroll">
                            <button class="category-btn active" data-category="all">
                                <i class="fas fa-layer-group"></i>
                                <span>Todos</span>
                            </button>
                            <button class="category-btn" data-category="entradas">
                                <i class="fas fa-seedling"></i>
                                <span>Entradas</span>
                            </button>
                            <button class="category-btn" data-category="platos-fuertes">
                                <i class="fas fa-drumstick-bite"></i>
                                <span>Platos Fuertes</span>
                            </button>
                            <button class="category-btn" data-category="postres">
                                <i class="fas fa-ice-cream"></i>
                                <span>Postres</span>
                            </button>
                            <button class="category-btn" data-category="bebidas">
                                <i class="fas fa-glass-martini"></i>
                                <span>Bebidas</span>
                            </button>
                            <button class="category-btn" data-category="especiales">
                                <i class="fas fa-crown"></i>
                                <span>Especiales</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Información de resultados -->
                <div class="results-info">
                    <span class="results-count">Mostrando <strong>${AppState.menuItems.length}</strong> platillos</span>
                    <div class="sort-options">
                        <select class="sort-select">
                            <option value="name">Ordenar por: Nombre</option>
                            <option value="price-low">Precio: Menor a Mayor</option>
                            <option value="price-high">Precio: Mayor a Menor</option>
                            <option value="rating">Mejor Valorados</option>
                            <option value="newest">Más Recientes</option>
                        </select>
                    </div>
                </div>

                <!-- Grid de items con skeleton loading -->
                <div class="menu-items-grid">
                    ${renderSkeletonLoading(8)}
                </div>

                <!-- Estado sin resultados -->
                <div class="no-results hidden">
                    <div class="no-results-content">
                        <div class="no-results-icon">
                            <i class="fas fa-utensils"></i>
                        </div>
                        <h3>No se encontraron platillos</h3>
                        <p>Intenta con otros términos de búsqueda o categorías</p>
                        <button class="clear-filters-btn">
                            <i class="fas fa-times"></i>
                            Limpiar Filtros
                        </button>
                    </div>
                </div>

                <!-- CTA Flotante para móviles -->
                <div class="mobile-cart-cta">
                    <div class="cta-content">
                        <div class="cta-info">
                            <span class="cta-items">${getCartTotalItems()} items</span>
                            <span class="cta-price">L ${getCartTotalPrice().toFixed(2)}</span>
                        </div>
                        <button class="cta-btn screen-btn" data-screen="cart">
                            Ver Carrito
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Inicializar componentes
    initializeMenuComponents();
    
    // Cargar items después de un pequeño delay para mostrar skeleton
    setTimeout(() => {
        renderMenuItems();
    }, 800);
}

function initializeMenuComponents() {
    // Configurar event listeners
    setupMenuEventListeners();
    
    // Iniciar animaciones
    startMenuAnimations();
    
    // Actualizar contadores
    updateMenuCounters();
}

function setupMenuEventListeners() {
    // Filtros de categoría
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Animación de cambio activo
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Actualizar categoría
            AppState.currentCategory = this.getAttribute('data-category');
            renderMenuItems();
        });
    });
    
    // Filtros adicionales
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            // Aquí podrías agregar lógica para filtros adicionales
        });
    });
    
    // Búsqueda con debounce
    const searchInput = document.querySelector('.search-input');
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            AppState.currentSearchQuery = this.value;
            renderMenuItems();
        }, 300);
    });
    
    // Limpiar búsqueda
    const clearSearch = document.querySelector('.search-clear');
    if (clearSearch) {
        clearSearch.addEventListener('click', function() {
            searchInput.value = '';
            AppState.currentSearchQuery = '';
            renderMenuItems();
        });
    }
    
    // Ordenamiento
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            AppState.currentSort = this.value;
            renderMenuItems();
        });
    }
    
    // Limpiar filtros
    const clearFilters = document.querySelector('.clear-filters-btn');
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            resetFilters();
            renderMenuItems();
        });
    }
    
    // Navegación
    document.querySelectorAll('.screen-btn').forEach(button => {
        button.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            if (screenId) showScreen(screenId);
        });
    });
}

function startMenuAnimations() {
    // Animación de entrada para los elementos
    const items = document.querySelectorAll('.menu-item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

function updateMenuCounters() {
    const itemsCount = document.querySelector('.items-count');
    const totalPrice = document.querySelector('.total-price');
    const ctaItems = document.querySelector('.cta-items');
    const ctaPrice = document.querySelector('.cta-price');
    
    if (itemsCount) itemsCount.textContent = `${getCartTotalItems()} items`;
    if (totalPrice) totalPrice.textContent = `L ${getCartTotalPrice().toFixed(2)}`;
    if (ctaItems) ctaItems.textContent = `${getCartTotalItems()} items`;
    if (ctaPrice) ctaPrice.textContent = `L ${getCartTotalPrice().toFixed(2)}`;
}

function renderSkeletonLoading(count) {
    return Array(count).fill(0).map(() => `
        <div class="menu-item skeleton">
            <div class="menu-item-image skeleton-image"></div>
            <div class="menu-item-content">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="menu-item-footer">
                    <div class="skeleton-price"></div>
                    <div class="skeleton-button"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderMenuItems() {
    const menuContainer = document.querySelector('.menu-items-grid');
    const noResults = document.querySelector('.no-results');
    const resultsCount = document.querySelector('.results-count');
    
    // Filtrar y ordenar items
    let filteredItems = filterMenuItems();
    filteredItems = sortMenuItems(filteredItems);
    
    // Actualizar contador de resultados
    if (resultsCount) {
        resultsCount.innerHTML = `Mostrando <strong>${filteredItems.length}</strong> platillo${filteredItems.length !== 1 ? 's' : ''}`;
    }
    
    // Mostrar estado sin resultados
    if (filteredItems.length === 0) {
        menuContainer.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    
    // Renderizar items
    menuContainer.innerHTML = filteredItems.map(item => `
        <div class="menu-item" data-category="${item.category}" data-id="${item.id}">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.onerror=null; this.src=''; this.classList.add('image-fallback'); this.innerHTML='<i class=\\'fas fa-utensils\\'></i>';">
                
                <!-- Badges y etiquetas -->
                <div class="menu-item-badges">
                    ${item.isSpicy ? `
                        <div class="badge spicy" title="Plato picante">
                            <i class="fas fa-fire"></i>
                            <span>Picante</span>
                        </div>
                    ` : ''}
                    ${item.isVegetarian ? `
                        <div class="badge vegetarian" title="Opción vegetariana">
                            <i class="fas fa-leaf"></i>
                            <span>Vegetariano</span>
                        </div>
                    ` : ''}
                    ${item.isNew ? `
                        <div class="badge new" title="Nuevo en el menú">
                            <i class="fas fa-star"></i>
                            <span>Nuevo</span>
                        </div>
                    ` : ''}
                    ${item.isChefSpecial ? `
                        <div class="badge special" title="Especial del chef">
                            <i class="fas fa-crown"></i>
                            <span>Especial</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Rating -->
                <div class="menu-item-rating">
                    <i class="fas fa-star"></i>
                    <span>${item.rating}</span>
                </div>
                
                <!-- Quick actions -->
                <div class="menu-item-actions">
                    <button class="action-btn favorite-btn" data-id="${item.id}" title="Agregar a favoritos">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="action-btn info-btn" data-id="${item.id}" title="Ver información">
                        <i class="fas fa-info"></i>
                    </button>
                </div>
            </div>

            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3 class="menu-item-name">${item.name}</h3>
                    <span class="item-prep-time">
                        <i class="fas fa-clock"></i>
                        ${item.prepTime || '15-20'} min
                    </span>
                </div>
                
                <p class="menu-item-description">${item.description}</p>
                
                <div class="menu-item-ingredients">
                    <span class="ingredients-label">Ingredientes principales:</span>
                    <span class="ingredients-list">${getMainIngredients(item)}</span>
                </div>

                <div class="menu-item-footer">
                    <div class="menu-item-price">
                        <span class="price-label">Precio</span>
                        <div class="price-amount">
                            <span class="price-currency">L</span>
                            <span class="price-value">${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="quantity-controls">
                        ${AppState.cart[item.id] && AppState.cart[item.id] > 0 ? `
                            <div class="quantity-display">
                                <button class="qty-btn decrease" data-id="${item.id}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="qty-value">${AppState.cart[item.id]}</span>
                                <button class="qty-btn increase" data-id="${item.id}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        ` : `
                            <button class="add-to-cart-btn" data-id="${item.id}">
                                <i class="fas fa-shopping-cart"></i>
                                <span>Agregar</span>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Configurar event listeners dinámicos
    setupDynamicEventListeners();
    
    // Iniciar animaciones de entrada
    startItemsAnimation();
}

function filterMenuItems() {
    return AppState.menuItems.filter(item => {
        const matchesCategory = AppState.currentCategory === "all" || item.category === AppState.currentCategory;
        const matchesSearch = item.name.toLowerCase().includes(AppState.currentSearchQuery.toLowerCase()) ||
                             item.description.toLowerCase().includes(AppState.currentSearchQuery.toLowerCase()) ||
                             (item.ingredients && item.ingredients.some(ing => ing.toLowerCase().includes(AppState.currentSearchQuery.toLowerCase())));
        return matchesCategory && matchesSearch;
    });
}

function sortMenuItems(items) {
    switch(AppState.currentSort) {
        case 'price-low':
            return [...items].sort((a, b) => a.price - b.price);
        case 'price-high':
            return [...items].sort((a, b) => b.price - a.price);
        case 'rating':
            return [...items].sort((a, b) => b.rating - a.rating);
        case 'newest':
            return [...items].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        default:
            return [...items].sort((a, b) => a.name.localeCompare(b.name));
    }
}

function setupDynamicEventListeners() {
    // Botones de agregar al carrito
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            addToCartWithAnimation(itemId, this);
        });
    });
    
    // Controles de cantidad
    document.querySelectorAll('.qty-btn.increase').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            updateCartQuantity(itemId, 1);
        });
    });
    
    document.querySelectorAll('.qty-btn.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            updateCartQuantity(itemId, -1);
        });
    });
    
    // Botones de favoritos
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            toggleFavorite(itemId, this);
        });
    });
    
    // Botones de información
    document.querySelectorAll('.info-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            showItemDetails(itemId);
        });
    });
}

function addToCartWithAnimation(itemId, button) {
    // Animación de agregado
    button.classList.add('adding');
    button.innerHTML = '<i class="fas fa-check"></i><span>Agregado</span>';
    
    // Agregar al carrito
    addToCart(itemId);
    
    // Restaurar botón después de animación
    setTimeout(() => {
        button.classList.remove('adding');
        renderMenuItems(); // Re-render para mostrar controles de cantidad
    }, 1000);
}

function updateCartQuantity(itemId, change) {
    if (AppState.cart[itemId]) {
        AppState.cart[itemId] += change;
        
        if (AppState.cart[itemId] <= 0) {
            delete AppState.cart[itemId];
        }
        
        updateCartCount();
        updateMenuCounters();
        renderMenuItems();
    }
}

function toggleFavorite(itemId, button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.replace('far', 'fas');
        button.classList.add('favorited');
        showNotification('Agregado a favoritos', 'success');
    } else {
        icon.classList.replace('fas', 'far');
        button.classList.remove('favorited');
        showNotification('Removido de favoritos', 'info');
    }
}

function showItemDetails(itemId) {
    const item = AppState.menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    // Aquí podrías implementar un modal de detalles
    console.log('Mostrar detalles del item:', item);
    // showItemModal(item);
}

function getMainIngredients(item) {
    const ingredients = item.ingredients || ['Ingredientes frescos', 'Especias seleccionadas'];
    return ingredients.slice(0, 3).join(', ') + (ingredients.length > 3 ? '...' : '');
}

function resetFilters() {
    AppState.currentCategory = 'all';
    AppState.currentSearchQuery = '';
    AppState.currentSort = 'name';
    
    // Reset UI
    document.querySelectorAll('.category-btn, .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.category-btn[data-category="all"]').classList.add('active');
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    document.querySelector('.search-input').value = '';
    document.querySelector('.sort-select').value = 'name';
}

function startItemsAnimation() {
    const items = document.querySelectorAll('.menu-item:not(.skeleton)');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate-in');
    });
}

// Helper functions
function getCartTotalItems() {
    return Object.values(AppState.cart).reduce((sum, count) => sum + count, 0);
}

function getCartTotalPrice() {
    return Object.keys(AppState.cart).reduce((sum, id) => {
        const itemId = parseInt(id);
        const menuItem = AppState.menuItems.find(item => item.id === itemId);
        return sum + (menuItem ? menuItem.price * AppState.cart[itemId] : 0);
    }, 0);
}

function addToCart(itemId) {
    if (!AppState.cart[itemId]) {
        AppState.cart[itemId] = 0;
    }
    AppState.cart[itemId]++;
    
    updateCartCount();
    updateMenuCounters();
    
    // Mostrar notificación de agregado
    const item = AppState.menuItems.find(i => i.id === itemId);
    if (item) {
        showNotification(`"${item.name}" agregado al carrito`, 'success');
    }
}

function showNotification(message, type = 'info') {
    // Implementar sistema de notificaciones
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Actualizar el estado global con más propiedades para los items
AppState.menuItems = AppState.menuItems.map(item => ({
    ...item,
    isNew: Math.random() > 0.7,
    isChefSpecial: Math.random() > 0.8,
    prepTime: `${15 + Math.floor(Math.random() * 15)}-${20 + Math.floor(Math.random() * 20)}`,
    ingredients: [
        'Ingrediente premium 1',
        'Ingrediente fresco 2', 
        'Especia especial 3',
        'Complemento único 4'
    ].sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3))
}));

// Inicializar estado de ordenamiento
AppState.currentSort = 'name';