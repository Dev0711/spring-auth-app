import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // API calls → Spring Boot
      '/auth': 'http://localhost:8080',

      // Start Google OAuth2 flow → Spring Boot
      '/oauth2/authorization': 'http://localhost:8080',

      // Spring Security's code-exchange callback → Spring Boot
      '/login/oauth2': 'http://localhost:8080',

      // NOTE: /oauth2/callback is intentionally NOT proxied.
      // That route belongs to React (OAuthCallback.jsx).
      // Spring Boot redirects the browser to:
      //   http://localhost:5173/oauth2/callback?token=...
      // and React Router handles it from there.
    },
  },
});
