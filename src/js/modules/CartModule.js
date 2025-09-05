/**
 * WANDERLUST TRAVEL - CART MODULE
 * Handles shopping cart functionality
 */

class CartModule {
    constructor(app) {
        this.app = app;
        this.cart = app.state.cart;
        this.elements = {
            cartButton: document.querySelector('.cart-button'),
            cartCount: document.querySelector('.cart-count'),
            cartModal: document.querySelector('.cart-modal'),
            cartItems: document.querySelector('.cart-items'),
            cartTotal: document.querySelector('.cart-total'),
            cartEmpty: document.querySelector('.cart-empty'),
            cartActions: document.querySelector('.cart-actions')
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.renderCart();
    }

    setupEventListeners() {
        // Cart button click
        if (this.elements.cartButton) {
            this.elements.cartButton.addEventListener('click', () => this.toggleCart());
        }

        // Close cart modal
        const closeBtn = document.querySelector('.cart-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCart());
        }

        // Cart modal backdrop click
        if (this.elements.cartModal) {
            this.elements.cartModal.addEventListener('click', (e) => {
                if (e.target === this.elements.cartModal) {
                    this.closeCart();
                }
            });
        }
    }

    /**
     * Add item to cart
     */
    addToCart(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        this.showAddToCartNotification(item);
    }

    /**
     * Remove item from cart
     */
    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    /**
     * Update item quantity
     */
    updateQuantity(itemId, quantity) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.renderCart();
            }
        }
    }

    /**
     * Clear entire cart
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    /**
     * Get cart total
     */
    getCartTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Get cart item count
     */
    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    /**
     * Save cart to localStorage
     */
    saveCart() {
        this.app.setState({ cart: this.cart });
    }

    /**
     * Update cart count display
     */
    updateCartCount() {
        const count = this.getCartItemCount();
        if (this.elements.cartCount) {
            this.elements.cartCount.textContent = count;
            this.elements.cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    /**
     * Render cart items
     */
    renderCart() {
        if (!this.elements.cartItems) return;

        if (this.cart.length === 0) {
            this.elements.cartItems.innerHTML = `
                <div class="cart-empty">
                    <div class="empty-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add some amazing destinations to get started!</p>
                    <button class="btn btn-primary" onclick="app.getModule('navigation').scrollToSection('destinations')">
                        Explore Destinations
                    </button>
                </div>
            `;
            return;
        }

        this.elements.cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-location">${item.location}</p>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="app.getModule('cart').updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="app.getModule('cart').updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="app.getModule('cart').removeFromCart('${item.id}')" title="Remove item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');

        // Update total
        if (this.elements.cartTotal) {
            this.elements.cartTotal.textContent = `$${this.getCartTotal().toFixed(2)}`;
        }
    }

    /**
     * Toggle cart modal
     */
    toggleCart() {
        if (this.elements.cartModal) {
            this.elements.cartModal.classList.toggle('active');
            document.body.classList.toggle('modal-open');
        }
    }

    /**
     * Close cart modal
     */
    closeCart() {
        if (this.elements.cartModal) {
            this.elements.cartModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }

    /**
     * Show add to cart notification
     */
    showAddToCartNotification(item) {
        this.app.getModule('notifications').show({
            type: 'success',
            title: 'Added to Cart!',
            message: `${item.name} has been added to your cart.`,
            duration: 3000
        });
    }

    /**
     * Process checkout
     */
    processCheckout() {
        if (this.cart.length === 0) {
            this.app.getModule('notifications').show({
                type: 'warning',
                title: 'Cart Empty',
                message: 'Please add items to your cart before checkout.',
                duration: 3000
            });
            return;
        }

        // Simulate checkout process
        this.app.getModule('notifications').show({
            type: 'info',
            title: 'Processing Checkout...',
            message: 'Redirecting to secure payment...',
            duration: 2000
        });

        // Simulate payment processing
        setTimeout(() => {
            this.app.getModule('notifications').show({
                type: 'success',
                title: 'Payment Successful!',
                message: 'Your booking has been confirmed. Check your email for details.',
                duration: 5000
            });
            
            this.clearCart();
            this.closeCart();
        }, 2000);
    }
}

// Export for use in main app
window.CartModule = CartModule;

