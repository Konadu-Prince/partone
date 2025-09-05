/**
 * WANDERLUST TRAVEL - MAIN APPLICATION CLASS
 * Core application controller following waterfall methodology
 */

class WanderlustApp {
    constructor() {
        this.config = {
            version: '1.0.0',
            debug: false,
            api: {
                baseUrl: '/api',
                timeout: 5000
            },
            storage: {
                cart: 'wanderlust_cart',
                wishlist: 'wanderlust_wishlist',
                theme: 'wanderlust_theme',
                user: 'wanderlust_user'
            },
            animations: {
                duration: 300,
                easing: 'ease-in-out'
            }
        };

        this.state = {
            cart: [],
            wishlist: [],
            user: null,
            theme: 'light',
            isLoading: false,
            notifications: []
        };

        this.modules = {};
        this.eventListeners = new Map();
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.log('Initializing Wanderlust Travel App...');
        
        // Load saved state
        this.loadState();
        
        // Initialize modules
        this.initializeModules();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start the application
        this.start();
        
        this.log('Application initialized successfully');
    }

    /**
     * Initialize all application modules
     */
    initializeModules() {
        // Core modules
        this.modules.navigation = new NavigationModule(this);
        this.modules.cart = new CartModule(this);
        this.modules.wishlist = new WishlistModule(this);
        this.modules.theme = new ThemeModule(this);
        this.modules.search = new SearchModule(this);
        this.modules.forms = new FormsModule(this);
        this.modules.notifications = new NotificationModule(this);
        this.modules.animations = new AnimationModule(this);
        
        // Feature modules
        this.modules.testimonials = new TestimonialsModule(this);
        this.modules.booking = new BookingModule(this);
        this.modules.user = new UserModule(this);
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Window events
        this.addEventListener(window, 'load', () => this.onWindowLoad());
        this.addEventListener(window, 'resize', () => this.onWindowResize());
        this.addEventListener(window, 'scroll', () => this.onWindowScroll());
        
        // Document events
        this.addEventListener(document, 'DOMContentLoaded', () => this.onDOMReady());
        this.addEventListener(document, 'click', (e) => this.onDocumentClick(e));
        this.addEventListener(document, 'keydown', (e) => this.onDocumentKeydown(e));
    }

    /**
     * Start the application
     */
    start() {
        // Update UI with loaded state
        this.updateUI();
        
        // Initialize animations
        this.modules.animations.init();
        
        // Show welcome message
        this.log('🚀 Wanderlust Travel - Premium UI Enhanced');
        this.log('Features: Search, Cart, Wishlist, Theme Toggle, Animations');
    }

    /**
     * Load application state from localStorage
     */
    loadState() {
        try {
            // Load cart
            const cartData = localStorage.getItem(this.config.storage.cart);
            if (cartData) {
                this.state.cart = JSON.parse(cartData);
            }

            // Load wishlist
            const wishlistData = localStorage.getItem(this.config.storage.wishlist);
            if (wishlistData) {
                this.state.wishlist = JSON.parse(wishlistData);
            }

            // Load theme
            const themeData = localStorage.getItem(this.config.storage.theme);
            if (themeData) {
                this.state.theme = themeData;
            }

            // Load user data
            const userData = localStorage.getItem(this.config.storage.user);
            if (userData) {
                this.state.user = JSON.parse(userData);
            }
        } catch (error) {
            this.log('Error loading state:', error);
        }
    }

    /**
     * Save application state to localStorage
     */
    saveState() {
        try {
            localStorage.setItem(this.config.storage.cart, JSON.stringify(this.state.cart));
            localStorage.setItem(this.config.storage.wishlist, JSON.stringify(this.state.wishlist));
            localStorage.setItem(this.config.storage.theme, this.state.theme);
            if (this.state.user) {
                localStorage.setItem(this.config.storage.user, JSON.stringify(this.state.user));
            }
        } catch (error) {
            this.log('Error saving state:', error);
        }
    }

    /**
     * Update UI based on current state
     */
    updateUI() {
        // Update cart count
        this.modules.cart.updateCartCount();
        
        // Update wishlist
        this.modules.wishlist.updateWishlistUI();
        
        // Apply theme
        this.modules.theme.applyTheme(this.state.theme);
        
        // Update user menu
        if (this.modules.user) {
            this.modules.user.updateUserMenu();
        }
    }

    /**
     * Add event listener with automatic cleanup
     */
    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, []);
        }
        this.eventListeners.get(element).push({ event, handler });
    }

    /**
     * Remove all event listeners for cleanup
     */
    removeAllEventListeners() {
        this.eventListeners.forEach((listeners, element) => {
            listeners.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler);
            });
        });
        this.eventListeners.clear();
    }

    /**
     * Event handlers
     */
    onWindowLoad() {
        this.log('Window loaded');
        this.modules.animations.animateOnLoad();
    }

    onWindowResize() {
        this.modules.animations.handleResize();
    }

    onWindowScroll() {
        this.modules.navigation.handleScroll();
        this.modules.animations.handleScroll();
    }

    onDOMReady() {
        this.log('DOM ready');
        this.modules.animations.observeElements();
    }

    onDocumentClick(event) {
        // Handle global click events
        this.modules.navigation.handleClick(event);
        this.modules.notifications.handleClick(event);
    }

    onDocumentKeydown(event) {
        // Handle global keyboard events
        if (event.key === 'Escape') {
            this.modules.navigation.closeAllMenus();
            this.modules.notifications.closeAll();
        }
    }

    /**
     * Utility methods
     */
    log(...args) {
        if (this.config.debug) {
            console.log('[WanderlustApp]', ...args);
        }
    }

    error(...args) {
        console.error('[WanderlustApp]', ...args);
    }

    warn(...args) {
        console.warn('[WanderlustApp]', ...args);
    }

    /**
     * Get module by name
     */
    getModule(name) {
        return this.modules[name];
    }

    /**
     * Get application state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Update application state
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveState();
        this.updateUI();
    }

    /**
     * Cleanup and destroy application
     */
    destroy() {
        this.log('Destroying application...');
        this.removeAllEventListeners();
        this.modules = {};
        this.log('Application destroyed');
    }
}

// Export for use in other modules
window.WanderlustApp = WanderlustApp;
