/**
 * UNIFIED LUXURY ATELIER NAVBAR & MOBILE DRAWER CONTROLLER
 * Shared across all pages (excluding cart.html)
 */
(function () {
    'use strict';

    function initUnifiedNavbar() {
        const navbar = document.getElementById('navbar') || document.querySelector('nav.site-navbar');
        const hamburger = document.getElementById('hamburger');
        const menuWindow = document.getElementById('menu-window');
        const closeBtn = document.getElementById('menu-close-btn');
        const cartBtn = document.getElementById('cart-icon-btn');

        // 1. Scroll effect for navbar frosted glass
        if (navbar) {
            const handleScroll = () => {
                if (window.scrollY > 20) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        }

        // 2. Mobile Drawer Open/Close Handlers
        function openDrawer() {
            if (!menuWindow) return;
            menuWindow.classList.add('open');
            if (hamburger) {
                hamburger.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');
            }
            document.body.style.overflow = 'hidden';
            updateCartBadges();
        }

        function closeDrawer() {
            if (!menuWindow) return;
            menuWindow.classList.remove('open');
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        }

        if (hamburger && menuWindow) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                if (menuWindow.classList.contains('open')) {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeDrawer();
            });
        }

        if (menuWindow) {
            // Close when clicking outside content box
            menuWindow.addEventListener('click', (e) => {
                if (e.target === menuWindow) {
                    closeDrawer();
                }
            });

            // Close on link click
            const links = menuWindow.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    closeDrawer();
                });
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuWindow && menuWindow.classList.contains('open')) {
                closeDrawer();
            }
        });

        // 3. Cart Button Behavior
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                if (typeof window.openCartDrawer === 'function') {
                    e.preventDefault();
                    window.openCartDrawer();
                }
                // Otherwise normal link navigation to cart.html executes
            });
        }

        // 4. Synchronize Cart Counters
        function updateCartBadges() {
            let count = 0;
            try {
                const stored = localStorage.getItem('ap_user_cart');
                if (stored) {
                    const cart = JSON.parse(stored);
                    if (Array.isArray(cart)) {
                        count = cart.reduce((sum, item) => sum + (parseInt(item.qty, 10) || parseInt(item.quantity, 10) || 1), 0);
                    }
                }
            } catch (err) {
                console.error('Error reading ap_user_cart:', err);
            }

            const badges = [
                document.getElementById('cart-count'),
                document.getElementById('mobile-cart-count'),
                document.getElementById('dock-cart-count'),
                document.getElementById('detail-cart-count')
            ];

            badges.forEach(badge => {
                if (badge) {
                    const oldCount = parseInt(badge.textContent, 10) || 0;
                    badge.textContent = count;
                    if (count > 0) {
                        badge.style.display = 'flex';
                    }
                    if (oldCount !== count) {
                        badge.classList.remove('pop');
                        void badge.offsetWidth; // trigger reflow
                        badge.classList.add('pop');
                        setTimeout(() => badge.classList.remove('pop'), 300);
                    }
                }
            });
        }

        // Initial sync
        updateCartBadges();

        // Listen for storage events across tabs or local triggers
        window.addEventListener('storage', updateCartBadges);
        window.addEventListener('cartUpdated', updateCartBadges);
        window.updateNavbarCart = updateCartBadges;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUnifiedNavbar);
    } else {
        initUnifiedNavbar();
    }
})();
