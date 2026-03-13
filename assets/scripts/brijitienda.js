/* 
   Alebrijes de Oaxaca Teotihuacán
   Brijitienda Page Scripts
*/

document.addEventListener('DOMContentLoaded', () => {

    // Add to Cart Buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');

    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Get product name from parent card
            const card = btn.closest('.product-card');
            const productName = card.querySelector('h3').textContent;

            // Show toast notification
            showToast(`"${productName}" agregado al carrito`);

            // Button feedback
            const originalText = btn.innerHTML;
            btn.innerHTML = '✓ Agregado';
            btn.style.background = '#27ae60';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 1500);
        });
    });

    // Toast Notification Function
    function showToast(message) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.cart-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Product Card Animations
    const animateProducts = () => {
        const cards = document.querySelectorAll('.product-card');

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

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    };

    animateProducts();
});
