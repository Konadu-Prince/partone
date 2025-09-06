/**
 * WANDERLUST TRAVEL - QUESTION API
 * Question Management and Delivery API
 * Waterfall Methodology - Integration Layer
 */

class QuestionAPI {
    constructor() {
        this.baseURL = '/api/questions';
        this.questionFeeder = new QuestionFeeder();
        
        // Performance optimization components
        this.performanceOptimizer = new PerformanceOptimizer();
        this.errorHandler = new ErrorHandler();
        this.validationService = new ValidationService();
        
        // Enhanced caching with performance optimization
        this.cacheManager = new CacheManager();
        this.rateLimiter = new RateLimiter();
    }

    /**
     * Get questions for a specific user and context
     */
    async getQuestions(userId, options = {}) {
        try {
            // Rate limiting check
            if (!this.rateLimiter.allowRequest(userId, 'getQuestions')) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
            
            // Validate inputs
            const userIdValidation = this.validationService.validate(userId, 'userId');
            if (!userIdValidation.isValid) {
                throw new Error(`Invalid userId: ${userIdValidation.errors.join(', ')}`);
            }
            
            const cacheKey = this.generateCacheKey(userId, options);
            
            // Check enhanced cache first
            const cached = this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }

            // Fetch questions from feeder with performance optimization
            const questions = this.questionFeeder.feedQuestions(userId, options);
            
            // Cache the result with performance optimization
            this.cacheManager.set(cacheKey, questions);

            return questions;
        } catch (error) {
            this.errorHandler.handleError({
                type: 'network',
                message: 'Failed to fetch questions',
                context: { userId, options, error: error.message }
            });
            throw error;
        }
    }

    /**
     * Get daily questions for a user
     */
    async getDailyQuestions(userId) {
        try {
            const questions = this.questionFeeder.feedDailyQuestions(userId);
            
            // Log daily question feed
            this.logQuestionFeed(userId, 'daily', questions.length);
            
            return questions;
        } catch (error) {
            console.error('Error fetching daily questions:', error);
            throw new Error('Failed to fetch daily questions');
        }
    }

    /**
     * Get quiz questions for a specific quiz session
     */
    async getQuizQuestions(userId, quizConfig) {
        try {
            const questions = this.questionFeeder.feedQuizQuestions(userId, quizConfig);
            
            // Log quiz question feed
            this.logQuestionFeed(userId, 'quiz', questions.length, quizConfig);
            
            return questions;
        } catch (error) {
            console.error('Error fetching quiz questions:', error);
            throw new Error('Failed to fetch quiz questions');
        }
    }

    /**
     * Get practice questions for weak areas
     */
    async getPracticeQuestions(userId, weakAreas) {
        try {
            const questions = this.questionFeeder.feedPracticeQuestions(userId, weakAreas);
            
            // Log practice question feed
            this.logQuestionFeed(userId, 'practice', questions.length, { weakAreas });
            
            return questions;
        } catch (error) {
            console.error('Error fetching practice questions:', error);
            throw new Error('Failed to fetch practice questions');
        }
    }

    /**
     * Get challenge questions for advanced users
     */
    async getChallengeQuestions(userId) {
        try {
            const questions = this.questionFeeder.feedChallengeQuestions(userId);
            
            // Log challenge question feed
            this.logQuestionFeed(userId, 'challenge', questions.length);
            
            return questions;
        } catch (error) {
            console.error('Error fetching challenge questions:', error);
            throw new Error('Failed to fetch challenge questions');
        }
    }

    /**
     * Submit question answer and get feedback
     */
    async submitAnswer(userId, questionId, answer, timeSpent) {
        try {
            // Get question details
            const question = this.getQuestionById(questionId);
            if (!question) {
                throw new Error('Question not found');
            }

            // Validate answer
            const result = this.validateAnswer(question, answer);
            
            // Update question performance
            this.questionFeeder.updateQuestionPerformance(questionId, userId, {
                ...result,
                timeSpent,
                timestamp: Date.now()
            });

            // Get next question recommendation
            const nextQuestion = await this.getNextQuestion(userId, question);

            return {
                result,
                feedback: this.generateFeedback(question, result),
                nextQuestion,
                points: this.calculatePoints(question, result, timeSpent)
            };
        } catch (error) {
            console.error('Error submitting answer:', error);
            throw new Error('Failed to submit answer');
        }
    }

    /**
     * Get question by ID
     */
    getQuestionById(questionId) {
        // Search through all questions
        for (const [key, question] of this.questionFeeder.questionDatabase) {
            if (question.id === questionId) {
                return question;
            }
        }
        return null;
    }

    /**
     * Validate user answer against question
     */
    validateAnswer(question, userAnswer) {
        let isCorrect = false;
        let correctAnswer = question.correctAnswer;

        switch (question.type) {
            case 'multiple-choice':
                isCorrect = userAnswer === question.correctAnswer;
                break;
            case 'true-false':
                isCorrect = userAnswer === question.correctAnswer;
                break;
            case 'fill-in-blank':
                const correct = question.correctAnswer.toLowerCase().trim();
                const user = userAnswer.toLowerCase().trim();
                isCorrect = user === correct;
                break;
            case 'matching':
                isCorrect = this.validateMatchingAnswer(question, userAnswer);
                break;
            case 'image-identification':
                isCorrect = userAnswer === question.correctAnswer;
                break;
        }

        return {
            isCorrect,
            correctAnswer,
            userAnswer,
            questionId: question.id
        };
    }

    /**
     * Validate matching question answer
     */
    validateMatchingAnswer(question, userAnswer) {
        // Implementation for matching validation
        return true; // Placeholder
    }

    /**
     * Generate feedback for user answer
     */
    generateFeedback(question, result) {
        const feedback = {
            isCorrect: result.isCorrect,
            explanation: question.explanation,
            encouragement: this.getEncouragement(result.isCorrect),
            tips: this.getTips(question, result)
        };

        return feedback;
    }

    /**
     * Get encouragement message
     */
    getEncouragement(isCorrect) {
        const correctMessages = [
            "Excellent work! 🎉",
            "Great job! You're getting it! 👍",
            "Perfect! Keep up the great work! ⭐",
            "Outstanding! You're on fire! 🔥",
            "Brilliant! You're mastering this! 🏆"
        ];

        const incorrectMessages = [
            "Not quite, but you're learning! 📚",
            "Good try! Let's learn from this! 💪",
            "Almost there! Keep practicing! 🎯",
            "Nice effort! You'll get it next time! 🌟",
            "Good attempt! Every mistake is a learning opportunity! 📖"
        ];

        const messages = isCorrect ? correctMessages : incorrectMessages;
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Get tips based on question and result
     */
    getTips(question, result) {
        const tips = [];

        if (!result.isCorrect) {
            tips.push(`Remember: ${question.explanation}`);
            
            // Add category-specific tips
            switch (question.category) {
                case 'destinations':
                    tips.push("💡 Tip: Research destinations before traveling to learn about local customs and culture.");
                    break;
                case 'planning':
                    tips.push("💡 Tip: Always plan your budget in advance and include emergency funds.");
                    break;
                case 'safety':
                    tips.push("💡 Tip: Keep copies of important documents and know emergency contacts.");
                    break;
                case 'culture':
                    tips.push("💡 Tip: Learning basic phrases in the local language shows respect.");
                    break;
                case 'adventure':
                    tips.push("💡 Tip: Always follow safety guidelines and respect the environment.");
                    break;
                case 'sustainability':
                    tips.push("💡 Tip: Choose eco-friendly options and support local communities.");
                    break;
            }
        }

        return tips;
    }

    /**
     * Calculate points for answer
     */
    calculatePoints(question, result, timeSpent) {
        if (!result.isCorrect) return 0;

        let points = question.points || 10;

        // Time bonus for quick answers
        const timeLimit = question.timeLimit || 30;
        if (timeSpent < timeLimit * 0.5) {
            points += Math.round(points * 0.2); // 20% bonus
        } else if (timeSpent < timeLimit * 0.8) {
            points += Math.round(points * 0.1); // 10% bonus
        }

        // Difficulty multiplier
        const difficultyMultipliers = {
            'beginner': 1.0,
            'intermediate': 1.5,
            'advanced': 2.0
        };
        points *= difficultyMultipliers[question.difficulty] || 1.0;

        return Math.round(points);
    }

    /**
     * Get next question recommendation
     */
    async getNextQuestion(userId, currentQuestion) {
        try {
            // Get user's weak areas
            const weakAreas = this.getUserWeakAreas(userId);
            
            // If current question was answered incorrectly, suggest similar questions
            if (weakAreas.length > 0) {
                const practiceQuestions = await this.getPracticeQuestions(userId, weakAreas);
                if (practiceQuestions.length > 0) {
                    return practiceQuestions[0];
                }
            }

            // Otherwise, get next question in sequence
            const nextQuestions = await this.getQuestions(userId, {
                category: currentQuestion.category,
                subcategory: currentQuestion.subcategory,
                count: 1,
                excludeShown: true
            });

            return nextQuestions.length > 0 ? nextQuestions[0] : null;
        } catch (error) {
            console.error('Error getting next question:', error);
            return null;
        }
    }

    /**
     * Get user's weak areas for practice
     */
    getUserWeakAreas(userId) {
        const userProgress = this.questionFeeder.getUserProgress(userId);
        const weakAreas = [];

        // Analyze user's performance by category and difficulty
        // This is a simplified implementation
        const categories = ['destinations', 'planning', 'safety', 'culture', 'adventure', 'sustainability'];
        const difficulties = ['beginner', 'intermediate', 'advanced'];

        categories.forEach(category => {
            difficulties.forEach(difficulty => {
                // Mock weak area detection
                if (Math.random() < 0.3) { // 30% chance of being weak
                    weakAreas.push({ category, subcategory: 'general', difficulty });
                }
            });
        });

        return weakAreas;
    }

    /**
     * Get question statistics
     */
    async getQuestionStats() {
        try {
            return this.questionFeeder.getQuestionStats();
        } catch (error) {
            console.error('Error getting question stats:', error);
            throw new Error('Failed to get question statistics');
        }
    }

    /**
     * Search questions by criteria
     */
    async searchQuestions(criteria) {
        try {
            const questions = this.questionFeeder.queryQuestions(criteria);
            return questions;
        } catch (error) {
            console.error('Error searching questions:', error);
            throw new Error('Failed to search questions');
        }
    }

    /**
     * Generate cache key
     */
    generateCacheKey(userId, options) {
        return `${userId}-${JSON.stringify(options)}`;
    }

    /**
     * Log question feed for analytics
     */
    logQuestionFeed(userId, type, count, metadata = {}) {
        console.log(`📊 Question Feed: User ${userId}, Type: ${type}, Count: ${count}`, metadata);
        
        // In a real application, this would send to analytics service
        this.sendAnalytics({
            event: 'question_feed',
            userId,
            type,
            count,
            metadata,
            timestamp: Date.now()
        });
    }

    /**
     * Send analytics data
     */
    sendAnalytics(data) {
        // Mock analytics sending
        console.log('📈 Analytics:', data);
        
        // In a real application, this would send to analytics service
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Question cache cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            oldestEntry: Math.min(...Array.from(this.cache.values()).map(v => v.timestamp)),
            newestEntry: Math.max(...Array.from(this.cache.values()).map(v => v.timestamp))
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionAPI;
} else {
    window.QuestionAPI = QuestionAPI;
}
