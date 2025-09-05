/**
 * WANDERLUST TRAVEL - MAIN JAVASCRIPT ENTRY POINT
 * Waterfall methodology - simplified for production
 */

// ===== CONFIGURATION =====
const AppConfig = {
    app: {
        name: 'Wanderlust Travel',
        version: '1.0.0',
        debug: false
    },
    storage: {
        cart: 'wanderlust_cart',
        wishlist: 'wanderlust_wishlist',
        theme: 'wanderlust_theme'
    }
};

// ===== GLOBAL STATE =====
let appState = {
    cart: [],
    wishlist: [],
    theme: 'light'
};

// ===== UTILITY FUNCTIONS =====
function log(...args) {
    if (AppConfig.app.debug) {
        console.log('[WanderlustApp]', ...args);
    }
}

function loadState() {
    try {
        const cartData = localStorage.getItem(AppConfig.storage.cart);
        if (cartData) appState.cart = JSON.parse(cartData);

        const wishlistData = localStorage.getItem(AppConfig.storage.wishlist);
        if (wishlistData) appState.wishlist = JSON.parse(wishlistData);

        const themeData = localStorage.getItem(AppConfig.storage.theme);
        if (themeData) appState.theme = themeData;
    } catch (error) {
        log('Error loading state:', error);
    }
}

function saveState() {
    try {
        localStorage.setItem(AppConfig.storage.cart, JSON.stringify(appState.cart));
        localStorage.setItem(AppConfig.storage.wishlist, JSON.stringify(appState.wishlist));
        localStorage.setItem(AppConfig.storage.theme, appState.theme);
    } catch (error) {
        log('Error saving state:', error);
    }
}

// ===== CART FUNCTIONALITY =====
function updateCartCount() {
    const count = appState.cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
}

function addToCart(item) {
    const existingItem = appState.cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push({
            ...item,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    saveState();
    updateCartCount();
    showNotification('Added to Cart!', `${item.name} has been added to your cart.`, 'success');
}

// ===== WISHLIST FUNCTIONALITY =====
function updateWishlistUI() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(btn => {
        const itemId = btn.dataset.itemId;
        const isInWishlist = appState.wishlist.some(item => item.id === itemId);
        btn.classList.toggle('active', isInWishlist);
    });
}

function toggleWishlist(itemId) {
    const existingIndex = appState.wishlist.findIndex(item => item.id === itemId);
    
    if (existingIndex > -1) {
        appState.wishlist.splice(existingIndex, 1);
        showNotification('Removed from Wishlist', 'Item removed from your wishlist.', 'info');
    } else {
        appState.wishlist.push({ id: itemId, addedAt: new Date().toISOString() });
        showNotification('Added to Wishlist', 'Item added to your wishlist.', 'success');
    }
    
    saveState();
    updateWishlistUI();
}

// ===== THEME FUNCTIONALITY =====
function toggleTheme() {
    const newTheme = appState.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    appState.theme = theme;
    document.body.className = document.body.className.replace(/dark-theme|light-theme/g, '');
    document.body.classList.add(`${theme}-theme`);
    
    const themeToggle = document.querySelector('.theme-toggle svg');
    if (themeToggle) {
        if (theme === 'dark') {
            themeToggle.innerHTML = `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>`;
        } else {
            themeToggle.innerHTML = `<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>`;
        }
    }
    
    saveState();
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// ===== SEARCH FUNCTIONALITY =====
function openSearchOverlay() {
    showNotification('Search Feature', 'Search functionality would open here in a full implementation.', 'info');
}

// ===== MODAL FUNCTIONS =====
function openLoginModal() {
    window.location.href = 'login.html';
}

function openRegisterModal() {
    window.location.href = 'register.html';
}

function openBookingsModal() {
    showNotification('My Bookings', 'Your booking history would be displayed here.', 'info');
}

function openWishlistModal() {
    const count = appState.wishlist.length;
    showNotification('Wishlist', `You have ${count} items in your wishlist.`, 'info');
}

function openPremiumModal() {
    showNotification('Premium Features', 'Premium features would be displayed here.', 'info');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Cart button
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            showNotification('Shopping Cart', `You have ${appState.cart.length} items in your cart.`, 'info');
        });
    }
    
    // Mobile menu
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // Wishlist buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.wishlist-btn')) {
            const btn = e.target.closest('.wishlist-btn');
            const itemId = btn.dataset.itemId;
            if (itemId) {
                toggleWishlist(itemId);
            }
        }
    });
    
    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const itemData = btn.dataset.item;
            if (itemData) {
                try {
                    const item = JSON.parse(itemData);
                    addToCart(item);
                } catch (error) {
                    log('Error parsing item data:', error);
                }
            }
        }
    });
}

// ===== INITIALIZATION =====
function initializeApp() {
    log('Initializing Wanderlust Travel App...');
    
    // Load saved state
    loadState();
    
    // Update UI
    updateCartCount();
    updateWishlistUI();
    setTheme(appState.theme);
    
    // Setup event listeners
    setupEventListeners();
    
    log('Application initialized successfully');
    log('🚀 Wanderlust Travel - Premium UI Enhanced');
    log('Features: Search, Cart, Wishlist, Theme Toggle, Animations');
}

// ===== START APPLICATION =====
document.addEventListener('DOMContentLoaded', initializeApp);

// ===== GLOBAL FUNCTIONS FOR HTML =====
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.toggleTheme = toggleTheme;
window.openSearchOverlay = openSearchOverlay;
window.openLoginModal = openLoginModal;
window.openRegisterModal = openRegisterModal;
window.openBookingsModal = openBookingsModal;
window.openWishlistModal = openWishlistModal;
window.openPremiumModal = openPremiumModal;