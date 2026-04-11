/* 
   Alebrijes de Oaxaca Teotihuacán
   Contacto Page Scripts
*/

document.addEventListener('DOMContentLoaded', () => {

    // Form Submission Simulation
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic styles for loading
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            // Simulate server request
            setTimeout(() => {
                // Success feedback
                formStatus.innerText = '¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.';
                formStatus.className = 'formStatus success';

                // Reset form
                contactForm.reset();

                // Reset button
                btn.innerText = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.innerText = '';
                    formStatus.className = 'formStatus';
                }, 5000);

            }, 2000);
        });
    }

    // Animation for info cards
    const animateInfo = () => {
        const cards = document.querySelectorAll('.info-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
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

    animateInfo();
});
