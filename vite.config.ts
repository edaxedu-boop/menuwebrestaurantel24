import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Restaurant El 24',
        short_name: 'El 24',
        description: 'Parrillas, Criollos y Chifa - Restaurant El 24',
        theme_color: '#f43f5e',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'logo_restaurant_24.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo_restaurant_24.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
