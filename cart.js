// Cart Management System
document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('bubbles_thrift_cart')) || [];

    // Initialize Lucide icons if not already done
    if (window.lucide) lucide.createIcons();

    const updateCart = () => {
        localStorage.setItem('bubbles_thrift_cart', JSON.stringify(cart));
        updateCartUI();
    };

    const updateCartUI = () => {
        const cartBadge = document.getElementById('cartBadge');
        const cartDrawerItems = document.getElementById('cartDrawerItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartEmptyState = document.getElementById('cartEmptyState');
        const cartContent = document.getElementById('cartContent');

        // Update Badge
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            cartBadge.classList.toggle('hidden', totalItems === 0);
        }

        // Update Drawer Content
        if (cartDrawerItems) {
            if (cart.length === 0) {
                cartEmptyState?.classList.remove('hidden');
                cartContent?.classList.add('hidden');
            } else {
                cartEmptyState?.classList.add('hidden');
                cartContent?.classList.remove('hidden');

                cartDrawerItems.innerHTML = cart.map((item, index) => `
                    <div class="flex gap-4 py-6 border-b border-brand-primary/5 group">
                        <div class="w-20 h-24 bg-brand-surface rounded-xl overflow-hidden shrink-0">
                            <img src="${item.image}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex-1 flex flex-col justify-between">
                            <div>
                                <h4 class="font-serif text-brand-primary font-bold">${item.name}</h4>
                                <p class="text-xs text-gray-500 underline">${item.brand}</p>
                            </div>
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-3 border border-brand-primary/10 rounded-full px-2 py-1 scale-90 origin-left">
                                    <button class="w-6 h-6 flex items-center justify-center hover:text-brand-accent decrement" data-index="${index}">-</button>
                                    <span class="text-sm font-bold min-w-[1rem] text-center">${item.quantity}</span>
                                    <button class="w-6 h-6 flex items-center justify-center hover:text-brand-accent increment" data-index="${index}">+</button>
                                </div>
                                <p class="font-bold text-brand-primary">$${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                `).join('');

                // Update Total
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                if (cartTotal) cartTotal.textContent = `$${subtotal.toFixed(2)}`;
            }
        }
    };

    // Global Add to Cart Function
    window.addToCart = (product) => {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        openCart();
    };

    // Event Delegation for Cart Drawer Actions
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.increment')) {
            const index = e.target.closest('.increment').dataset.index;
            cart[index].quantity += 1;
            updateCart();
        }
        if (e.target.closest('.decrement')) {
            const index = e.target.closest('.decrement').dataset.index;
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        }
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const product = {
                name: btn.dataset.name,
                brand: btn.dataset.brand,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image
            };
            window.addToCart(product);
        }
    });

    // Drawer Visibility
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');

    window.openCart = () => {
        cartDrawer?.classList.remove('translate-x-full');
        cartOverlay?.classList.remove('opacity-0', 'pointer-events-none');
    };

    window.closeCart = () => {
        cartDrawer?.classList.add('translate-x-full');
        cartOverlay?.classList.add('opacity-0', 'pointer-events-none');
    };

    const cartIcon = document.getElementById('cartIcon');
    cartIcon?.addEventListener('click', (e) => {
        e.preventDefault();
        window.openCart();
    });

    const closeCartBtn = document.getElementById('closeCart');
    closeCartBtn?.addEventListener('click', window.closeCart);
    cartOverlay?.addEventListener('click', window.closeCart);

    // Initial Load
    updateCartUI();
});
