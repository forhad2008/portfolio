/**
 * Abdullah Psychotic / Bespoke Atelier Phone Verifier
 * Intelligent real-time phone validator & country code detection
 */
(function() {
    'use strict';

    window.PhoneVerifier = {
        verify: function(phoneNumber, countryCode) {
            if (!phoneNumber) {
                return { isValid: false, error: "Phone number is required." };
            }

            const clean = String(phoneNumber).replace(/[\s\-\(\)]/g, '');
            
            // Check for obvious sequential / dummy patterns
            if (/^(\d)\1+$/.test(clean) || /^(01234|12345|23456|34567|45678|56789|98765|87654)/.test(clean)) {
                return { isValid: false, error: "Dummy or sequential phone numbers are not permitted." };
            }

            // Bangladesh validation
            if (countryCode === '+880' || clean.startsWith('+880') || clean.startsWith('880') || clean.startsWith('01')) {
                let bdNum = clean;
                if (bdNum.startsWith('+880')) bdNum = bdNum.slice(4);
                else if (bdNum.startsWith('880')) bdNum = bdNum.slice(3);
                else if (bdNum.startsWith('0')) bdNum = bdNum.slice(1);

                // BD mobile operators start with 1[3-9]
                if (/^1[3-9]\d{8}$/.test(bdNum)) {
                    return {
                        isValid: true,
                        formattedNumber: '+880 1' + bdNum.slice(1, 4) + '-' + bdNum.slice(4),
                        e164Number: '+880' + bdNum,
                        country: 'BD'
                    };
                } else {
                    return { isValid: false, error: "Invalid Bangladesh mobile number format (must be 11 digits starting with 01)." };
                }
            }

            // General international phone validation: 7 to 15 digits
            if (/^\+?\d{7,15}$/.test(clean)) {
                const prefix = countryCode && !clean.startsWith('+') ? countryCode : '';
                return {
                    isValid: true,
                    formattedNumber: prefix + ' ' + clean,
                    e164Number: clean.startsWith('+') ? clean : (countryCode + clean),
                    country: 'INTL'
                };
            }

            return { isValid: false, error: "Please enter a valid phone number (at least 7-15 digits)." };
        },

        attachToInput: function(options) {
            const phoneInput = options.phoneInput;
            const countrySelect = options.countrySelect;
            const statusEl = options.statusEl;

            if (!phoneInput) return;

            function validate() {
                const val = phoneInput.value.trim();
                const cc = countrySelect ? countrySelect.value : '+880';
                
                if (!val) {
                    if (statusEl) {
                        statusEl.style.display = 'none';
                        statusEl.innerHTML = '';
                    }
                    return;
                }

                const res = window.PhoneVerifier.verify(val, cc);
                if (statusEl) {
                    statusEl.style.display = 'flex';
                    if (res.isValid) {
                        statusEl.style.color = '#10B981';
                        statusEl.style.background = 'rgba(16, 185, 129, 0.1)';
                        statusEl.innerHTML = `<i class="fa-solid fa-circle-check" style="margin-right: 6px;"></i> Verified: ${res.formattedNumber}`;
                    } else {
                        statusEl.style.color = '#EF4444';
                        statusEl.style.background = 'rgba(239, 68, 68, 0.1)';
                        statusEl.innerHTML = `<i class="fa-solid fa-circle-xmark" style="margin-right: 6px;"></i> ${res.error}`;
                    }
                }
            }

            phoneInput.addEventListener('input', validate);
            if (countrySelect) {
                countrySelect.addEventListener('change', validate);
            }
        }
    };
})();
