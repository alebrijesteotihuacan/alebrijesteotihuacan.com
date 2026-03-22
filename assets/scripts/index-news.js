/* 
   Alebrijes de Oaxaca Teotihuacán
   Index News Section - Display 3 most recent news
*/

document.addEventListener('DOMContentLoaded', () => {
    // Fetch news from noticias.html or use a shared data source
    // For now, we'll create a simple function that can be updated manually
    // or fetch from noticias.html
    
    function updateIndexNews() {
        // This function will be called to update the news section on index
        // For now, it's a placeholder that can be enhanced to fetch from noticias.html
        
        // Get the news grid on index
        const newsGrid = document.querySelector('#noticias .news-grid');
        if (!newsGrid) return;
        
        // For now, we'll keep the manual HTML structure
        // In the future, this could fetch from noticias.html and display the 3 most recent
    }
    
    updateIndexNews();
});

