/**
 * WANDERLUST TRAVEL - GAMIFICATION MODULE
 * Gamification System for Quiz Platform
 * Waterfall Methodology - Feature Layer
 */

class GamificationModule {
    constructor(app) {
        this.app = app;
        this.user = null;
        this.points = 0;
        this.level = 1;
        this.streak = 0;
        this.maxStreak = 0;
        this.achievements = [];
        this.badges = [];
        this.leaderboard = [];
        
        this.pointMultipliers = {
            correctAnswer: 1.0,
            streak: 1.5,
            speed: 2.0,
            difficulty: {
                beginner: 1.0,
                intermediate: 1.5,
                advanced: 2.0
            }
        };
        
        this.achievementDefinitions = this.initializeAchievements();
        this.badgeDefinitions = this.initializeBadges();
        
        this.eventListeners = new Map();
    }

    /**
     * Initialize the gamification module
     */
    async init() {
        console.log('🎮 Initializing Gamification Module...');
        
        // Load user progress
        await this.loadUserProgress();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize leaderboard
        await this.updateLeaderboard();
        
        console.log('✅ Gamification Module initialized');
    }

    /**
     * Initialize achievement definitions
     */
    initializeAchievements() {
        return {
            'first-quiz': {
                id: 'first-quiz',
                name: 'First Steps',
                description: 'Complete your first quiz',
                icon: '👶',
                points: 50,
                condition: (user) => user.quizzesCompleted >= 1,
                category: 'milestone'
            },
            'quiz-master': {
                id: 'quiz-master',
                name: 'Quiz Master',
                description: 'Complete 10 quizzes',
                icon: '🎯',
                points: 200,
                condition: (user) => user.quizzesCompleted >= 10,
                category: 'milestone'
            },
            'perfect-score': {
                id: 'perfect-score',
                name: 'Perfect Score',
                description: 'Get 100% on a quiz',
                icon: '💯',
                points: 100,
                condition: (user) => user.perfectScores >= 1,
                category: 'performance'
            },
            'streak-master': {
                id: 'streak-master',
                name: 'Streak Master',
                description: 'Answer 10 questions correctly in a row',
                icon: '🔥',
                points: 150,
                condition: (user) => user.maxStreak >= 10,
                category: 'performance'
            },
            'speed-demon': {
                id: 'speed-demon',
                name: 'Speed Demon',
                description: 'Answer a question in under 5 seconds',
                icon: '⚡',
                points: 75,
                condition: (user) => user.fastestAnswer <= 5,
                category: 'performance'
            },
            'explorer': {
                id: 'explorer',
                name: 'Explorer',
                description: 'Complete quizzes in 5 different categories',
                icon: '🗺️',
                points: 300,
                condition: (user) => user.categoriesCompleted >= 5,
                category: 'exploration'
            },
            'daily-champion': {
                id: 'daily-champion',
                name: 'Daily Champion',
                description: 'Complete a quiz for 7 consecutive days',
                icon: '📅',
                points: 250,
                condition: (user) => user.dailyStreak >= 7,
                category: 'consistency'
            },
            'knowledge-seeker': {
                id: 'knowledge-seeker',
                name: 'Knowledge Seeker',
                description: 'Answer 100 questions correctly',
                icon: '🧠',
                points: 400,
                condition: (user) => user.correctAnswers >= 100,
                category: 'milestone'
            },
            'category-expert': {
                id: 'category-expert',
                name: 'Category Expert',
                description: 'Master a specific travel category',
                icon: '🏆',
                points: 500,
                condition: (user) => this.checkCategoryMastery(user),
                category: 'expertise'
            },
            'social-butterfly': {
                id: 'social-butterfly',
                name: 'Social Butterfly',
                description: 'Share 5 achievements on social media',
                icon: '🦋',
                points: 100,
                condition: (user) => user.shares >= 5,
                category: 'social'
            }
        };
    }

    /**
     * Initialize badge definitions
     */
    initializeBadges() {
        return {
            'bronze-explorer': {
                id: 'bronze-explorer',
                name: 'Bronze Explorer',
                description: 'Basic travel knowledge',
                icon: '🥉',
                color: '#cd7f32',
                requirements: { points: 100, level: 1 },
                benefits: ['Basic certificate', 'Profile badge']
            },
            'silver-adventurer': {
                id: 'silver-adventurer',
                name: 'Silver Adventurer',
                description: 'Intermediate travel skills',
                icon: '🥈',
                color: '#c0c0c0',
                requirements: { points: 300, level: 3 },
                benefits: ['Intermediate certificate', 'Exclusive content']
            },
            'gold-wanderer': {
                id: 'gold-wanderer',
                name: 'Gold Wanderer',
                description: 'Advanced travel expertise',
                icon: '🥇',
                color: '#ffd700',
                requirements: { points: 600, level: 6 },
                benefits: ['Advanced certificate', 'Mentorship access']
            },
            'platinum-nomad': {
                id: 'platinum-nomad',
                name: 'Platinum Nomad',
                description: 'Expert travel mastery',
                icon: '💎',
                color: '#e5e4e2',
                requirements: { points: 1000, level: 10 },
                benefits: ['Expert certificate', 'Content creation rights']
            },
            'diamond-globetrotter': {
                id: 'diamond-globetrotter',
                name: 'Diamond Globetrotter',
                description: 'Travel industry professional',
                icon: '💠',
                color: '#b9f2ff',
                requirements: { points: 1500, level: 15 },
                benefits: ['Professional certification', 'Industry recognition']
            }
        };
    }

    /**
     * Award points for quiz performance
     */
    awardPoints(quizResult) {
        let pointsEarned = 0;
        
        // Base points for correct answers
        const correctAnswers = quizResult.userAnswers.filter(answer => answer.isCorrect).length;
        pointsEarned += correctAnswers * 10 * this.pointMultipliers.correctAnswer;
        
        // Streak bonus
        if (quizResult.maxStreak >= 5) {
            pointsEarned *= this.pointMultipliers.streak;
        }
        
        // Speed bonus
        const averageTime = quizResult.averageTimePerQuestion;
        if (averageTime < 10) { // Under 10 seconds per question
            pointsEarned *= this.pointMultipliers.speed;
        }
        
        // Difficulty multiplier
        const difficulty = quizResult.quiz.difficulty || 'beginner';
        pointsEarned *= this.pointMultipliers.difficulty[difficulty];
        
        // Perfect score bonus
        if (quizResult.percentage === 100) {
            pointsEarned += 100;
        }
        
        this.points += Math.round(pointsEarned);
        this.updateLevel();
        
        this.dispatchEvent('points:awarded', {
            pointsEarned: Math.round(pointsEarned),
            totalPoints: this.points,
            level: this.level
        });
        
        return Math.round(pointsEarned);
    }

    /**
     * Update user level based on points
     */
    updateLevel() {
        const newLevel = Math.floor(this.points / 100) + 1;
        const levelUp = newLevel > this.level;
        
        if (levelUp) {
            const oldLevel = this.level;
            this.level = newLevel;
            
            this.dispatchEvent('level:up', {
                oldLevel,
                newLevel: this.level,
                points: this.points
            });
            
            // Check for level-based achievements
            this.checkAchievements();
        }
    }

    /**
     * Update streak counter
     */
    updateStreak(quizResult) {
        const currentStreak = quizResult.maxStreak;
        
        if (currentStreak > this.streak) {
            this.streak = currentStreak;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
            
            this.dispatchEvent('streak:updated', {
                streak: this.streak,
                maxStreak: this.maxStreak
            });
        }
    }

    /**
     * Check and award achievements
     */
    checkAchievements() {
        const userStats = this.getUserStats();
        
        Object.values(this.achievementDefinitions).forEach(achievement => {
            if (!this.achievements.includes(achievement.id) && 
                achievement.condition(userStats)) {
                this.awardAchievement(achievement);
            }
        });
    }

    /**
     * Award an achievement
     */
    awardAchievement(achievement) {
        this.achievements.push(achievement.id);
        this.points += achievement.points;
        
        this.dispatchEvent('achievement:earned', {
            achievement,
            points: achievement.points,
            totalPoints: this.points
        });
        
        // Show achievement notification
        this.showAchievementNotification(achievement);
        
        // Save progress
        this.saveUserProgress();
    }

    /**
     * Check and award badges
     */
    checkBadges() {
        const userStats = this.getUserStats();
        
        Object.values(this.badgeDefinitions).forEach(badge => {
            if (!this.badges.includes(badge.id) && 
                this.meetsBadgeRequirements(badge, userStats)) {
                this.awardBadge(badge);
            }
        });
    }

    /**
     * Award a badge
     */
    awardBadge(badge) {
        this.badges.push(badge.id);
        
        this.dispatchEvent('badge:earned', {
            badge,
            benefits: badge.benefits
        });
        
        // Show badge notification
        this.showBadgeNotification(badge);
        
        // Save progress
        this.saveUserProgress();
    }

    /**
     * Check if user meets badge requirements
     */
    meetsBadgeRequirements(badge, userStats) {
        return userStats.points >= badge.requirements.points &&
               userStats.level >= badge.requirements.level;
    }

    /**
     * Get user statistics
     */
    getUserStats() {
        return {
            points: this.points,
            level: this.level,
            streak: this.streak,
            maxStreak: this.maxStreak,
            achievements: this.achievements.length,
            badges: this.badges.length,
            quizzesCompleted: this.getQuizzesCompleted(),
            correctAnswers: this.getCorrectAnswers(),
            perfectScores: this.getPerfectScores(),
            categoriesCompleted: this.getCategoriesCompleted(),
            dailyStreak: this.getDailyStreak(),
            fastestAnswer: this.getFastestAnswer(),
            shares: this.getShares()
        };
    }

    /**
     * Update leaderboard
     */
    async updateLeaderboard() {
        // In a real application, this would fetch from a server
        // For now, we'll use local storage
        const localLeaderboard = this.getLocalLeaderboard();
        
        // Add current user if not present
        const userStats = this.getUserStats();
        const existingUserIndex = localLeaderboard.findIndex(
            entry => entry.userId === this.user?.id
        );
        
        if (existingUserIndex >= 0) {
            localLeaderboard[existingUserIndex] = {
                ...localLeaderboard[existingUserIndex],
                ...userStats
            };
        } else {
            localLeaderboard.push({
                userId: this.user?.id || 'anonymous',
                username: this.user?.username || 'Anonymous',
                ...userStats
            });
        }
        
        // Sort by points
        localLeaderboard.sort((a, b) => b.points - a.points);
        
        // Keep top 100
        this.leaderboard = localLeaderboard.slice(0, 100);
        
        this.dispatchEvent('leaderboard:updated', {
            leaderboard: this.leaderboard,
            userRank: this.getUserRank()
        });
    }

    /**
     * Get user's rank on leaderboard
     */
    getUserRank() {
        const userIndex = this.leaderboard.findIndex(
            entry => entry.userId === this.user?.id
        );
        return userIndex >= 0 ? userIndex + 1 : null;
    }

    /**
     * Show achievement notification
     */
    showAchievementNotification(achievement) {
        this.dispatchEvent('notification:show', {
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: `${achievement.name}: ${achievement.description}`,
            icon: achievement.icon,
            duration: 5000
        });
    }

    /**
     * Show badge notification
     */
    showBadgeNotification(badge) {
        this.dispatchEvent('notification:show', {
            type: 'badge',
            title: 'New Badge Earned!',
            message: `${badge.name}: ${badge.description}`,
            icon: badge.icon,
            color: badge.color,
            duration: 5000
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for quiz completion
        this.app.addEventListener('quiz:finished', (event) => {
            this.handleQuizCompletion(event.detail);
        });
        
        // Listen for user actions
        this.app.addEventListener('user:action', (event) => {
            this.handleUserAction(event.detail);
        });
    }

    /**
     * Handle quiz completion
     */
    handleQuizCompletion(quizResult) {
        // Award points
        this.awardPoints(quizResult);
        
        // Update streak
        this.updateStreak(quizResult);
        
        // Check achievements and badges
        this.checkAchievements();
        this.checkBadges();
        
        // Update leaderboard
        this.updateLeaderboard();
        
        // Save progress
        this.saveUserProgress();
    }

    /**
     * Handle user actions
     */
    handleUserAction(action) {
        switch (action.type) {
            case 'share':
                this.handleShare(action.data);
                break;
            case 'daily_login':
                this.handleDailyLogin();
                break;
            case 'category_complete':
                this.handleCategoryComplete(action.data);
                break;
        }
    }

    /**
     * Handle social sharing
     */
    handleShare(data) {
        // Track sharing for social achievements
        this.dispatchEvent('analytics:track', {
            event: 'achievement_shared',
            data: data
        });
    }

    /**
     * Handle daily login
     */
    handleDailyLogin() {
        // Update daily streak
        this.dispatchEvent('analytics:track', {
            event: 'daily_login',
            data: { streak: this.getDailyStreak() }
        });
    }

    /**
     * Handle category completion
     */
    handleCategoryComplete(category) {
        // Check for category-specific achievements
        this.dispatchEvent('analytics:track', {
            event: 'category_completed',
            data: { category }
        });
    }

    /**
     * Load user progress from storage
     */
    async loadUserProgress() {
        try {
            const saved = localStorage.getItem('wanderlust_gamification');
            if (saved) {
                const data = JSON.parse(saved);
                this.points = data.points || 0;
                this.level = data.level || 1;
                this.streak = data.streak || 0;
                this.maxStreak = data.maxStreak || 0;
                this.achievements = data.achievements || [];
                this.badges = data.badges || [];
            }
        } catch (error) {
            console.warn('Failed to load gamification progress:', error);
        }
    }

    /**
     * Save user progress to storage
     */
    saveUserProgress() {
        try {
            const data = {
                points: this.points,
                level: this.level,
                streak: this.streak,
                maxStreak: this.maxStreak,
                achievements: this.achievements,
                badges: this.badges,
                lastSaved: Date.now()
            };
            
            localStorage.setItem('wanderlust_gamification', JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save gamification progress:', error);
        }
    }

    /**
     * Get local leaderboard from storage
     */
    getLocalLeaderboard() {
        try {
            const saved = localStorage.getItem('wanderlust_leaderboard');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Save local leaderboard to storage
     */
    saveLocalLeaderboard() {
        try {
            localStorage.setItem('wanderlust_leaderboard', JSON.stringify(this.leaderboard));
        } catch (error) {
            console.warn('Failed to save leaderboard:', error);
        }
    }

    // Helper methods for user statistics
    getQuizzesCompleted() { return 0; } // Implement based on your data
    getCorrectAnswers() { return 0; } // Implement based on your data
    getPerfectScores() { return 0; } // Implement based on your data
    getCategoriesCompleted() { return 0; } // Implement based on your data
    getDailyStreak() { return 0; } // Implement based on your data
    getFastestAnswer() { return 999; } // Implement based on your data
    getShares() { return 0; } // Implement based on your data
    checkCategoryMastery(user) { return false; } // Implement based on your data

    /**
     * Add event listener
     */
    addEventListener(event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(handler);
    }

    /**
     * Dispatch event
     */
    dispatchEvent(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in gamification event handler for ${event}:`, error);
                }
            });
        }
        
        // Also dispatch to main app
        if (this.app && this.app.dispatchEvent) {
            this.app.dispatchEvent(event, data);
        }
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.eventListeners.clear();
        this.saveUserProgress();
        this.saveLocalLeaderboard();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationModule;
} else {
    window.GamificationModule = GamificationModule;
}
