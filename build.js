#!/usr/bin/env node

/**
 * WANDERLUST TRAVEL - BUILD SYSTEM
 * Waterfall methodology build process
 */

const fs = require('fs');
const path = require('path');

class WanderlustBuilder {
    constructor() {
        this.srcDir = './src';
        this.distDir = './dist';
        this.config = {
            minify: process.env.NODE_ENV === 'production',
            sourcemaps: process.env.NODE_ENV !== 'production',
            version: '1.0.0'
        };
    }

    /**
     * Main build process
     */
    async build() {
        console.log('🚀 Starting Wanderlust Travel build process...');
        
        try {
            // Clean dist directory
            this.cleanDist();
            
            // Create dist structure
            this.createDistStructure();
            
            // Build CSS
            await this.buildCSS();
            
            // Build JavaScript
            await this.buildJS();
            
            // Copy assets
            this.copyAssets();
            
            // Copy HTML files
            this.copyHTML();
            
            // Generate build info
            this.generateBuildInfo();
            
            console.log('✅ Build completed successfully!');
            console.log(`📦 Output: ${this.distDir}`);
            
        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
    }

    /**
     * Clean distribution directory
     */
    cleanDist() {
        if (fs.existsSync(this.distDir)) {
            fs.rmSync(this.distDir, { recursive: true, force: true });
        }
        fs.mkdirSync(this.distDir, { recursive: true });
        console.log('🧹 Cleaned dist directory');
    }

    /**
     * Create distribution structure
     */
    createDistStructure() {
        const dirs = [
            'css',
            'js',
            'assets/images',
            'assets/icons',
            'assets/fonts',
            'components',
            'templates'
        ];
        
        dirs.forEach(dir => {
            fs.mkdirSync(path.join(this.distDir, dir), { recursive: true });
        });
        
        console.log('📁 Created dist structure');
    }

    /**
     * Build CSS files
     */
    async buildCSS() {
        console.log('🎨 Building CSS...');
        
        // Check if main CSS file exists
        const mainCSSPath = path.join(this.srcDir, 'css/main.css');
        if (!fs.existsSync(mainCSSPath)) {
            console.log('⚠️  Main CSS file not found, using inline-styles.css');
            // Copy inline-styles.css if it exists
            const inlineCSSPath = './inline-styles.css';
            if (fs.existsSync(inlineCSSPath)) {
                const inlineCSS = fs.readFileSync(inlineCSSPath, 'utf8');
                const finalCSS = this.config.minify ? this.minifyCSS(inlineCSS) : inlineCSS;
                fs.writeFileSync(path.join(this.distDir, 'css/wanderlust-styles.css'), finalCSS);
                console.log('✅ CSS built from inline-styles.css');
                return;
            }
        }
        
        // Read main CSS file
        const mainCSS = fs.readFileSync(mainCSSPath, 'utf8');
        
        // Process imports
        const processedCSS = await this.processCSSImports(mainCSS);
        
        // Minify if in production
        const finalCSS = this.config.minify ? this.minifyCSS(processedCSS) : processedCSS;
        
        // Write to dist
        fs.writeFileSync(path.join(this.distDir, 'css/wanderlust-styles.css'), finalCSS);
        
        console.log('✅ CSS built successfully');
    }

    /**
     * Process CSS imports
     */
    async processCSSImports(css, basePath = '') {
        const importRegex = /@import\s+url\(['"]([^'"]+)['"]\);/g;
        let processedCSS = css;
        let match;
        
        while ((match = importRegex.exec(css)) !== null) {
            const importPath = path.join(this.srcDir, 'css', basePath, match[1]);
            
            if (fs.existsSync(importPath)) {
                const importedCSS = fs.readFileSync(importPath, 'utf8');
                const relativePath = path.dirname(match[1]);
                const processedImport = await this.processCSSImports(importedCSS, relativePath);
                processedCSS = processedCSS.replace(match[0], processedImport);
            } else {
                console.warn(`⚠️  CSS import not found: ${importPath}`);
            }
        }
        
        return processedCSS;
    }

    /**
     * Build JavaScript files
     */
    async buildJS() {
        console.log('⚡ Building JavaScript...');
        
        // Check if main JS file exists
        const mainJSPath = path.join(this.srcDir, 'js/main.js');
        if (!fs.existsSync(mainJSPath)) {
            console.log('⚠️  Main JS file not found, using wanderlust-app.js');
            // Copy wanderlust-app.js if it exists
            const appJSPath = './wanderlust-app.js';
            if (fs.existsSync(appJSPath)) {
                const appJS = fs.readFileSync(appJSPath, 'utf8');
                const finalJS = this.config.minify ? this.minifyJS(appJS) : appJS;
                fs.writeFileSync(path.join(this.distDir, 'js/wanderlust-app.js'), finalJS);
                console.log('✅ JavaScript built from wanderlust-app.js');
                return;
            }
        }
        
        // Read main JS file
        const mainJS = fs.readFileSync(mainJSPath, 'utf8');
        
        // Process imports
        const processedJS = await this.processJSImports(mainJS);
        
        // Minify if in production
        const finalJS = this.config.minify ? this.minifyJS(processedJS) : processedJS;
        
        // Write to dist
        fs.writeFileSync(path.join(this.distDir, 'js/wanderlust-app.js'), finalJS);
        
        console.log('✅ JavaScript built successfully');
    }

    /**
     * Process JavaScript imports
     */
    async processJSImports(js) {
        const importRegex = /importScripts\(['"]([^'"]+)['"]\);/g;
        let processedJS = js;
        let match;
        
        while ((match = importRegex.exec(js)) !== null) {
            const importPath = path.join(this.srcDir, 'js', match[1]);
            
            if (fs.existsSync(importPath)) {
                const importedJS = fs.readFileSync(importPath, 'utf8');
                processedJS = processedJS.replace(match[0], `\n// ${match[1]}\n${importedJS}\n`);
            } else {
                console.warn(`⚠️  JS import not found: ${importPath}`);
            }
        }
        
        return processedJS;
    }

    /**
     * Copy assets
     */
    copyAssets() {
        console.log('📦 Copying assets...');
        
        // Copy travel assets
        if (fs.existsSync('./travel-assets')) {
            fs.cpSync('./travel-assets', path.join(this.distDir, 'assets/images'), { recursive: true });
        }
        
        // Copy other assets if they exist
        const assetDirs = ['images', 'icons', 'fonts'];
        assetDirs.forEach(dir => {
            const srcPath = path.join(this.srcDir, 'assets', dir);
            const distPath = path.join(this.distDir, 'assets', dir);
            
            if (fs.existsSync(srcPath)) {
                fs.cpSync(srcPath, distPath, { recursive: true });
            }
        });
        
        // Copy PWA files
        const pwaFiles = ['manifest.json', 'sw.js'];
        pwaFiles.forEach(file => {
            if (fs.existsSync(file)) {
                fs.copyFileSync(file, path.join(this.distDir, file));
                console.log(`📱 Copied PWA file: ${file}`);
            }
        });
        
        console.log('✅ Assets copied');
    }

    /**
     * Copy HTML files
     */
    copyHTML() {
        console.log('📄 Copying HTML files...');
        
        const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
        
        htmlFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            
            // Update asset paths for dist
            let updatedContent = content
                .replace(/wanderlust-styles\.css/g, 'css/wanderlust-styles.css')
                .replace(/wanderlust-app\.js/g, 'js/wanderlust-app.js')
                .replace(/travel-assets\//g, 'assets/images/');
            
            // Add PWA meta tags if not present
            if (!updatedContent.includes('manifest.json')) {
                updatedContent = updatedContent.replace(
                    '<head>',
                    `<head>
    <!-- PWA Meta Tags -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#3498db">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Wanderlust Travel">
    <link rel="apple-touch-icon" href="assets/icons/icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/icons/icon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/icons/icon-16x16.png">
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="Discover amazing travel destinations with Wanderlust Travel. Book your dream vacation with our modern travel platform.">
    <meta name="keywords" content="travel, tourism, vacation, destinations, booking, wanderlust">
    <meta name="author" content="Wanderlust Travel Team">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Wanderlust Travel - Book Your Dream Vacation">
    <meta property="og:description" content="Discover amazing travel destinations with Wanderlust Travel. Book your dream vacation with our modern travel platform.">
    <meta property="og:image" content="assets/images/hero-bg.jpg">
    <meta property="og:url" content="https://konadu-prince.github.io/wanderlust-travel-website">
    <meta property="og:type" content="website">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Wanderlust Travel - Book Your Dream Vacation">
    <meta name="twitter:description" content="Discover amazing travel destinations with Wanderlust Travel. Book your dream vacation with our modern travel platform.">
    <meta name="twitter:image" content="assets/images/hero-bg.jpg">`
                );
            }
            
            // Add service worker registration
            if (!updatedContent.includes('sw.js')) {
                updatedContent = updatedContent.replace(
                    '</body>',
                    `    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then((registration) => {
                        console.log('✅ Service Worker registered:', registration.scope);
                    })
                    .catch((error) => {
                        console.log('❌ Service Worker registration failed:', error);
                    });
            });
        }
    </script>
</body>`
                );
            }
            
            // Minify HTML in production
            if (this.config.minify) {
                updatedContent = this.minifyHTML(updatedContent);
            }
            
            fs.writeFileSync(path.join(this.distDir, file), updatedContent);
        });
        
        console.log('✅ HTML files copied and enhanced');
    }

    /**
     * Generate build information
     */
    generateBuildInfo() {
        const buildInfo = {
            version: this.config.version,
            buildTime: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            minified: this.config.minify,
            sourcemaps: this.config.sourcemaps
        };
        
        fs.writeFileSync(
            path.join(this.distDir, 'build-info.json'),
            JSON.stringify(buildInfo, null, 2)
        );
        
        console.log('📋 Build info generated');
    }

    /**
     * Simple CSS minification
     */
    minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
            .replace(/,\s+/g, ',') // Remove spaces after commas
            .replace(/:\s+/g, ':') // Remove spaces after colons
            .trim();
    }

    /**
     * Simple JavaScript minification
     */
    minifyJS(js) {
        return js
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
            .trim();
    }

    /**
     * Simple HTML minification
     */
    minifyHTML(html) {
        return html
            .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/>\s+</g, '><') // Remove whitespace between tags
            .trim();
    }

    /**
     * Watch for changes during development
     */
    watch() {
        console.log('👀 Watching for changes...');
        
        const watchPaths = [
            path.join(this.srcDir, 'css'),
            path.join(this.srcDir, 'js'),
            './*.html'
        ];
        
        watchPaths.forEach(watchPath => {
            if (fs.existsSync(watchPath)) {
                fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
                    if (filename && (filename.endsWith('.css') || filename.endsWith('.js') || filename.endsWith('.html'))) {
                        console.log(`🔄 File changed: ${filename}`);
                        this.build();
                    }
                });
            }
        });
    }
}

// CLI interface
if (require.main === module) {
    const builder = new WanderlustBuilder();
    const command = process.argv[2];
    
    switch (command) {
        case 'build':
            builder.build();
            break;
        case 'watch':
            builder.watch();
            break;
        case 'clean':
            builder.cleanDist();
            break;
        default:
            console.log('Usage: node build.js [build|watch|clean]');
            console.log('  build - Build the project');
            console.log('  watch - Watch for changes and rebuild');
            console.log('  clean - Clean dist directory');
    }
}

module.exports = WanderlustBuilder;

