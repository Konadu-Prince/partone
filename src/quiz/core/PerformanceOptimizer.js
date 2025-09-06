/**
 * WANDERLUST TRAVEL - PERFORMANCE OPTIMIZER
 * Foundation Layer - Performance Optimization Core
 * Waterfall Methodology - Foundation Layer
 * Design Pattern: Singleton + Strategy Pattern
 */

class PerformanceOptimizer {
    constructor() {
        if (PerformanceOptimizer.instance) {
            return PerformanceOptimizer.instance;
        }
        
        this.strategies = new Map();
        this.cacheManager = new CacheManager();
        this.memoryManager = new MemoryManager();
        this.indexManager = new IndexManager();
        
        this.initializeStrategies();
        PerformanceOptimizer.instance = this;
    }
    
    /**
     * Initialize optimization strategies
     */
    initializeStrategies() {
        // Strategy Pattern for different optimization types
        this.strategies.set('database', new DatabaseOptimizationStrategy());
        this.strategies.set('memory', new MemoryOptimizationStrategy());
        this.strategies.set('cache', new CacheOptimizationStrategy());
        this.strategies.set('rendering', new RenderingOptimizationStrategy());
    }
    
    /**
     * Apply optimization strategy
     */
    optimize(type, context) {
        const strategy = this.strategies.get(type);
        if (!strategy) {
            throw new Error(`Unknown optimization strategy: ${type}`);
        }
        
        return strategy.optimize(context);
    }
    
    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            cache: this.cacheManager.getMetrics(),
            memory: this.memoryManager.getMetrics(),
            index: this.indexManager.getMetrics(),
            timestamp: Date.now()
        };
    }
}

/**
 * CACHE MANAGER - Singleton Pattern
 * Foundation Layer - Caching Strategy
 */
class CacheManager {
    constructor() {
        if (CacheManager.instance) {
            return CacheManager.instance;
        }
        
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.maxCacheSize = 1000;
        this.hitCount = 0;
        this.missCount = 0;
        
        CacheManager.instance = this;
    }
    
    /**
     * Get cached data
     */
    get(key) {
        const item = this.cache.get(key);
        if (item && Date.now() - item.timestamp < this.cacheTimeout) {
            this.hitCount++;
            return item.data;
        }
        
        this.missCount++;
        this.cache.delete(key);
        return null;
    }
    
    /**
     * Set cached data
     */
    set(key, data, customTimeout = null) {
        if (this.cache.size >= this.maxCacheSize) {
            this.evictOldest();
        }
        
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            timeout: customTimeout || this.cacheTimeout
        });
    }
    
    /**
     * Evict oldest cache entries
     */
    evictOldest() {
        let oldestKey = null;
        let oldestTime = Date.now();
        
        for (const [key, item] of this.cache) {
            if (item.timestamp < oldestTime) {
                oldestTime = item.timestamp;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }
    
    /**
     * Clear cache
     */
    clear() {
        this.cache.clear();
        this.hitCount = 0;
        this.missCount = 0;
    }
    
    /**
     * Get cache metrics
     */
    getMetrics() {
        const totalRequests = this.hitCount + this.missCount;
        return {
            size: this.cache.size,
            hitRate: totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0,
            hitCount: this.hitCount,
            missCount: this.missCount,
            maxSize: this.maxCacheSize
        };
    }
}

/**
 * MEMORY MANAGER - Singleton Pattern
 * Foundation Layer - Memory Management
 */
class MemoryManager {
    constructor() {
        if (MemoryManager.instance) {
            return MemoryManager.instance;
        }
        
        this.cleanupInterval = 30 * 60 * 1000; // 30 minutes
        this.maxMemoryUsage = 50 * 1024 * 1024; // 50MB
        this.cleanupThreshold = 0.8; // 80% of max memory
        
        this.startCleanupTimer();
        MemoryManager.instance = this;
    }
    
    /**
     * Start automatic cleanup timer
     */
    startCleanupTimer() {
        setInterval(() => {
            this.performCleanup();
        }, this.cleanupInterval);
    }
    
    /**
     * Perform memory cleanup
     */
    performCleanup() {
        const memoryUsage = this.getMemoryUsage();
        
        if (memoryUsage > this.maxMemoryUsage * this.cleanupThreshold) {
            console.log('🧹 Performing memory cleanup...');
            
            // Cleanup old data
            this.cleanupOldData();
            
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
            
            console.log(`✅ Memory cleanup completed. Usage: ${this.formatBytes(memoryUsage)}`);
        }
    }
    
    /**
     * Cleanup old data
     */
    cleanupOldData() {
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
        
        // This would be implemented by specific modules
        // For now, we'll dispatch a cleanup event
        document.dispatchEvent(new CustomEvent('memory:cleanup', {
            detail: { cutoffTime }
        }));
    }
    
    /**
     * Get current memory usage
     */
    getMemoryUsage() {
        if (performance.memory) {
            return performance.memory.usedJSHeapSize;
        }
        return 0;
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
     * Get memory metrics
     */
    getMetrics() {
        return {
            currentUsage: this.getMemoryUsage(),
            maxUsage: this.maxMemoryUsage,
            usagePercentage: (this.getMemoryUsage() / this.maxMemoryUsage) * 100,
            formattedUsage: this.formatBytes(this.getMemoryUsage())
        };
    }
}

/**
 * INDEX MANAGER - Singleton Pattern
 * Foundation Layer - Index Management
 */
class IndexManager {
    constructor() {
        if (IndexManager.instance) {
            return IndexManager.instance;
        }
        
        this.indexes = new Map();
        IndexManager.instance = this;
    }
    
    /**
     * Create index for fast lookup
     */
    createIndex(name, data, keyExtractor) {
        const index = new Map();
        
        data.forEach(item => {
            const key = keyExtractor(item);
            if (!index.has(key)) {
                index.set(key, []);
            }
            index.get(key).push(item);
        });
        
        this.indexes.set(name, index);
        return index;
    }
    
    /**
     * Get items by index key
     */
    getByIndex(indexName, key) {
        const index = this.indexes.get(indexName);
        return index ? index.get(key) || [] : [];
    }
    
    /**
     * Update index
     */
    updateIndex(indexName, item, keyExtractor) {
        const index = this.indexes.get(indexName);
        if (index) {
            const key = keyExtractor(item);
            if (!index.has(key)) {
                index.set(key, []);
            }
            index.get(key).push(item);
        }
    }
    
    /**
     * Get index metrics
     */
    getMetrics() {
        const metrics = {};
        for (const [name, index] of this.indexes) {
            metrics[name] = {
                size: index.size,
                totalItems: Array.from(index.values()).reduce((sum, items) => sum + items.length, 0)
            };
        }
        return metrics;
    }
}

/**
 * OPTIMIZATION STRATEGIES - Strategy Pattern
 * Foundation Layer - Optimization Strategies
 */

class DatabaseOptimizationStrategy {
    optimize(context) {
        const { questionDatabase } = context;
        
        // Create indexes for fast lookup
        const questionIndex = new Map();
        const categoryIndex = new Map();
        const difficultyIndex = new Map();
        
        for (const [key, question] of questionDatabase) {
            // Index by ID for O(1) lookup
            questionIndex.set(question.id, key);
            
            // Index by category
            if (!categoryIndex.has(question.category)) {
                categoryIndex.set(question.category, []);
            }
            categoryIndex.get(question.category).push(key);
            
            // Index by difficulty
            if (!difficultyIndex.has(question.difficulty)) {
                difficultyIndex.set(question.difficulty, []);
            }
            difficultyIndex.get(question.difficulty).push(key);
        }
        
        return {
            questionIndex,
            categoryIndex,
            difficultyIndex
        };
    }
}

class MemoryOptimizationStrategy {
    optimize(context) {
        const { data } = context;
        
        // Implement data pagination
        const pageSize = 100;
        const pages = [];
        
        for (let i = 0; i < data.length; i += pageSize) {
            pages.push(data.slice(i, i + pageSize));
        }
        
        return {
            pages,
            pageSize,
            totalPages: pages.length
        };
    }
}

class CacheOptimizationStrategy {
    optimize(context) {
        const { cacheManager, data, key } = context;
        
        // Implement intelligent caching
        const cacheKey = this.generateCacheKey(key, data);
        const cached = cacheManager.get(cacheKey);
        
        if (cached) {
            return cached;
        }
        
        // Process data and cache result
        const processed = this.processData(data);
        cacheManager.set(cacheKey, processed);
        
        return processed;
    }
    
    generateCacheKey(key, data) {
        return `${key}_${JSON.stringify(data).length}`;
    }
    
    processData(data) {
        // Implement data processing logic
        return data;
    }
}

class RenderingOptimizationStrategy {
    optimize(context) {
        const { elements, renderFunction } = context;
        
        // Implement virtual scrolling for large lists
        const visibleElements = this.getVisibleElements(elements);
        
        return {
            visibleElements,
            renderFunction: this.optimizeRenderFunction(renderFunction)
        };
    }
    
    getVisibleElements(elements) {
        // Implement virtual scrolling logic
        return elements.slice(0, 50); // Show first 50 elements
    }
    
    optimizeRenderFunction(renderFunction) {
        // Implement render function optimization
        return renderFunction;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        PerformanceOptimizer, 
        CacheManager, 
        MemoryManager, 
        IndexManager 
    };
} else {
    window.PerformanceOptimizer = PerformanceOptimizer;
    window.CacheManager = CacheManager;
    window.MemoryManager = MemoryManager;
    window.IndexManager = IndexManager;
}
