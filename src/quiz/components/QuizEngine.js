/**
 * WANDERLUST TRAVEL - QUIZ ENGINE
 * Core Quiz Engine Component
 * Waterfall Methodology - Component Layer
 */

class QuizEngine {
    constructor(config = {}) {
        this.config = {
            timeLimit: config.timeLimit || 30,
            shuffleQuestions: config.shuffleQuestions !== false,
            shuffleOptions: config.shuffleOptions !== false,
            showExplanation: config.showExplanation !== false,
            allowSkip: config.allowSkip || false,
            adaptiveDifficulty: config.adaptiveDifficulty || false,
            ...config
        };
        
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.timer = null;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        
        this.eventListeners = new Map();
        this.questionTypes = new Map();
        
        this.initializeQuestionTypes();
    }

    /**
     * Initialize question type handlers
     */
    initializeQuestionTypes() {
        this.questionTypes.set('multiple-choice', {
            render: this.renderMultipleChoice.bind(this),
            validate: this.validateMultipleChoice.bind(this),
            calculateScore: this.calculateMultipleChoiceScore.bind(this)
        });
        
        this.questionTypes.set('true-false', {
            render: this.renderTrueFalse.bind(this),
            validate: this.validateTrueFalse.bind(this),
            calculateScore: this.calculateTrueFalseScore.bind(this)
        });
        
        this.questionTypes.set('fill-in-blank', {
            render: this.renderFillInBlank.bind(this),
            validate: this.validateFillInBlank.bind(this),
            calculateScore: this.calculateFillInBlankScore.bind(this)
        });
        
        this.questionTypes.set('matching', {
            render: this.renderMatching.bind(this),
            validate: this.validateMatching.bind(this),
            calculateScore: this.calculateMatchingScore.bind(this)
        });
        
        this.questionTypes.set('image-identification', {
            render: this.renderImageIdentification.bind(this),
            validate: this.validateImageIdentification.bind(this),
            calculateScore: this.calculateImageIdentificationScore.bind(this)
        });
    }

    /**
     * Start a new quiz
     */
    startQuiz(quizData) {
        this.currentQuiz = {
            ...quizData,
            questions: this.config.shuffleQuestions ? 
                this.shuffleArray([...quizData.questions]) : 
                quizData.questions
        };
        
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        
        this.dispatchEvent('quiz:started', { quiz: this.currentQuiz });
        this.renderCurrentQuestion();
        this.startTimer();
    }

    /**
     * Render the current question
     */
    renderCurrentQuestion() {
        if (!this.currentQuiz || this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            this.finishQuiz();
            return;
        }
        
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const questionType = this.questionTypes.get(question.type);
        
        if (!questionType) {
            console.error(`Unknown question type: ${question.type}`);
            return;
        }
        
        this.dispatchEvent('question:rendering', { 
            question, 
            index: this.currentQuestionIndex,
            total: this.currentQuiz.questions.length 
        });
        
        questionType.render(question);
        this.startQuestionTimer(question);
    }

    /**
     * Submit an answer for the current question
     */
    submitAnswer(answer) {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const questionType = this.questionTypes.get(question.type);
        
        if (!questionType) {
            console.error(`Unknown question type: ${question.type}`);
            return;
        }
        
        const validation = questionType.validate(question, answer);
        const score = validation.isCorrect ? 
            questionType.calculateScore(question, answer) : 0;
        
        const userAnswer = {
            questionId: question.id,
            answer: answer,
            isCorrect: validation.isCorrect,
            score: score,
            timeSpent: this.getQuestionTimeSpent(),
            timestamp: Date.now()
        };
        
        this.userAnswers.push(userAnswer);
        
        if (validation.isCorrect) {
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
        } else {
            this.streak = 0;
        }
        
        this.score += score;
        
        this.dispatchEvent('answer:submitted', {
            question,
            userAnswer,
            streak: this.streak,
            score: this.score
        });
        
        // Show explanation if configured
        if (this.config.showExplanation) {
            this.showExplanation(question, userAnswer);
        } else {
            this.nextQuestion();
        }
    }

    /**
     * Move to the next question
     */
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.currentQuiz.questions.length) {
            this.renderCurrentQuestion();
        } else {
            this.finishQuiz();
        }
    }

    /**
     * Skip the current question
     */
    skipQuestion() {
        if (!this.config.allowSkip) {
            return;
        }
        
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const userAnswer = {
            questionId: question.id,
            answer: null,
            isCorrect: false,
            score: 0,
            timeSpent: this.getQuestionTimeSpent(),
            timestamp: Date.now(),
            skipped: true
        };
        
        this.userAnswers.push(userAnswer);
        this.streak = 0;
        
        this.dispatchEvent('question:skipped', { question, userAnswer });
        this.nextQuestion();
    }

    /**
     * Finish the quiz and calculate final results
     */
    finishQuiz() {
        const endTime = Date.now();
        const totalTime = endTime - this.startTime;
        
        const results = {
            quiz: this.currentQuiz,
            userAnswers: this.userAnswers,
            score: this.score,
            maxScore: this.calculateMaxScore(),
            percentage: this.calculatePercentage(),
            streak: this.streak,
            maxStreak: this.maxStreak,
            totalTime: totalTime,
            averageTimePerQuestion: totalTime / this.currentQuiz.questions.length,
            completedAt: new Date().toISOString()
        };
        
        this.dispatchEvent('quiz:finished', results);
        this.renderResults(results);
    }

    /**
     * Calculate maximum possible score
     */
    calculateMaxScore() {
        return this.currentQuiz.questions.reduce((total, question) => {
            return total + (question.points || 10);
        }, 0);
    }

    /**
     * Calculate percentage score
     */
    calculatePercentage() {
        const maxScore = this.calculateMaxScore();
        return maxScore > 0 ? Math.round((this.score / maxScore) * 100) : 0;
    }

    /**
     * Start the overall quiz timer
     */
    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            this.dispatchEvent('timer:tick', { elapsed });
        }, 1000);
    }

    /**
     * Start timer for current question
     */
    startQuestionTimer(question) {
        this.questionStartTime = Date.now();
        
        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
        }
        
        const timeLimit = question.timeLimit || this.config.timeLimit;
        
        this.questionTimer = setTimeout(() => {
            this.dispatchEvent('question:timeout', { question });
            this.submitAnswer(null); // Auto-submit with no answer
        }, timeLimit * 1000);
    }

    /**
     * Get time spent on current question
     */
    getQuestionTimeSpent() {
        return this.questionStartTime ? 
            Math.round((Date.now() - this.questionStartTime) / 1000) : 0;
    }

    /**
     * Show explanation for a question
     */
    showExplanation(question, userAnswer) {
        this.dispatchEvent('explanation:show', {
            question,
            userAnswer,
            explanation: question.explanation
        });
        
        // Auto-advance after showing explanation
        setTimeout(() => {
            this.nextQuestion();
        }, 3000);
    }

    /**
     * Render quiz results
     */
    renderResults(results) {
        this.dispatchEvent('results:render', results);
    }

    // Question Type Renderers
    renderMultipleChoice(question) {
        const options = this.config.shuffleOptions ? 
            this.shuffleArray([...question.options]) : 
            question.options;
        
        this.dispatchEvent('question:render', {
            type: 'multiple-choice',
            question,
            options
        });
    }

    renderTrueFalse(question) {
        this.dispatchEvent('question:render', {
            type: 'true-false',
            question,
            options: ['True', 'False']
        });
    }

    renderFillInBlank(question) {
        this.dispatchEvent('question:render', {
            type: 'fill-in-blank',
            question
        });
    }

    renderMatching(question) {
        this.dispatchEvent('question:render', {
            type: 'matching',
            question
        });
    }

    renderImageIdentification(question) {
        this.dispatchEvent('question:render', {
            type: 'image-identification',
            question
        });
    }

    // Question Type Validators
    validateMultipleChoice(question, answer) {
        return {
            isCorrect: answer === question.correctAnswer,
            correctAnswer: question.correctAnswer
        };
    }

    validateTrueFalse(question, answer) {
        const userAnswer = answer === 'True' || answer === 0;
        return {
            isCorrect: userAnswer === question.correctAnswer,
            correctAnswer: question.correctAnswer
        };
    }

    validateFillInBlank(question, answer) {
        const correctAnswer = question.correctAnswer.toLowerCase().trim();
        const userAnswer = answer.toLowerCase().trim();
        
        return {
            isCorrect: userAnswer === correctAnswer,
            correctAnswer: question.correctAnswer
        };
    }

    validateMatching(question, answer) {
        // Implementation for matching questions
        return {
            isCorrect: this.checkMatchingAnswer(question, answer),
            correctAnswer: question.correctMatches
        };
    }

    validateImageIdentification(question, answer) {
        return {
            isCorrect: answer === question.correctAnswer,
            correctAnswer: question.correctAnswer
        };
    }

    // Score Calculators
    calculateMultipleChoiceScore(question, answer) {
        const baseScore = question.points || 10;
        const timeBonus = this.calculateTimeBonus(question);
        return baseScore + timeBonus;
    }

    calculateTrueFalseScore(question, answer) {
        const baseScore = question.points || 10;
        const timeBonus = this.calculateTimeBonus(question);
        return baseScore + timeBonus;
    }

    calculateFillInBlankScore(question, answer) {
        const baseScore = question.points || 10;
        const timeBonus = this.calculateTimeBonus(question);
        return baseScore + timeBonus;
    }

    calculateMatchingScore(question, answer) {
        const baseScore = question.points || 10;
        const timeBonus = this.calculateTimeBonus(question);
        return baseScore + timeBonus;
    }

    calculateImageIdentificationScore(question, answer) {
        const baseScore = question.points || 10;
        const timeBonus = this.calculateTimeBonus(question);
        return baseScore + timeBonus;
    }

    /**
     * Calculate time bonus for quick answers
     */
    calculateTimeBonus(question) {
        const timeSpent = this.getQuestionTimeSpent();
        const timeLimit = question.timeLimit || this.config.timeLimit;
        
        if (timeSpent < timeLimit * 0.5) {
            return Math.round((question.points || 10) * 0.2); // 20% bonus
        } else if (timeSpent < timeLimit * 0.8) {
            return Math.round((question.points || 10) * 0.1); // 10% bonus
        }
        
        return 0;
    }

    /**
     * Check matching answer correctness
     */
    checkMatchingAnswer(question, answer) {
        // Implementation for matching validation
        return true; // Placeholder
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
     * Add event listener
     */
    addEventListener(event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(handler);
    }

    /**
     * Remove event listener
     */
    removeEventListener(event, handler) {
        if (this.eventListeners.has(event)) {
            const handlers = this.eventListeners.get(event);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
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
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
        }
        this.eventListeners.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizEngine;
} else {
    window.QuizEngine = QuizEngine;
}
