import{o as y,g as w,d as x,c as m,b as f,r as E,k as L,m as B,n as k,j as D,e as C,h as j}from"./firebase-config-CZqFWkal.js";document.addEventListener("DOMContentLoaded",()=>{const u=document.getElementById("welcome-message"),c=document.getElementById("rutina-select"),p=document.getElementById("camera-btn"),g=document.getElementById("enviar-btn"),h=document.getElementById("back-btn"),d=document.getElementById("photo-preview");let i=null,n="";y(f,async o=>{if(!o){window.location.href="index.html";return}const t=o.email.split("@")[0].trim();try{const e=await w(x(m,"userMap",t));n=e.exists()&&e.data().nombre?e.data().nombre:t}catch{n=t}u.textContent=`Bienvenido, ${n}`}),p.addEventListener("click",async()=>{try{const o=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),t=document.createElement("video");t.srcObject=o,t.setAttribute("playsinline","true"),await t.play();const e=document.createElement("div");e.className="capture-container",e.innerHTML=`
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
        `,document.body.appendChild(e);const a=e.querySelector("#camera-feed");a.srcObject=o,a.play(),e.querySelector("#capture-trigger").addEventListener("click",()=>{const r=document.createElement("canvas");r.width=a.videoWidth,r.height=a.videoHeight,r.getContext("2d").drawImage(a,0,0),r.toBlob(l=>{i=l;const v=URL.createObjectURL(l);d.src=v,d.style.display="block",o.getTracks().forEach(b=>b.stop()),document.body.removeChild(e)},"image/jpeg",.8)}),e.querySelector("#close-camera").addEventListener("click",()=>{o.getTracks().forEach(r=>r.stop()),document.body.removeChild(e)})}catch(o){console.error("Error cámara:",o),alert("No se pudo acceder a la cámara.")}}),g.addEventListener("click",async()=>{if(!c.value){alert("Debes seleccionar una rutina.");return}if(!i){alert("Debes tomar una foto primero.");return}const o=c.options[c.selectedIndex].text,t=document.createElement("div");t.className="fullscreen-loader",t.innerHTML='<span class="loader"></span>',document.body.appendChild(t);try{const e=`ejercicios/${Date.now()}.jpg`,a=E(L,e);await B(a,i);const s=await k(a);await D(C(m,"ejercicios"),{rutina:o,photoURL:s,user:n,date:new Date().toLocaleDateString(),time:new Date().toLocaleTimeString(),timestamp:j()}),setTimeout(()=>{window.location.href="menu.html"},500)}catch(e){console.error("Error al enviar:",e),document.body.removeChild(t),alert("Error enviando evidencia. Verifica tu conexión.")}}),h.addEventListener("click",()=>{window.location.href="menu.html"})});
