/**
 * loader-overlay.js — Módulo global para el overlay de carga con logo
 * Uso: import { showLoader, hideLoader } from './loader-overlay.js';
 */

const LOGO_PATH = '/imagenes/logo.webp';

/** Inyecta el overlay en el body si no existe aún */
function ensureLoader() {
    if (document.getElementById('app-loader')) return;

    const overlay = document.createElement('div');
    overlay.id = 'app-loader';
    overlay.innerHTML = `
    <div class="loader-core">
      <div class="spiral spiral-4"></div>
      <div class="spiral spiral-1"></div>
      <div class="spiral spiral-2"></div>
      <div class="spiral spiral-3"></div>
      <img class="loader-logo" src="${LOGO_PATH}" alt="Logo empresa" />
    </div>
    <p class="loader-text">Cargando<span class="dots"></span></p>
  `;
    document.body.appendChild(overlay);
}

/**
 * Muestra el overlay de carga
 * @param {string} [text='Cargando'] — Texto que aparece debajo del logo
 */
export function showLoader(text = 'Cargando') {
    ensureLoader();
    const overlay = document.getElementById('app-loader');
    const label = overlay.querySelector('.loader-text');
    if (label) label.innerHTML = `${text}<span class="dots"></span>`;
    overlay.classList.remove('hidden');
}

/**
 * Oculta el overlay de carga con una transición suave
 */
export function hideLoader() {
    const overlay = document.getElementById('app-loader');
    if (overlay) overlay.classList.add('hidden');
}
