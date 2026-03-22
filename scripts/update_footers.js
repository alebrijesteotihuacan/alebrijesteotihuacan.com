const fs = require('fs');
const path = require('path');

const cssToAdd = `
/* Footer Copied from Main Site */
footer {
    background-color: #050505;
    color: #aaa;
    padding: 80px 0 20px;
    font-size: 0.95rem;
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 40px;
    margin-bottom: 60px;
}

.footer-brand p {
    margin-top: 20px;
    max-width: 300px;
}

.footer-logo-img {
    height: 60px;
    filter: grayscale(100%) brightness(200%);
    opacity: 0.7;
}

.footer-links h4,
.footer-contact h4,
.footer-social h4 {
    color: var(--white);
    margin-bottom: 25px;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.footer-links ul li {
    margin-bottom: 12px;
}

.footer-links a:hover {
    color: var(--naranja-primary);
    padding-left: 5px;
}

.footer-contact p {
    margin-bottom: 15px;
}

.footer-bottom {
    border-top: 1px solid #222;
    padding-top: 30px;
    text-align: center;
    font-size: 0.85rem;
    color: #555;
}

.footer-bottom a {
    color: #888;
    text-decoration: none;
    transition: color 0.3s ease;
    margin: 0 5px;
}

.footer-bottom a:hover {
    color: var(--naranja-primary);
}

.footer-icon {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-right: 8px;
    color: var(--naranja-primary);
    display: inline-block;
}

/* Social Links in Footer - Column Layout */
.social-links-footer {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.social-link-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #aaa;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.03);
    text-decoration: none;
}

.social-link-item:hover {
    color: var(--white);
    background: var(--naranja-primary);
    transform: translateX(5px);
}

.social-link-item svg {
    flex-shrink: 0;
}

.footer-icon-social {
    width: 20px;
    height: 20px;
}

@media (max-width: 1024px) {
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}
@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: 1fr;
    }
}
`;

const htmlFooter = `<!-- Footer -->
    <footer id="contacto">
        <div class="container footer-grid">
            <div class="footer-brand">
                <img src="../../assets/Alebrijes Teotihuacan.png" alt="Logo Footer" class="footer-logo-img">
                <p>Pasión y formación deportiva con identidad oaxaqueña.</p>
            </div>

            <div class="footer-links">
                <h4>Navegación</h4>
                <ul>
                    <li><a href="../../index.html">Inicio</a></li>
                    <li><a href="../../pages/nosotros.html">Nosotros</a></li>
                    <li><a href="index.html" target="_blank" rel="noopener noreferrer">Visorias</a></li>
                    <li><a href="../../pages/ligatdp.html">Liga TDP</a></li>
                    <li><a href="../../pages/noticias.html">Noticias</a></li>
                    <li><a href="../../pages/fuerzasbasicas.html">Fuerzas Básicas</a></li>
                    <li><a href="../../pages/casaclub.html">Casa Club</a></li>
                    <li><a href="../../pages/escuela.html">Escuela</a></li>
                </ul>
            </div>

            <div class="footer-contact">
                <h4>Contacto</h4>
                <p>
                    <svg class="footer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    Centro Deportivo Pascual Boing
                </p>
                <p>
                    <svg class="footer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    alebrijesclub6@gmail.com
                </p>
            </div>

            <div class="footer-social">
                <h4>Alebrijes de Oaxaca</h4>
                <div class="social-links-footer">
                    <a href="https://www.facebook.com/AlebrijesOficial/" target="_blank" class="social-link-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                        <span>Facebook</span>
                    </a>
                    <a href="https://www.instagram.com/alebrijesoaxacaoficial/" target="_blank" class="social-link-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        </svg>
                        <span>Instagram</span>
                    </a>
                    <a href="https://www.tiktok.com/@alebrijesoaxacaoficial?lang=es" target="_blank" class="social-link-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                        <span>TikTok</span>
                    </a>
                    <a href="https://x.com/AlebrijesOaxaca" target="_blank" class="social-link-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>X (Twitter)</span>
                    </a>
                    <a href="https://www.youtube.com/user/AlebrijesTV" target="_blank" class="social-link-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span>YouTube</span>
                    </a>
                </div>
                <h4 style="margin-top: 20px;">Alebrijes Teotihuacán</h4>
                <div class="social-links-footer">
                    <a href="https://www.facebook.com/profile.php?id=100083182488673&locale=es_LA" target="_blank" class="social-link-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                        <span>Facebook</span>
                    </a>
                    <a href="https://www.instagram.com/alebrijes_teoti" target="_blank" class="social-link-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        </svg>
                        <span>Instagram</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Alebrijes de Oaxaca Teotihuacán. | <a href="../../pages/politica-privacidad.html">Política de Privacidad</a> | <a href="../../pages/terminos-condiciones.html">Términos y Condiciones</a></p>
        </div>
    </footer>`;

const targetDir = 'c:/Users/52558/OneDrive/Escritorio/Alebrijes Teotihuacan - Sitio Web/alebrijesteotihuacan.com-main/webvisorias/FormularioDeRegistroVisoria-main';
const pages = ['index', 'casos-exito', 'que-es-visoria', 'sedes', 'visores'];

console.log("Starting footer integration...");

pages.forEach(page => {
    // Modify CSS
    const cssPath = path.join(targetDir, \`\${page}.css\`);
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    if (!cssContent.includes('.footer-grid')) {
        fs.writeFileSync(cssPath, cssContent + cssToAdd);
        console.log(\`✅ Appended CSS to \${page}.css\`);
    } else {
        console.log(\`⏩ Skipped CSS for \${page}.css (already present)\`);
    }

    // Modify HTML
    const htmlPath = path.join(targetDir, \`\${page}.html\`);
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Replace old footer with new footer
    const footerRegex = /<!-- Footer -->[\s\S]*?<footer[^>]*>[\s\S]*?<\/footer>/;
    if (footerRegex.test(htmlContent)) {
        htmlContent = htmlContent.replace(footerRegex, htmlFooter);
        fs.writeFileSync(htmlPath, htmlContent);
        console.log(\`✅ Replaced HTML in \${page}.html\`);
    } else {
        console.log(\`❌ Could not find footer in \${page}.html\`);
    }
});
