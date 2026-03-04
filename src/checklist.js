/* src/checklist.js – Firebase Modular SDK */
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import lottie from 'lottie-web';
import { showLoader, hideLoader } from './loader-overlay.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Firebase Setup (ya inicializado en firebase-config.js)
    let displayName = "";

    // 2. DOM Elements
    const form = document.getElementById("unified-form");
    const checkResguardo = document.getElementById("check-resguardo");
    const checkConductor = document.getElementById("check-conductor");
    const sectionResguardo = document.getElementById("section-resguardo");
    const sectionConductor = document.getElementById("section-conductor");
    const submitBtn = document.getElementById("submit-btn");
    const welcomeEl = document.getElementById("welcome-message");
    const backBtn = document.getElementById("back-btn");

    const lottieModal = document.getElementById("lottie-modal");
    const lottieContainer = document.getElementById("lottie-container");

    // 3. Auth Check
    onAuthStateChanged(auth, async user => {
        if (!user) return window.location.href = "index.html";
        const emailName = user.email.split("@")[0];
        try {
            const userDoc = await getDoc(doc(db, "userMap", emailName));
            displayName = userDoc.exists() && userDoc.data().nombre ? userDoc.data().nombre : emailName;
        } catch {
            displayName = emailName;
        }
        welcomeEl.textContent = `Bienvenido, ${displayName}`;
        welcomeEl.classList.remove("skeleton");
    });

    // 4. Role Toggle Logic
    function updateFormState() {
        const isResguardo = checkResguardo.checked;
        const isConductor = checkConductor.checked;

        if (isResguardo) sectionResguardo.classList.add("active");
        else sectionResguardo.classList.remove("active");

        if (isConductor) sectionConductor.classList.add("active");
        else sectionConductor.classList.remove("active");

        if (isResguardo || isConductor) submitBtn.style.display = "block";
        else submitBtn.style.display = "none";

        setRequired(sectionResguardo, isResguardo);
        setRequired(sectionConductor, isConductor);
    }

    function setRequired(section, isRequired) {
        const inputs = section.querySelectorAll("input[type='radio']");
        inputs.forEach(input => {
            if (isRequired) input.setAttribute("required", "true");
            else input.removeAttribute("required");
        });
    }

    checkResguardo.addEventListener("change", updateFormState);
    checkConductor.addEventListener("change", updateFormState);

    // 5. Reveal Animation on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Helper Notificación
    function showNotification(title, message, isError = false) {
        const modal = document.getElementById("notification-modal");
        const titleEl = document.getElementById("notification-title");
        const msgEl = document.getElementById("notification-message");
        const okBtn = document.getElementById("notification-ok-btn");
        const iconEl = document.getElementById("notif-icon");

        if (!modal) return alert(message);
        titleEl.textContent = title;
        msgEl.innerHTML = message;

        if (isError) {
            titleEl.style.color = "#d32f2f";
            okBtn.style.backgroundColor = "#d32f2f";
            if (iconEl) iconEl.textContent = "❌";
        } else {
            titleEl.style.color = "#28a745";
            okBtn.style.backgroundColor = "#28a745";
            if (iconEl) iconEl.textContent = "✅";
        }

        modal.style.display = "flex";
        const newOkBtn = okBtn.cloneNode(true);
        okBtn.parentNode.replaceChild(newOkBtn, okBtn);
        newOkBtn.onclick = () => modal.style.display = "none";
    }

    // 6. Submit Logic
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        lottieModal.style.display = "flex";
        const anim = lottie.loadAnimation({
            container: lottieContainer,
            renderer: "svg",
            loop: false,
            autoplay: true,
            path: "https://assets10.lottiefiles.com/packages/lf20_jbrw3hcz.json"
        });

        anim.addEventListener("complete", async () => {
            const data = {};

            data["Roles"] = [];
            if (checkResguardo.checked) data["Roles"].push("Resguardo");
            if (checkConductor.checked) data["Roles"].push("Conductor");

            const formData = new FormData(form);
            for (const [key, value] of formData.entries()) {
                if (key !== "roles") data[key] = value;
            }

            const now = new Date();
            const dateOptions = { timeZone: 'America/Lima', day: '2-digit', month: '2-digit', year: 'numeric' };
            const timeOptions = { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

            data["Fecha"] = new Intl.DateTimeFormat('es-PE', dateOptions).format(now);
            data["Hora"] = new Intl.DateTimeFormat('es-PE', timeOptions).format(now);
            data["Usuario Nombre"] = displayName;
            data["Usuario ID"] = auth.currentUser.email;
            data["timestamp"] = serverTimestamp();

            try {
                await addDoc(collection(db, "checklists"), data);
                window.location.href = "menu.html";
            } catch (error) {
                console.error("Error guardando:", error);
                lottieModal.style.display = "none";
                showNotification("Error", "Error al guardar el checklist. Intenta nuevamente.", true);
            }
        });
    });

    // 7. Navegación
    backBtn.addEventListener("click", () => { window.location.href = "menu.html"; });
});
