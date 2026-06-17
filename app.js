document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
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

    // Hero Polaroid Stack Interaction (Bring to front on hover/click)
    const polaroids = document.querySelectorAll('.polaroid-card');
    
    polaroids.forEach(card => {
        card.addEventListener('mouseenter', () => {
            resetPolaroidsZIndex();
            card.style.zIndex = '15';
        });

        card.addEventListener('click', () => {
            resetPolaroidsZIndex();
            card.style.zIndex = '15';
            
            // Temporary pop animation
            card.style.transform += ' scale(1.05)';
            setTimeout(() => {
                if (card.id === 'polaroid-summer') {
                    card.style.transform = 'rotate(8deg)';
                } else if (card.id === 'polaroid-crew') {
                    card.style.transform = 'rotate(-9deg)';
                }
            }, 200);
        });
    });

    function resetPolaroidsZIndex() {
        const summer = document.getElementById('polaroid-summer');
        const crew = document.getElementById('polaroid-crew');
        if (summer && crew) {
            summer.style.zIndex = '5';
            crew.style.zIndex = '10';
        }
    }

    // Polaroid Stack (Personal Section) Fan Out Interaction
    const stackContainer = document.querySelector('.polaroid-stack-container');
    const redCard = document.querySelector('.stack-back-card-red');
    const purpleCard = document.querySelector('.stack-back-card-purple');
    const frontCard = document.querySelector('.stack-front-card');

    if (stackContainer && redCard && purpleCard && frontCard) {
        stackContainer.addEventListener('mouseenter', () => {
            redCard.style.transform = 'rotate(-15deg) translate(-22px, 18px)';
            purpleCard.style.transform = 'rotate(-7deg) translate(-14px, 6px)';
            frontCard.style.transform = 'rotate(8deg) translate(14px, -8px) scale(1.02)';
        });

        stackContainer.addEventListener('mouseleave', () => {
            redCard.style.transform = 'rotate(-10deg) translate(-10px, 12px)';
            purpleCard.style.transform = 'rotate(-4deg) translate(-8px, 2px)';
            frontCard.style.transform = 'rotate(5deg) translate(8px, -5px)';
        });

        // Add fun wiggle on click
        frontCard.addEventListener('click', () => {
            frontCard.style.transform += ' scale(1.04) rotate(2deg)';
            setTimeout(() => {
                frontCard.style.transform = 'rotate(8deg) translate(14px, -8px) scale(1.02)';
            }, 180);
        });
    }

    // Telegram Bot Chat Sequenced Reveal on Scroll
    const chatThread = document.querySelector('.chat-thread');
    const chatMsgs = document.querySelectorAll('.chat-msg');

    if (chatThread && chatMsgs.length > 0) {
        const chatObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Reveal messages sequentially to simulate a real conversation
                    chatMsgs.forEach((msg, index) => {
                        setTimeout(() => {
                            msg.classList.add('revealed');
                        }, index * 600); // 600ms delay between messages
                    });
                    
                    // Stop observing once triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15 // Trigger when 15% of thread is visible
        });

        chatObserver.observe(chatThread);
    }

    // Subtle Parallax / Interactive Tilt for Hero Section
    const heroSection = document.querySelector('.hero-section');
    const heroCard = document.querySelector('.hero-left-card');
    
    if (heroSection && window.innerWidth > 1024) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            // Calculate offsets from center (-0.5 to 0.5)
            const xOffset = (clientX / innerWidth) - 0.5;
            const yOffset = (clientY / innerHeight) - 0.5;
            
            // Gently translate left hero card
            if (heroCard) {
                heroCard.style.transform = `translate(${xOffset * 15}px, ${yOffset * 15}px)`;
            }
            
            // Gently float background blobs in opposite direction
            const blob1 = document.querySelector('.blob-top-left');
            const blob2 = document.querySelector('.blob-bottom-right');
            if (blob1) {
                blob1.style.transform = `translate(${xOffset * -30}px, ${yOffset * -30}px)`;
            }
            if (blob2) {
                blob2.style.transform = `translate(${xOffset * -40}px, ${yOffset * -40}px)`;
            }
        });

        // Reset positions when mouse leaves
        heroSection.addEventListener('mouseleave', () => {
            if (heroCard) {
                heroCard.style.transform = 'none';
            }
            const blob1 = document.querySelector('.blob-top-left');
            const blob2 = document.querySelector('.blob-bottom-right');
            if (blob1) blob1.style.transform = 'none';
            if (blob2) blob2.style.transform = 'none';
        });
    }

    // Smooth Scroll transitions for standard links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // If mobile menu is active, close it
                if (navMenu && navMenu.classList.contains('active')) {
                    mobileToggle.click();
                }
                
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
