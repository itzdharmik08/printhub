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

    // --- State and Default Seed Data ---
    const defaultMemories = [
        {
            id: 'mem-1',
            title: 'SUMMER PICNIC \'24',
            image: '../assets/summer_gear.png',
            tape: 'tape-pink',
            pin: 'pin-yellow',
            tilt: 4,
            likes: 24,
            likedByUser: false,
            comments: [
                { name: 'Alice', text: 'This print is gorgeous! The color tone is perfect.', date: 'Jun 12' }
            ]
        },
        {
            id: 'mem-2',
            title: 'ALPINE MORNINGS',
            image: '../assets/alpine_mornings.png',
            tape: 'tape-blue',
            pin: 'pin-yellow',
            tilt: -3,
            likes: 42,
            likedByUser: false,
            comments: [
                { name: 'Sophia', text: 'The mountain reflection is crystal clear!', date: 'Jun 16' }
            ]
        },
        {
            id: 'mem-3',
            title: 'NEON TOKYO',
            image: '../assets/neon_tokyo.png',
            tape: 'tape-purple',
            pin: 'pin-yellow',
            tilt: 5,
            likes: 87,
            likedByUser: false,
            comments: [
                { name: 'Sophia', text: 'The mountain reflection is crystal clear!', date: 'Jun 16' }
            ]
        },
        {
            id: 'mem-4',
            title: 'MODERN GEOMETRY',
            image: '../assets/modern_geometry.png',
            tape: 'tape-pink',
            pin: 'pin-yellow',
            tilt: -5,
            likes: 19,
            likedByUser: false,
            comments: [
                { name: 'Sophia', text: 'The mountain reflection is crystal clear!', date: 'Jun 16' }
            ]
        },
        {
            id: 'mem-5',
            title: 'LIBRARY SOLITUDE',
            image: '../assets/library_solitude.png',
            tape: 'tape-blue',
            pin: 'pin-yellow',
            tilt: 3,
            likes: 31,
            likedByUser: false,
            comments: [
                { name: 'Sophia', text: 'The mountain reflection is crystal clear!', date: 'Jun 16' }
            ]
        },
        {
            id: 'mem-6',
            title: 'MACRO MORNING',
            image: '../assets/macro_morning.png',
            tape: 'tape-pink',
            pin: 'pin-yellow',
            tilt: -2,
            likes: 35,
            likedByUser: false,
            comments: []
        },
        {
            id: 'mem-8',
            title: 'TRIAL 8',
            image: '../assets/trail 8.png',
            tape: 'tape-blue',
            pin: 'pin-yellow',
            tilt: 4,
            likes: 18,
            likedByUser: false,
            comments: []
        },
        {
            id: 'mem-9',
            title: 'TRIAL 9',
            image: '../assets/trail 9.png',
            tape: 'tape-purple',
            pin: 'pin-yellow',
            tilt: -3,
            likes: 29,
            likedByUser: false,
            comments: []
        },
        {
            id: 'mem-10',
            title: 'TRIAL 10',
            image: '../assets/trail 10.png',
            tape: 'tape-orange',
            pin: 'pin-yellow',
            tilt: 2,
            likes: 50,
            likedByUser: false,
            comments: []
        },
        {
            id: 'mem-11',
            title: 'TRIAL 11',
            image: '../assets/trail 11.png',
            tape: 'tape-yellow',
            pin: 'pin-yellow',
            tilt: -4,
            likes: 15,
            likedByUser: false,
            comments: []
        },
        {
            id: 'mem-7',
            title: 'PACIFIC POWER',
            image: '../assets/pacific_power.png',
            tape: 'tape-purple',
            pin: 'pin-yellow',
            tilt: 6,
            likes: 56,
            likedByUser: false,
            comments: []
        }
    ];

    let memories = [];
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    let currentMode = (modeParam === 'owner' || modeParam === 'admin') ? 'owner' : 'visitor';

    // Load from LocalStorage or seed defaults
    function initData() {
        const stored = localStorage.getItem('printhub_memories');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);

                // Reset if stored data has a different number of items
                if (parsed.length !== defaultMemories.length) {
                    memories = [...defaultMemories];
                    saveMemories();
                    return;
                }

                // Reset if any stored image uses the old broken path (missing ../)
                const hasStaleAssetPaths = parsed.some(mem =>
                    mem.image && mem.image.startsWith('assets/')
                );
                if (hasStaleAssetPaths) {
                    memories = [...defaultMemories];
                    saveMemories();
                    return;
                }

                // Sanitize loaded items to ensure all required fields are present
                memories = parsed.map(mem => {
                    const defaultSeed = defaultMemories.find(d => d.id === mem.id);
                    return {
                        id: mem.id,
                        title: mem.title,
                        image: mem.image,
                        tape: mem.tape,
                        pin: mem.pin,
                        tilt: mem.tilt !== undefined ? mem.tilt : 0,
                        likes: mem.likes !== undefined && mem.likes !== null ? mem.likes : (defaultSeed ? defaultSeed.likes : 0),
                        likedByUser: mem.likedByUser !== undefined && mem.likedByUser !== null ? mem.likedByUser : false,
                        comments: mem.comments || (defaultSeed ? defaultSeed.comments : [])
                    };
                });
                saveMemories(); // Store sanitized version back to storage
            } catch (e) {
                console.error("Failed to parse stored memories, resetting.", e);
                memories = [...defaultMemories];
                saveMemories();
            }
        } else {
            memories = [...defaultMemories];
            saveMemories();
        }
    }

    function saveMemories() {
        try {
            localStorage.setItem('printhub_memories', JSON.stringify(memories));
        } catch (e) {
            console.error("Failed to save to localStorage:", e);
            alert("Oops! Your browser storage is full. Even after automatically compressing your photo, the data is too large. Please try choosing a smaller image file!");
        }
    }

    // --- Mode Control ---
    const addCardDashed = document.getElementById('add-card-dashed');

    // --- Render Board Grid ---
    const boardGrid = document.getElementById('board-grid');

    function renderBoard() {
        if (!boardGrid) return;

        // Clear existing elements
        const addCard = document.getElementById('add-card-dashed');
        const items = boardGrid.querySelectorAll('.board-polaroid, .board-taped-image');
        items.forEach(p => p.remove());

        // Center dynamically if there are 2 or fewer items
        if (memories.length <= 2) {
            boardGrid.classList.add('two-items');
        } else {
            boardGrid.classList.remove('two-items');
        }

        memories.forEach(mem => {
            const card = document.createElement('div');
            card.className = 'board-taped-image';
            card.id = mem.id;
            card.style.transform = `rotate(${mem.tilt}deg)`;

            const tapeColorClass = mem.tape || 'tape-pink';

            card.innerHTML = `
                <div class="tape ${tapeColorClass} tape-top"></div>
                <img src="${mem.image}" alt="${mem.title}" class="taped-img" loading="lazy">
            `;

            // Insert card before the "Add to Board" card
            if (addCard) {
                boardGrid.insertBefore(card, addCard);
            } else {
                boardGrid.appendChild(card);
            }
        });
    }

    function toggleLike(id) {
        const memIndex = memories.findIndex(m => m.id === id);
        if (memIndex !== -1) {
            const mem = memories[memIndex];
            if (mem.likedByUser) {
                mem.likes = Math.max(0, mem.likes - 1);
                mem.likedByUser = false;
            } else {
                mem.likes += 1;
                mem.likedByUser = true;

                // Add pop scale animation on click
                const card = document.getElementById(id);
                if (card) {
                    const heart = card.querySelector('.like-btn');
                    if (heart) {
                        heart.style.transform = 'scale(1.25)';
                        setTimeout(() => heart.style.transform = 'none', 150);
                    }
                }
            }
            saveMemories();
            renderBoard();
        }
    }

    function deleteMemory(id) {
        const card = document.getElementById(id);
        if (card) {
            card.classList.add('deleting');

            // Wait for shrink animation to complete
            setTimeout(() => {
                memories = memories.filter(m => m.id !== id);
                saveMemories();
                renderBoard();
            }, 300);
        }
    }

    // --- Modal Management (Add Modal) ---
    const addModal = document.getElementById('add-memory-modal');
    const closeModalBtns = document.querySelectorAll('.modal-close, .modal-cancel');
    const addMemoryForm = document.getElementById('add-memory-form');

    // Tape and Pin selection states in Modal
    let selectedTapeColor = 'tape-pink';
    let selectedPinColor = 'pin-blue';

    if (addCardDashed && addModal) {
        addCardDashed.addEventListener('click', () => {
            addModal.classList.add('show');
            // Reset input values and base64 cache
            if (addMemoryForm) addMemoryForm.reset();
            loadedImageBase64 = '';

            // Reset button text & state
            const submitBtn = addModal.querySelector('.modal-submit');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.innerHTML = '<span>Pin Creation</span>';
            }

            resetModalOptions();
        });
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.coming-soon-modal');
            if (modal) modal.classList.remove('show');
        });
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            const modal = e.target.closest('.coming-soon-modal');
            if (modal) modal.classList.remove('show');
        });
    });

    // Handle Custom Color Pickers inside Modal
    const tapeColorOptions = document.querySelectorAll('.color-option[data-type="tape"]');
    const pinColorOptions = document.querySelectorAll('.color-option[data-type="pin"]');

    tapeColorOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            tapeColorOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            selectedTapeColor = opt.getAttribute('data-color');
        });
    });

    pinColorOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            pinColorOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            selectedPinColor = opt.getAttribute('data-color');
        });
    });

    function resetModalOptions() {
        selectedTapeColor = 'tape-pink';
        selectedPinColor = 'pin-blue';
        tapeColorOptions.forEach(o => o.classList.remove('active'));
        pinColorOptions.forEach(o => o.classList.remove('active'));

        // Select defaults
        const defaultTape = document.querySelector('.color-option[data-type="tape"][data-color="tape-pink"]');
        const defaultPin = document.querySelector('.color-option[data-type="pin"][data-color="pin-blue"]');
        if (defaultTape) defaultTape.classList.add('active');
        if (defaultPin) defaultPin.classList.add('active');
    }

    // --- File Reading and Submission ---
    const fileInput = document.getElementById('photo-upload');
    let loadedImageBase64 = '';

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Disable submit button and show processing status
                const submitBtn = document.querySelector('.modal-submit');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.7';
                    submitBtn.innerHTML = '<span>Processing...</span>';
                }

                const reader = new FileReader();
                reader.onload = function (evt) {
                    const img = new Image();
                    img.onload = function () {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        // Downscale to maximum width/height of 450px
                        const max_size = 450;
                        if (width > height) {
                            if (width > max_size) {
                                height *= max_size / width;
                                width = max_size;
                            }
                        } else {
                            if (height > max_size) {
                                width *= max_size / height;
                                height = max_size;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;

                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        // Compress to JPEG with 0.65 quality (extremely compact, under 30KB)
                        loadedImageBase64 = canvas.toDataURL('image/jpeg', 0.65);

                        // Re-enable submit button
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.style.opacity = '1';
                            submitBtn.innerHTML = '<span>Pin Creation</span>';
                        }
                    };
                    img.src = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (addMemoryForm) {
        addMemoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const captionInput = document.getElementById('memory-caption').value.trim();

            if (!captionInput) {
                alert("Please write a description!");
                return;
            }

            // Standard assets array for random fallback if no image uploaded
            const fallbacks = [
                '../assets/summer_gear.png',
                '../assets/the_crew.png',
                '../assets/miss_you.png',
                '../assets/precision_print.png',
                '../assets/alpine_mornings.png',
                '../assets/neon_tokyo.png',
                '../assets/modern_geometry.png'
            ];

            const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            const imageToUse = loadedImageBase64 || randomFallback;

            const newMemory = {
                id: 'mem-' + Date.now(),
                title: captionInput.toUpperCase(),
                image: imageToUse,
                tape: selectedTapeColor,
                pin: selectedPinColor,
                tilt: Math.floor(Math.random() * 12) - 6, // Random rotation between -6 and +5
                likes: 0,
                likedByUser: false,
                comments: []
            };

            memories.push(newMemory);
            saveMemories();

            // Render and close modal
            renderBoard();
            addModal.classList.remove('show');

            // Clear inputs
            loadedImageBase64 = '';
            addMemoryForm.reset();
        });
    }

    // Initialize Page
    initData();
    if (addCardDashed) {
        addCardDashed.style.display = (currentMode === 'owner') ? 'flex' : 'none';
    }
    renderBoard();
});
