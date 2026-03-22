/* 
   Alebrijes de Oaxaca Teotihuacán
   Noticias Page Scripts - Real-time Search, Filtering, and Pagination
*/

document.addEventListener('DOMContentLoaded', () => {
    // Get all news cards
    const newsCards = document.querySelectorAll('.news-card-modern');
    const searchInput = document.querySelector('#news-search');
    const searchClearBtn = document.querySelector('#search-clear, .search-clear-btn-top');
    const filterButtons = document.querySelectorAll('.filter-btn-top, .filter-btn');
    const resultsNumber = document.getElementById('results-number');
    const noResultsMessage = document.getElementById('no-results');
    const newsGrid = document.getElementById('news-grid');
    const paginationNumbers = document.getElementById('pagination-numbers');
    const paginationPrev = document.getElementById('pagination-prev');
    const paginationNext = document.getElementById('pagination-next');

    // State - Initialize currentFilter from active button if present
    let currentFilter = 'all';
    const activeFilterButton = document.querySelector('.filter-btn-top.active, .filter-btn.active');
    if (activeFilterButton) {
        currentFilter = activeFilterButton.getAttribute('data-filter') || 'all';
    }
    let currentSearch = '';
    let currentPage = 1;
    const itemsPerPage = 12; // Changed to 12 for perfect grid symmetry (multiple of 3 regular cards per row)

    // Category mapping for display
    const categoryMap = {
        'liga-tdp': 'Liga TDP',
        'visorias': 'Visorias',
        'fuerzas-basicas': 'Fuerzas Básicas',
        'club': 'Club'
    };

    // Update category display in cards
    function updateCategoryDisplay() {
        newsCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const typeElement = card.querySelector('.news-card-type[data-category-dynamic="true"]');
            if (typeElement && category && category !== 'all') {
                typeElement.textContent = categoryMap[category] || category;
            }
        });
    }

    // Initialize
    updateResultsCount();
    updateCategoryDisplay();
    
    // Sort news by date (most recent first)
    if (newsGrid) {
        sortNewsByDate(newsGrid);
    }
    
    // Update relative times and initialize date updates
    updateRelativeTimes();
    initDateUpdates();
    
    // Add click handlers to news cards to navigate to news detail
    newsCards.forEach(card => {
        // Create a slug from the title for URL, or use existing ID
        let slug = card.id;
        if (!slug) {
            const title = card.getAttribute('data-title') || '';
            slug = title.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
                .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
            // Set the ID for future reference
            card.id = slug;
        }
        
        // Add click handler to the entire card (except share button)
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on share button
            if (e.target.closest('.news-card-share')) {
                return;
            }
            // Navigate to news detail page
            const currentPath = window.location.pathname;
            const currentFile = currentPath.split('/').pop();
            
            // Always navigate to detail page
            if (currentFile === 'noticias.html' || currentPath.includes('/noticias.html')) {
                // Already on news page, navigate to detail page
                window.location.href = `noticia-detalle.html?noticia=${slug}`;
            } else {
                // Navigate to detail page from index or other pages
                window.location.href = `pages/noticia-detalle.html?noticia=${slug}`;
            }
        });
    });
    
    // Scroll to article if hash is present in URL
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetCard = document.getElementById(hash);
        if (targetCard) {
            setTimeout(() => {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Highlight the card briefly
                targetCard.style.transition = 'box-shadow 0.3s ease';
                targetCard.style.boxShadow = '0 4px 20px rgba(243, 106, 33, 0.4)';
                setTimeout(() => {
                    targetCard.style.boxShadow = '';
                }, 2000);
            }, 300);
        }
    }
    
    updateDisplay();
    setupPagination();

    // Search Input Event Listener (Real-time)
    // Note: Scroll to top only on category/pagination changes, not while typing
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            currentPage = 1;
            
            // Show/hide clear button
            if (currentSearch.length > 0) {
                if (searchClearBtn) searchClearBtn.style.display = 'flex';
            } else {
                if (searchClearBtn) searchClearBtn.style.display = 'none';
            }
            
            filterAndDisplay();
        });
    }

    // Clear Search Button
    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentSearch = '';
            currentPage = 1;
            searchClearBtn.style.display = 'none';
            filterAndDisplay();
            searchInput.focus();
            // Scroll to top when clearing search
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Filter Buttons Event Listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.getAttribute('data-filter');
            currentPage = 1;
            
            // Show header immediately when a category filter is active
            const header = document.querySelector('.news-page-header');
            if (header) {
                if (currentFilter !== 'all') {
                    header.classList.add('visible');
                    header.classList.add('always-visible');
                } else {
                    header.classList.remove('always-visible');
                    // Check scroll position for 'all' filter
                    if (window.pageYOffset <= 100) {
                        header.classList.remove('visible');
                    }
                }
            }
            
            // Scroll to top when changing category filter - use requestAnimationFrame to ensure it executes
            requestAnimationFrame(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            filterAndDisplay();
        });
    });

    // Pagination Event Listeners
    if (paginationPrev) {
        paginationPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                filterAndDisplay();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (paginationNext) {
        paginationNext.addEventListener('click', () => {
            const totalPages = getTotalPages();
            if (currentPage < totalPages) {
                currentPage++;
                filterAndDisplay();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Pagination Number Click (delegated event)
    if (paginationNumbers) {
        paginationNumbers.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination-number')) {
                currentPage = parseInt(e.target.getAttribute('data-page'));
                filterAndDisplay();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Update Results Count
    function updateResultsCount() {
        if (resultsNumber) {
            resultsNumber.textContent = newsCards.length;
        }
    }

    // Filter and Display Function
    function filterAndDisplay() {
        let visibleCards = [];
        
        newsCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title') || '';
            const content = card.getAttribute('data-content') || '';
            const searchText = (title + ' ' + content).toLowerCase();
            
            // Check filter
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            
            // Check search
            const matchesSearch = currentSearch === '' || searchText.includes(currentSearch);
            
            if (matchesFilter && matchesSearch) {
                visibleCards.push(card);
            }
        });

        // Update results count
        const totalVisible = visibleCards.length;
        if (resultsNumber) {
            resultsNumber.textContent = totalVisible;
        }

        // Show/hide no results message
        if (noResultsMessage) {
            if (totalVisible === 0) {
                noResultsMessage.style.display = 'block';
                noResultsMessage.classList.add('show');
                if (newsGrid) newsGrid.style.display = 'none';
            } else {
                noResultsMessage.style.display = 'none';
                noResultsMessage.classList.remove('show');
                if (newsGrid) newsGrid.style.display = 'grid';
            }
        }

        // Show/hide carousel based on filter or search
        const carouselSection = document.querySelector('.news-carousel-section');
        if (carouselSection) {
            if (currentSearch !== '' || currentFilter !== 'all') {
                carouselSection.style.display = 'none';
            } else {
                carouselSection.style.display = 'block';
            }
        }

        // Pagination
        const totalPages = Math.ceil(totalVisible / itemsPerPage);
        setupPagination(totalPages);
        
        // Calculate pagination range
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const cardsToShow = visibleCards.slice(startIndex, endIndex);

        // Hide all cards first
        newsCards.forEach(card => {
            card.classList.add('hidden');
            card.style.display = 'none';
        });

        // Show visible cards with animation
        cardsToShow.forEach((card, index) => {
            card.classList.remove('hidden');
            card.style.display = 'flex';
            
            // Update category display for visible cards
            const category = card.getAttribute('data-category');
            const typeElement = card.querySelector('.news-card-type[data-category-dynamic="true"]');
            if (typeElement && category && category !== 'all') {
                typeElement.textContent = categoryMap[category] || category;
            }
            
            // Only animate if not already visible
            if (card.style.opacity !== '1') {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 30);
            }
        });

        // Update pagination buttons state
        updatePaginationButtons(totalPages);
    }

    // Get Total Pages
    function getTotalPages() {
        let visibleCount = 0;
        newsCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title') || '';
            const content = card.getAttribute('data-content') || '';
            const searchText = (title + ' ' + content).toLowerCase();
            
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            const matchesSearch = currentSearch === '' || searchText.includes(currentSearch);
            
            if (matchesFilter && matchesSearch) {
                visibleCount++;
            }
        });
        return Math.ceil(visibleCount / itemsPerPage);
    }

    // Setup Pagination Numbers
    function setupPagination(totalPages = null) {
        if (!paginationNumbers) return;
        
        if (totalPages === null) {
            totalPages = getTotalPages();
        }

        // Clear existing pagination numbers
        paginationNumbers.innerHTML = '';

        // Only show pagination if there's more than 1 page
        if (totalPages <= 1) {
            updatePaginationButtons(0);
            return;
        }

        // Show max 5 page numbers
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        // Adjust if we're near the start
        if (endPage - startPage < 4 && totalPages > 4) {
            if (currentPage <= 3) {
                endPage = Math.min(5, totalPages);
                startPage = 1;
            } else {
                startPage = Math.max(1, totalPages - 4);
                endPage = totalPages;
            }
        }

        // Create page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-number';
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.setAttribute('data-page', i);
            pageBtn.textContent = i;
            paginationNumbers.appendChild(pageBtn);
        }
    }

    // Update Pagination Buttons State
    function updatePaginationButtons(totalPages) {
        if (paginationPrev) {
            paginationPrev.disabled = currentPage === 1;
        }
        if (paginationNext) {
            paginationNext.disabled = currentPage >= totalPages || totalPages === 0;
        }
    }

    // Initial Display Update
    function updateDisplay() {
        filterAndDisplay();
    }

    // Staggered Animation on Load (for initial render)
    const animateGridOnLoad = () => {
        const visibleCards = Array.from(newsCards).filter(card => !card.classList.contains('hidden'));
        
        visibleCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    };

    // Run animation on load
    setTimeout(animateGridOnLoad, 100);

    // Initialize Carousel
    initCarousel();

    // Sticky Header on Scroll
    initStickyHeader();


    // Share Button Functionality (Event Delegation)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.news-card-share')) {
            e.preventDefault();
            e.stopPropagation();
            const btn = e.target.closest('.news-card-share');
            const article = btn.closest('.news-card-modern');
            if (!article) return;
            
            const title = article.getAttribute('data-title') || 'Noticia Alebrijes';
            const url = window.location.href;

            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: article.getAttribute('data-content') || '',
                    url: url
                }).catch(err => {
                    if (err.name !== 'AbortError') {
                        console.log('Error sharing', err);
                    }
                });
            } else {
                // Fallback: copy to clipboard
                const textToShare = `${title}\n${url}`;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(textToShare).then(() => {
                        // Visual feedback
                        const originalBg = btn.style.background;
                        const originalBorder = btn.style.borderColor;
                        btn.style.background = 'var(--primary)';
                        btn.style.borderColor = 'var(--primary)';
                        setTimeout(() => {
                            btn.style.background = originalBg;
                            btn.style.borderColor = originalBorder;
                        }, 1000);
                    });
                }
            }
        }
    });

    // Initialize News Carousel - Hero Image Style
    function initCarousel() {
        const carousel = document.getElementById('news-carousel');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const dotsContainer = document.getElementById('carousel-dots');
        
        if (!carousel) return;

        // Get first 6 news items for carousel (sorted by date, most recent first)
        const allCards = Array.from(newsCards);
        // Sort by date if available
        const sortedCards = allCards.sort((a, b) => {
            const dateA = a.getAttribute('data-date');
            const dateB = b.getAttribute('data-date');
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return new Date(dateB) - new Date(dateA);
        });
        const carouselItems = sortedCards.slice(0, 6);

        let currentIndex = 0;
        let autoPlayInterval = null;

        // Create carousel items
        carouselItems.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title') || '';
            const imageElement = card.querySelector('.news-card-image img');
            let imageSrc = '../assets/Alebrijes Teotihuacan.png';
            if (imageElement) {
                const src = imageElement.getAttribute('src');
                if (src) {
                    imageSrc = src.startsWith('../') ? src : '../' + src.replace(/^\.\.\//, '');
                }
            }
            const timeElement = card.querySelector('.news-card-time');
            const time = timeElement ? timeElement.textContent : '1d';
            const typeElement = card.querySelector('.news-card-type[data-category-dynamic="true"]');
            const type = typeElement ? (categoryMap[category] || category) : 'noticia';

            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            if (index === 0) carouselItem.classList.add('active');
            carouselItem.setAttribute('data-index', index);
            carouselItem.innerHTML = `
                <div class="carousel-item-image">
                    <img src="${imageSrc}" alt="${title}">
                </div>
                <div class="carousel-item-content">
                    <div class="carousel-item-meta">
                        <span>${time}</span>
                        <span>|</span>
                        <span>${type}</span>
                    </div>
                    <h3 class="carousel-item-title">${title.toUpperCase()}</h3>
                </div>
            `;
            
            carouselItem.addEventListener('click', () => {
                let slug = card.id;
                if (!slug) {
                    const title = card.getAttribute('data-title') || '';
                    slug = title.toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                    card.id = slug;
                }
                const currentPath = window.location.pathname;
                if (currentPath.includes('noticias.html')) {
                    window.location.href = `noticia-detalle.html?noticia=${slug}`;
                } else {
                    window.location.href = `pages/noticia-detalle.html?noticia=${slug}`;
                }
            });
            
            carousel.appendChild(carouselItem);
        });

        // Function to show specific slide
        function showSlide(index) {
            const items = carousel.querySelectorAll('.carousel-item');
            items.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            
            // Update dots
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
            
            currentIndex = index;
        }

        // Function to go to next slide
        function nextSlide() {
            const nextIndex = (currentIndex + 1) % carouselItems.length;
            showSlide(nextIndex);
        }

        // Function to go to previous slide
        function prevSlide() {
            const prevIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
            showSlide(prevIndex);
        }

        // Create dots
        if (dotsContainer) {
            for (let i = 0; i < carouselItems.length; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Ir a slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    showSlide(i);
                    resetAutoPlay();
                });
                dotsContainer.appendChild(dot);
            }
        }

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }

        // Auto-play function
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                nextSlide();
            }, 6000); // 6 seconds
        }

        function resetAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
            startAutoPlay();
        }

        // Start auto-play
        startAutoPlay();

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
        });

        carousel.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }

    // Initialize Sticky Header - Show on scroll
    function initStickyHeader() {
        const header = document.querySelector('.news-page-header');
        if (!header) return;

        // If a category filter is active (not 'all'), show header from start
        if (currentFilter !== 'all') {
            header.classList.add('visible');
            header.classList.add('always-visible');
        }

        // Show header when user scrolls down (only if filter is 'all')
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            // Don't hide/show header if a category filter is active
            if (currentFilter !== 'all') {
                return;
            }
            
            const currentScroll = window.pageYOffset;
            
            // Show header when scrolled down more than 100px
            if (currentScroll > 100) {
                header.classList.add('visible');
                header.classList.add('sticky-active');
            } else {
                // Hide header when at top (only if not always-visible)
                if (!header.classList.contains('always-visible')) {
                    header.classList.remove('visible');
                    header.classList.remove('sticky-active');
                }
            }
            
            lastScroll = currentScroll;
        });
    }
});
