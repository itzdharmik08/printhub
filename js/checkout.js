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

    // --- State Variables ---
    let polaroidCount = 5;
    let shippingCost = 0; // standard is FREE (0)
    let basePricePerPrint = 15; // ₹15 per print

    // --- DOM Elements ---
    const qtyDecrement = document.getElementById('qty-decrement');
    const qtyIncrement = document.getElementById('qty-increment');
    const qtyInput = document.getElementById('quantity');
    
    const deliveryCards = document.querySelectorAll('.delivery-card');
    const paymentCards = document.querySelectorAll('.payment-card');
    
    const summaryItems = document.getElementById('summary-items');
    const summaryTotal = document.getElementById('summary-total');
    
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    
    const captionInput = document.getElementById('caption-input');
    const polaroidCaptionPreview = document.getElementById('illustration-polaroid-caption');
    
    // Photo preview elements
    const illustrationPreviewImg = document.getElementById('illustration-preview-img');
    const illustrationPlaceholderBg = document.getElementById('illustration-placeholder-bg');
    const thumbnailPreviewImg = document.getElementById('thumbnail-preview-img');
    const previewPlaceholderIcon = document.getElementById('preview-placeholder-icon');
    
    // Form and success screen
    const checkoutForm = document.getElementById('checkout-form');
    const successOverlay = document.getElementById('success-overlay');
    const successOrderId = document.getElementById('success-order-id');
    const successTrackBtn = document.getElementById('success-track-btn');

    // --- Pricing Calculation & Summary Update ---
    function updatePricing() {
        // Read quantity
        polaroidCount = parseInt(qtyInput.value) || 1;
        
        // Calculate subtotal
        const subtotal = polaroidCount * basePricePerPrint;
        const total = subtotal + shippingCost;
        
        // Update Bottom summary text
        const itemText = polaroidCount === 1 ? '1 Retro Print' : `${polaroidCount} Retro Prints`;
        summaryItems.textContent = itemText;
        summaryTotal.textContent = `₹${total}`;
    }

    // --- Polaroid Quantity Counter Interaction ---
    if (qtyDecrement && qtyIncrement && qtyInput) {
        qtyDecrement.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 5;
            if (val > 1) {
                qtyInput.value = val - 1;
                updatePricing();
            }
        });

        qtyIncrement.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 5;
            if (val < 99) {
                qtyInput.value = val + 1;
                updatePricing();
            }
        });
    }

    // --- Selectable Shipping Cards Interaction ---
    deliveryCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all
            deliveryCards.forEach(c => c.classList.remove('selected'));
            
            // Add to clicked card
            card.classList.add('selected');
            
            // Read price cost
            shippingCost = parseInt(card.getAttribute('data-cost')) || 0;
            
            // Recalculate
            updatePricing();
        });
    });

    // --- Selectable Payment Cards Interaction ---
    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            paymentCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });

    // --- Dynamic Caption Preview Interaction ---
    if (captionInput && polaroidCaptionPreview) {
        captionInput.addEventListener('input', () => {
            const text = captionInput.value.trim();
            // Font is styled to look handwritten in CSS, so uppercase matches zine vibes perfectly
            polaroidCaptionPreview.textContent = text ? text.toUpperCase() : '';
            
            // Subtle rotation adjustments to look handmade when user is editing
            const polaroidFrame = document.getElementById('illustration-polaroid');
            if (polaroidFrame) {
                const rotation = text.length % 2 === 0 ? '2.5deg' : '4deg';
                polaroidFrame.style.transform = `rotate(${rotation}) scale(1.02)`;
                setTimeout(() => {
                    polaroidFrame.style.transform = `rotate(${rotation}) scale(1)`;
                }, 100);
            }
        });
    }

    // --- Uploading Files / Image Handling ---
    if (dropzone && fileInput) {
        // Trigger file input when clicking dropzone
        dropzone.addEventListener('click', () => {
            fileInput.click();
        });

        // Trigger when file changes via upload dialog
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            processUploadedFile(file);
        });

        // Drag & Drop event bindings
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('dragover');
            }, false);
        });

        // Handle drop event
        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const file = dt.files[0];
            processUploadedFile(file);
        }, false);
    }

    // Process file, read, and render previews
    function processUploadedFile(file) {
        if (!file) return;

        // Check if image file
        if (!file.type.startsWith('image/')) {
            alert('Oh snap! Please upload an image file (JPEG, PNG, HEIC, etc.).');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
            const imageUrl = evt.target.result;
            
            // Set illustration preview image
            if (illustrationPreviewImg) {
                illustrationPreviewImg.src = imageUrl;
                illustrationPreviewImg.style.display = 'block';
            }
            if (illustrationPlaceholderBg) {
                illustrationPlaceholderBg.style.display = 'none';
            }

            // Set small personalization thumbnail preview
            if (thumbnailPreviewImg) {
                thumbnailPreviewImg.src = imageUrl;
                thumbnailPreviewImg.style.display = 'block';
            }
            if (previewPlaceholderIcon) {
                previewPlaceholderIcon.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }

    // --- Helper to Generate Mock Order ID (PH-XXXX-XXXX) ---
    function generateOrderId() {
        const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // omit ambiguous chars like I, O, 0, 1
        let part1 = '';
        let part2 = '';
        for (let i = 0; i < 4; i++) {
            part1 += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            part2 += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return `PH-${part1}-${part2}`;
    }

    // --- Form Submission & Success Confirmation ---
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check form validity manually (since button is outside form block)
            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            
            if (!fullname || !email || !phone || !address) {
                // Focus on the first empty field to guide the user
                if (!fullname) document.getElementById('fullname').focus();
                else if (!email) document.getElementById('email').focus();
                else if (!phone) document.getElementById('phone').focus();
                else if (!address) document.getElementById('address').focus();
                
                alert('Please fill out all the required delivery details first!');
                return;
            }

            // Generate order ID
            const newOrderId = generateOrderId();
            
            // Set details in success modal
            if (successOrderId) {
                successOrderId.textContent = newOrderId;
            }
            
            // Link the Track Order button to the tracking page with orderId query parameter
            if (successTrackBtn) {
                successTrackBtn.href = `tracking.html?orderId=${newOrderId}`;
            }

            // Show success screen popup
            if (successOverlay) {
                successOverlay.classList.add('show');
            }
        });
    }

    // Initial pricing sync
    updatePricing();
});
