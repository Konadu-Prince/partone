/**
 * WANDERLUST TRAVEL - CORE APPLICATION
 * Main Application Controller
 * Waterfall Methodology Implementation
 */

class WanderlustApp {
    constructor() {
        this.config = null;
        this.modules = new Map();
        this.state = {
            theme: 'light',
            cart: [],
            wishlist: [],
            user: null,
            searchQuery: '',
            currentPage: 'home'
        };
        this.eventListeners = new Map();
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing Wanderlust Travel App...');
            
            // Load configuration
            await this.loadConfig();
            
            // Initialize modules
            await this.initializeModules();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load saved state
            this.loadState();
            
            // Initialize UI
            this.initializeUI();
            
            this.isInitialized = true;
            console.log('✅ Wanderlust Travel App initialized successfully');
            
            // Dispatch ready event
            this.dispatchEvent('app:ready', { app: this });
            
        } catch (error) {
            console.error('❌ Failed to initialize Wanderlust Travel App:', error);
            this.handleError(error);
        }
    }

    /**
     * Load application configuration
     */
    async loadConfig() {
        try {
            // Try to load from config file
            if (typeof AppConfig !== 'undefined') {
                this.config = AppConfig;
            } else {
                // Fallback configuration
                this.config = {
                    app: {
                        name: 'Wanderlust Travel',
                        version: '1.0.0',
                        environment: 'production'
                    },
                    api: {
                        baseUrl: '/api',
                        timeout: 10000
                    },
                    storage: {
                        prefix: 'wanderlust_',
                        version: '1.0.0'
                    },
                    ui: {
                        theme: 'light',
                        animations: true,
                        transitions: true
                    },
                    features: {
                        cart: true,
                        wishlist: true,
                        search: true,
                        themes: true,
                        notifications: true
                    }
                };
            }
            
            console.log('📋 Configuration loaded:', this.config);
        } catch (error) {
            console.warn('⚠️ Failed to load configuration, using defaults:', error);
        }
    }

    /**
     * Initialize all modules
     */
    async initializeModules() {
        const moduleNames = [
            'CartModule',
            'ThemeModule',
            'SearchModule',
            'NavigationModule',
            'FormsModule',
            'NotificationModule',
            'AnimationModule'
        ];

        for (const moduleName of moduleNames) {
            try {
                await this.initializeModule(moduleName);
            } catch (error) {
                console.warn(`⚠️ Failed to initialize ${moduleName}:`, error);
            }
        }
    }

    /**
     * Initialize a specific module
     */
    async initializeModule(moduleName) {
        try {
            // Check if module class exists
            if (typeof window[moduleName] === 'undefined') {
                console.warn(`⚠️ Module ${moduleName} not found`);
                return;
            }

            // Create module instance
            const module = new window[moduleName](this);
            
            // Initialize module
            if (typeof module.init === 'function') {
                await module.init();
            }
            
            // Store module
            this.modules.set(moduleName, module);
            
            console.log(`✅ Module ${moduleName} initialized`);
        } catch (error) {
            console.error(`❌ Failed to initialize module ${moduleName}:`, error);
            throw error;
        }
    }

    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Theme change events
        this.addEventListener('theme:change', (event) => {
            this.state.theme = event.detail.theme;
            this.saveState();
        });

        // Cart events
        this.addEventListener('cart:add', (event) => {
            this.state.cart.push(event.detail.item);
            this.saveState();
        });

        this.addEventListener('cart:remove', (event) => {
            this.state.cart = this.state.cart.filter(item => item.id !== event.detail.id);
            this.saveState();
        });

        // Wishlist events
        this.addEventListener('wishlist:add', (event) => {
            this.state.wishlist.push(event.detail.item);
            this.saveState();
        });

        this.addEventListener('wishlist:remove', (event) => {
            this.state.wishlist = this.state.wishlist.filter(item => item.id !== event.detail.id);
            this.saveState();
        });

        // Search events
        this.addEventListener('search:query', (event) => {
            this.state.searchQuery = event.detail.query;
        });

        // Navigation events
        this.addEventListener('navigation:change', (event) => {
            this.state.currentPage = event.detail.page;
        });

        // Error handling
        window.addEventListener('error', (event) => {
            this.handleError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason);
        });
    }

    /**
     * Load saved state from localStorage
     */
    loadState() {
        try {
            const savedState = localStorage.getItem(`${this.config.storage.prefix}state`);
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                this.state = { ...this.state, ...parsedState };
                console.log('💾 State loaded from storage');
            }
        } catch (error) {
            console.warn('⚠️ Failed to load state from storage:', error);
        }
    }

    /**
     * Save current state to localStorage
     */
    saveState() {
        try {
            localStorage.setItem(
                `${this.config.storage.prefix}state`,
                JSON.stringify(this.state)
            );
        } catch (error) {
            console.warn('⚠️ Failed to save state to storage:', error);
        }
    }

    /**
     * Initialize UI components
     */
    initializeUI() {
        // Apply saved theme
        if (this.state.theme) {
            document.documentElement.setAttribute('data-theme', this.state.theme);
        }

        // Initialize lazy loading for images
        this.initializeLazyLoading();

        // Initialize scroll animations
        this.initializeScrollAnimations();

        // Initialize form validation
        this.initializeFormValidation();
    }

    /**
     * Initialize lazy loading for images
     */
    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Initialize scroll animations
     */
    initializeScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fadeInUp');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    /**
     * Initialize form validation
     */
    initializeFormValidation() {
        document.querySelectorAll('form[data-validate]').forEach(form => {
            form.addEventListener('submit', (event) => {
                if (!this.validateForm(form)) {
                    event.preventDefault();
                }
            });
        });
    }

    /**
     * Validate a form
     */
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        return isValid;
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Add event listener
     */
    addEventListener(event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(handler);
    }

    /**
     * Remove event listener
     */
    removeEventListener(event, handler) {
        if (this.eventListeners.has(event)) {
            const handlers = this.eventListeners.get(event);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    /**
     * Dispatch event
     */
    dispatchEvent(event, detail = {}) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(handler => {
                try {
                    handler({ detail });
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Get module by name
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Update state
     */
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.saveState();
    }

    /**
     * Handle errors
     */
    handleError(error) {
        console.error('🚨 Application Error:', error);
        
        // Show user-friendly error message
        this.dispatchEvent('notification:show', {
            type: 'error',
            message: 'Something went wrong. Please try again.',
            duration: 5000
        });
    }

    /**
     * Cleanup resources
     */
    destroy() {
        // Remove event listeners
        this.eventListeners.clear();
        
        // Destroy modules
        this.modules.forEach(module => {
            if (typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        this.modules.clear();
        
        console.log('🧹 Wanderlust Travel App destroyed');
    }
}

// Global app instance
window.WanderlustApp = WanderlustApp;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new WanderlustApp();
        window.app.init();
    });
} else {
    window.app = new WanderlustApp();
    window.app.init();
}
