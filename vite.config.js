import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        checklist: resolve(__dirname, 'checklist.html'),
        contactos: resolve(__dirname, 'contactos.html'),
        ejercicios: resolve(__dirname, 'ejercicios.html'),
        evidenciaEjercicios: resolve(__dirname, 'evidencia-ejercicios.html'),
        reporteIncidencias: resolve(__dirname, 'reporte-incidencias.html'),
        tipo: resolve(__dirname, 'tipo.html'),
      }
    }
  }
});
