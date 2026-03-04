const d="/imagenes/logo.webp";function o(){if(document.getElementById("app-loader"))return;const e=document.createElement("div");e.id="app-loader",e.innerHTML=`
    <div class="loader-core">
      <div class="spiral spiral-4"></div>
      <div class="spiral spiral-1"></div>
      <div class="spiral spiral-2"></div>
      <div class="spiral spiral-3"></div>
      <img class="loader-logo" src="${d}" alt="Logo empresa" />
    </div>
    <p class="loader-text">Cargando<span class="dots"></span></p>
  `,document.body.appendChild(e)}function l(e="Cargando"){o();const a=document.getElementById("app-loader"),s=a.querySelector(".loader-text");s&&(s.innerHTML=`${e}<span class="dots"></span>`),a.classList.remove("hidden")}function r(){const e=document.getElementById("app-loader");e&&e.classList.add("hidden")}export{r as h,l as s};
