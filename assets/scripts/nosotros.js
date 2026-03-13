/* 
   Alebrijes de Oaxaca Teotihuacán
   Nosotros Page Scripts
*/

document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.mvv-card, .history-content, .history-image, .value-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(el => {
            // Set initial state
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    };

    animateOnScroll();
});
