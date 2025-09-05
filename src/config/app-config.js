/**
 * WANDERLUST TRAVEL - APPLICATION CONFIGURATION
 * Centralized configuration management following waterfall methodology
 */

const AppConfig = {
    // Application metadata
    app: {
        name: 'Wanderlust Travel',
        version: '1.0.0',
        description: 'Premium travel booking platform with modern UI',
        author: 'Wanderlust Team',
        url: 'https://wanderlust-travel.com',
        debug: false
    },

    // API configuration
    api: {
        baseUrl: '/api',
        version: 'v1',
        timeout: 10000,
        retries: 3,
        endpoints: {
            destinations: '/destinations',
            packages: '/packages',
            blog: '/blog',
            users: '/users',
            bookings: '/bookings',
            search: '/search',
            contact: '/contact'
        }
    },

    // Storage configuration
    storage: {
        prefix: 'wanderlust_',
        keys: {
            cart: 'cart',
            wishlist: 'wishlist',
            theme: 'theme',
            user: 'user',
            preferences: 'preferences',
            searchHistory: 'search_history'
        },
        expiration: {
            cart: 7 * 24 * 60 * 60 * 1000, // 7 days
            wishlist: 30 * 24 * 60 * 60 * 1000, // 30 days
            user: 24 * 60 * 60 * 1000, // 24 hours
            preferences: 365 * 24 * 60 * 60 * 1000 // 1 year
        }
    },

    // UI configuration
    ui: {
        theme: {
            default: 'light',
            available: ['light', 'dark'],
            autoDetect: true
        },
        animations: {
            enabled: true,
            duration: 300,
            easing: 'ease-in-out',
            reducedMotion: false
        },
        breakpoints: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536
        },
        zIndex: {
            dropdown: 1000,
            sticky: 1020,
            fixed: 1030,
            modalBackdrop: 1040,
            modal: 1050,
            popover: 1060,
            tooltip: 1070,
            toast: 1080
        }
    },

    // Feature flags
    features: {
        search: true,
        cart: true,
        wishlist: true,
        themeToggle: true,
        animations: true,
        notifications: true,
        offline: false,
        pwa: false,
        analytics: false
    },

    // Content configuration
    content: {
        destinations: {
            itemsPerPage: 12,
            featuredCount: 6,
            categories: ['beach', 'mountain', 'city', 'adventure', 'cultural', 'luxury']
        },
        blog: {
            itemsPerPage: 9,
            featuredCount: 3,
            categories: ['travel-tips', 'destinations', 'guides', 'reviews', 'news']
        },
        testimonials: {
            autoRotate: true,
            rotationInterval: 5000,
            showDots: true,
            showArrows: true
        }
    },

    // Search configuration
    search: {
        debounceDelay: 300,
        minQueryLength: 2,
        maxResults: 10,
        highlightMatches: true,
        categories: ['destinations', 'packages', 'blog'],
        filters: {
            price: {
                min: 0,
                max: 10000,
                step: 100
            },
            duration: {
                min: 1,
                max: 30,
                step: 1
            },
            rating: {
                min: 1,
                max: 5,
                step: 0.5
            }
        }
    },

    // Notification configuration
    notifications: {
        position: 'top-right',
        duration: 5000,
        maxVisible: 5,
        types: {
            success: {
                icon: '✓',
                color: '#10b981',
                duration: 3000
            },
            error: {
                icon: '✕',
                color: '#ef4444',
                duration: 7000
            },
            warning: {
                icon: '⚠',
                color: '#f59e0b',
                duration: 5000
            },
            info: {
                icon: 'ℹ',
                color: '#3b82f6',
                duration: 4000
            }
        }
    },

    // Form configuration
    forms: {
        validation: {
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                pattern: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number'
            },
            password: {
                minLength: 8,
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecialChars: false
            }
        },
        autoSave: true,
        autoSaveDelay: 2000
    },

    // Social media links
    social: {
        facebook: 'https://facebook.com/wanderlusttravel',
        twitter: 'https://twitter.com/wanderlusttravel',
        instagram: 'https://instagram.com/wanderlusttravel',
        linkedin: 'https://linkedin.com/company/wanderlusttravel',
        youtube: 'https://youtube.com/wanderlusttravel'
    },

    // Contact information
    contact: {
        email: 'info@wanderlust-travel.com',
        phone: '+1 (555) 123-4567',
        address: {
            street: '123 Travel Street',
            city: 'Adventure City',
            state: 'AC',
            zip: '12345',
            country: 'United States'
        },
        hours: {
            weekdays: '9:00 AM - 6:00 PM',
            weekends: '10:00 AM - 4:00 PM',
            timezone: 'EST'
        }
    },

    // SEO configuration
    seo: {
        title: 'Wanderlust Travel - Premium Travel Experiences',
        description: 'Discover amazing destinations, book premium travel packages, and create unforgettable memories with Wanderlust Travel.',
        keywords: ['travel', 'destinations', 'vacation', 'booking', 'adventure', 'luxury travel'],
        ogImage: '/assets/images/og-image.jpg',
        twitterCard: 'summary_large_image'
    },

    // Performance configuration
    performance: {
        lazyLoading: true,
        imageOptimization: true,
        preloadCritical: true,
        cacheStrategy: 'stale-while-revalidate',
        compression: true
    },

    // Security configuration
    security: {
        csrfProtection: true,
        xssProtection: true,
        contentSecurityPolicy: true,
        rateLimiting: {
            enabled: true,
            maxRequests: 100,
            windowMs: 15 * 60 * 1000 // 15 minutes
        }
    },

    // Analytics configuration
    analytics: {
        enabled: false,
        providers: {
            google: {
                trackingId: null
            },
            facebook: {
                pixelId: null
            }
        },
        events: {
            pageView: true,
            userInteraction: true,
            ecommerce: true,
            custom: true
        }
    },

    // Development configuration
    development: {
        hotReload: true,
        sourceMaps: true,
        debugMode: false,
        mockData: true,
        devTools: true
    }
};

// Environment-specific overrides
const environment = process.env.NODE_ENV || 'development';

if (environment === 'production') {
    AppConfig.app.debug = false;
    AppConfig.development.debugMode = false;
    AppConfig.development.mockData = false;
    AppConfig.analytics.enabled = true;
} else if (environment === 'development') {
    AppConfig.app.debug = true;
    AppConfig.development.debugMode = true;
    AppConfig.development.mockData = true;
}

// Utility functions for configuration access
const ConfigUtils = {
    /**
     * Get configuration value by path
     */
    get(path, defaultValue = null) {
        return path.split('.').reduce((obj, key) => {
            return obj && obj[key] !== undefined ? obj[key] : defaultValue;
        }, AppConfig);
    },

    /**
     * Set configuration value by path
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, AppConfig);
        target[lastKey] = value;
    },

    /**
     * Check if feature is enabled
     */
    isFeatureEnabled(feature) {
        return AppConfig.features[feature] === true;
    },

    /**
     * Get storage key with prefix
     */
    getStorageKey(key) {
        return `${AppConfig.storage.prefix}${key}`;
    },

    /**
     * Get API endpoint URL
     */
    getApiUrl(endpoint) {
        return `${AppConfig.api.baseUrl}${AppConfig.api.endpoints[endpoint] || endpoint}`;
    },

    /**
     * Get breakpoint value
     */
    getBreakpoint(name) {
        return AppConfig.ui.breakpoints[name];
    },

    /**
     * Check if current screen size matches breakpoint
     */
    isBreakpoint(name) {
        const breakpoint = this.getBreakpoint(name);
        return window.innerWidth >= breakpoint;
    }
};

// Export configuration
window.AppConfig = AppConfig;
window.ConfigUtils = ConfigUtils;

// Make configuration available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppConfig, ConfigUtils };
}
