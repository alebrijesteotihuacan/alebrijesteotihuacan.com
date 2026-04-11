document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    
    // Create overlay if it doesn't exist
    function createMenuOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);
        return overlay;
    }
    
    const menuOverlay = document.querySelector('.mobile-menu-overlay') || createMenuOverlay();

    // Function to close menu
    function closeMenu() {
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        if (navbar) navbar.classList.remove('menu-open');
        
        // Close all dropdowns
        document.querySelectorAll('.dropdown-menu.show').forEach(dropdown => {
            dropdown.classList.remove('show');
            const navItem = dropdown.closest('.nav-item');
            if (navItem) navItem.classList.remove('dropdown-open');
        });
    }

    // Function to open menu
    function openMenu() {
        if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
        if (navLinks) navLinks.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
        if (navbar) navbar.classList.add('menu-open');
    }

    // Scroll Effect
    let lastScrollY = window.scrollY;
    let separatorOffset = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
            document.body.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
            document.body.classList.remove('scrolled');
        }
        
        // Separator scroll effect (only on index page)
        const separator = document.querySelector('.news-header-separator');
        if (separator) {
            const separatorRect = separator.getBoundingClientRect();
            const isVisible = separatorRect.top < window.innerHeight && separatorRect.bottom > 0;
            
            if (isVisible) {
                const scrollDirection = currentScrollY > lastScrollY ? 1 : -1; // 1 = down, -1 = up
                const scrollDelta = Math.abs(currentScrollY - lastScrollY);
                
                // Accumulate offset based on scroll direction
                const scrollFactor = 0.3; // Adjust sensitivity (lower = less movement per scroll)
                separatorOffset += scrollDelta * scrollFactor * scrollDirection;
                
                // Clamp the offset to reasonable limits (max 300px in either direction)
                const maxOffset = 300;
                separatorOffset = Math.max(Math.min(separatorOffset, maxOffset), -maxOffset);
                
                // Apply the offset via CSS custom property
                separator.style.setProperty('--separator-offset', `${separatorOffset}px`);
            }
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });

    if (mobileMenuBtn && navLinks) {
        // Toggle menu on button click
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Note: Overlay click handling removed - document click listener handles it

        // Dropdown Accordion Logic (Mobile)
        const dropdownToggles = document.querySelectorAll('.nav-item > a');

        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                // Only handle on mobile
                if (window.innerWidth > 768) {
                    return; // Let desktop behavior handle it
                }

                const dropdown = toggle.nextElementSibling;
                const navItem = toggle.closest('.nav-item');
                
                // Check if this link has a dropdown menu
                if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                    // This is a dropdown toggle, prevent navigation
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close all other dropdowns first
                    document.querySelectorAll('.dropdown-menu.show').forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('show');
                            const otherNavItem = otherDropdown.closest('.nav-item');
                            if (otherNavItem) otherNavItem.classList.remove('dropdown-open');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('show');
                    
                    // Add/remove class for arrow rotation
                    if (navItem) {
                        if (dropdown.classList.contains('show')) {
                            navItem.classList.add('dropdown-open');
                        } else {
                            navItem.classList.remove('dropdown-open');
                        }
                    }
                }
                // Regular links: Don't prevent default - let them navigate naturally
                // Menu will close via the document click listener or after navigation
            });
        });

        // Close menu when clicking on dropdown submenu links
        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Allow the link to navigate normally
                // Just close the menu after navigation
                setTimeout(() => {
                    closeMenu();
                }, 150);
            });
        });

        // Close menu when clicking outside (on desktop resize or outside click)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                navLinks.classList.contains('active')) {
                // Only close if click is completely outside the menu and button
                const clickedInsideMenu = navLinks.contains(e.target);
                const clickedOnButton = mobileMenuBtn.contains(e.target);
                
                if (!clickedInsideMenu && !clickedOnButton) {
                    closeMenu();
                }
            }
        }, true); // Use capture phase to catch events early

        // Close menu on window resize if it goes above mobile breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Home Latest Results Carousel
    const homeCarouselTrack = document.querySelector('.home-carousel-track');
    const homeCards = document.querySelectorAll('.home-result-card');
    const prevBtn = document.querySelector('.home-carousel-btn.prev');
    const nextBtn = document.querySelector('.home-carousel-btn.next');
    const dotsContainer = document.querySelector('.home-carousel-dots');

    if (homeCarouselTrack && homeCards.length > 0) {
        let currentIndex = 0;
        const totalCards = homeCards.length;

        // Create dots
        homeCards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('home-dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.home-dot');

        function updateCarousel() {
            // Move track
            homeCarouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        }

        // Event listeners for arrows
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto-play
        let autoPlayInterval = setInterval(nextSlide, 5000);

        // Pause on hover
        const carouselWrapper = document.querySelector('.home-carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            carouselWrapper.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(nextSlide, 5000);
            });
        }

        // Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        homeCarouselTrack.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoPlayInterval);
        }, { passive: true });

        homeCarouselTrack.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            autoPlayInterval = setInterval(nextSlide, 5000);
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe Left
                nextSlide();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe Right
                prevSlide();
            }
        }
    }
});
