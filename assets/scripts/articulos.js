/* 
   Alebrijes de Oaxaca Teotihuacán
   Artículos Page Scripts - Real-time Search and Pagination (8 items per page)
*/

document.addEventListener('DOMContentLoaded', () => {
    // Get all article cards
    const articleCards = document.querySelectorAll('.news-card-modern');
    const searchInput = document.querySelector('#articles-search');
    const searchClearBtn = document.querySelector('#search-clear, .search-clear-btn-top');
    const noResultsMessage = document.getElementById('no-results');
    const articlesGrid = document.getElementById('articles-grid');
    const paginationNumbers = document.getElementById('pagination-numbers');
    const paginationPrev = document.getElementById('pagination-prev');
    const paginationNext = document.getElementById('pagination-next');

    // State
    let currentSearch = '';
    let currentPage = 1;
    const itemsPerPage = 8; // 8 articles per page

    // Sort articles by date (most recent first)
    if (articlesGrid) {
        sortNewsByDate(articlesGrid);
    }
    
    // Update relative times and initialize date updates
    updateRelativeTimes();
    initDateUpdates();
    
    // Add click handlers to article cards to navigate to article detail
    articleCards.forEach(card => {
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
            // Navigate to article detail page
            const currentPath = window.location.pathname;
            const currentFile = currentPath.split('/').pop();
            
            // Always navigate to detail page
            if (currentFile === 'articulos.html' || currentPath.includes('/articulos.html')) {
                // Already on articles page, navigate to detail page
                window.location.href = `articulo-detalle.html?articulo=${slug}`;
            } else {
                // Navigate to detail page from index or other pages
                window.location.href = `pages/articulo-detalle.html?articulo=${slug}`;
            }
        });
    });
    
    updateDisplay();
    setupPagination();

    // Search Input Event Listener (Real-time)
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

    // Filter and Display Function
    function filterAndDisplay() {
        let visibleCards = [];
        
        articleCards.forEach(card => {
            const title = card.getAttribute('data-title') || '';
            const content = card.getAttribute('data-content') || '';
            const searchText = (title + ' ' + content).toLowerCase();
            
            // Check search
            const matchesSearch = currentSearch === '' || searchText.includes(currentSearch);
            
            if (matchesSearch) {
                visibleCards.push(card);
            }
        });

        // Show/hide no results message
        const totalVisible = visibleCards.length;
        if (noResultsMessage) {
            if (totalVisible === 0) {
                noResultsMessage.style.display = 'block';
                noResultsMessage.classList.add('show');
                if (articlesGrid) articlesGrid.style.display = 'none';
            } else {
                noResultsMessage.style.display = 'none';
                noResultsMessage.classList.remove('show');
                if (articlesGrid) articlesGrid.style.display = 'grid';
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
        articleCards.forEach(card => {
            card.classList.add('hidden');
            card.style.display = 'none';
        });

        // Show visible cards with animation
        cardsToShow.forEach((card, index) => {
            card.classList.remove('hidden');
            card.style.display = 'flex';
            
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
        articleCards.forEach(card => {
            const title = card.getAttribute('data-title') || '';
            const content = card.getAttribute('data-content') || '';
            const searchText = (title + ' ' + content).toLowerCase();
            
            const matchesSearch = currentSearch === '' || searchText.includes(currentSearch);
            
            if (matchesSearch) {
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
        const visibleCards = Array.from(articleCards).filter(card => !card.classList.contains('hidden'));
        
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
            
            const title = article.getAttribute('data-title') || 'Artículo Alebrijes';
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

    // Initialize Sticky Header - Always visible for articles page
    function initStickyHeader() {
        const header = document.querySelector('.news-page-header');
        if (!header) return;

        // Articles page header is always visible from start
        header.classList.add('visible');
        header.classList.add('always-visible');

        // Show sticky-active when scrolled
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('sticky-active');
            } else {
                header.classList.remove('sticky-active');
            }
        });
    }
});
