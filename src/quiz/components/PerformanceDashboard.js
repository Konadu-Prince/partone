/**
 * WANDERLUST TRAVEL - PERFORMANCE DASHBOARD
 * Component Layer - Performance Monitoring
 * Waterfall Methodology - Component Layer
 * Design Pattern: Observer Pattern + Facade Pattern
 */

class PerformanceDashboard {
    constructor() {
        this.performanceOptimizer = new PerformanceOptimizer();
        this.errorHandler = new ErrorHandler();
        this.rateLimiter = new RateLimiter();
        this.metrics = {
            performance: {},
            errors: {},
            rateLimiting: {},
            cache: {},
            memory: {}
        };
        
        this.updateInterval = 5000; // 5 seconds
        this.isVisible = false;
        this.dashboardElement = null;
        
        this.setupEventListeners();
        this.startMonitoring();
    }
    
    /**
     * Setup event listeners for performance monitoring
     */
    setupEventListeners() {
        // Listen for performance events
        document.addEventListener('performance:metric', (event) => {
            this.updateMetric(event.detail);
        });
        
        // Listen for error events
        document.addEventListener('error:occurred', (event) => {
            this.updateErrorMetric(event.detail);
        });
        
        // Listen for rate limiting events
        document.addEventListener('rate:limit:exceeded', (event) => {
            this.updateRateLimitMetric(event.detail);
        });
    }
    
    /**
     * Start performance monitoring
     */
    startMonitoring() {
        setInterval(() => {
            this.collectMetrics();
            if (this.isVisible) {
                this.updateDashboard();
            }
        }, this.updateInterval);
    }
    
    /**
     * Collect performance metrics
     */
    collectMetrics() {
        try {
            // Performance metrics
            this.metrics.performance = this.performanceOptimizer.getMetrics();
            
            // Error metrics
            this.metrics.errors = this.errorHandler.getErrorStats();
            
            // Rate limiting metrics
            this.metrics.rateLimiting = this.rateLimiter.getStats();
            
            // Memory metrics
            this.metrics.memory = this.getMemoryMetrics();
            
            // Cache metrics
            this.metrics.cache = this.getCacheMetrics();
            
        } catch (error) {
            console.error('Error collecting performance metrics:', error);
        }
    }
    
    /**
     * Get memory metrics
     */
    getMemoryMetrics() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit,
                usagePercentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
            };
        }
        return { used: 0, total: 0, limit: 0, usagePercentage: 0 };
    }
    
    /**
     * Get cache metrics
     */
    getCacheMetrics() {
        // This would get metrics from cache manager
        return {
            size: 0,
            hitRate: 0,
            missRate: 0
        };
    }
    
    /**
     * Update metric
     */
    updateMetric(metric) {
        this.metrics.performance[metric.name] = metric.value;
    }
    
    /**
     * Update error metric
     */
    updateErrorMetric(error) {
        if (!this.metrics.errors[error.type]) {
            this.metrics.errors[error.type] = 0;
        }
        this.metrics.errors[error.type]++;
    }
    
    /**
     * Update rate limit metric
     */
    updateRateLimitMetric(rateLimit) {
        if (!this.metrics.rateLimiting[rateLimit.action]) {
            this.metrics.rateLimiting[rateLimit.action] = 0;
        }
        this.metrics.rateLimiting[rateLimit.action]++;
    }
    
    /**
     * Show performance dashboard
     */
    show() {
        if (!this.dashboardElement) {
            this.createDashboard();
        }
        
        this.dashboardElement.style.display = 'block';
        this.isVisible = true;
        this.updateDashboard();
    }
    
    /**
     * Hide performance dashboard
     */
    hide() {
        if (this.dashboardElement) {
            this.dashboardElement.style.display = 'none';
        }
        this.isVisible = false;
    }
    
    /**
     * Toggle performance dashboard
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * Create performance dashboard
     */
    createDashboard() {
        this.dashboardElement = document.createElement('div');
        this.dashboardElement.id = 'performance-dashboard';
        this.dashboardElement.className = 'performance-dashboard';
        this.dashboardElement.innerHTML = `
            <div class="dashboard-header">
                <h3>🚀 Performance Dashboard</h3>
                <button class="close-btn" onclick="performanceDashboard.hide()">×</button>
            </div>
            <div class="dashboard-content">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h4>📊 Performance</h4>
                        <div id="performance-metrics"></div>
                    </div>
                    <div class="metric-card">
                        <h4>❌ Errors</h4>
                        <div id="error-metrics"></div>
                    </div>
                    <div class="metric-card">
                        <h4>🚦 Rate Limiting</h4>
                        <div id="rate-limit-metrics"></div>
                    </div>
                    <div class="metric-card">
                        <h4>💾 Memory</h4>
                        <div id="memory-metrics"></div>
                    </div>
                    <div class="metric-card">
                        <h4>🗄️ Cache</h4>
                        <div id="cache-metrics"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        this.addDashboardStyles();
        
        document.body.appendChild(this.dashboardElement);
    }
    
    /**
     * Add dashboard styles
     */
    addDashboardStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .performance-dashboard {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 600px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: monospace;
                font-size: 12px;
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background: #f5f5f5;
                border-bottom: 1px solid #ddd;
                border-radius: 8px 8px 0 0;
            }
            
            .dashboard-header h3 {
                margin: 0;
                font-size: 14px;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
            }
            
            .dashboard-content {
                padding: 10px;
                max-height: 500px;
                overflow-y: auto;
            }
            
            .metrics-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .metric-card {
                border: 1px solid #eee;
                border-radius: 4px;
                padding: 8px;
            }
            
            .metric-card h4 {
                margin: 0 0 8px 0;
                font-size: 12px;
                color: #333;
            }
            
            .metric-item {
                display: flex;
                justify-content: space-between;
                margin: 2px 0;
                font-size: 11px;
            }
            
            .metric-value {
                font-weight: bold;
            }
            
            .metric-good { color: #27ae60; }
            .metric-warning { color: #f39c12; }
            .metric-error { color: #e74c3c; }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Update dashboard display
     */
    updateDashboard() {
        if (!this.dashboardElement) return;
        
        // Update performance metrics
        const performanceElement = document.getElementById('performance-metrics');
        if (performanceElement) {
            performanceElement.innerHTML = this.renderPerformanceMetrics();
        }
        
        // Update error metrics
        const errorElement = document.getElementById('error-metrics');
        if (errorElement) {
            errorElement.innerHTML = this.renderErrorMetrics();
        }
        
        // Update rate limit metrics
        const rateLimitElement = document.getElementById('rate-limit-metrics');
        if (rateLimitElement) {
            rateLimitElement.innerHTML = this.renderRateLimitMetrics();
        }
        
        // Update memory metrics
        const memoryElement = document.getElementById('memory-metrics');
        if (memoryElement) {
            memoryElement.innerHTML = this.renderMemoryMetrics();
        }
        
        // Update cache metrics
        const cacheElement = document.getElementById('cache-metrics');
        if (cacheElement) {
            cacheElement.innerHTML = this.renderCacheMetrics();
        }
    }
    
    /**
     * Render performance metrics
     */
    renderPerformanceMetrics() {
        const metrics = this.metrics.performance;
        return `
            <div class="metric-item">
                <span>Cache Hit Rate:</span>
                <span class="metric-value ${metrics.cache?.hitRate > 80 ? 'metric-good' : 'metric-warning'}">
                    ${metrics.cache?.hitRate?.toFixed(1) || 0}%
                </span>
            </div>
            <div class="metric-item">
                <span>Memory Usage:</span>
                <span class="metric-value ${metrics.memory?.usagePercentage < 70 ? 'metric-good' : 'metric-warning'}">
                    ${metrics.memory?.formattedUsage || '0 MB'}
                </span>
            </div>
        `;
    }
    
    /**
     * Render error metrics
     */
    renderErrorMetrics() {
        const metrics = this.metrics.errors;
        return `
            <div class="metric-item">
                <span>Total Errors:</span>
                <span class="metric-value ${metrics.totalErrors === 0 ? 'metric-good' : 'metric-error'}">
                    ${metrics.totalErrors || 0}
                </span>
            </div>
            <div class="metric-item">
                <span>Recent Errors:</span>
                <span class="metric-value">
                    ${metrics.recentErrors?.length || 0}
                </span>
            </div>
        `;
    }
    
    /**
     * Render rate limit metrics
     */
    renderRateLimitMetrics() {
        const metrics = this.metrics.rateLimiting;
        return `
            <div class="metric-item">
                <span>Total Users:</span>
                <span class="metric-value">${metrics.totalUsers || 0}</span>
            </div>
            <div class="metric-item">
                <span>Total Requests:</span>
                <span class="metric-value">${metrics.totalRequests || 0}</span>
            </div>
        `;
    }
    
    /**
     * Render memory metrics
     */
    renderMemoryMetrics() {
        const metrics = this.metrics.memory;
        return `
            <div class="metric-item">
                <span>Used:</span>
                <span class="metric-value ${metrics.usagePercentage < 70 ? 'metric-good' : 'metric-warning'}">
                    ${this.formatBytes(metrics.used)}
                </span>
            </div>
            <div class="metric-item">
                <span>Usage:</span>
                <span class="metric-value ${metrics.usagePercentage < 70 ? 'metric-good' : 'metric-warning'}">
                    ${metrics.usagePercentage?.toFixed(1) || 0}%
                </span>
            </div>
        `;
    }
    
    /**
     * Render cache metrics
     */
    renderCacheMetrics() {
        const metrics = this.metrics.cache;
        return `
            <div class="metric-item">
                <span>Cache Size:</span>
                <span class="metric-value">${metrics.size || 0}</span>
            </div>
            <div class="metric-item">
                <span>Hit Rate:</span>
                <span class="metric-value ${metrics.hitRate > 80 ? 'metric-good' : 'metric-warning'}">
                    ${metrics.hitRate?.toFixed(1) || 0}%
                </span>
            </div>
        `;
    }
    
    /**
     * Format bytes for display
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Export performance data
     */
    exportData() {
        const data = {
            timestamp: Date.now(),
            metrics: this.metrics,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceDashboard;
} else {
    window.PerformanceDashboard = PerformanceDashboard;
}
