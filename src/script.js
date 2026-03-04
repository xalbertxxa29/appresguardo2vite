// src/script.js  –  Login page
// Lógica idéntica al original; ahora usa Firebase Modular SDK

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { showLoader, hideLoader } from './loader-overlay.js';

document.addEventListener("DOMContentLoaded", () => {

    // ——— Verificación de Sesión Persistente ———
    onAuthStateChanged(auth, user => {
        if (user) {
            window.location.href = "menu.html";
        }
    });

    // ——— Función para validar Hexadecimal ———
    function isValidHex(hex) {
        return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
    }

    // ——— Función para aplicar color de sirena y guardar en localStorage ———
    function applySirenColor(hex) {
        if (!hex || !isValidHex(hex)) {
            console.warn(`Color inválido detectado: ${hex}. Usando default.`);
            hex = '#00ff00';
        }
        try {
            document.documentElement.style.setProperty('--siren-color', hex);
            const c = hex.replace('#', '');
            let r, g, b;
            if (c.length === 3) {
                r = parseInt(c[0] + c[0], 16);
                g = parseInt(c[1] + c[1], 16);
                b = parseInt(c[2] + c[2], 16);
            } else {
                r = parseInt(c.substring(0, 2), 16);
                g = parseInt(c.substring(2, 4), 16);
                b = parseInt(c.substring(4, 6), 16);
            }
            if (isNaN(r) || isNaN(g) || isNaN(b)) throw new Error("Parseo RGB fallido");
            document.documentElement.style.setProperty('--siren-rgb', `${r},${g},${b}`);
            localStorage.setItem('sirenColor', hex);
        } catch (e) {
            console.error("Error aplicando color sirena:", e);
            document.documentElement.style.setProperty('--siren-color', '#00ff00');
            document.documentElement.style.setProperty('--siren-rgb', '0,255,0');
        }
    }

    // ——— Suscripción en tiempo real a Firestore ———
    const sirenRef = doc(db, 'settings', 'siren');
    onSnapshot(sirenRef, snapshot => {
        let color = '#00ff00';
        if (snapshot.exists() && snapshot.data().color) {
            color = snapshot.data().color;
        } else {
            const saved = localStorage.getItem('sirenColor');
            if (saved) color = saved;
        }
        applySirenColor(color);
    }, err => {
        console.error("Error escuchando siren en Firestore:", err);
        const saved = localStorage.getItem('sirenColor') || '#00ff00';
        applySirenColor(saved);
    });

    // ——— Captura elementos del DOM ———
    const loginForm = document.getElementById("login-form");
    const loginBtn = document.getElementById("login-btn");
    const loadingOverlay = document.getElementById("loadingOverlay");
    const errorModal = document.getElementById("errorModal");
    const modalMessage = document.getElementById("modalMessage");
    const modalClose = document.getElementById("modalClose");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const rememberCheckbox = document.getElementById("remember");
    const togglePassword = document.getElementById("togglePassword");

    if (!loginForm) {
        console.error("❌ No se encontró #login-form en el DOM");
        return;
    }

    // ——— Estado inicial ———
    loginForm.reset();
    usernameInput.disabled = false;
    passwordInput.disabled = false;
    loginBtn.disabled = false;
    loadingOverlay.hidden = true;
    errorModal.style.display = "none";

    // ——— Prefill "Recordarme" ———
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
        usernameInput.value = rememberedUser;
        rememberCheckbox.checked = true;
    }

    // ——— Toggle visibilidad de la contraseña ———
    togglePassword.addEventListener("click", () => {
        const isPwd = passwordInput.type === "password";
        passwordInput.type = isPwd ? "text" : "password";
        togglePassword.style.transform = isPwd ? "rotate(180deg)" : "rotate(0)";
        togglePassword.setAttribute("aria-label", isPwd ? "Ocultar contraseña" : "Mostrar contraseña");
    });

    // ——— Cerrar modal de error ———
    modalClose.addEventListener("click", () => { errorModal.style.display = "none"; });
    errorModal.addEventListener("click", e => {
        if (e.target === errorModal) errorModal.style.display = "none";
    });

    // ——— Manejo del submit ———
    loginForm.addEventListener("submit", async e => {
        e.preventDefault();
        modalMessage.textContent = "";
        errorModal.style.display = "none";

        let userInput = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!userInput || !password) return showModal("Por favor, completa todos los campos.");

        if (!userInput.includes('@')) {
            userInput = `${userInput}@liderman.com.pe`;
            console.log(`Autocompletando dominio: ${userInput}`);
        } else {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput)) {
                return showModal("El formato del correo electrónico no es válido.");
            }
        }

        if (rememberCheckbox.checked) {
            localStorage.setItem("rememberedUser", usernameInput.value.trim());
        } else {
            localStorage.removeItem("rememberedUser");
        }

        loginBtn.disabled = true;
        loadingOverlay.hidden = false;

        try {
            await signInWithEmailAndPassword(auth, userInput, password);
            window.location.href = "menu.html";
        } catch (error) {
            loadingOverlay.hidden = true;
            loginBtn.disabled = false;

            const code = error.code;
            let msg = "Ha ocurrido un error. Intenta de nuevo.";
            if (["auth/user-not-found", "auth/wrong-password", "auth/invalid-credential"].includes(code)) {
                msg = "Usuario o contraseña incorrectos.";
            } else if (code === "auth/too-many-requests") {
                msg = "Demasiados intentos fallidos. Por favor espera unos minutos.";
            } else if (code === "auth/invalid-email") {
                msg = "El formato del usuario/correo no es válido.";
            } else if (code === "auth/network-request-failed") {
                msg = "Error de conexión. Verifica tu internet.";
            } else {
                msg = `Error: ${error.message}`;
            }
            showModal(msg);
        }
    });

    function showModal(text) {
        modalMessage.textContent = text;
        errorModal.style.display = "flex";
        modalClose.focus();
    }
});
