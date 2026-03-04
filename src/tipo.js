/* src/tipo.js – Firebase Modular SDK */
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { showLoader, hideLoader } from './loader-overlay.js';

onAuthStateChanged(auth, async user => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    const uid = user.email.split('@')[0];
    try {
        const userDoc = await getDoc(doc(db, 'userMap', uid));
        const welcomeElem = document.getElementById('welcome-message');
        if (userDoc.exists() && userDoc.data().nombre) {
            welcomeElem.textContent = `Bienvenido, ${userDoc.data().nombre}`;
        } else {
            welcomeElem.textContent = `Bienvenido, ${uid}`;
        }
    } catch (e) {
        console.error("Error leyendo userMap:", e);
    }
});

// Redirecciones de botones
document.getElementById('resguardo-btn').addEventListener('click', () => {
    window.location.href = 'formulario.html';
});

document.getElementById('conductor-btn').addEventListener('click', () => {
    window.location.href = 'formulario-conductor.html';
});

document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'menu.html';
});
