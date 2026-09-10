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
            if (path.includes('collection.html')) {
                currentPage = 'collection';
            } else if (path.includes('about.html')) {
                currentPage = 'about';
            } else if (path.includes('service.html')) {
                currentPage = 'service';
            } else if (path.includes('resume.html')) {
                currentPage = 'resume';
            } else if (path.includes('privacy.html')) {
                currentPage = 'privacy';
            }

            // Desktop Nav
            document.querySelectorAll('.desktop-nav li, .desktop-nav a, .nav-menu a').forEach(el => {
                const href = (el.getAttribute('href') || '').toLowerCase();
                const isMatch = (
                    (currentPage === 'home' && (href === 'index.html' || href === '#home' || href === './')) ||
                    (currentPage === 'collection' && href.includes('collection.html')) ||
                    (currentPage === 'about' && href.includes('about.html')) ||
                    (currentPage === 'service' && href.includes('service.html')) ||
                    (currentPage === 'resume' && href.includes('resume.html'))
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
                    (currentPage === 'home' && (href === 'index.html' || href === '#home' || href === './')) ||
                    (currentPage === 'collection' && href.includes('collection.html')) ||
                    (currentPage === 'about' && href.includes('about.html')) ||
                    (currentPage === 'service' && href.includes('service.html')) ||
                    (currentPage === 'resume' && href.includes('resume.html'))
                );

                if (isMatch) {
                    link.classList.add('active');
                }
            });

            // Mobile Bottom Dock
            document.querySelectorAll('.mobile-bottom-dock .dock-item').forEach(item => {
                const href = (item.getAttribute('href') || '').toLowerCase();
                const isMatch = (
                    (currentPage === 'home' && (href === 'index.html' || href === '#home' || href === './')) ||
                    (currentPage === 'collection' && href.includes('collection.html')) ||
                    (currentPage === 'service' && href.includes('service.html'))
                );

                if (isMatch) {
                    item.classList.add('active');
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

        // 4. Cart Button Behavior
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                if (typeof window.openCartDrawer === 'function') {
                    e.preventDefault();
                    window.openCartDrawer();
                }
            });
        }

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
