import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/RedTeaming/',
  server: {
    port: 3000,
    open: true
  }
});
