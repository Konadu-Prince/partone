/**
 * WANDERLUST TRAVEL - ERROR HANDLER
 * Foundation Layer - Error Handling Core
 * Waterfall Methodology - Foundation Layer
 * Design Pattern: Singleton + Chain of Responsibility Pattern
 */

class ErrorHandler {
    constructor() {
        if (ErrorHandler.instance) {
            return ErrorHandler.instance;
        }
        
        this.handlers = new Map();
        this.errorQueue = [];
        this.maxQueueSize = 100;
        this.reportingEnabled = true;
        
        this.initializeHandlers();
        this.setupGlobalErrorHandling();
        
        ErrorHandler.instance = this;
    }
    
    /**
     * Initialize error handlers using Chain of Responsibility pattern
     */
    initializeHandlers() {
        // Chain of Responsibility: Each handler tries to handle the error
        this.handlers.set('validation', new ValidationErrorHandler());
        this.handlers.set('network', new NetworkErrorHandler());
        this.handlers.set('quiz', new QuizErrorHandler());
        this.handlers.set('system', new SystemErrorHandler());
        this.handlers.set('fallback', new FallbackErrorHandler());
    }
    
    /**
     * Setup global error handling
     */
    setupGlobalErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled promise rejection',
                stack: event.reason?.stack
            });
        });
    }
    
    /**
     * Handle error using Chain of Responsibility pattern
     */
    handleError(error, context = {}) {
        const errorInfo = this.enrichError(error, context);
        
        // Try each handler in sequence
        for (const [type, handler] of this.handlers) {
            if (handler.canHandle(errorInfo)) {
                const result = handler.handle(errorInfo);
                if (result.handled) {
                    this.logError(errorInfo, result);
                    return result;
                }
            }
        }
        
        // If no handler could handle the error, use fallback
        const fallbackResult = this.handlers.get('fallback').handle(errorInfo);
        this.logError(errorInfo, fallbackResult);
        return fallbackResult;
    }
    
    /**
     * Enrich error with additional context
     */
    enrichError(error, context) {
        return {
            ...error,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            userId: this.getUserId(),
            sessionId: this.getSessionId(),
            context,
            id: this.generateErrorId()
        };
    }
    
    /**
     * Log error for analytics
     */
    logError(errorInfo, result) {
        // Add to error queue
        this.errorQueue.push({
            error: errorInfo,
            result,
            timestamp: Date.now()
        });
        
        // Maintain queue size
        if (this.errorQueue.length > this.maxQueueSize) {
            this.errorQueue.shift();
        }
        
        // Report to analytics if enabled
        if (this.reportingEnabled) {
            this.reportError(errorInfo, result);
        }
    }
    
    /**
     * Report error to analytics service
     */
    reportError(errorInfo, result) {
        // In a real application, this would send to analytics service
        console.log('📊 Error Reported:', {
            id: errorInfo.id,
            type: errorInfo.type,
            message: errorInfo.message,
            handled: result.handled,
            userAction: result.userAction
        });
    }
    
    /**
     * Get user ID
     */
    getUserId() {
        return localStorage.getItem('userId') || 'anonymous';
    }
    
    /**
     * Get session ID
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = this.generateSessionId();
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }
    
    /**
     * Generate unique error ID
     */
    generateErrorId() {
        return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Get error statistics
     */
    getErrorStats() {
        const stats = {
            totalErrors: this.errorQueue.length,
            errorTypes: {},
            recentErrors: this.errorQueue.slice(-10)
        };
        
        this.errorQueue.forEach(item => {
            const type = item.error.type;
            stats.errorTypes[type] = (stats.errorTypes[type] || 0) + 1;
        });
        
        return stats;
    }
}

/**
 * ERROR HANDLERS - Chain of Responsibility Pattern
 * Foundation Layer - Error Handling Strategies
 */

class ValidationErrorHandler {
    canHandle(error) {
        return error.type === 'validation' || 
               error.message?.includes('validation') ||
               error.message?.includes('invalid');
    }
    
    handle(error) {
        return {
            handled: true,
            userAction: 'show_validation_error',
            message: 'Please check your input and try again.',
            severity: 'warning',
            recoverable: true
        };
    }
}

class NetworkErrorHandler {
    canHandle(error) {
        return error.type === 'network' || 
               error.message?.includes('fetch') ||
               error.message?.includes('network') ||
               error.message?.includes('timeout');
    }
    
    handle(error) {
        return {
            handled: true,
            userAction: 'show_network_error',
            message: 'Network connection issue. Please check your internet connection.',
            severity: 'error',
            recoverable: true,
            retryable: true
        };
    }
}

class QuizErrorHandler {
    canHandle(error) {
        return error.type === 'quiz' || 
               error.message?.includes('question') ||
               error.message?.includes('quiz') ||
               error.context?.component === 'quiz';
    }
    
    handle(error) {
        return {
            handled: true,
            userAction: 'show_quiz_error',
            message: 'Quiz error occurred. Your progress has been saved.',
            severity: 'error',
            recoverable: true,
            saveProgress: true
        };
    }
}

class SystemErrorHandler {
    canHandle(error) {
        return error.type === 'system' || 
               error.message?.includes('system') ||
               error.message?.includes('internal');
    }
    
    handle(error) {
        return {
            handled: true,
            userAction: 'show_system_error',
            message: 'A system error occurred. Please refresh the page.',
            severity: 'critical',
            recoverable: false,
            refreshRequired: true
        };
    }
}

class FallbackErrorHandler {
    canHandle(error) {
        return true; // Always can handle as fallback
    }
    
    handle(error) {
        return {
            handled: true,
            userAction: 'show_generic_error',
            message: 'An unexpected error occurred. Please try again.',
            severity: 'error',
            recoverable: true
        };
    }
}

/**
 * VALIDATION SERVICE - Foundation Layer
 * Input validation and sanitization
 */
class ValidationService {
    constructor() {
        this.rules = new Map();
        this.initializeRules();
    }
    
    /**
     * Initialize validation rules
     */
    initializeRules() {
        this.rules.set('userId', {
            pattern: /^[a-zA-Z0-9_-]+$/,
            minLength: 3,
            maxLength: 50,
            message: 'User ID must be 3-50 characters, alphanumeric with underscores and hyphens only'
        });
        
        this.rules.set('questionId', {
            pattern: /^[a-zA-Z0-9_-]+$/,
            minLength: 1,
            maxLength: 100,
            message: 'Question ID must be 1-100 characters, alphanumeric with underscores and hyphens only'
        });
        
        this.rules.set('answer', {
            pattern: /^[a-zA-Z0-9\s.,!?-]+$/,
            minLength: 1,
            maxLength: 500,
            message: 'Answer must be 1-500 characters, alphanumeric with basic punctuation only'
        });
    }
    
    /**
     * Validate input
     */
    validate(input, type) {
        const rule = this.rules.get(type);
        if (!rule) {
            return { isValid: true, errors: [] };
        }
        
        const errors = [];
        
        // Check pattern
        if (rule.pattern && !rule.pattern.test(input)) {
            errors.push(rule.message);
        }
        
        // Check length
        if (input.length < rule.minLength) {
            errors.push(`${type} must be at least ${rule.minLength} characters`);
        }
        
        if (input.length > rule.maxLength) {
            errors.push(`${type} must be no more than ${rule.maxLength} characters`);
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Sanitize input
     */
    sanitize(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/[<>]/g, '')
            .trim();
    }
    
    /**
     * Validate question data
     */
    validateQuestion(question) {
        const errors = [];
        
        if (!question.id) errors.push('Question ID is required');
        if (!question.question) errors.push('Question text is required');
        if (!question.type) errors.push('Question type is required');
        if (!question.category) errors.push('Question category is required');
        if (!question.difficulty) errors.push('Question difficulty is required');
        
        // Validate question type
        const validTypes = ['multiple-choice', 'true-false', 'fill-in-blank', 'matching', 'image-identification'];
        if (!validTypes.includes(question.type)) {
            errors.push(`Invalid question type: ${question.type}`);
        }
        
        // Validate difficulty
        const validDifficulties = ['beginner', 'intermediate', 'advanced'];
        if (!validDifficulties.includes(question.difficulty)) {
            errors.push(`Invalid difficulty: ${question.difficulty}`);
        }
        
        // Validate options for multiple choice
        if (question.type === 'multiple-choice') {
            if (!question.options || question.options.length < 2) {
                errors.push('Multiple choice questions must have at least 2 options');
            }
            if (question.correctAnswer === undefined || question.correctAnswer === null) {
                errors.push('Correct answer is required for multiple choice questions');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        ErrorHandler, 
        ValidationService,
        ValidationErrorHandler,
        NetworkErrorHandler,
        QuizErrorHandler,
        SystemErrorHandler,
        FallbackErrorHandler
    };
} else {
    window.ErrorHandler = ErrorHandler;
    window.ValidationService = ValidationService;
}
