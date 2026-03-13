/* 
   Alebrijes de Oaxaca Teotihuacán
   Visorias Page Scripts
*/

document.addEventListener('DOMContentLoaded', () => {

    // Form Handling
    const form = document.getElementById('registrationForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation simulation
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            // Disable button
            btn.disabled = true;
            btn.innerText = 'Enviando...';

            // Simulate API call
            setTimeout(() => {
                // Success feedback
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-success'); // Assuming you might have or want this, or just inline style
                btn.style.backgroundColor = '#2ecc71';
                btn.style.borderColor = '#2ecc71';
                btn.innerText = '¡Registro Completado!';

                // Reset form
                form.reset();

                // Show success alert
                alert('Gracias por tu registro. Nos pondremos en contacto contigo pronto.');

                // Reset button after delay
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                }, 3000);
            }, 1500);
        });
    }

    // Optional: Animate grid items
    const cards = document.querySelectorAll('.req-card, .date-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation
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
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});
