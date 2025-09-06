/**
 * WANDERLUST TRAVEL - QUESTION DELIVERY COMPONENT
 * Real-time Question Delivery and Management
 * Waterfall Methodology - Component Layer
 */

class QuestionDelivery {
    constructor() {
        this.questionAPI = new QuestionAPI();
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.userId = this.getUserId();
        this.deliveryMode = 'adaptive'; // adaptive, sequential, random, personalized
        this.questionBuffer = [];
        this.bufferSize = 5;
        this.isLoading = false;
        
        this.setupEventListeners();
        this.initializeDelivery();
    }

    /**
     * Initialize question delivery system
     */
    async initializeDelivery() {
        console.log('🚀 Initializing Question Delivery System...');
        
        try {
            // Pre-load initial questions
            await this.preloadQuestions();
            
            // Setup real-time updates
            this.setupRealTimeUpdates();
            
            console.log('✅ Question Delivery System initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Question Delivery System:', error);
        }
    }

    /**
     * Pre-load questions into buffer
     */
    async preloadQuestions() {
        try {
            this.isLoading = true;
            
            // Load initial questions based on delivery mode
            const questions = await this.loadInitialQuestions();
            
            this.questionBuffer = questions;
            this.currentQuestions = questions;
            
            console.log(`📚 Pre-loaded ${questions.length} questions`);
        } catch (error) {
            console.error('Error pre-loading questions:', error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Load initial questions based on delivery mode
     */
    async loadInitialQuestions() {
        switch (this.deliveryMode) {
            case 'adaptive':
                return await this.questionAPI.getQuestions(this.userId, {
                    count: this.bufferSize,
                    adaptive: true,
                    personalized: true
                });
            
            case 'daily':
                return await this.questionAPI.getDailyQuestions(this.userId);
            
            case 'practice':
                const weakAreas = this.questionAPI.getUserWeakAreas(this.userId);
                return await this.questionAPI.getPracticeQuestions(this.userId, weakAreas);
            
            case 'challenge':
                return await this.questionAPI.getChallengeQuestions(this.userId);
            
            case 'quiz':
                return await this.questionAPI.getQuizQuestions(this.userId, {
                    category: 'destinations',
                    difficulty: 'intermediate',
                    questionCount: this.bufferSize
                });
            
            default:
                return await this.questionAPI.getQuestions(this.userId, {
                    count: this.bufferSize
                });
        }
    }

    /**
     * Get next question for user
     */
    async getNextQuestion() {
        try {
            // Check if we have questions in buffer
            if (this.currentQuestionIndex >= this.currentQuestions.length) {
                await this.loadMoreQuestions();
            }

            // Get current question
            const question = this.currentQuestions[this.currentQuestionIndex];
            
            if (!question) {
                throw new Error('No more questions available');
            }

            // Update question statistics
            this.updateQuestionStats(question);

            // Move to next question
            this.currentQuestionIndex++;

            // Pre-load more questions if buffer is getting low
            if (this.currentQuestionIndex >= this.currentQuestions.length - 2) {
                this.loadMoreQuestions(); // Don't await, load in background
            }

            return question;
        } catch (error) {
            console.error('Error getting next question:', error);
            throw error;
        }
    }

    /**
     * Load more questions into buffer
     */
    async loadMoreQuestions() {
        try {
            if (this.isLoading) return;

            this.isLoading = true;
            
            // Get more questions based on current context
            const moreQuestions = await this.getContextualQuestions();
            
            // Add to buffer
            this.currentQuestions.push(...moreQuestions);
            
            console.log(`📚 Loaded ${moreQuestions.length} more questions`);
        } catch (error) {
            console.error('Error loading more questions:', error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Get contextual questions based on user behavior
     */
    async getContextualQuestions() {
        // Analyze user's recent performance
        const recentPerformance = this.analyzeRecentPerformance();
        
        // Adjust question selection based on performance
        if (recentPerformance.averageScore < 50) {
            // User is struggling, provide easier questions
            return await this.questionAPI.getQuestions(this.userId, {
                difficulty: 'beginner',
                count: this.bufferSize,
                adaptive: true
            });
        } else if (recentPerformance.averageScore > 85) {
            // User is excelling, provide harder questions
            return await this.questionAPI.getQuestions(this.userId, {
                difficulty: 'advanced',
                count: this.bufferSize,
                adaptive: true
            });
        } else {
            // Normal performance, provide mixed questions
            return await this.questionAPI.getQuestions(this.userId, {
                count: this.bufferSize,
                adaptive: true,
                personalized: true
            });
        }
    }

    /**
     * Submit answer and get feedback
     */
    async submitAnswer(questionId, answer, timeSpent) {
        try {
            const result = await this.questionAPI.submitAnswer(
                this.userId, 
                questionId, 
                answer, 
                timeSpent
            );

            // Update delivery based on result
            this.updateDeliveryBasedOnResult(result);

            // Dispatch events
            this.dispatchAnswerEvent(result);

            return result;
        } catch (error) {
            console.error('Error submitting answer:', error);
            throw error;
        }
    }

    /**
     * Update delivery strategy based on answer result
     */
    updateDeliveryBasedOnResult(result) {
        if (!result.result.isCorrect) {
            // User got question wrong, adjust delivery
            this.scheduleSimilarQuestions(result.questionId);
        }
    }

    /**
     * Schedule similar questions for practice
     */
    async scheduleSimilarQuestions(questionId) {
        try {
            const question = this.questionAPI.getQuestionById(questionId);
            if (!question) return;

            // Get similar questions for practice
            const similarQuestions = await this.questionAPI.searchQuestions({
                category: question.category,
                subcategory: question.subcategory,
                difficulty: question.difficulty,
                excludeShown: true
            });

            // Add to front of queue for immediate practice
            if (similarQuestions.length > 0) {
                this.currentQuestions.unshift(...similarQuestions.slice(0, 2));
                console.log(`📝 Scheduled ${similarQuestions.length} similar questions for practice`);
            }
        } catch (error) {
            console.error('Error scheduling similar questions:', error);
        }
    }

    /**
     * Analyze user's recent performance
     */
    analyzeRecentPerformance() {
        // Mock implementation - in real app, this would analyze actual data
        return {
            averageScore: 75,
            recentAnswers: 10,
            correctAnswers: 7,
            averageTime: 15,
            weakAreas: ['safety', 'culture']
        };
    }

    /**
     * Update question statistics
     */
    updateQuestionStats(question) {
        // Update question shown count
        question.timesShown = (question.timesShown || 0) + 1;
        question.lastShown = Date.now();

        // Log question delivery
        this.logQuestionDelivery(question);
    }

    /**
     * Log question delivery for analytics
     */
    logQuestionDelivery(question) {
        console.log(`📊 Question Delivered: ${question.id} (${question.category}/${question.subcategory})`);
        
        // Send analytics
        this.questionAPI.sendAnalytics({
            event: 'question_delivered',
            userId: this.userId,
            questionId: question.id,
            category: question.category,
            subcategory: question.subcategory,
            difficulty: question.difficulty,
            type: question.type,
            timestamp: Date.now()
        });
    }

    /**
     * Setup real-time updates
     */
    setupRealTimeUpdates() {
        // Setup periodic question refresh
        setInterval(() => {
            this.refreshQuestionDatabase();
        }, 30 * 60 * 1000); // Every 30 minutes

        // Setup performance monitoring
        setInterval(() => {
            this.monitorPerformance();
        }, 5 * 60 * 1000); // Every 5 minutes
    }

    /**
     * Refresh question database
     */
    async refreshQuestionDatabase() {
        try {
            console.log('🔄 Refreshing question database...');
            
            // Clear cache
            this.questionAPI.clearCache();
            
            // Reload questions if needed
            if (this.currentQuestions.length < this.bufferSize) {
                await this.loadMoreQuestions();
            }
            
            console.log('✅ Question database refreshed');
        } catch (error) {
            console.error('Error refreshing question database:', error);
        }
    }

    /**
     * Monitor system performance
     */
    monitorPerformance() {
        const stats = {
            questionsInBuffer: this.currentQuestions.length,
            currentIndex: this.currentQuestionIndex,
            isLoading: this.isLoading,
            cacheStats: this.questionAPI.getCacheStats()
        };

        console.log('📊 Performance Stats:', stats);

        // Adjust buffer size based on performance
        if (stats.questionsInBuffer < 3) {
            this.loadMoreQuestions();
        }
    }

    /**
     * Change delivery mode
     */
    async changeDeliveryMode(mode) {
        if (this.deliveryMode === mode) return;

        console.log(`🔄 Changing delivery mode from ${this.deliveryMode} to ${mode}`);
        
        this.deliveryMode = mode;
        
        // Clear current questions and reload
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        
        await this.preloadQuestions();
        
        // Dispatch mode change event
        this.dispatchEvent('delivery:mode:changed', { mode });
    }

    /**
     * Get current delivery status
     */
    getDeliveryStatus() {
        return {
            mode: this.deliveryMode,
            questionsInBuffer: this.currentQuestions.length,
            currentIndex: this.currentQuestionIndex,
            isLoading: this.isLoading,
            userId: this.userId
        };
    }

    /**
     * Get user ID (mock implementation)
     */
    getUserId() {
        // In a real app, this would get from authentication
        return localStorage.getItem('userId') || 'anonymous-user';
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for user interactions
        document.addEventListener('user:answer:submitted', (event) => {
            this.handleUserAnswer(event.detail);
        });

        // Listen for delivery mode changes
        document.addEventListener('delivery:mode:request', (event) => {
            this.changeDeliveryMode(event.detail.mode);
        });
    }

    /**
     * Handle user answer submission
     */
    async handleUserAnswer(detail) {
        try {
            const result = await this.submitAnswer(
                detail.questionId,
                detail.answer,
                detail.timeSpent
            );
            
            // Update UI with result
            this.updateUIWithResult(result);
        } catch (error) {
            console.error('Error handling user answer:', error);
        }
    }

    /**
     * Update UI with answer result
     */
    updateUIWithResult(result) {
        // Dispatch result event
        this.dispatchEvent('question:result', result);
        
        // Show feedback
        this.showFeedback(result.feedback);
        
        // Update progress
        this.updateProgress(result);
    }

    /**
     * Show feedback to user
     */
    showFeedback(feedback) {
        // Create feedback notification
        const notification = {
            type: feedback.isCorrect ? 'success' : 'info',
            title: feedback.isCorrect ? 'Correct!' : 'Not quite right',
            message: feedback.encouragement,
            explanation: feedback.explanation,
            tips: feedback.tips
        };

        this.dispatchEvent('notification:show', notification);
    }

    /**
     * Update user progress
     */
    updateProgress(result) {
        const progress = {
            points: result.points,
            isCorrect: result.result.isCorrect,
            questionId: result.result.questionId
        };

        this.dispatchEvent('progress:update', progress);
    }

    /**
     * Dispatch custom event
     */
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Dispatch answer event
     */
    dispatchAnswerEvent(result) {
        this.dispatchEvent('question:answered', {
            questionId: result.result.questionId,
            userId: this.userId,
            result: result.result,
            points: result.points,
            feedback: result.feedback
        });
    }

    /**
     * Get question statistics
     */
    async getQuestionStats() {
        try {
            return await this.questionAPI.getQuestionStats();
        } catch (error) {
            console.error('Error getting question stats:', error);
            return null;
        }
    }

    /**
     * Export delivery data
     */
    exportDeliveryData() {
        return {
            deliveryStatus: this.getDeliveryStatus(),
            questionStats: this.questionAPI.getQuestionStats(),
            cacheStats: this.questionAPI.getCacheStats(),
            timestamp: Date.now()
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        // Clear intervals
        // Remove event listeners
        // Clear cache
        this.questionAPI.clearCache();
        
        console.log('🧹 Question Delivery System cleaned up');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionDelivery;
} else {
    window.QuestionDelivery = QuestionDelivery;
}
