import{o as b,g as v,d as w,c as d,b as y,r as f,k as x,m as E,n as L,j as k,e as B,h as D}from"./firebase-config-CZqFWkal.js";import{s as C,h as I}from"./loader-overlay-BlexRQPy.js";document.addEventListener("DOMContentLoaded",()=>{const s=document.getElementById("welcome-message"),l=document.getElementById("desc-textarea"),m=document.getElementById("camera-btn"),p=document.getElementById("enviar-btn"),u=document.getElementById("back-btn"),i=document.getElementById("photo-preview");let n=null,r="";b(y,async a=>{if(!a)return window.location.href="index.html";const e=a.email.split("@")[0].trim();try{const t=await v(w(d,"userMap",e));r=t.exists()&&t.data().nombre?t.data().nombre:e}catch{r=e}s.textContent=`Bienvenido, ${r}`}),m.addEventListener("click",async()=>{try{const a=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),e=document.createElement("div");e.className="capture-container",e.innerHTML=`
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
        `,document.body.appendChild(e);const t=e.querySelector("#camera-feed");t.srcObject=a,t.setAttribute("playsinline","true"),await t.play(),e.querySelector("#capture-trigger").addEventListener("click",()=>{const o=document.createElement("canvas");o.width=t.videoWidth,o.height=t.videoHeight,o.getContext("2d").drawImage(t,0,0),o.toBlob(c=>{n=c;const g=URL.createObjectURL(c);i.src=g,i.style.display="block",a.getTracks().forEach(h=>h.stop()),document.body.removeChild(e)},"image/jpeg",.8)}),e.querySelector("#close-camera").addEventListener("click",()=>{a.getTracks().forEach(o=>o.stop()),document.body.removeChild(e)})}catch(a){console.error("Error cámara:",a),alert("No se pudo acceder a la cámara.")}}),p.addEventListener("click",async()=>{const a=l.value.trim();if(!a){alert("Debes escribir una descripción.");return}if(!n){alert("Debes tomar una foto primero.");return}C("Enviando reporte...");try{const e=`incidencias/${Date.now()}.jpg`,t=f(x,e);await E(t,n);const o=await L(t);await k(B(d,"incidencias"),{descripción:a,photoURL:o,user:r,date:new Date().toLocaleDateString(),time:new Date().toLocaleTimeString(),timestamp:D()}),setTimeout(()=>{window.location.href="menu.html"},500)}catch(e){console.error("Error al enviar:",e),I(),alert("Error enviando incidencia.")}}),u.addEventListener("click",()=>{window.location.href="menu.html"})});
