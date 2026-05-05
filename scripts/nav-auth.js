/*
    Alebrijes de Oaxaca Teotihuacán
    Navigation Authentication State Handler
    
    Este script debe incluirse en todas las páginas para actualizar
    dinámicamente el botón de login/logout en la navegación.
*/

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD5aakkUMk77EMKPwHvjXTqzPKBvejhjEo",
    authDomain: "metricasalebrijes.firebaseapp.com",
    projectId: "metricasalebrijes",
    storageBucket: "metricasalebrijes.firebasestorage.app",
    messagingSenderId: "822819596837",
    appId: "1:822819596837:web:62f3f4139332830ee96dcc"
};

// Initialize Firebase - reuse existing app if already initialized
let app;
try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
    app = initializeApp(firebaseConfig, 'nav-auth-' + Date.now());
}
const auth = getAuth(app);
const db = getFirestore(app);

// Check if user is a professor
async function isProfesor(userId) {
    try {
        const profRef = doc(db, 'profesores', userId);
        const profSnap = await getDoc(profRef);
        return profSnap.exists();
    } catch (error) {
        console.error('Error checking professor status:', error);
        return false;
    }
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('nav-login-btn');

    if (!loginBtn) {
        console.log('Nav auth: login button not found');
        return;
    }

    // Listen for auth state changes
    onAuthStateChanged(auth, async (user) => {
        console.log('Nav auth state changed:', user ? 'logged in' : 'logged out');
        await updateNavButton(user, loginBtn);
    });
});

// Update navigation button based on auth state
async function updateNavButton(user, button) {
    if (!button) return;

    // Determine the correct path prefix based on current location
    // Handle both forward slashes and backslashes for Windows compatibility
    const pathname = window.location.pathname.replace(/\\/g, '/');
    const isInPages = pathname.includes('/pages/') || pathname.endsWith('/pages');
    const pathPrefix = isInPages ? '' : 'pages/';

    console.log('Nav auth: isInPages =', isInPages, 'pathPrefix =', pathPrefix);

    if (user) {
        // Check if user is a professor
        const isProf = await isProfesor(user.uid);
        const portalLink = isProf ? 'panel-profesor.html' : 'mi-rendimiento.html';
        const portalText = isProf ? 'Dashboard' : 'Mi Portal';

        // User is logged in - show portal button
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            ${portalText}
        `;
        button.href = pathPrefix + portalLink;
        button.classList.add('logged-in');

        // Create logout button if it doesn't exist
        let logoutItem = document.getElementById('nav-logout-item');
        if (!logoutItem) {
            logoutItem = document.createElement('li');
            logoutItem.id = 'nav-logout-item';
            logoutItem.className = 'nav-item';
            logoutItem.innerHTML = `
                <a href="#" id="nav-logout-btn" class="nav-link nav-btn-logout">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Cerrar Sesión
                </a>
            `;

            // Insert after login button
            const parentItem = button.closest('.nav-item');
            if (parentItem) {
                parentItem.after(logoutItem);
            }

            // Add logout event listener
            const logoutBtn = logoutItem.querySelector('#nav-logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        await signOut(auth);
                        window.location.href = pathPrefix + 'login.html';
                    } catch (error) {
                        console.error('Error logging out:', error);
                    }
                });
            }
        }
    } else {
        // User is not logged in - show "Iniciar Sesión"
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            Iniciar Sesión
        `;
        button.href = pathPrefix + 'login.html';
        button.classList.remove('logged-in');

        // Remove logout button if exists
        const logoutItem = document.getElementById('nav-logout-item');
        if (logoutItem) {
            logoutItem.remove();
        }
    }
}
