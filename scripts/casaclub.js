/* 
   Alebrijes de Oaxaca Teotihuacán
   Casa Club Page Scripts
*/

document.addEventListener('DOMContentLoaded', () => {

    // Amenities Animation
    const animateAmenities = () => {
        const cards = document.querySelectorAll('.amenity-card');
        const values = document.querySelectorAll('.value-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        // Setup amenity cards
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        // Setup value items
        values.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    };

    animateAmenities();
});
