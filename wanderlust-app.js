// Shopping Cart System
let cart = [];
let cartTotal = 0;

// Wishlist System
let wishlist = [];

// Load wishlist from localStorage
function loadWishlist() {
    const savedWishlist = localStorage.getItem('wanderlustWishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
        updateWishlistUI();
    }
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('wanderlustWishlist', JSON.stringify(wishlist));
}

// Add to wishlist
function addToWishlist(id, name, price, image) {
    const existingItem = wishlist.find(item => item.id === id);
    
    if (existingItem) {
        showNotification(`${name} is already in your wishlist!`, 'info');
        return;
    }
    
    wishlist.push({
        id: id,
        name: name,
        price: price,
        image: image,
        addedAt: new Date().toISOString()
    });
    
    saveWishlist();
    updateWishlistUI();
    showNotification(`${name} added to wishlist!`, 'success');
}

// Remove from wishlist
function removeFromWishlist(id) {
    wishlist = wishlist.filter(item => item.id !== id);
    saveWishlist();
    updateWishlistUI();
    showNotification('Item removed from wishlist', 'info');
}

// Update wishlist UI
function updateWishlistUI() {
    const wishlistIcons = document.querySelectorAll('.wishlist-icon');
    wishlistIcons.forEach(icon => {
        const card = icon.closest('.destination-card');
        if (card) {
            const id = card.dataset.id;
            const isInWishlist = wishlist.some(item => item.id === id);
            
            if (isInWishlist) {
                icon.innerHTML = '<i class="fas fa-heart text-red-500"></i>';
                icon.classList.add('text-red-500');
            } else {
                icon.innerHTML = '<i class="fas fa-heart text-white"></i>';
                icon.classList.remove('text-red-500');
            }
        }
    });
}

// Toggle wishlist item
function toggleWishlist(id, name, price, image) {
    const existingItem = wishlist.find(item => item.id === id);
    
    if (existingItem) {
        removeFromWishlist(id);
    } else {
        addToWishlist(id, name, price, image);
    }
}

// Cart functionality
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalElement = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// User Menu
const userMenuToggle = document.getElementById('userMenuToggle');
const userMenu = document.getElementById('userMenu');

// Booking Modal
const bookingModal = document.getElementById('bookingModal');
const bookingModalClose = document.getElementById('bookingModalClose');
const cancelBooking = document.getElementById('cancelBooking');
const paymentSuccessModal = document.getElementById('paymentSuccessModal');
const closeSuccessModal = document.getElementById('closeSuccessModal');

// Countdown Timer
const countdown = document.getElementById('countdown');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');

// Enhanced Mobile Navigation Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');

// Open mobile menu
mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
        mobileMenu.querySelector('.absolute').style.transform = 'translateX(0)';
    }, 10);
    document.body.style.overflow = 'hidden';
});

// Close mobile menu
function closeMobileMenu() {
    mobileMenu.querySelector('.absolute').style.transform = 'translateX(100%)';
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

mobileMenuClose.addEventListener('click', closeMobileMenu);

// Close mobile menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        closeMobileMenu();
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05)';
        navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    }
});

// Cart Toggle
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
});

cartClose.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// User Menu Toggle
userMenuToggle.addEventListener('click', () => {
    userMenu.classList.toggle('active');
});

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
    if (!userMenuToggle.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.remove('active');
    }
});

// Search functionality event listeners
document.addEventListener('DOMContentLoaded', function() {
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlayClose = document.getElementById('searchOverlayClose');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    
    // Open search overlay
    if (searchToggle) {
        searchToggle.addEventListener('click', openSearchOverlay);
    }
    
    // Close search overlay
    if (searchOverlayClose) {
        searchOverlayClose.addEventListener('click', closeSearchOverlay);
    }
    
    // Search input functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length > 2) {
                performSearch(query);
            } else {
                // Show suggestions when input is empty or short
                const searchResults = document.getElementById('searchResults');
                if (searchResults) {
                    searchResults.innerHTML = `
                        <div class="search-suggestions">
                            <h4 class="text-lg font-semibold text-white mb-4">Popular Destinations</h4>
                            <div class="suggestion-tags">
                                <span class="suggestion-tag" data-search="canada">Canada</span>
                                <span class="suggestion-tag" data-search="ghana">Ghana</span>
                                <span class="suggestion-tag" data-search="kenya">Kenya</span>
                                <span class="suggestion-tag" data-search="japan">Japan</span>
                                <span class="suggestion-tag" data-search="italy">Italy</span>
                                <span class="suggestion-tag" data-search="france">France</span>
                            </div>
                        </div>
                    `;
                }
            }
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(e.target.value);
            }
        });
    }
    
    // Search button
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            if (searchInput) {
                performSearch(searchInput.value);
            }
        });
    }
    
    // Suggestion tags
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchTerm = tag.getAttribute('data-search');
            if (searchInput) {
                searchInput.value = searchTerm;
                performSearch(searchTerm);
            }
        });
    });
    
    // Close search overlay when clicking outside
    document.addEventListener('click', (e) => {
        const searchOverlay = document.getElementById('searchOverlay');
        if (searchOverlay && !searchOverlay.contains(e.target) && !searchToggle.contains(e.target)) {
            closeSearchOverlay();
        }
    });
    
    // Close search overlay on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearchOverlay();
        }
    });
});

// Enhanced Add to Cart Functionality with Micro-interactions
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
        const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
        const id = button.dataset.id;
        const price = parseFloat(button.dataset.price);
        const name = button.dataset.name;
        
        // Add loading state
        const originalContent = button.innerHTML;
        button.innerHTML = '<div class="loading-spinner"></div>';
        button.disabled = true;
        
        // Simulate loading delay for better UX
        setTimeout(() => {
        addToCart(id, name, price);
        showNotification(`${name} added to cart!`, 'success');
            
            // Restore button with success state
            button.innerHTML = '<i class="fas fa-check mr-2"></i>Added!';
            button.classList.add('bg-green-500');
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.disabled = false;
                button.classList.remove('bg-green-500');
            }, 1500);
        }, 800);
    }
});

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
}

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items display
    cartItems.innerHTML = '';
    cartTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="images/hero-bg.jpg" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    
    // Save cart to localStorage
    localStorage.setItem('wanderlustCart', JSON.stringify(cart));
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showNotification('Item removed from cart', 'info');
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('wanderlustCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Checkout functionality
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Show booking modal
    showBookingModal();
});

// Booking Modal Functions
function showBookingModal() {
    const firstItem = cart[0];
    document.getElementById('modalItemName').textContent = firstItem.name;
    document.getElementById('modalItemPrice').textContent = `$${firstItem.price.toFixed(2)}`;
    document.getElementById('modalTotal').textContent = `$${cartTotal.toFixed(2)}`;
    
    bookingModal.classList.add('active');
}

bookingModalClose.addEventListener('click', () => {
    bookingModal.classList.remove('active');
});

cancelBooking.addEventListener('click', () => {
    bookingModal.classList.remove('active');
});

// Close modal when clicking outside
bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
    }
});

// Payment method toggle
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const cardInputs = document.getElementById('cardInputs');
        if (this.value === 'card') {
            cardInputs.classList.add('active');
        } else {
            cardInputs.classList.remove('active');
        }
    });
});

// Booking form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate payment processing
    showNotification('Processing payment...', 'info');
    
    setTimeout(() => {
        // Simulate successful payment
        bookingModal.classList.remove('active');
        showPaymentSuccess();
        
        // Clear cart
        cart = [];
        updateCart();
        
        // Reset form
        this.reset();
        
        showNotification('Booking confirmed! Check your email for details.', 'success');
    }, 2000);
});

function showPaymentSuccess() {
    document.getElementById('successAmount').textContent = `$${cartTotal.toFixed(2)}`;
    document.getElementById('successBookingId').textContent = `WL-${Date.now().toString().slice(-6)}`;
    paymentSuccessModal.classList.add('active');
}

closeSuccessModal.addEventListener('click', () => {
    paymentSuccessModal.classList.remove('active');
});

// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const endDate = new Date('2024-12-31T23:59:59').getTime();
    const timeLeft = endDate - now;
    
    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Search Overlay Functionality
const searchToggle = document.getElementById('searchToggle');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

searchToggle.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    searchInput.focus();
});

searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
});

searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
        searchOverlay.classList.remove('active');
    }
});

// Enhanced Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function toggleTheme() {
    body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
        showNotification('Dark mode enabled', 'info');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
        showNotification('Light mode enabled', 'info');
    }
    
    // Update all glass elements for dark mode
    updateGlassElements(isDark);
}

function updateGlassElements(isDark) {
    const glassElements = document.querySelectorAll('.glass, .glass-card');
    glassElements.forEach(element => {
        if (isDark) {
            element.style.background = 'rgba(0, 0, 0, 0.2)';
            element.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        } else {
            element.style.background = 'rgba(255, 255, 255, 0.1)';
            element.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
    });
}

themeToggle.addEventListener('click', toggleTheme);

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.className = 'fas fa-sun';
    updateGlassElements(true);
}

// Enhanced Search Functionality
const searchResults = document.getElementById('searchResults');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');

// Comprehensive search data with more destinations
const searchData = [
    { 
        name: 'Canada', 
        category: 'mountain city', 
        price: 'mid', 
        description: 'Experience stunning landscapes and vibrant cities',
        image: 'travel-assets/canada-mountain.jpg',
        priceRange: '$899 - $2,499',
        rating: 4.8,
        duration: '7-14 days',
        features: ['Nature', 'Cities', 'Winter Sports']
    },
    { 
        name: 'Ghana', 
        category: 'beach culture', 
        price: 'budget', 
        description: 'Discover rich history and beautiful beaches',
        image: 'travel-assets/ghana-beach.jpg',
        priceRange: '$699 - $1,299',
        rating: 4.6,
        duration: '5-10 days',
        features: ['Beaches', 'History', 'Culture']
    },
    { 
        name: 'Kenya', 
        category: 'adventure nature', 
        price: 'mid', 
        description: 'Embark on unforgettable safari adventures',
        image: 'travel-assets/kenya-safari.jpg',
        priceRange: '$1,299 - $3,999',
        rating: 4.9,
        duration: '7-12 days',
        features: ['Wildlife', 'Photography', 'Nature']
    },
    { 
        name: 'Bali', 
        category: 'beach culture', 
        price: 'mid', 
        description: 'Tropical paradise with rich culture and stunning beaches',
        image: 'travel-assets/hero-bg.jpg',
        priceRange: '$799 - $2,199',
        rating: 4.7,
        duration: '5-14 days',
        features: ['Beaches', 'Culture', 'Spirituality']
    },
    { 
        name: 'Switzerland', 
        category: 'mountain city', 
        price: 'luxury', 
        description: 'Alpine beauty and urban sophistication',
        image: 'travel-assets/hero-bg.jpg',
        priceRange: '$2,499 - $5,999',
        rating: 4.9,
        duration: '7-21 days',
        features: ['Mountains', 'Cities', 'Luxury']
    },
    { 
        name: 'Japan', 
        category: 'city culture', 
        price: 'mid', 
        description: 'Modern cities and ancient traditions',
        image: 'travel-assets/hero-bg.jpg',
        priceRange: '$1,199 - $3,499',
        rating: 4.8,
        duration: '7-14 days',
        features: ['Culture', 'Cities', 'Technology']
    },
    { 
        name: 'Thailand', 
        category: 'beach culture', 
        price: 'budget', 
        description: 'Exotic temples, tropical beaches, and vibrant street food',
        image: 'travel-assets/hero-bg.jpg',
        priceRange: '$599 - $1,799',
        rating: 4.5,
        duration: '5-12 days',
        features: ['Beaches', 'Food', 'Temples']
    },
    { 
        name: 'Iceland', 
        category: 'adventure nature', 
        price: 'luxury', 
        description: 'Land of fire and ice with breathtaking natural wonders',
        image: 'travel-assets/hero-bg.jpg',
        priceRange: '$1,999 - $4,999',
        rating: 4.9,
        duration: '7-14 days',
        features: ['Nature', 'Adventure', 'Photography']
    },
    { 
        name: 'Italy', 
        category: 'city culture', 
        price: 'mid', 
        description: 'Art, history, and culinary excellence',
        image: 'travel-assets/hero-bg.jpg',
        priceRange: '$1,299 - $3,999',
        rating: 4.7,
        duration: '7-21 days',
        features: ['Art', 'History', 'Food']
    },
    { 
        name: 'New Zealand', 
        category: 'adventure nature', 
        price: 'mid', 
        description: 'Adventure capital with stunning landscapes',
        image: 'travel-assets/hero-bg.jpg',
        priceRange: '$1,499 - $3,499',
        rating: 4.8,
        duration: '10-21 days',
        features: ['Adventure', 'Nature', 'Outdoor Activities']
    }
];

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const price = priceFilter.value;
    
    let filteredResults = searchData.filter(item => {
        const matchesQuery = !query || 
                           item.name.toLowerCase().includes(query) || 
                           item.description.toLowerCase().includes(query) ||
                           item.features.some(feature => feature.toLowerCase().includes(query));
        const matchesCategory = !category || item.category.includes(category);
        const matchesPrice = !price || item.price === price;
        
        return matchesQuery && matchesCategory && matchesPrice;
    });
    
    // Sort results by relevance (exact name matches first, then description matches)
    if (query) {
        filteredResults.sort((a, b) => {
            const aNameMatch = a.name.toLowerCase().includes(query);
            const bNameMatch = b.name.toLowerCase().includes(query);
            const aDescMatch = a.description.toLowerCase().includes(query);
            const bDescMatch = b.description.toLowerCase().includes(query);
            
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
            if (aDescMatch && !bDescMatch) return -1;
            if (!aDescMatch && bDescMatch) return 1;
            return a.rating - b.rating; // Sort by rating as tiebreaker
        });
    }
    
    displaySearchResults(filteredResults);
}

searchInput.addEventListener('input', performSearch);
categoryFilter.addEventListener('change', performSearch);
priceFilter.addEventListener('change', performSearch);

function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results text-center py-8">
                <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600 text-lg">No destinations found matching your criteria.</p>
                <p class="text-gray-500 text-sm mt-2">Try adjusting your search terms or filters.</p>
            </div>
        `;
        return;
    }
    
    searchResults.innerHTML = results.map((item, index) => `
        <div class="search-result-item bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-primary/20" 
             style="animation-delay: ${index * 100}ms;" 
             onclick="selectDestination('${item.name}')">
            <div class="flex items-start space-x-4">
                <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-xl font-bold text-dark">${item.name}</h4>
                        <div class="flex items-center space-x-1">
                            <i class="fas fa-star text-accent"></i>
                            <span class="text-sm font-semibold text-gray-600">${item.rating}</span>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-3 leading-relaxed">${item.description}</p>
                    <div class="flex flex-wrap gap-2 mb-3">
                        ${item.features.map(feature => `
                            <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                ${feature}
                            </span>
                        `).join('')}
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-500">
                            <span class="font-semibold text-primary">${item.priceRange}</span>
                            <span class="mx-2">•</span>
                            <span>${item.duration}</span>
                        </div>
                        <button class="btn-primary px-4 py-2 text-sm rounded-xl hover:shadow-lg transition-all duration-300">
                            <i class="fas fa-eye mr-1"></i>View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to handle destination selection
function selectDestination(destinationName) {
    showNotification(`Selected ${destinationName} for booking!`, 'success');
    // Close search overlay
    searchOverlay.classList.remove('active');
    // Scroll to destinations section
    document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
}

// Add CSS for search results
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-result-item {
        padding: 1rem;
        border-bottom: 1px solid #e9ecef;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .search-result-item:hover {
        background: #f8f9fa;
    }
    
    .search-result-item h4 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
    }
    
    .search-result-item p {
        color: #555;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .search-result-category,
    .search-result-price {
        display: inline-block;
        background: #ecf0f1;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        margin-right: 0.5rem;
    }
    
    .no-results {
        text-align: center;
        color: #7f8c8d;
        padding: 2rem;
    }
`;
document.head.appendChild(searchStyles);

// Testimonials Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Event listeners for testimonial controls
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-advance testimonials
setInterval(nextSlide, 5000);

// Destinations Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const destinationCards = document.querySelectorAll('.destination-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter destinations
        destinationCards.forEach(card => {
            const categories = card.dataset.category;
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Enhanced Newsletter Form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const consentCheckbox = this.querySelector('input[type="checkbox"]');
        const submitBtn = this.querySelector('button[type="submit"]');
        
        const email = emailInput.value.trim();
        const consent = consentCheckbox.checked;
        
        // Validation
        if (!email) {
            showNotification('Please enter your email address.', 'error');
            emailInput.focus();
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            emailInput.focus();
            return;
        }
        
        if (!consent) {
            showNotification('Please agree to receive travel updates and offers.', 'error');
            consentCheckbox.focus();
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-spinner"></div> Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate subscription process
        setTimeout(() => {
            showNotification('🎉 Welcome to Wanderlust! You\'ll receive our latest travel deals and inspiration.', 'success');
        this.reset();
            
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        
        // In a real application, you would send this to a server
        console.log('Newsletter subscription:', email);
        }, 1500);
    });
}

// Enhanced Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Enhanced validation
        const errors = [];
        
        if (!data.fullName || data.fullName.trim().length < 2) {
            errors.push('Please enter a valid full name (at least 2 characters)');
        }
        
        if (!data.email) {
            errors.push('Email address is required');
        } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
                errors.push('Please enter a valid email address');
            }
        }
        
        if (data.phone && data.phone.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
                errors.push('Please enter a valid phone number');
            }
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Please enter a message (at least 10 characters)');
        }
        
        if (errors.length > 0) {
            showNotification(errors.join('. '), 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-spinner"></div> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission with delay
        setTimeout(() => {
            showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        this.reset();
            
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        
        // In a real application, you would send the data to a server here
            console.log('Contact form data:', data);
        }, 2000);
    });
}

// Premium features
document.querySelectorAll('.premium-unlock').forEach(button => {
    button.addEventListener('click', () => {
        showNotification('Upgrade to Premium to unlock this content!', 'info');
        // In a real app, this would redirect to premium signup
    });
});

// Premium subscription buttons
document.querySelectorAll('.premium-pricing .btn').forEach(button => {
    button.addEventListener('click', () => {
        const plan = button.closest('.price-option').querySelector('h3').textContent;
        showNotification(`Redirecting to ${plan} subscription...`, 'info');
        // In a real app, this would redirect to payment processing
    });
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Enhanced Intersection Observer for advanced animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Staggered animation delay
            setTimeout(() => {
            entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.classList.add('animate-fade-in-up');
            }, index * 100);
        }
    });
}, observerOptions);

// Advanced scroll-triggered animations
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-in-right');
        }
    });
}, { threshold: 0.2 });

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('#home');
    if (hero) {
        const rate = scrolled * -0.3;
        hero.style.transform = `translateY(${rate}px)`;
    }
    
    // Floating elements parallax
    const floatingElements = document.querySelectorAll('.animate-float');
    floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    const animatedElements = document.querySelectorAll('.destination-card, .package-card, .about-content, .contact-content, .blog-card, .testimonial-content');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Load saved data
    loadCart();
    loadWishlist();
    
    // Initialize search with default results
    performSearch();
    
    // Initialize testimonials slider
    if (document.querySelectorAll('.testimonial-slide').length > 0) {
        showSlide(0);
    }
    
    // Initialize stats animation
    const statsSection = document.querySelector('.quick-stats');
    if (statsSection) {
        quickStatsObserver.observe(statsSection);
    }
    
    // Add click handlers for premium features
    document.querySelectorAll('.premium-unlock').forEach(button => {
        button.addEventListener('click', () => {
            showNotification('Upgrade to Premium to unlock this content!', 'info');
        });
    });
    
    // Add click handlers for subscription buttons
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent.includes('Subscribe Now')) {
            button.addEventListener('click', () => {
                const plan = button.closest('.bg-white').querySelector('h3').textContent;
                showNotification(`Redirecting to ${plan} subscription...`, 'info');
            });
        }
    });
    
    console.log('🚀 Wanderlust Travel - All functionality initialized!');
});

// Additional functionality for buttons and links
function openLoginModal() {
    showNotification('Login modal would open here. In a real app, this would show a login form.', 'info');
    // Close user menu
    userMenu.classList.add('hidden');
}

function openRegisterModal() {
    showNotification('Registration modal would open here. In a real app, this would show a registration form.', 'info');
    // Close user menu
    userMenu.classList.add('hidden');
}

function openBookingsModal() {
    showNotification('My Bookings page would open here. This would show all your travel bookings.', 'info');
    // Close user menu
    userMenu.classList.add('hidden');
}

function openWishlistModal() {
    if (wishlist.length === 0) {
        showNotification('Your wishlist is empty. Add some destinations to your wishlist first!', 'info');
    } else {
        showNotification(`You have ${wishlist.length} items in your wishlist. Wishlist page would open here.`, 'info');
    }
    // Close user menu
    userMenu.classList.add('hidden');
}

function openPremiumModal() {
    showNotification('Premium upgrade modal would open here. This would show premium features and pricing.', 'info');
    // Close user menu
    userMenu.classList.add('hidden');
}

function openSearchOverlay() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    
    if (searchOverlay) {
        searchOverlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        
        // Focus on search input
        setTimeout(() => {
            if (searchInput) {
                searchInput.focus();
            }
        }, 100);
    }
    
    // Close mobile menu
    closeMobileMenu();
}

function closeSearchOverlay() {
    const searchOverlay = document.getElementById('searchOverlay');
    
    if (searchOverlay) {
        searchOverlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

function performSearch(query) {
    if (!query.trim()) return;
    
    // Simulate search results
    const destinations = [
        { name: 'Canada Adventure', location: 'Canada', price: 899, image: 'travel-assets/canada-mountain.jpg' },
        { name: 'Ghana Beach Paradise', location: 'Ghana', price: 599, image: 'travel-assets/ghana-beach.jpg' },
        { name: 'Kenya Safari Experience', location: 'Kenya', price: 1299, image: 'travel-assets/kenya-safari.jpg' },
        { name: 'Japan Cultural Tour', location: 'Japan', price: 1599, image: 'travel-assets/japan-temple.jpg' },
        { name: 'Italy Food & Wine', location: 'Italy', price: 999, image: 'travel-assets/italy-vineyard.jpg' },
        { name: 'France Art & History', location: 'France', price: 799, image: 'travel-assets/france-louvre.jpg' }
    ];
    
    const results = destinations.filter(dest => 
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.location.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-search text-4xl text-white/50 mb-4"></i>
                <p class="text-white/70">No destinations found matching your search.</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = results.map(dest => `
        <div class="search-result-item bg-white/10 hover:bg-white/20 rounded-xl p-4 cursor-pointer transition-all duration-300" onclick="navigateToDestination('${dest.location.toLowerCase()}')">
            <div class="flex items-center space-x-4">
                <img src="${dest.image}" alt="${dest.name}" class="w-16 h-16 rounded-lg object-cover">
                <div class="flex-1">
                    <h4 class="text-white font-semibold">${dest.name}</h4>
                    <p class="text-white/70">${dest.location}</p>
                </div>
                <div class="text-right">
                    <p class="text-primary font-bold">$${dest.price}</p>
                    <p class="text-white/70 text-sm">per person</p>
                </div>
            </div>
        </div>
    `).join('');
    
    searchResults.innerHTML = `
        <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white">Search Results (${results.length})</h4>
            ${resultsHTML}
        </div>
    `;
}

function navigateToDestination(destination) {
    closeSearchOverlay();
    window.location.href = `destination-details.html?destination=${destination}`;
}

function openBlogPost(postId) {
    const postTitles = {
        'budget-travel-tips': 'Budget Travel Tips: How to See the World for Less',
        'hidden-gems': 'Hidden Gems: Off-the-Beaten-Path Destinations',
        'budget-travel-guide': 'The Ultimate Budget Travel Guide'
    };
    
    const title = postTitles[postId] || 'Blog Post';
    showNotification(`Opening "${title}" - Blog post page would load here.`, 'info');
}

function openBlogArchive() {
    showNotification('Blog archive page would open here. This would show all blog posts with filtering options.', 'info');
}

function openDestinationDetails(destinationId) {
    const destinationNames = {
        'canada': 'Canada Adventure',
        'ghana': 'Ghana Experience', 
        'kenya': 'Kenya Safari'
    };
    
    const name = destinationNames[destinationId] || 'Destination';
    showNotification(`Opening detailed page for "${name}" - This would show full destination information, photos, and booking options.`, 'info');
}

function openAllDestinations() {
    showNotification('All destinations page would open here. This would show a comprehensive list of all available destinations with advanced filtering.', 'info');
}

function openPremiumSubscription(planType) {
    const planNames = {
        'monthly': 'Monthly Premium Plan',
        'annual': 'Annual Premium Plan'
    };
    
    const planName = planNames[planType] || 'Premium Plan';
    showNotification(`Opening ${planName} subscription page. This would redirect to payment processing.`, 'info');
}

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Animate quick stats
const quickStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('[data-target]');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                animateCounter(stat, target);
            });
            quickStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const quickStatsSection = document.querySelector('.quick-stats');
if (quickStatsSection) {
    quickStatsObserver.observe(quickStatsSection);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
        this.style.opacity = '0.5';
        this.style.filter = 'grayscale(100%)';
    });
});

// Smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

revealSections.forEach(section => {
    revealObserver.observe(section);
});

// Add CSS for reveal animation
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    section {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    section.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hero {
        opacity: 1 !important;
        transform: none !important;
    }
`;
document.head.appendChild(revealStyle);

// Enhanced search functionality with keyboard navigation
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchOverlay.classList.remove('active');
    }
});

// Blog card interactions
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', function() {
        // Add click effect
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // In a real application, this would navigate to the blog post
        console.log('Blog post clicked:', this.querySelector('h3').textContent);
    });
});

// Newsletter checkbox styling
document.querySelectorAll('.newsletter-checkbox input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const label = this.nextElementSibling;
        if (this.checked) {
            label.style.color = 'white';
        } else {
            label.style.color = 'rgba(255, 255, 255, 0.9)';
        }
    });
});

// Enhanced touch interactions for mobile
document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.interactive')) {
        e.target.closest('.interactive').classList.add('active');
    }
});

document.addEventListener('touchend', (e) => {
    if (e.target.closest('.interactive')) {
        setTimeout(() => {
            e.target.closest('.interactive').classList.remove('active');
        }, 150);
    }
});

// Advanced card hover effects
document.querySelectorAll('.card-hover').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-12px) scale(1.02)';
        card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    });
});

// Enhanced notification system with better animations
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element with enhanced styling
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content flex items-center space-x-3">
            <div class="notification-icon">
                ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                  type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : 
                  '<i class="fas fa-info-circle"></i>'}
            </div>
            <span class="notification-message">${message}</span>
            <button class="notification-close ml-auto">&times;</button>
        </div>
    `;
    
    // Enhanced styles with glassmorphism
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(39, 174, 96, 0.95)' : 
                     type === 'error' ? 'rgba(231, 76, 60, 0.95)' : 
                     'rgba(52, 152, 219, 0.95)'};
        backdrop-filter: blur(20px);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        font-weight: 500;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in with spring effect
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    });
}

// Console welcome message
console.log(`
🚀 Welcome to Wanderlust Travel - Premium UI Enhanced!
✨ A professional travel booking platform with modern design
🎨 Built with HTML5, CSS3, and JavaScript
📱 Mobile-first design with advanced touch interactions
🎯 Interactive features and smooth animations
🔍 Advanced search functionality with glassmorphism
🌙 Dark theme support with enhanced styling
📊 Dynamic statistics and testimonials
📝 Blog and newsletter features
🛒 Shopping cart and booking system
💳 Payment processing integration
👑 Premium membership tiers
⏰ Limited time offers and countdown timers
🎭 Modern micro-interactions and loading states
🌈 Advanced animations and parallax effects
`);

// Performance optimization: Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add some fun Easter eggs
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 Konami Code activated! You found the secret!', 'success');
        // Add some fun effects
        document.body.style.animation = 'rainbow 2s infinite';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Add rainbow animation CSS
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);
