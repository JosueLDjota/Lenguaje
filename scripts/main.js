// Estado global de la aplicación
const AppState = {
    cart: {},
    selectedTable: null,
    appliedPromo: false,
    currentCategory: 'all',
    currentSearchQuery: '',
    
    // Datos del menú
    menuItems: [
        {
            id: 1,
            name: "Filete de Res Premium",
            description: "Jugoso filete de res angus de 300g con reducción de vino tinto, puré de papas trufado y vegetales asados",
            price: 485,
            image: "https://images.unsplash.com/photo-1676300185292-e23bb3db50fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwc3RlYWslMjBwbGF0ZXxlbnwxfHx8fDE3NjQwMjk0Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            category: "platos-fuertes",
            rating: 4.9,
        },
        {
            id: 2,
            name: "Pasta Carbonara Clásica",
            description: "Fettuccine fresco con salsa cremosa de huevo, pancetta italiana, parmesano reggiano y pimienta negra",
            price: 295,
            image: "https://images.unsplash.com/photo-1707322540604-f69bd7b2cb4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYSUyMGRpc2h8ZW58MXx8fHwxNzYzOTQ1NzcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            category: "platos-fuertes",
            rating: 4.8,
        },
        {
            id: 3,
            name: "Salmón a la Parrilla",
            description: "Salmón noruego glaseado con miel y mostaza, acompañado de arroz salvaje y espárragos",
            price: 425,
            image: "https://images.unsplash.com/photo-1641898378716-1f38ec04bb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9uJTIwZmlzaHxlbnwxfHx8fDE3NjM5NzY0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            category: "platos-fuertes",
            rating: 4.7,
        },
        {
            id: 4,
            name: "Ensalada César",
            description: "Lechuga romana fresca, crutones caseros, pollo a la parrilla, queso parmesano y aderezo césar",
            price: 185,
            image: "https://images.unsplash.com/photo-1739436776460-35f309e3f887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZCUyMGZyZXNofGVufDF8fHx8MTc2Mzk5NDkxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            category: "entradas",
            isVegetarian: true,
            rating: 4.6,
        },
        {
            id: 5,
            name: "Hamburguesa Gourmet",
            description: "Carne de res premium, queso cheddar, tocino ahumado, cebolla caramelizada, lechuga y tomate en pan brioche",
            price: 265,
            image: "https://images.unsplash.com/photo-1761315413445-32882bf16350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBnb3VybWV0JTIwZnJpZXN8ZW58MXx8fHwxNzY0MDA4MTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            category: "platos-fuertes",
            rating: 4.8,
        },
        {
            id: 6,
            name: "Lava Cake de Chocolate",
            description: "Bizcocho de chocolate belga con centro fundido, helado de vainilla y salsa de frambuesa",
            price: 155,
            image: "https://images.unsplash.com/photo-1736840334919-aac2d5af73e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjM5NTU5NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            category: "postres",
            rating: 5.0,
        },
        {
            id: 7,
            name: "Tacos de Camarón",
            description: "Tres tacos de camarón empanizado con col morada, aguacate, pico de gallo y salsa chipotle",
            price: 225,
            image: "https://images.unsplash.com/photo-1611250188496-e966043a0629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJpbXAlMjB0YWNvcyUyMGZvb2R8ZW58MXx8fHwxNzY0MDI5NDcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            category: "entradas",
            isSpicy: true,
            rating: 4.7,
        },
        {
            id: 8,
            name: "Pizza Margherita",
            description: "Pizza artesanal con salsa de tomate San Marzano, mozzarella fresca, albahaca y aceite de oliva",
            price: 245,
            image: "https://images.unsplash.com/photo-1573821663912-6df460f9c684?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGElMjBiYXNpbHxlbnwxfHx8fDE3NjQwMjk0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            category: "platos-fuertes",
            isVegetarian: true,
            rating: 4.8,
        },
    ],
    
    // Datos de las mesas
    tables: [
        { id: 1, tableNumber: 1, status: "available", capacity: 2, shape: "round", location: "Ventana - Vista Jardín", position: { x: 1, y: 1 } },
        { id: 2, tableNumber: 2, status: "reserved", capacity: 2, shape: "round", location: "Ventana - Vista Jardín", position: { x: 2, y: 1 } },
        { id: 3, tableNumber: 3, status: "available", capacity: 4, shape: "square", location: "Ventana - Vista Ciudad", position: { x: 3, y: 1 } },
        { id: 4, tableNumber: 4, status: "occupied", capacity: 2, shape: "round", location: "Ventana - Vista Ciudad", position: { x: 4, y: 1 } },
        
        { id: 5, tableNumber: 5, status: "available", capacity: 4, shape: "square", location: "Zona Central - Izquierda", position: { x: 1, y: 2 } },
        { id: 6, tableNumber: 6, status: "available", capacity: 6, shape: "rectangular", location: "Zona Central - Centro", position: { x: 2, y: 2 } },
        { id: 7, tableNumber: 7, status: "reserved", capacity: 4, shape: "square", location: "Zona Central - Derecha", position: { x: 4, y: 2 } },
        
        { id: 8, tableNumber: 8, status: "available", capacity: 2, shape: "round", location: "Zona Media - Izquierda", position: { x: 1, y: 3 } },
        { id: 9, tableNumber: 9, status: "occupied", capacity: 4, shape: "square", location: "Zona Media - Centro", position: { x: 2, y: 3 } },
        { id: 10, tableNumber: 10, status: "available", capacity: 4, shape: "square", location: "Zona Media - Centro", position: { x: 3, y: 3 } },
        { id: 11, tableNumber: 11, status: "reserved", capacity: 2, shape: "round", location: "Zona Media - Derecha", position: { x: 4, y: 3 } },
        
        { id: 12, tableNumber: 12, status: "available", capacity: 6, shape: "rectangular", location: "Zona VIP - Centro", position: { x: 2, y: 4 } },
        { id: 13, tableNumber: 13, status: "available", capacity: 4, shape: "square", location: "Zona VIP - Derecha", position: { x: 4, y: 4 } },
        
        { id: 14, tableNumber: 14, status: "occupied", capacity: 2, shape: "round", location: "Bar - Frente", position: { x: 1, y: 5 } },
        { id: 15, tableNumber: 15, status: "available", capacity: 2, shape: "round", location: "Bar - Centro", position: { x: 2, y: 5 } },
        { id: 16, tableNumber: 16, status: "available", capacity: 4, shape: "square", location: "Bar - Esquina", position: { x: 3, y: 5 } },
        { id: 17, tableNumber: 17, status: "reserved", capacity: 2, shape: "round", location: "Bar - Fondo", position: { x: 4, y: 5 } },
    ]
};

// FUNCIÓN ÚNICA DE NAVEGACIÓN MEJORADA
function showScreen(screenId) {
    console.log('🔄 Cambiando a pantalla:', screenId);
    
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla seleccionada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log('🎯 Mostrando:', screenId);
        
        // Renderizado ESPECIAL para el dashboard
        if (screenId === 'dashboard') {
            console.log('🚀 Iniciando renderizado del dashboard...');
            setTimeout(() => {
                if (window.screenRenderers && window.screenRenderers.dashboard) {
                    console.log('✅ Ejecutando renderizador del dashboard');
                    window.screenRenderers.dashboard();
                } else {
                    console.error('❌ No se encontró renderizador del dashboard');
                    // Contenido de emergencia
                    targetScreen.innerHTML = `
                        <div style="padding: 2rem; text-align: center; background: #f97316; color: white; border-radius: 10px; margin: 2rem;">
                            <h1>🎉 ¡Dashboard de Emergencia!</h1>
                            <p>El dashboard está funcionando pero el renderizador no se cargó</p>
                            <p>Usuario: ${window.authManager?.currentUser?.name || 'No identificado'}</p>
                            <button onclick="showScreen('welcome')" 
                                    style="padding: 10px 20px; background: white; color: #f97316; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">
                                Ir a Inicio
                            </button>
                        </div>
                    `;
                }
            }, 50);
        } else {
            // Llamar al renderizador específico si existe
            if (window.screenRenderers && window.screenRenderers[screenId]) {
                console.log(`✅ Ejecutando renderizador de ${screenId}`);
                window.screenRenderers[screenId]();
            } else {
                // Si no hay renderizador, usar el método antiguo como fallback
                console.log(`ℹ️  No hay renderizador para ${screenId}, usando fallback`);
                renderScreenFallback(screenId);
            }
        }
    } else {
        console.error('❌ No se encontró la pantalla:', screenId);
        // Fallback a welcome si la pantalla no existe
        showScreen('welcome');
    }
}

// MÉTODO FALLBACK para pantallas sin renderizador
function renderScreenFallback(screenId) {
    const screen = document.getElementById(screenId);
    if (!screen) return;

    switch(screenId) {
        case 'welcome':
            if (typeof renderWelcomeScreen === 'function') {
                renderWelcomeScreen();
            } else {
                screen.innerHTML = `<h1>Bienvenido a Sabor & Arte</h1><p>Pantalla de bienvenida</p>`;
            }
            break;
        case 'menu':
            if (typeof renderMenuScreen === 'function') {
                renderMenuScreen();
            } else {
                screen.innerHTML = `<h1>Menú</h1><p>Pantalla del menú</p>`;
            }
            break;
        case 'cart':
            if (typeof renderCartScreen === 'function') {
                renderCartScreen();
            } else {
                screen.innerHTML = `<h1>Carrito</h1><p>Pantalla del carrito</p>`;
            }
            break;
        case 'reservation':
            if (typeof renderReservationScreen === 'function') {
                renderReservationScreen();
            } else {
                screen.innerHTML = `<h1>Reservaciones</h1><p>Pantalla de reservaciones</p>`;
            }
            break;
        case 'login':
            if (typeof renderLoginScreen === 'function') {
                renderLoginScreen();
            } else {
                screen.innerHTML = `<h1>Iniciar Sesión</h1><p>Pantalla de login</p>`;
            }
            break;
        default:
            screen.innerHTML = `<h1>${screenId}</h1><p>Pantalla no configurada</p>`;
    }
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicación...');
    
    // Configurar navegación para TODOS los botones
    document.querySelectorAll('.nav-btn, .screen-btn, [data-screen]').forEach(button => {
        button.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            if (screenId) {
                console.log('📱 Botón navegación clickeado:', screenId);
                showScreen(screenId);
            }
        });
    });
    
    // Verificar si hay sesión activa y redirigir
    if (window.authManager && window.authManager.isAuthenticated && window.authManager.currentUser) {
        const user = window.authManager.currentUser;
        console.log('🔐 Sesión activa encontrada:', user.role);
        
        if (user.role === 'admin') {
            console.log('🎯 Admin detectado, redirigiendo a dashboard');
            showScreen('dashboard');
        } else {
            showScreen('welcome');
        }
    } else {
        // Inicializar pantalla de bienvenida por defecto
        showScreen('welcome');
    }
    
    console.log('✅ Aplicación de restaurante inicializada correctamente');
    console.log('📊 Renderizadores disponibles:', Object.keys(window.screenRenderers || {}));
    console.log('🔧 Funciones disponibles:', 
        'showScreen:', typeof showScreen,
        'renderWelcomeScreen:', typeof renderWelcomeScreen,
        'renderMenuScreen:', typeof renderMenuScreen,
        'renderLoginScreen:', typeof renderLoginScreen
    );
});

// Funciones de utilidad
function formatCurrency(amount) {
    return `L ${amount.toFixed(2)}`;
}

function getCartTotalItems() {
    return Object.values(AppState.cart).reduce((sum, count) => sum + count, 0);
}

function updateCartCount() {
    const totalItems = getCartTotalItems();
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        if (totalItems > 0) {
            element.textContent = totalItems;
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
}

// Registrar renderizadores globalmente
window.screenRenderers = window.screenRenderers || {};

console.log('🔧 main.js cargado correctamente');