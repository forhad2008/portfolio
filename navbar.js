/**
 * UNIFIED LUXURY ATELIER NAVBAR & ADVANCE MOBILE VIEW CONTROLLER
 * Shared across all pages for perfect responsive UI & instant cart sync
 */
(function () {
    'use strict';

    function initUnifiedNavbar() {
        const navbar = document.getElementById('navbar') || document.querySelector('nav.site-navbar');
        const hamburger = document.getElementById('hamburger');
        const menuWindow = document.getElementById('menu-window');
        const closeBtn = document.getElementById('menu-close-btn');
        const cartBtn = document.getElementById('cart-icon-btn');

        // 1. Scroll Effect for Navbar Frosted Glass
        if (navbar) {
            let ticking = false;
            const handleScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        if (window.scrollY > 20) {
                            navbar.classList.add('scrolled');
                        } else {
                            navbar.classList.remove('scrolled');
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        }

        // 2. Auto-Highlight Active Nav Links Based on Current URL
        function highlightActiveLinks() {
            const path = window.location.pathname.toLowerCase();
            const hash = window.location.hash.toLowerCase();

            // Match targets
            let currentPage = 'home';
            if (path.includes('webcollection.html')) {
                currentPage = 'webcollection';
            } else if (path.includes('collection.html')) {
                currentPage = 'collection';
            } else if (path.includes('about.html')) {
                currentPage = 'about';
            } else if (path.includes('service.html')) {
                currentPage = 'service';
            } else if (path.includes('resume.html')) {
                currentPage = 'resume';
            } else if (path.includes('cart.html')) {
                currentPage = 'cart';
            } else if (path.includes('privacy.html')) {
                currentPage = 'privacy';
            } else if (path.match(/\/(?:[1-9]|1[0-1])\.html/)) {
                currentPage = 'drops';
            }

            // Desktop Nav
            document.querySelectorAll('.desktop-nav li, .desktop-nav a, .nav-menu a').forEach(el => {
                const href = (el.getAttribute('href') || '').toLowerCase();
                const isMatch = (
                    (currentPage === 'home' && (href === 'index.html' || href === '#home' || href === './' || href.endsWith('/index.html'))) ||
                    (currentPage === 'webcollection' && href.includes('webcollection.html')) ||
                    (currentPage === 'collection' && href.includes('collection.html') && !href.includes('webcollection.html')) ||
                    (currentPage === 'about' && href.includes('about.html')) ||
                    (currentPage === 'service' && href.includes('service.html')) ||
                    (currentPage === 'resume' && href.includes('resume.html')) ||
                    (currentPage === 'drops' && href.includes('#shop'))
                );

                if (isMatch) {
                    if (el.tagName === 'LI') {
                        el.classList.add('active');
                    } else {
                        el.classList.add('active');
                        if (el.parentElement && el.parentElement.tagName === 'LI') {
                            el.parentElement.classList.add('active');
                        }
                    }
                }
            });

            // Mobile Drawer Links
            document.querySelectorAll('.mobile-nav-link, .menu-nav-links a').forEach(link => {
                const href = (link.getAttribute('href') || '').toLowerCase();
                const isMatch = (
                    (currentPage === 'home' && (href === 'index.html' || href === '#home' || href === './' || href.endsWith('/index.html'))) ||
                    (currentPage === 'webcollection' && href.includes('webcollection.html')) ||
                    (currentPage === 'collection' && href.includes('collection.html') && !href.includes('webcollection.html')) ||
                    (currentPage === 'about' && href.includes('about.html')) ||
                    (currentPage === 'service' && href.includes('service.html')) ||
                    (currentPage === 'resume' && href.includes('resume.html')) ||
                    (currentPage === 'cart' && href.includes('cart.html')) ||
                    (currentPage === 'drops' && href.includes('#shop'))
                );

                if (isMatch) {
                    link.classList.add('active');
                }
            });

            // Mobile Bottom Dock
            document.querySelectorAll('.mobile-bottom-dock .dock-item').forEach(item => {
                const href = (item.getAttribute('href') || '').toLowerCase();
                const isMatch = (
                    (currentPage === 'home' && (href === 'index.html' || href === '#home' || href === './' || href.endsWith('/index.html'))) ||
                    (currentPage === 'webcollection' && href.includes('webcollection.html')) ||
                    (currentPage === 'collection' && href.includes('collection.html') && !href.includes('webcollection.html')) ||
                    (currentPage === 'drops' && (href.includes('#shop') || href.includes('drops'))) ||
                    (currentPage === 'cart' && href.includes('cart.html')) ||
                    (currentPage === 'service' && href.includes('service.html')) ||
                    (currentPage === 'about' && href.includes('about.html')) ||
                    (currentPage === 'resume' && (href.includes('resume.html') || href.includes('about.html')))
                );

                if (isMatch) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        highlightActiveLinks();

        // 3. Mobile Drawer Open/Close Logic
        function openDrawer() {
            if (!menuWindow) return;
            menuWindow.classList.add('open');
            if (hamburger) {
                hamburger.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');
            }
            document.body.classList.add('menu-open');
            updateCartBadges();
        }

        function closeDrawer() {
            if (!menuWindow) return;
            menuWindow.classList.remove('open');
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            document.body.classList.remove('menu-open');
        }

        if (hamburger) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                if (menuWindow && menuWindow.classList.contains('open')) {
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
            // Close when tapping outside the content box
            menuWindow.addEventListener('click', (e) => {
                if (e.target === menuWindow) {
                    closeDrawer();
                }
            });

            // Close when clicking any navigation link
            const navLinks = menuWindow.querySelectorAll('a');
            navLinks.forEach(link => {
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

        // Close drawer if resized to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992 && menuWindow && menuWindow.classList.contains('open')) {
                closeDrawer();
            }
        }, { passive: true });

        // 4. Cart Drawer Controller (Universal across pages)
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');
        const cartCloseBtn = document.getElementById('cart-close-btn');
        const cartContinueBtn = document.getElementById('cart-continue-btn');

        function getCartData() {
            try {
                const stored = localStorage.getItem('ap_user_cart');
                return stored ? JSON.parse(stored) : [];
            } catch (e) {
                return [];
            }
        }

        function saveCartData(cart) {
            localStorage.setItem('ap_user_cart', JSON.stringify(cart));
            updateCartBadges();
            renderDrawerItems();
            window.dispatchEvent(new Event('cartUpdated'));
        }

        function renderDrawerItems() {
            const container = document.getElementById('cart-items-container');
            const subtotalEl = document.getElementById('cart-subtotal');
            if (!container) return;

            const cart = getCartData();
            const subtotal = cart.reduce((sum, item) => sum + (Number(item.price || 0) * (item.qty || 1)), 0);
            if (subtotalEl) {
                subtotalEl.textContent = `$${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="cart-empty-state">
                        <i class="fa-solid fa-bag-shopping cart-empty-icon"></i>
                        <h4>Your Bag is Empty</h4>
                        <p>Explore our bespoke identity collections and add an exclusive piece to start.</p>
                        <a href="index.html#shop" class="btn btn-secondary" onclick="if(window.closeCartDrawer)window.closeCartDrawer();">Explore Collections</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = cart.map(item => `
                <div class="cart-drawer-item">
                    <img src="${item.image || item.img || 'logo.png'}" alt="${item.name || 'Artwork'}" onerror="this.src='logo.png'">
                    <div class="cart-drawer-item-details">
                        <span class="cart-drawer-item-badge">${item.badge || 'Bespoke Item'}</span>
                        <div class="cart-drawer-item-title">${item.name || 'Graphic Piece'}</div>
                        <span class="cart-drawer-item-size">Edition: ${item.size || 'Standard'}</span>
                        <div class="cart-drawer-item-bottom">
                            <div class="cart-drawer-item-price">$${Number(item.price || 0).toLocaleString()}</div>
                            <div class="cart-qty-ctrls">
                                <button class="cart-qty-btn" type="button" aria-label="Decrease quantity" onclick="changeCartDrawerQty(${Number(item.id)}, '${item.size || 'Standard Edition'}', -1)">-</button>
                                <span class="cart-qty-num">${item.qty || 1}</span>
                            </div>
                        </div>
                    </div>
                    <button class="cart-drawer-item-remove" type="button" aria-label="Remove item" onclick="removeCartDrawerItem(${Number(item.id)}, '${item.size || 'Standard Edition'}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `).join('');
        }

        window.changeCartDrawerQty = function(id, size, delta) {
            let cart = getCartData();
            const item = cart.find(i => i.id === id && (i.size === size || (!i.size && size === "Standard Edition")));
            if (!item) return;
            item.qty = (item.qty || 1) + delta;
            if (item.qty <= 0) {
                cart = cart.filter(i => i !== item);
            }
            saveCartData(cart);
        };

        window.removeCartDrawerItem = function(id, size) {
            let cart = getCartData();
            cart = cart.filter(i => !(i.id === id && (i.size === size || (!i.size && size === "Standard Edition"))));
            saveCartData(cart);
        };

        function openCartDrawer() {
            closeDrawer();
            const drawer = document.getElementById('cart-drawer');
            const overlay = document.getElementById('cart-overlay');
            if (drawer) {
                drawer.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.classList.add('cart-drawer-open', 'no-scroll');
                renderDrawerItems();
                updateCartBadges();
            }
        }

        function closeCartDrawer() {
            const drawer = document.getElementById('cart-drawer');
            const overlay = document.getElementById('cart-overlay');
            if (drawer) {
                drawer.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.classList.remove('cart-drawer-open', 'no-scroll');
            }
        }

        if (!window.openCartDrawer) window.openCartDrawer = openCartDrawer;
        if (!window.closeCartDrawer) window.closeCartDrawer = closeCartDrawer;

        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                if (document.getElementById('cart-drawer')) {
                    e.preventDefault();
                    window.openCartDrawer();
                }
            });
        }

        const dockCartBtn = document.getElementById('dock-cart-btn') || document.querySelector('.dock-cart-btn');
        if (dockCartBtn) {
            dockCartBtn.addEventListener('click', (e) => {
                if (document.getElementById('cart-drawer')) {
                    e.preventDefault();
                    window.openCartDrawer();
                }
            });
        }

        if (cartCloseBtn) cartCloseBtn.addEventListener('click', window.closeCartDrawer);
        if (cartContinueBtn) cartContinueBtn.addEventListener('click', window.closeCartDrawer);
        if (cartOverlay) cartOverlay.addEventListener('click', window.closeCartDrawer);

        // 5. Synchronize All Cart Counters Across Document
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
                document.getElementById('drawer-cart-count'),
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

        updateCartBadges();

        // Listen for storage events across tabs or local triggers
        window.addEventListener('storage', updateCartBadges);
        window.addEventListener('cartUpdated', updateCartBadges);
        window.updateNavbarCart = updateCartBadges;

        // Register Service Worker across all pages
        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js').catch(() => {});
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUnifiedNavbar);
    } else {
        initUnifiedNavbar();
    }
})();
