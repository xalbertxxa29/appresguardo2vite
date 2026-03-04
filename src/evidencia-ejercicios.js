// src/evidencia-ejercicios.js – Firebase Modular SDK
// Cámara optimizada: Captura local -> Subida diferida

import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

document.addEventListener("DOMContentLoaded", () => {
    const welcomeMsg = document.getElementById("welcome-message");
    const rutinaSelect = document.getElementById("rutina-select");
    const cameraBtn = document.getElementById("camera-btn");
    const enviarBtn = document.getElementById("enviar-btn");
    const backBtn = document.getElementById("back-btn");
    const photoPreview = document.getElementById("photo-preview");

    let currentPhotoBlob = null;
    let displayName = "";

    // — Verificar sesión y mostrar nombre —
    onAuthStateChanged(auth, async user => {
        if (!user) { window.location.href = "index.html"; return; }
        const key = user.email.split("@")[0].trim();
        try {
            const userDoc = await getDoc(doc(db, "userMap", key));
            displayName = userDoc.exists() && userDoc.data().nombre ? userDoc.data().nombre : key;
        } catch {
            displayName = key;
        }
        welcomeMsg.textContent = `Bienvenido, ${displayName}`;
    });

    // — Abrir cámara y capturar foto (Local) —
    cameraBtn.addEventListener("click", async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            const video = document.createElement("video");
            video.srcObject = stream;
            video.setAttribute("playsinline", "true");
            await video.play();

            const overlay = document.createElement("div");
            overlay.className = "capture-container";
            overlay.innerHTML = `
            <div style="position:relative; width:100%; max-width:360px; display:flex; flex-direction:column; align-items:center;">
                <video id="camera-feed" style="width:100%; border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,0.5);"></video>
                <div style="margin-top:20px;">
                    <button id="capture-trigger" style="
                        background-color: #ff3b30; 
                        color: white; 
                        border: 4px solid white; 
                        border-radius: 50%; 
                        width: 70px; 
                        height: 70px; 
                        font-size: 0;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                        cursor: pointer;">
                    Capturar
                    </button>
                    <button id="close-camera" style="
                        margin-left: 20px;
                        background: #333;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 20px;
                        font-weight: bold;
                        cursor: pointer;">
                    Cancelar
                    </button>
                </div>
            </div>
        `;

            document.body.appendChild(overlay);
            const videoEl = overlay.querySelector("#camera-feed");
            videoEl.srcObject = stream;
            videoEl.play();

            const triggerBtn = overlay.querySelector("#capture-trigger");
            triggerBtn.addEventListener("click", () => {
                const canvas = document.createElement("canvas");
                canvas.width = videoEl.videoWidth;
                canvas.height = videoEl.videoHeight;
                canvas.getContext("2d").drawImage(videoEl, 0, 0);

                canvas.toBlob(blob => {
                    currentPhotoBlob = blob;
                    const localURL = URL.createObjectURL(blob);
                    photoPreview.src = localURL;
                    photoPreview.style.display = "block";
                    stream.getTracks().forEach(t => t.stop());
                    document.body.removeChild(overlay);
                }, "image/jpeg", 0.8);
            });

            overlay.querySelector("#close-camera").addEventListener("click", () => {
                stream.getTracks().forEach(t => t.stop());
                document.body.removeChild(overlay);
            });

        } catch (err) {
            console.error("Error cámara:", err);
            alert("No se pudo acceder a la cámara.");
        }
    });

    // — Enviar datos (Subida a Firebase) —
    enviarBtn.addEventListener("click", async () => {
        if (!rutinaSelect.value) { alert("Debes seleccionar una rutina."); return; }
        if (!currentPhotoBlob) { alert("Debes tomar una foto primero."); return; }

        const rutina = rutinaSelect.options[rutinaSelect.selectedIndex].text;

        const loaderOverlay = document.createElement("div");
        loaderOverlay.className = "fullscreen-loader";
        loaderOverlay.innerHTML = `<span class="loader"></span>`;
        document.body.appendChild(loaderOverlay);

        try {
            const filename = `ejercicios/${Date.now()}.jpg`;
            const storageRef = ref(storage, filename);
            await uploadBytes(storageRef, currentPhotoBlob);
            const downloadURL = await getDownloadURL(storageRef);

            await addDoc(collection(db, "ejercicios"), {
                rutina,
                photoURL: downloadURL,
                user: displayName,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                timestamp: serverTimestamp()
            });

            setTimeout(() => { window.location.href = "menu.html"; }, 500);

        } catch (err) {
            console.error("Error al enviar:", err);
            document.body.removeChild(loaderOverlay);
            alert("Error enviando evidencia. Verifica tu conexión.");
        }
    });

    // — Botón Atrás —
    backBtn.addEventListener("click", () => { window.location.href = "menu.html"; });
});
