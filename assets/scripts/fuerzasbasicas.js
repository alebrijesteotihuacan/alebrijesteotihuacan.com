/* 
   Alebrijes de Oaxaca Teotihuacán
   Fuerzas Basicas Page Scripts
*/

document.addEventListener('DOMContentLoaded', () => {

    // Timeline Animation
    const animateTimeline = () => {
        const items = document.querySelectorAll('.timeline-item');
        const cards = document.querySelectorAll('.category-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }
            });
        }, { threshold: 0.1 });

        // Setup timeline items
        items.forEach((item, index) => {
            item.style.opacity = '0';
            // Alternating slide in
            item.style.transform = index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
            item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(item);
        });

        // Setup cards
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    };

    animateTimeline();
});
