/* 
   Alebrijes de Oaxaca Teotihuacán
   News Utilities - Date formatting and sorting
*/

// Calculate relative time from ISO date string
function getRelativeTime(dateString) {
    if (!dateString) return '1d';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    // Less than 1 minute
    if (diffMins < 1) {
        return 'Ahora';
    }
    // Less than 1 hour
    else if (diffMins < 60) {
        return `Hace ${diffMins} min`;
    }
    // Less than 24 hours
    else if (diffHours < 24) {
        return diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
    }
    // Less than 30 days
    else if (diffDays < 30) {
        return diffDays === 1 ? 'Hace 1 día' : `Hace ${diffDays} días`;
    }
    // Less than 12 months
    else if (diffMonths < 12) {
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return months[date.getMonth()];
    }
    // More than 1 year
    else {
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${months[date.getMonth()]}, ${date.getFullYear()}`;
    }
}

// Sort news articles by date (most recent first)
function sortNewsByDate(newsContainer) {
    if (!newsContainer) return;
    
    const articles = Array.from(newsContainer.querySelectorAll('.news-card-modern'));
    
    // Sort by data-date attribute
    articles.sort((a, b) => {
        const dateA = a.getAttribute('data-date');
        const dateB = b.getAttribute('data-date');
        
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1; // Articles without date go to the end
        if (!dateB) return -1;
        
        return new Date(dateB) - new Date(dateA); // Most recent first
    });
    
    // Re-append in sorted order
    articles.forEach(article => {
        newsContainer.appendChild(article);
    });
}

// Update relative time displays for all news cards
function updateRelativeTimes() {
    const timeElements = document.querySelectorAll('.news-card-time[data-date]');
    
    timeElements.forEach(element => {
        const dateString = element.getAttribute('data-date');
        if (dateString) {
            element.textContent = getRelativeTime(dateString);
        }
    });
}

// Initialize date updates (call every minute to update relative times)
function initDateUpdates() {
    updateRelativeTimes();
    // Update every minute
    setInterval(updateRelativeTimes, 60000);
}

