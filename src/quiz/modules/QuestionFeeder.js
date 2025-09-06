/**
 * WANDERLUST TRAVEL - QUESTION FEEDER MODULE
 * Dynamic Question Delivery System
 * Waterfall Methodology - Feature Layer
 */

class QuestionFeeder {
    constructor() {
        this.questionDatabase = new Map();
        this.userProgress = new Map();
        this.adaptiveEngine = new AdaptiveQuestionEngine();
        this.contentManager = new ContentManager();
        this.analytics = new QuestionAnalytics();
        
        // Performance optimization components
        this.performanceOptimizer = new PerformanceOptimizer();
        this.errorHandler = new ErrorHandler();
        this.validationService = new ValidationService();
        
        // Indexes for fast lookup (O(1) instead of O(n))
        this.questionIndex = new Map(); // ID -> key mapping
        this.categoryIndex = new Map(); // category -> [keys]
        this.difficultyIndex = new Map(); // difficulty -> [keys]
        
        this.initializeQuestionDatabase();
        this.setupEventListeners();
    }

    /**
     * Initialize the question database with all available questions
     */
    initializeQuestionDatabase() {
        console.log('📚 Initializing Question Database...');
        
        // Load questions from all categories
        Object.keys(SampleQuestions).forEach(category => {
            Object.keys(SampleQuestions[category]).forEach(subcategory => {
                const questions = SampleQuestions[category][subcategory];
                questions.forEach(question => {
                    this.addQuestionToDatabase(question);
                });
            });
        });
        
        console.log(`✅ Question Database initialized with ${this.questionDatabase.size} questions`);
    }

    /**
     * Add a question to the database with indexing
     */
    addQuestionToDatabase(question) {
        try {
            // Validate question data
            const validation = this.validationService.validateQuestion(question);
            if (!validation.isValid) {
                this.errorHandler.handleError({
                    type: 'validation',
                    message: `Invalid question data: ${validation.errors.join(', ')}`,
                    context: { question }
                });
                return;
            }
            
            const key = `${question.category}-${question.subcategory}-${question.id}`;
            const enrichedQuestion = {
                ...question,
                timesShown: 0,
                correctAnswers: 0,
                averageTime: 0,
                difficultyScore: this.calculateDifficultyScore(question),
                lastShown: null,
                tags: question.tags || []
            };
            
            // Add to database
            this.questionDatabase.set(key, enrichedQuestion);
            
            // Update indexes for fast lookup
            this.updateIndexes(key, enrichedQuestion);
            
        } catch (error) {
            this.errorHandler.handleError({
                type: 'system',
                message: 'Failed to add question to database',
                context: { question, error: error.message }
            });
        }
    }
    
    /**
     * Update indexes for fast lookup
     */
    updateIndexes(key, question) {
        // Index by ID for O(1) lookup
        this.questionIndex.set(question.id, key);
        
        // Index by category
        if (!this.categoryIndex.has(question.category)) {
            this.categoryIndex.set(question.category, []);
        }
        this.categoryIndex.get(question.category).push(key);
        
        // Index by difficulty
        if (!this.difficultyIndex.has(question.difficulty)) {
            this.difficultyIndex.set(question.difficulty, []);
        }
        this.difficultyIndex.get(question.difficulty).push(key);
    }

    /**
     * Calculate difficulty score based on question properties
     */
    calculateDifficultyScore(question) {
        let score = 0;
        
        // Base difficulty
        const difficultyMultipliers = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3
        };
        score += difficultyMultipliers[question.difficulty] || 1;
        
        // Question type complexity
        const typeComplexity = {
            'multiple-choice': 1,
            'true-false': 1,
            'fill-in-blank': 2,
            'matching': 3,
            'image-identification': 2
        };
        score += typeComplexity[question.type] || 1;
        
        // Points as difficulty indicator
        score += Math.floor(question.points / 10);
        
        return Math.min(score, 10); // Cap at 10
    }

    /**
     * Feed questions to a user based on their profile and preferences
     */
    feedQuestions(userId, options = {}) {
        try {
            // Validate inputs
            const userIdValidation = this.validationService.validate(userId, 'userId');
            if (!userIdValidation.isValid) {
                throw new Error(`Invalid userId: ${userIdValidation.errors.join(', ')}`);
            }
            
            const {
                category = null,
                subcategory = null,
                difficulty = null,
                count = 10,
                adaptive = true,
                excludeShown = true,
                personalized = true
            } = options;

            console.log(`🍽️ Feeding ${count} questions to user ${userId}`);

            // Get user profile and progress
            const userProfile = this.getUserProfile(userId);
            const userProgress = this.getUserProgress(userId);

            // Build question query with optimized lookup
            let questions = this.queryQuestionsOptimized({
                category,
                subcategory,
                difficulty,
                excludeShown: excludeShown ? userProgress.answeredQuestions : [],
                personalized: personalized ? userProfile : null
            });

            // Apply adaptive filtering if enabled
            if (adaptive) {
                questions = this.adaptiveEngine.filterQuestions(questions, userProfile, userProgress);
            }

            // Select final questions
            const selectedQuestions = this.selectQuestions(questions, count, userProfile);

            // Update analytics
            this.analytics.trackQuestionFeed(userId, selectedQuestions, options);

            return selectedQuestions;
            
        } catch (error) {
            this.errorHandler.handleError({
                type: 'quiz',
                message: 'Failed to feed questions',
                context: { userId, options, error: error.message }
            });
            
            // Return fallback questions
            return this.getFallbackQuestions(options.count || 10);
        }
    }
    
    /**
     * Optimized question query using indexes
     */
    queryQuestionsOptimized(criteria) {
        let questionKeys = new Set();
        
        // Use indexes for fast filtering
        if (criteria.category) {
            const categoryKeys = this.categoryIndex.get(criteria.category) || [];
            categoryKeys.forEach(key => questionKeys.add(key));
        }
        
        if (criteria.difficulty) {
            const difficultyKeys = this.difficultyIndex.get(criteria.difficulty) || [];
            if (questionKeys.size === 0) {
                difficultyKeys.forEach(key => questionKeys.add(key));
            } else {
                // Intersection of category and difficulty
                const filteredKeys = new Set();
                difficultyKeys.forEach(key => {
                    if (questionKeys.has(key)) {
                        filteredKeys.add(key);
                    }
                });
                questionKeys = filteredKeys;
            }
        }
        
        // If no specific criteria, get all questions
        if (questionKeys.size === 0) {
            questionKeys = new Set(this.questionDatabase.keys());
        }
        
        // Convert keys to questions
        let questions = Array.from(questionKeys).map(key => this.questionDatabase.get(key));
        
        // Apply additional filters
        if (criteria.excludeShown && criteria.excludeShown.length > 0) {
            questions = questions.filter(q => !criteria.excludeShown.includes(q.id));
        }
        
        if (criteria.personalized) {
            questions = this.applyPersonalization(questions, criteria.personalized);
        }
        
        return questions;
    }
    
    /**
     * Get fallback questions when main query fails
     */
    getFallbackQuestions(count) {
        const fallbackQuestions = [];
        const allQuestions = Array.from(this.questionDatabase.values());
        
        // Get random questions as fallback
        for (let i = 0; i < Math.min(count, allQuestions.length); i++) {
            const randomIndex = Math.floor(Math.random() * allQuestions.length);
            fallbackQuestions.push(allQuestions[randomIndex]);
        }
        
        return fallbackQuestions;
    }

    /**
     * Query questions based on criteria
     */
    queryQuestions(criteria) {
        let questions = Array.from(this.questionDatabase.values());

        // Filter by category
        if (criteria.category) {
            questions = questions.filter(q => q.category === criteria.category);
        }

        // Filter by subcategory
        if (criteria.subcategory) {
            questions = questions.filter(q => q.subcategory === criteria.subcategory);
        }

        // Filter by difficulty
        if (criteria.difficulty) {
            questions = questions.filter(q => q.difficulty === criteria.difficulty);
        }

        // Exclude already shown questions
        if (criteria.excludeShown && criteria.excludeShown.length > 0) {
            questions = questions.filter(q => !criteria.excludeShown.includes(q.id));
        }

        // Apply personalized filtering
        if (criteria.personalized) {
            questions = this.applyPersonalization(questions, criteria.personalized);
        }

        return questions;
    }

    /**
     * Apply personalization based on user profile
     */
    applyPersonalization(questions, userProfile) {
        return questions.map(question => {
            let score = 1;

            // Boost questions in user's preferred categories
            if (userProfile.preferredCategories.includes(question.category)) {
                score += 0.5;
            }

            // Boost questions matching user's interests
            if (userProfile.interests.some(interest => 
                question.tags.includes(interest))) {
                score += 0.3;
            }

            // Adjust based on user's skill level
            const skillLevel = userProfile.skillLevels[question.category] || 'beginner';
            const difficultyOrder = ['beginner', 'intermediate', 'advanced'];
            const userLevelIndex = difficultyOrder.indexOf(skillLevel);
            const questionLevelIndex = difficultyOrder.indexOf(question.difficulty);
            
            if (questionLevelIndex <= userLevelIndex + 1) {
                score += 0.2;
            }

            // Boost questions user hasn't seen recently
            if (!question.lastShown || 
                (Date.now() - question.lastShown) > (7 * 24 * 60 * 60 * 1000)) {
                score += 0.3;
            }

            return { ...question, personalizationScore: score };
        }).sort((a, b) => b.personalizationScore - a.personalizationScore);
    }

    /**
     * Select final questions using intelligent selection
     */
    selectQuestions(questions, count, userProfile) {
        if (questions.length <= count) {
            return questions;
        }

        const selected = [];
        const categories = [...new Set(questions.map(q => q.category))];
        const difficulties = ['beginner', 'intermediate', 'advanced'];

        // Distribute questions across categories and difficulties
        const questionsPerCategory = Math.ceil(count / categories.length);
        const questionsPerDifficulty = Math.ceil(count / difficulties.length);

        categories.forEach(category => {
            const categoryQuestions = questions.filter(q => q.category === category);
            
            difficulties.forEach(difficulty => {
                const difficultyQuestions = categoryQuestions.filter(q => q.difficulty === difficulty);
                const needed = Math.min(questionsPerDifficulty, difficultyQuestions.length);
                
                // Select top questions based on personalization score
                const selectedFromDifficulty = difficultyQuestions
                    .slice(0, needed)
                    .map(q => ({ ...q, selectedAt: Date.now() }));
                
                selected.push(...selectedFromDifficulty);
            });
        });

        // If we still need more questions, fill with highest scoring
        if (selected.length < count) {
            const remaining = questions.filter(q => 
                !selected.some(s => s.id === q.id));
            const needed = count - selected.length;
            const additional = remaining
                .slice(0, needed)
                .map(q => ({ ...q, selectedAt: Date.now() }));
            selected.push(...additional);
        }

        // Shuffle and limit to requested count
        return this.shuffleArray(selected).slice(0, count);
    }

    /**
     * Feed daily questions to a user
     */
    feedDailyQuestions(userId) {
        const userProfile = this.getUserProfile(userId);
        const dailyStreak = this.getUserProgress(userId).dailyStreak || 0;

        // Adjust question count based on streak
        const baseCount = 5;
        const streakBonus = Math.min(Math.floor(dailyStreak / 7), 5);
        const questionCount = baseCount + streakBonus;

        // Mix of categories for daily variety
        const categories = userProfile.preferredCategories.length > 0 
            ? userProfile.preferredCategories 
            : Object.keys(TravelCategories);

        const questions = [];
        const questionsPerCategory = Math.ceil(questionCount / categories.length);

        categories.forEach(category => {
            const categoryQuestions = this.feedQuestions(userId, {
                category,
                count: questionsPerCategory,
                adaptive: true,
                personalized: true
            });
            questions.push(...categoryQuestions);
        });

        return questions.slice(0, questionCount);
    }

    /**
     * Feed questions for a specific quiz session
     */
    feedQuizQuestions(userId, quizConfig) {
        const {
            category,
            subcategory,
            difficulty,
            questionCount = 10,
            timeLimit = 30,
            adaptive = true
        } = quizConfig;

        return this.feedQuestions(userId, {
            category,
            subcategory,
            difficulty,
            count: questionCount,
            adaptive,
            personalized: true
        }).map(question => ({
            ...question,
            timeLimit: timeLimit,
            quizId: this.generateQuizId(),
            sessionStart: Date.now()
        }));
    }

    /**
     * Feed practice questions for weak areas
     */
    feedPracticeQuestions(userId, weakAreas) {
        const questions = [];

        weakAreas.forEach(area => {
            const areaQuestions = this.feedQuestions(userId, {
                category: area.category,
                subcategory: area.subcategory,
                difficulty: area.difficulty,
                count: 3,
                adaptive: true,
                personalized: true
            });
            questions.push(...areaQuestions);
        });

        return questions;
    }

    /**
     * Feed challenge questions for advanced users
     */
    feedChallengeQuestions(userId) {
        const userProfile = this.getUserProfile(userId);
        
        // Only feed challenges to users with good performance
        if (userProfile.averageScore < 70) {
            return [];
        }

        return this.feedQuestions(userId, {
            difficulty: 'advanced',
            count: 5,
            adaptive: false, // Don't adapt for challenges
            personalized: false
        });
    }

    /**
     * Update question performance after user answers
     */
    updateQuestionPerformance(questionId, userId, result) {
        const question = this.questionDatabase.get(questionId);
        if (!question) return;

        // Update question statistics
        question.timesShown++;
        question.lastShown = Date.now();
        
        if (result.isCorrect) {
            question.correctAnswers++;
        }

        // Update average time
        if (result.timeSpent) {
            question.averageTime = (question.averageTime + result.timeSpent) / 2;
        }

        // Update user progress
        this.updateUserProgress(userId, questionId, result);

        // Adjust difficulty score based on performance
        this.adjustQuestionDifficulty(question, result);
    }

    /**
     * Adjust question difficulty based on performance
     */
    adjustQuestionDifficulty(question, result) {
        const accuracy = question.correctAnswers / question.timesShown;
        
        if (accuracy < 0.3) {
            // Question is too hard, lower difficulty
            question.difficultyScore = Math.max(1, question.difficultyScore - 0.5);
        } else if (accuracy > 0.8) {
            // Question is too easy, increase difficulty
            question.difficultyScore = Math.min(10, question.difficultyScore + 0.3);
        }
    }

    /**
     * Get user profile (mock implementation)
     */
    getUserProfile(userId) {
        return this.userProfiles.get(userId) || {
            preferredCategories: ['destinations', 'planning'],
            interests: ['geography', 'culture', 'budgeting'],
            skillLevels: {
                'destinations': 'intermediate',
                'planning': 'beginner',
                'safety': 'beginner',
                'culture': 'intermediate',
                'adventure': 'beginner',
                'sustainability': 'beginner'
            },
            averageScore: 75,
            totalQuizzes: 10,
            joinDate: Date.now() - (30 * 24 * 60 * 60 * 1000) // 30 days ago
        };
    }

    /**
     * Get user progress (mock implementation)
     */
    getUserProgress(userId) {
        return this.userProgress.get(userId) || {
            answeredQuestions: [],
            dailyStreak: 0,
            lastActive: Date.now(),
            totalQuestions: 0,
            correctAnswers: 0,
            averageTime: 0
        };
    }

    /**
     * Update user progress
     */
    updateUserProgress(userId, questionId, result) {
        const progress = this.getUserProgress(userId);
        
        progress.answeredQuestions.push(questionId);
        progress.totalQuestions++;
        progress.lastActive = Date.now();
        
        if (result.isCorrect) {
            progress.correctAnswers++;
        }
        
        progress.averageTime = (progress.averageTime + result.timeSpent) / 2;
        
        this.userProgress.set(userId, progress);
    }

    /**
     * Generate unique quiz ID
     */
    generateQuizId() {
        return `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for question performance updates
        document.addEventListener('question:answered', (event) => {
            this.updateQuestionPerformance(
                event.detail.questionId,
                event.detail.userId,
                event.detail.result
            );
        });

        // Listen for user profile updates
        document.addEventListener('user:profile:updated', (event) => {
            this.userProfiles.set(event.detail.userId, event.detail.profile);
        });
    }

    /**
     * Get question statistics
     */
    getQuestionStats() {
        const stats = {
            totalQuestions: this.questionDatabase.size,
            categories: {},
            difficulties: {},
            types: {}
        };

        this.questionDatabase.forEach(question => {
            // Category stats
            if (!stats.categories[question.category]) {
                stats.categories[question.category] = 0;
            }
            stats.categories[question.category]++;

            // Difficulty stats
            if (!stats.difficulties[question.difficulty]) {
                stats.difficulties[question.difficulty] = 0;
            }
            stats.difficulties[question.difficulty]++;

            // Type stats
            if (!stats.types[question.type]) {
                stats.types[question.type] = 0;
            }
            stats.types[question.type]++;
        });

        return stats;
    }

    /**
     * Export question data for analytics
     */
    exportQuestionData() {
        return {
            questions: Array.from(this.questionDatabase.values()),
            stats: this.getQuestionStats(),
            timestamp: Date.now()
        };
    }
}

/**
 * Adaptive Question Engine
 */
class AdaptiveQuestionEngine {
    constructor() {
        this.adaptationRules = new Map();
        this.setupAdaptationRules();
    }

    setupAdaptationRules() {
        // Rule: If user is struggling, provide easier questions
        this.adaptationRules.set('struggling', (questions, userProfile, userProgress) => {
            if (userProgress.averageScore < 50) {
                return questions.filter(q => q.difficulty === 'beginner');
            }
            return questions;
        });

        // Rule: If user is excelling, provide harder questions
        this.adaptationRules.set('excelling', (questions, userProfile, userProgress) => {
            if (userProgress.averageScore > 85) {
                return questions.filter(q => q.difficulty === 'advanced');
            }
            return questions;
        });

        // Rule: Balance question types
        this.adaptationRules.set('type_balance', (questions, userProfile, userProgress) => {
            const typeCounts = {};
            return questions.filter(question => {
                const type = question.type;
                typeCounts[type] = (typeCounts[type] || 0) + 1;
                return typeCounts[type] <= 3; // Max 3 of each type
            });
        });
    }

    filterQuestions(questions, userProfile, userProgress) {
        let filteredQuestions = questions;

        // Apply all adaptation rules
        this.adaptationRules.forEach((rule, name) => {
            filteredQuestions = rule(filteredQuestions, userProfile, userProgress);
        });

        return filteredQuestions;
    }
}

/**
 * Content Manager for question content
 */
class ContentManager {
    constructor() {
        this.contentCache = new Map();
        this.contentSources = [
            'SampleQuestions',
            'UserGeneratedQuestions',
            'ExpertQuestions',
            'CrowdsourcedQuestions'
        ];
    }

    async loadQuestionsFromSource(source) {
        // Mock implementation - in real app, this would fetch from API
        console.log(`📥 Loading questions from ${source}`);
        return [];
    }

    async refreshQuestionDatabase() {
        console.log('🔄 Refreshing question database...');
        
        for (const source of this.contentSources) {
            const questions = await this.loadQuestionsFromSource(source);
            // Process and add questions to database
        }
    }
}

/**
 * Question Analytics
 */
class QuestionAnalytics {
    constructor() {
        this.analytics = {
            questionFeeds: [],
            performanceMetrics: new Map(),
            userEngagement: new Map()
        };
    }

    trackQuestionFeed(userId, questions, options) {
        this.analytics.questionFeeds.push({
            userId,
            questionCount: questions.length,
            options,
            timestamp: Date.now()
        });
    }

    getAnalytics() {
        return this.analytics;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuestionFeeder, AdaptiveQuestionEngine, ContentManager, QuestionAnalytics };
} else {
    window.QuestionFeeder = QuestionFeeder;
    window.AdaptiveQuestionEngine = AdaptiveQuestionEngine;
    window.ContentManager = ContentManager;
    window.QuestionAnalytics = QuestionAnalytics;
}
