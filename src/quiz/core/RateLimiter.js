/**
 * WANDERLUST TRAVEL - RATE LIMITER
 * Foundation Layer - Rate Limiting Core
 * Waterfall Methodology - Foundation Layer
 * Design Pattern: Singleton + Strategy Pattern
 */

class RateLimiter {
    constructor() {
        if (RateLimiter.instance) {
            return RateLimiter.instance;
        }
        
        this.requests = new Map();
        this.limits = new Map();
        this.strategies = new Map();
        
        this.initializeLimits();
        this.initializeStrategies();
        
        RateLimiter.instance = this;
    }
    
    /**
     * Initialize rate limits for different actions
     */
    initializeLimits() {
        this.limits.set('getQuestions', { requests: 100, window: 60 * 1000 }); // 100 requests per minute
        this.limits.set('submitAnswer', { requests: 200, window: 60 * 1000 }); // 200 requests per minute
        this.limits.set('getDailyQuestions', { requests: 10, window: 60 * 1000 }); // 10 requests per minute
        this.limits.set('getChallengeQuestions', { requests: 20, window: 60 * 1000 }); // 20 requests per minute
        this.limits.set('getPracticeQuestions', { requests: 50, window: 60 * 1000 }); // 50 requests per minute
    }
    
    /**
     * Initialize rate limiting strategies
     */
    initializeStrategies() {
        this.strategies.set('sliding_window', new SlidingWindowStrategy());
        this.strategies.set('token_bucket', new TokenBucketStrategy());
        this.strategies.set('fixed_window', new FixedWindowStrategy());
    }
    
    /**
     * Check if request is allowed
     */
    allowRequest(userId, action) {
        try {
            const limit = this.limits.get(action);
            if (!limit) {
                return true; // No limit defined, allow request
            }
            
            const key = `${userId}_${action}`;
            const now = Date.now();
            
            // Get or create request history
            if (!this.requests.has(key)) {
                this.requests.set(key, []);
            }
            
            const userRequests = this.requests.get(key);
            
            // Clean old requests outside the window
            const windowStart = now - limit.window;
            const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
            this.requests.set(key, validRequests);
            
            // Check if under limit
            if (validRequests.length < limit.requests) {
                // Add current request
                validRequests.push(now);
                this.requests.set(key, validRequests);
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('Rate limiter error:', error);
            return true; // Allow request on error to avoid blocking users
        }
    }
    
    /**
     * Get rate limit info for user and action
     */
    getRateLimitInfo(userId, action) {
        const limit = this.limits.get(action);
        if (!limit) {
            return { allowed: true, remaining: Infinity, resetTime: null };
        }
        
        const key = `${userId}_${action}`;
        const userRequests = this.requests.get(key) || [];
        const now = Date.now();
        const windowStart = now - limit.window;
        const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
        
        return {
            allowed: validRequests.length < limit.requests,
            remaining: Math.max(0, limit.requests - validRequests.length),
            resetTime: validRequests.length > 0 ? validRequests[0] + limit.window : now + limit.window,
            limit: limit.requests,
            window: limit.window
        };
    }
    
    /**
     * Clean up old request data
     */
    cleanup() {
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        for (const [key, requests] of this.requests) {
            const validRequests = requests.filter(timestamp => now - timestamp < maxAge);
            if (validRequests.length === 0) {
                this.requests.delete(key);
            } else {
                this.requests.set(key, validRequests);
            }
        }
    }
    
    /**
     * Get rate limiter statistics
     */
    getStats() {
        const stats = {
            totalUsers: this.requests.size,
            totalRequests: 0,
            actions: {}
        };
        
        for (const [key, requests] of this.requests) {
            const [userId, action] = key.split('_');
            stats.totalRequests += requests.length;
            
            if (!stats.actions[action]) {
                stats.actions[action] = { users: 0, requests: 0 };
            }
            stats.actions[action].users++;
            stats.actions[action].requests += requests.length;
        }
        
        return stats;
    }
}

/**
 * RATE LIMITING STRATEGIES - Strategy Pattern
 * Foundation Layer - Rate Limiting Strategies
 */

class SlidingWindowStrategy {
    allowRequest(userId, action, limit) {
        // Implementation of sliding window rate limiting
        return true; // Placeholder
    }
}

class TokenBucketStrategy {
    allowRequest(userId, action, limit) {
        // Implementation of token bucket rate limiting
        return true; // Placeholder
    }
}

class FixedWindowStrategy {
    allowRequest(userId, action, limit) {
        // Implementation of fixed window rate limiting
        return true; // Placeholder
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RateLimiter };
} else {
    window.RateLimiter = RateLimiter;
}
