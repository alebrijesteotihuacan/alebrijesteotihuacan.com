/* Estadio Page Scripts */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Estadio page loaded');
    setRandomHeroImage();
    initGallery();
    initLightbox();
});

function setRandomHeroImage() {
    const heroImg = document.querySelector('.estadio-bg-img');
    if (heroImg && galleryImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * galleryImages.length);
        heroImg.src = galleryImages[randomIndex];
    }
}

// Gallery Images Data
const galleryImages = [
    '../assets/CentroRecreativoPascualBoing/Foto1.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto2.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto3.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto4.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto5.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto6.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto7.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto8.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto9.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto10.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto11.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto12.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto13.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto14.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto15.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto16.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto17.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto18.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto19.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto20.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto21.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto22.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto23.jpg',
    '../assets/CentroRecreativoPascualBoing/Foto24.jpg'
];

// Initialize Gallery
function initGallery() {
    const galleryCollage = document.getElementById('gallery-collage');
    if (!galleryCollage) return;

    galleryCollage.innerHTML = '';

    galleryImages.forEach((imageSrc, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-index', index);
        galleryItem.setAttribute('tabindex', '0');
        galleryItem.setAttribute('role', 'button');
        galleryItem.setAttribute('aria-label', `Ver imagen ${index + 1}`);

        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Centro Deportivo Pascual Boing - Foto ${index + 1}`;
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'gallery-item-overlay';

        const icon = document.createElement('div');
        icon.className = 'gallery-item-icon';
        icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
        `;

        overlay.appendChild(icon);
        galleryItem.appendChild(img);
        galleryItem.appendChild(overlay);
        galleryCollage.appendChild(galleryItem);

        // Click event
        galleryItem.addEventListener('click', () => openLightbox(index));

        // Keyboard event
        galleryItem.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });
}

// Lightbox functionality
let currentImageIndex = 0;

function initLightbox() {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (!lightboxModal) return;

    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on background click
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Navigation
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox(1));
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
}

function openLightbox(index) {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCounter = document.getElementById('lightbox-counter');

    if (!lightboxModal || !lightboxImage) return;

    currentImageIndex = index;
    lightboxImage.src = galleryImages[index];
    lightboxImage.alt = `Centro Deportivo Pascual Boing - Foto ${index + 1}`;

    if (lightboxCounter) {
        lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
    }

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightboxModal = document.getElementById('lightbox-modal');
    if (!lightboxModal) return;

    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }

    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCounter = document.getElementById('lightbox-counter');

    if (lightboxImage) {
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.src = galleryImages[currentImageIndex];
            lightboxImage.alt = `Centro Deportivo Pascual Boing - Foto ${currentImageIndex + 1}`;
            lightboxImage.style.opacity = '1';
        }, 150);
    }

    if (lightboxCounter) {
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
}
