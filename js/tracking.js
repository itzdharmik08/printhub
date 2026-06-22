document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle hamburger animation
            const bars = mobileToggle.querySelectorAll('.bar');
            if (navMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // --- Timeline Rendering Data Structure ---
    const stepElements = {
        received: document.getElementById('step-received'),
        darkroom: document.getElementById('step-darkroom'),
        quality: document.getElementById('step-quality'),
        shipped: document.getElementById('step-shipped')
    };

    const dateElements = {
        received: document.getElementById('date-received'),
        darkroom: document.getElementById('date-darkroom'),
        quality: document.getElementById('date-quality'),
        shipped: document.getElementById('date-shipped')
    };

    const progressBar = document.getElementById('timeline-progress-bar');
    const searchForm = document.getElementById('order-lookup-form');
    const cardContainer = document.querySelector('.manual-search-card');
    const precisionCard = document.getElementById('precision-details-card');

    // SVG templates for dynamic update injection
    const iconCheckSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;

    const iconTargetSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
        </svg>
    `;

    const iconTruckSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
    `;

    // Check for query parameters to auto-fill search
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId');
    if (orderIdParam) {
        const orderInput = document.getElementById('order-id-input');
        const emailInput = document.getElementById('email-input');
        if (orderInput) {
            orderInput.value = orderIdParam;
        }
        if (emailInput) {
            emailInput.value = 'guest@printhub.com'; // fill default mock email
        }
        // Submit form automatically
        if (searchForm) {
            setTimeout(() => {
                searchForm.dispatchEvent(new Event('submit', { cancelable: true }));
            }, 300);
        }
    } else {
        // Initialize state to mockup default on load if no orderId parameter
        updateTimeline(3, {
            received: 'Confirmed Oct 12',
            darkroom: 'Processing Oct 13',
            quality: 'In Progress',
            shipped: 'Estimated Oct 15'
        });
    }

    // --- Form lookup trigger ---
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const orderIdInput = document.getElementById('order-id-input').value.trim();
            const emailInput = document.getElementById('email-input').value.trim();

            // Clear any old banner
            const oldBanner = document.querySelector('.status-banner');
            if (oldBanner) {
                oldBanner.remove();
            }

            // Neobrutalist input validation regex
            // Checks for PH-XXXX-XXXX format where X is alphanumeric or digit
            const orderIdRegex = /^PH-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;

            if (!orderIdRegex.test(orderIdInput)) {
                showBanner('Invalid Order ID format. Use PH-XXXX-XXXX (e.g., PH-1234-5678).', 'error');
                return;
            }

            // Simulated successful search: parse digits from order ID to return variable statuses
            showBanner(`Order ${orderIdInput.toUpperCase()} loaded successfully!`, 'success');

            // Extract numeric code from search string (default to 3 if none)
            const matches = orderIdInput.match(/\d/g);
            const sumOfDigits = matches ? matches.reduce((acc, val) => acc + parseInt(val), 0) : 15;
            const stageSelector = sumOfDigits % 4; // 0, 1, 2, 3

            // Generate realistic status dates relative to lookup date
            const today = new Date();
            const formatDate = (dateOffset) => {
                const d = new Date();
                d.setDate(today.getDate() + dateOffset);
                const options = { month: 'short', day: 'numeric' };
                return d.toLocaleDateString('en-US', options);
            };

            if (stageSelector === 0) {
                // Stage 1: Received only
                updateTimeline(1, {
                    received: `Confirmed ${formatDate(-1)}`,
                    darkroom: 'Pending',
                    quality: 'Pending',
                    shipped: `Estimated ${formatDate(4)}`
                });
            } else if (stageSelector === 1) {
                // Stage 2: Darkroom current
                updateTimeline(2, {
                    received: `Confirmed ${formatDate(-2)}`,
                    darkroom: 'Processing',
                    quality: 'Pending',
                    shipped: `Estimated ${formatDate(3)}`
                });
            } else if (stageSelector === 2) {
                // Stage 3: Quality Check (Default mock state)
                updateTimeline(3, {
                    received: `Confirmed ${formatDate(-3)}`,
                    darkroom: `Processing ${formatDate(-2)}`,
                    quality: 'In Progress',
                    shipped: `Estimated ${formatDate(2)}`
                });
            } else {
                // Stage 4: Shipped
                updateTimeline(4, {
                    received: `Confirmed ${formatDate(-4)}`,
                    darkroom: `Processing ${formatDate(-3)}`,
                    quality: `Passed ${formatDate(-2)}`,
                    shipped: `Shipped ${formatDate(-1)}`
                });
            }
        });
    }

    // Function to dynamically render timeline
    function updateTimeline(activeStep, dates) {
        // Step 1: Received
        if (activeStep >= 1) {
            setStepState('received', activeStep === 1 ? 'current' : 'completed', iconCheckSvg);
        }
        dateElements.received.textContent = dates.received;

        // Step 2: Darkroom
        if (activeStep >= 2) {
            setStepState('darkroom', activeStep === 2 ? 'current' : 'completed', activeStep === 2 ? iconTargetSvg : iconCheckSvg);
        } else {
            setStepState('darkroom', 'pending', iconTargetSvg);
        }
        dateElements.darkroom.textContent = dates.darkroom;

        // Step 3: Quality Check
        if (activeStep >= 3) {
            setStepState('quality', activeStep === 3 ? 'current' : 'completed', activeStep === 3 ? iconTargetSvg : iconCheckSvg);
        } else {
            setStepState('quality', 'pending', iconTargetSvg);
        }
        dateElements.quality.textContent = dates.quality;

        // Step 4: Shipped
        if (activeStep >= 4) {
            setStepState('shipped', activeStep === 4 ? 'current' : 'completed', iconTruckSvg);
        } else {
            setStepState('shipped', 'pending', iconTruckSvg);
        }
        dateElements.shipped.textContent = dates.shipped;

        // Progress line width setting
        let progressWidth = '0%';
        if (activeStep === 2) progressWidth = '33.3%';
        else if (activeStep === 3) progressWidth = '66.6%';
        else if (activeStep === 4) progressWidth = '100%';
        progressBar.style.width = progressWidth;

        // Toggle precision details card based on current stage active status
        if (precisionCard) {
            if (activeStep === 3) {
                precisionCard.style.display = 'flex';
            } else {
                precisionCard.style.display = 'none';
            }
        }
    }

    // Helper to toggle CSS classes and icons on timeline steps
    function setStepState(stepKey, state, defaultIcon) {
        const step = stepElements[stepKey];
        const wrapper = step.querySelector('.step-icon-wrapper');

        step.classList.remove('completed', 'current', 'pending');
        step.classList.add(state);

        if (state === 'completed') {
            wrapper.innerHTML = iconCheckSvg;
        } else if (state === 'current') {
            wrapper.innerHTML = defaultIcon;
        } else {
            wrapper.innerHTML = defaultIcon;
        }
    }

    // Helper to render neobrutalist validation/success banners
    function showBanner(message, type) {
        const banner = document.createElement('div');
        banner.className = `status-banner ${type}`;
        
        let icon = '';
        if (type === 'success') {
            icon = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            `;
        } else {
            icon = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            `;
        }

        banner.innerHTML = `${icon} <span>${message}</span>`;
        
        // Insert banner at the top of the manual search card form
        if (cardContainer) {
            cardContainer.insertBefore(banner, searchForm);
        }
    }
});
