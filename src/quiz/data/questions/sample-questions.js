/**
 * WANDERLUST TRAVEL - SAMPLE QUIZ QUESTIONS
 * Sample Questions for Quiz Platform
 * Waterfall Methodology - Foundation Layer
 */

const SampleQuestions = {
  destinations: {
    europe: [
      {
        id: 'europe-001',
        type: 'multiple-choice',
        difficulty: 'beginner',
        category: 'destinations',
        subcategory: 'europe',
        question: 'What is the capital city of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        explanation: 'Paris is the capital and largest city of France, known for landmarks like the Eiffel Tower and Louvre Museum.',
        points: 10,
        tags: ['geography', 'capitals', 'france']
      },
      {
        id: 'europe-002',
        type: 'true-false',
        difficulty: 'intermediate',
        category: 'destinations',
        subcategory: 'europe',
        question: 'The Euro is the official currency of all European Union countries.',
        correctAnswer: false,
        explanation: 'While the Euro is used by 19 EU countries, some EU members like Denmark, Sweden, and Poland still use their own currencies.',
        points: 15,
        tags: ['currency', 'european-union', 'economics']
      },
      {
        id: 'europe-003',
        type: 'fill-in-blank',
        difficulty: 'advanced',
        category: 'destinations',
        subcategory: 'europe',
        question: 'The famous Neuschwanstein Castle is located in which German state?',
        correctAnswer: 'Bavaria',
        explanation: 'Neuschwanstein Castle is located in Bavaria, Germany, and was the inspiration for Disney\'s Sleeping Beauty Castle.',
        points: 20,
        tags: ['architecture', 'germany', 'castles', 'bavaria']
      }
    ],
    asia: [
      {
        id: 'asia-001',
        type: 'multiple-choice',
        difficulty: 'beginner',
        category: 'destinations',
        subcategory: 'asia',
        question: 'Which country is known as the "Land of the Rising Sun"?',
        options: ['China', 'Japan', 'South Korea', 'Thailand'],
        correctAnswer: 1,
        explanation: 'Japan is known as the "Land of the Rising Sun" due to its location east of the Asian mainland.',
        points: 10,
        tags: ['nicknames', 'japan', 'geography']
      },
      {
        id: 'asia-002',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        category: 'destinations',
        subcategory: 'asia',
        question: 'What is the traditional greeting in Thailand?',
        options: ['Handshake', 'Wai', 'Bow', 'Hug'],
        correctAnswer: 1,
        explanation: 'The Wai is the traditional Thai greeting, performed by pressing palms together and bowing slightly.',
        points: 15,
        tags: ['culture', 'thailand', 'etiquette', 'greetings']
      }
    ]
  },

  planning: {
    budget: [
      {
        id: 'budget-001',
        type: 'multiple-choice',
        difficulty: 'beginner',
        category: 'planning',
        subcategory: 'budget',
        question: 'What percentage of your travel budget should typically be allocated for accommodation?',
        options: ['20-30%', '30-40%', '40-50%', '50-60%'],
        correctAnswer: 1,
        explanation: 'Accommodation typically accounts for 30-40% of a travel budget, though this can vary based on destination and travel style.',
        points: 10,
        tags: ['budgeting', 'accommodation', 'planning']
      },
      {
        id: 'budget-002',
        type: 'true-false',
        difficulty: 'intermediate',
        category: 'planning',
        subcategory: 'budget',
        question: 'Travel insurance is always worth the cost, regardless of your destination.',
        correctAnswer: true,
        explanation: 'Travel insurance provides protection against unexpected events like trip cancellations, medical emergencies, and lost luggage.',
        points: 15,
        tags: ['insurance', 'safety', 'planning']
      }
    ]
  },

  safety: {
    'general-safety': [
      {
        id: 'safety-001',
        type: 'multiple-choice',
        difficulty: 'beginner',
        category: 'safety',
        subcategory: 'general-safety',
        question: 'What is the most important document to keep safe while traveling?',
        options: ['Credit card', 'Passport', 'Hotel key', 'Phone'],
        correctAnswer: 1,
        explanation: 'Your passport is the most important document as it\'s required for international travel and can be difficult to replace.',
        points: 10,
        tags: ['documents', 'passport', 'safety']
      }
    ]
  },

  culture: {
    language: [
      {
        id: 'culture-001',
        type: 'fill-in-blank',
        difficulty: 'beginner',
        category: 'culture',
        subcategory: 'language',
        question: 'How do you say "Thank you" in Japanese?',
        correctAnswer: 'Arigato',
        explanation: 'Arigato (ありがとう) is the most common way to say "Thank you" in Japanese.',
        points: 10,
        tags: ['japanese', 'language', 'phrases']
      }
    ]
  },

  adventure: {
    outdoor: [
      {
        id: 'adventure-001',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        category: 'adventure',
        subcategory: 'outdoor',
        question: 'What is the "Leave No Trace" principle?',
        options: [
          'Leave everything as you found it',
          'Take only photos, leave only footprints',
          'Both of the above',
          'None of the above'
        ],
        correctAnswer: 2,
        explanation: 'Leave No Trace means both leaving everything as you found it and taking only photos while leaving only footprints.',
        points: 15,
        tags: ['outdoor-ethics', 'environment', 'hiking']
      }
    ]
  },

  sustainability: {
    'eco-friendly': [
      {
        id: 'sustainability-001',
        type: 'multiple-choice',
        difficulty: 'beginner',
        category: 'sustainability',
        subcategory: 'eco-friendly',
        question: 'Which mode of transportation has the lowest carbon footprint for short distances?',
        options: ['Car', 'Plane', 'Train', 'Walking'],
        correctAnswer: 3,
        explanation: 'Walking has the lowest carbon footprint as it produces no direct emissions.',
        points: 10,
        tags: ['carbon-footprint', 'transportation', 'environment']
      }
    ]
  }
};

// Question types and their configurations
const QuestionTypes = {
  'multiple-choice': {
    name: 'Multiple Choice',
    description: 'Choose the correct answer from multiple options',
    icon: '📝',
    maxOptions: 4,
    minOptions: 2
  },
  'true-false': {
    name: 'True or False',
    description: 'Determine if the statement is true or false',
    icon: '✅',
    maxOptions: 2,
    minOptions: 2
  },
  'fill-in-blank': {
    name: 'Fill in the Blank',
    description: 'Complete the statement with the correct word or phrase',
    icon: '✏️',
    maxOptions: 0,
    minOptions: 0
  },
  'matching': {
    name: 'Matching',
    description: 'Match items from two columns',
    icon: '🔗',
    maxOptions: 10,
    minOptions: 2
  },
  'image-identification': {
    name: 'Image Identification',
    description: 'Identify landmarks, flags, or cultural items from images',
    icon: '🖼️',
    maxOptions: 4,
    minOptions: 2
  }
};

// Difficulty levels and their characteristics
const DifficultyLevels = {
  beginner: {
    name: 'Beginner',
    description: 'Basic knowledge level',
    color: '#27ae60',
    pointsMultiplier: 1.0,
    timeLimit: 30 // seconds per question
  },
  intermediate: {
    name: 'Intermediate',
    description: 'Moderate knowledge level',
    color: '#f39c12',
    pointsMultiplier: 1.5,
    timeLimit: 25
  },
  advanced: {
    name: 'Advanced',
    description: 'Expert knowledge level',
    color: '#e74c3c',
    pointsMultiplier: 2.0,
    timeLimit: 20
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SampleQuestions, QuestionTypes, DifficultyLevels };
} else {
  window.SampleQuestions = SampleQuestions;
  window.QuestionTypes = QuestionTypes;
  window.DifficultyLevels = DifficultyLevels;
}
