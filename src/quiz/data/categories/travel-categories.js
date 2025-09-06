/**
 * WANDERLUST TRAVEL - QUIZ CATEGORIES
 * Travel Knowledge Categories for Quiz Platform
 * Waterfall Methodology - Foundation Layer
 */

const TravelCategories = {
  destinations: {
    id: 'destinations',
    name: 'Destination Mastery',
    description: 'Test your knowledge about countries, cultures, and local customs',
    icon: '🌍',
    color: '#3498db',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    subcategories: [
      {
        id: 'europe',
        name: 'Europe',
        description: 'European countries, cultures, and travel tips',
        icon: '🏰',
        questions: 150
      },
      {
        id: 'asia',
        name: 'Asia',
        description: 'Asian destinations, traditions, and cultural insights',
        icon: '🏮',
        questions: 200
      },
      {
        id: 'americas',
        name: 'Americas',
        description: 'North and South American travel knowledge',
        icon: '🗽',
        questions: 180
      },
      {
        id: 'africa',
        name: 'Africa',
        description: 'African countries, wildlife, and cultural heritage',
        icon: '🦁',
        questions: 120
      },
      {
        id: 'oceania',
        name: 'Oceania',
        description: 'Australia, New Zealand, and Pacific islands',
        icon: '🏝️',
        questions: 80
      }
    ],
    totalQuestions: 730
  },

  planning: {
    id: 'planning',
    name: 'Travel Planning',
    description: 'Master the art of travel planning and organization',
    icon: '📋',
    color: '#e74c3c',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    subcategories: [
      {
        id: 'budget',
        name: 'Budget Planning',
        description: 'Money management and cost optimization',
        icon: '💰',
        questions: 100
      },
      {
        id: 'itinerary',
        name: 'Itinerary Creation',
        description: 'Planning routes and scheduling activities',
        icon: '🗓️',
        questions: 120
      },
      {
        id: 'booking',
        name: 'Booking Strategies',
        description: 'Finding deals and making reservations',
        icon: '🎫',
        questions: 90
      },
      {
        id: 'insurance',
        name: 'Travel Insurance',
        description: 'Understanding coverage and claims',
        icon: '🛡️',
        questions: 60
      }
    ],
    totalQuestions: 370
  },

  safety: {
    id: 'safety',
    name: 'Safety & Security',
    description: 'Essential safety knowledge for safe travels',
    icon: '🛡️',
    color: '#f39c12',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    subcategories: [
      {
        id: 'general-safety',
        name: 'General Safety',
        description: 'Basic safety tips and awareness',
        icon: '⚠️',
        questions: 80
      },
      {
        id: 'emergency',
        name: 'Emergency Procedures',
        description: 'Handling emergencies while traveling',
        icon: '🚨',
        questions: 70
      },
      {
        id: 'health',
        name: 'Health Precautions',
        description: 'Staying healthy while traveling',
        icon: '🏥',
        questions: 90
      },
      {
        id: 'digital-security',
        name: 'Digital Security',
        description: 'Protecting your digital information',
        icon: '🔒',
        questions: 60
      }
    ],
    totalQuestions: 300
  },

  culture: {
    id: 'culture',
    name: 'Cultural Competency',
    description: 'Understanding and respecting different cultures',
    icon: '🎭',
    color: '#9b59b6',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    subcategories: [
      {
        id: 'language',
        name: 'Language Basics',
        description: 'Essential phrases and communication',
        icon: '🗣️',
        questions: 120
      },
      {
        id: 'etiquette',
        name: 'Cultural Etiquette',
        description: 'Proper behavior in different cultures',
        icon: '🤝',
        questions: 100
      },
      {
        id: 'traditions',
        name: 'Local Traditions',
        description: 'Understanding cultural traditions',
        icon: '🎊',
        questions: 80
      },
      {
        id: 'communication',
        name: 'Communication Skills',
        description: 'Effective cross-cultural communication',
        icon: '💬',
        questions: 70
      }
    ],
    totalQuestions: 370
  },

  adventure: {
    id: 'adventure',
    name: 'Adventure & Activities',
    description: 'Outdoor activities and adventure travel',
    icon: '🏔️',
    color: '#27ae60',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    subcategories: [
      {
        id: 'outdoor',
        name: 'Outdoor Activities',
        description: 'Hiking, camping, and nature activities',
        icon: '🥾',
        questions: 100
      },
      {
        id: 'sports',
        name: 'Adventure Sports',
        description: 'Extreme sports and adventure activities',
        icon: '🏄',
        questions: 80
      },
      {
        id: 'photography',
        name: 'Travel Photography',
        description: 'Capturing amazing travel moments',
        icon: '📸',
        questions: 90
      },
      {
        id: 'equipment',
        name: 'Equipment Knowledge',
        description: 'Gear and equipment for adventures',
        icon: '🎒',
        questions: 70
      }
    ],
    totalQuestions: 340
  },

  sustainability: {
    id: 'sustainability',
    name: 'Sustainable Travel',
    description: 'Eco-friendly and responsible travel practices',
    icon: '🌱',
    color: '#2ecc71',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    subcategories: [
      {
        id: 'eco-friendly',
        name: 'Eco-Friendly Practices',
        description: 'Reducing environmental impact',
        icon: '♻️',
        questions: 80
      },
      {
        id: 'responsible',
        name: 'Responsible Tourism',
        description: 'Ethical travel practices',
        icon: '🤲',
        questions: 70
      },
      {
        id: 'environmental',
        name: 'Environmental Awareness',
        description: 'Understanding environmental issues',
        icon: '🌍',
        questions: 60
      },
      {
        id: 'community',
        name: 'Community Impact',
        description: 'Positive impact on local communities',
        icon: '🏘️',
        questions: 50
      }
    ],
    totalQuestions: 260
  }
};

// Certification levels for each category
const CertificationLevels = {
  bronze: {
    name: 'Bronze Explorer',
    description: 'Basic travel knowledge',
    pointsRequired: 100,
    color: '#cd7f32',
    icon: '🥉',
    benefits: [
      'Basic travel knowledge certificate',
      'Access to beginner quizzes',
      'Profile badge'
    ]
  },
  silver: {
    name: 'Silver Adventurer',
    description: 'Intermediate travel skills',
    pointsRequired: 300,
    color: '#c0c0c0',
    icon: '🥈',
    benefits: [
      'Intermediate travel skills certificate',
      'Access to intermediate quizzes',
      'Exclusive content access',
      'Priority support'
    ]
  },
  gold: {
    name: 'Gold Wanderer',
    description: 'Advanced travel expertise',
    pointsRequired: 600,
    color: '#ffd700',
    icon: '🥇',
    benefits: [
      'Advanced travel expertise certificate',
      'Access to expert quizzes',
      'Mentorship opportunities',
      'Early feature access'
    ]
  },
  platinum: {
    name: 'Platinum Nomad',
    description: 'Expert travel mastery',
    pointsRequired: 1000,
    color: '#e5e4e2',
    icon: '💎',
    benefits: [
      'Expert travel mastery certificate',
      'Content creation privileges',
      'Community moderation rights',
      'Exclusive events access'
    ]
  },
  diamond: {
    name: 'Diamond Globetrotter',
    description: 'Travel industry professional',
    pointsRequired: 1500,
    color: '#b9f2ff',
    icon: '💠',
    benefits: [
      'Professional certification',
      'Industry recognition',
      'Speaking opportunities',
      'Brand partnership opportunities'
    ]
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TravelCategories, CertificationLevels };
} else {
  window.TravelCategories = TravelCategories;
  window.CertificationLevels = CertificationLevels;
}
