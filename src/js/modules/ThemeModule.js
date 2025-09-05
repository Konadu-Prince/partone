/**
 * WANDERLUST TRAVEL - THEME MODULE
 * Handles dark/light theme switching
 */

class ThemeModule {
    constructor(app) {
        this.app = app;
        this.currentTheme = app.state.theme || 'light';
        this.elements = {
            themeToggle: document.querySelector('.theme-toggle'),
            body: document.body,
            glassElements: document.querySelectorAll('.glass-card, .glass-nav, .glass-overlay')
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme(this.currentTheme);
        this.updateThemeToggle();
    }

    setupEventListeners() {
        // Theme toggle button
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem(this.app.config.storage.theme)) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * Set specific theme
     */
    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.updateThemeToggle();
        this.saveTheme();
        this.updateGlassElements();
    }

    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        this.elements.body.className = this.elements.body.className.replace(/dark-theme|light-theme/g, '');
        this.elements.body.classList.add(`${theme}-theme`);
        
        // Update meta theme-color
        this.updateMetaThemeColor(theme);
        
        // Update CSS custom properties
        this.updateCSSVariables(theme);
    }

    /**
     * Update theme toggle button appearance
     */
    updateThemeToggle() {
        if (!this.elements.themeToggle) return;

        const icon = this.elements.themeToggle.querySelector('svg');
        if (icon) {
            if (this.currentTheme === 'dark') {
                // Sun icon for dark theme
                icon.innerHTML = `
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                `;
            } else {
                // Moon icon for light theme
                icon.innerHTML = `
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                `;
            }
        }
    }

    /**
     * Update meta theme-color for mobile browsers
     */
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#1e293b' : '#ffffff';
    }

    /**
     * Update CSS custom properties for theme
     */
    updateCSSVariables(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.style.setProperty('--bg-primary', 'var(--dark-900)');
            root.style.setProperty('--bg-secondary', 'var(--dark-800)');
            root.style.setProperty('--text-primary', 'var(--light-100)');
            root.style.setProperty('--text-secondary', 'var(--light-300)');
            root.style.setProperty('--border-color', 'var(--dark-700)');
        } else {
            root.style.setProperty('--bg-primary', 'var(--light-50)');
            root.style.setProperty('--bg-secondary', 'var(--light-100)');
            root.style.setProperty('--text-primary', 'var(--dark-900)');
            root.style.setProperty('--text-secondary', 'var(--dark-600)');
            root.style.setProperty('--border-color', 'var(--light-200)');
        }
    }

    /**
     * Update glass elements for theme
     */
    updateGlassElements() {
        this.elements.glassElements.forEach(element => {
            if (this.currentTheme === 'dark') {
                element.classList.add('glass-dark');
                element.classList.remove('glass-light');
            } else {
                element.classList.add('glass-light');
                element.classList.remove('glass-dark');
            }
        });
    }

    /**
     * Save theme preference
     */
    saveTheme() {
        this.app.setState({ theme: this.currentTheme });
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Check if dark theme is active
     */
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    /**
     * Check if light theme is active
     */
    isLightTheme() {
        return this.currentTheme === 'light';
    }

    /**
     * Get theme-specific color
     */
    getThemeColor(colorName) {
        const colorMap = {
            light: {
                primary: 'var(--primary-500)',
                secondary: 'var(--secondary-500)',
                background: 'var(--light-50)',
                surface: 'var(--light-100)',
                text: 'var(--dark-900)',
                textSecondary: 'var(--dark-600)'
            },
            dark: {
                primary: 'var(--primary-400)',
                secondary: 'var(--secondary-400)',
                background: 'var(--dark-900)',
                surface: 'var(--dark-800)',
                text: 'var(--light-100)',
                textSecondary: 'var(--light-300)'
            }
        };
        
        return colorMap[this.currentTheme]?.[colorName] || colorMap.light[colorName];
    }

    /**
     * Apply theme to specific element
     */
    applyThemeToElement(element, theme = this.currentTheme) {
        if (!element) return;
        
        element.classList.remove('light-theme', 'dark-theme');
        element.classList.add(`${theme}-theme`);
        
        // Update glass effect if present
        if (element.classList.contains('glass-card') || 
            element.classList.contains('glass-nav') || 
            element.classList.contains('glass-overlay')) {
            this.updateGlassElements();
        }
    }

    /**
     * Create theme-aware element
     */
    createThemedElement(tagName, className = '', content = '') {
        const element = document.createElement(tagName);
        element.className = `${className} ${this.currentTheme}-theme`;
        element.innerHTML = content;
        return element;
    }

    /**
     * Get theme transition duration
     */
    getTransitionDuration() {
        return this.app.config.animations.duration;
    }

    /**
     * Animate theme transition
     */
    animateThemeTransition(newTheme, callback) {
        const duration = this.getTransitionDuration();
        
        // Add transition class
        this.elements.body.style.transition = `background-color ${duration}ms ease-in-out, color ${duration}ms ease-in-out`;
        
        // Apply new theme
        this.setTheme(newTheme);
        
        // Remove transition class after animation
        setTimeout(() => {
            this.elements.body.style.transition = '';
            if (callback) callback();
        }, duration);
    }
}

// Export for use in main app
window.ThemeModule = ThemeModule;
