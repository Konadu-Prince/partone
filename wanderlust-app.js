// Shopping Cart System
let cart = [];
let cartTotal = 0;

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

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
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

// Add to Cart Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const button = e.target;
        const id = button.dataset.id;
        const price = parseFloat(button.dataset.price);
        const name = button.dataset.name;
        
        addToCart(id, name, price);
        showNotification(`${name} added to cart!`, 'success');
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

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-theme')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.className = 'fas fa-sun';
}

// Search Functionality
const searchResults = document.getElementById('searchResults');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');

// Sample search data
const searchData = [
    { name: 'Canada', category: 'mountain city', price: 'mid', description: 'Experience stunning landscapes and vibrant cities' },
    { name: 'Ghana', category: 'beach culture', price: 'budget', description: 'Discover rich history and beautiful beaches' },
    { name: 'Kenya', category: 'adventure nature', price: 'mid', description: 'Embark on unforgettable safari adventures' },
    { name: 'Bali', category: 'beach culture', price: 'mid', description: 'Tropical paradise with rich culture' },
    { name: 'Switzerland', category: 'mountain city', price: 'luxury', description: 'Alpine beauty and urban sophistication' },
    { name: 'Japan', category: 'city culture', price: 'mid', description: 'Modern cities and ancient traditions' }
];

function performSearch() {
    const query = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const price = priceFilter.value;
    
    let filteredResults = searchData.filter(item => {
        const matchesQuery = item.name.toLowerCase().includes(query) || 
                           item.description.toLowerCase().includes(query);
        const matchesCategory = !category || item.category.includes(category);
        const matchesPrice = !price || item.price === price;
        
        return matchesQuery && matchesCategory && matchesPrice;
    });
    
    displaySearchResults(filteredResults);
}

searchInput.addEventListener('input', performSearch);
categoryFilter.addEventListener('change', performSearch);
priceFilter.addEventListener('change', performSearch);

function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No destinations found matching your criteria.</p>';
        return;
    }
    
    searchResults.innerHTML = results.map(item => `
        <div class="search-result-item">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <span class="search-result-category">${item.category}</span>
            <span class="search-result-price">${item.price}</span>
        </div>
    `).join('');
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

// Newsletter Form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const consent = this.querySelector('input[type="checkbox"]').checked;
        
        if (!consent) {
            showNotification('Please agree to receive updates.', 'error');
            return;
        }
        
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        this.reset();
        
        // In a real application, you would send this to a server
        console.log('Newsletter subscription:', email);
    });
}

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.fullName || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        
        // Reset form
        this.reset();
        
        // In a real application, you would send the data to a server here
        console.log('Form data:', data);
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.destination-card, .package-card, .about-content, .contact-content, .blog-card, .testimonial-content');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Load cart from localStorage
    loadCart();
});

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

// Console welcome message
console.log(`
🚀 Welcome to Wanderlust Travel - Monetization Ready!
✨ A professional travel booking platform with e-commerce capabilities
🎨 Built with HTML5, CSS3, and JavaScript
📱 Mobile-first design approach
🎯 Interactive features and smooth animations
🔍 Advanced search functionality
🌙 Dark theme support
📊 Dynamic statistics and testimonials
📝 Blog and newsletter features
🛒 Shopping cart and booking system
💳 Payment processing integration
👑 Premium membership tiers
⏰ Limited time offers and countdown timers
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
