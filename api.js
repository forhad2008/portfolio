/**
 * Abdullah Psychotic / Bespoke Atelier API Service
 */
(function() {
    'use strict';

    const GOOGLE_SCRIPT_BASE = 'https://script.google.com/macros/s/AKfycbyHik2t4HnaeQsY9A992qOPdMHxjV0YeS-pcSnfisZYwJW5JJbH55RxhRHPHbGO2hztSA';

    window.AP_API = {
        baseUrl: GOOGLE_SCRIPT_BASE,

        verifyCoupon: function(code, subtotal) {
            return new Promise((resolve) => {
                const normalized = (code || '').trim().toUpperCase();
                if (normalized === 'WELCOME10') {
                    resolve({
                        ok: true,
                        code: 'WELCOME10',
                        calculatedDiscount: subtotal * 0.10,
                        discountPercent: 10
                    });
                } else if (normalized === 'PSYCHOTIC20') {
                    resolve({
                        ok: true,
                        code: 'PSYCHOTIC20',
                        calculatedDiscount: subtotal * 0.20,
                        discountPercent: 20
                    });
                } else {
                    resolve({
                        ok: false,
                        message: 'Invalid or expired promotional code.'
                    });
                }
            });
        },

        createOrder: function(orderData) {
            return new Promise((resolve, reject) => {
                const cb = 'apiOrderCb_' + Date.now();
                const script = document.createElement('script');
                const params = new URLSearchParams({
                    action: 'create_order',
                    order: JSON.stringify(orderData),
                    callback: cb
                });

                window[cb] = function(response) {
                    try { delete window[cb]; } catch(e) {}
                    if (script.parentNode) script.parentNode.removeChild(script);
                    resolve(response);
                };

                script.src = `${GOOGLE_SCRIPT_BASE}/exec?${params.toString()}`;
                script.onerror = function() {
                    try { delete window[cb]; } catch(e) {}
                    if (script.parentNode) script.parentNode.removeChild(script);
                    reject(new Error('Network error submitting order'));
                };

                document.head.appendChild(script);
            });
        }
    };
})();
