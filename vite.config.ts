import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@use-gesture/react', '@react-spring/web']
  },
  // Configure static asset handling
  publicDir: 'public',
  assetsInclude: ['**/*.png', '**/*.json', '**/*.lottie'],
  server: {
    watch: {
      usePolling: true,
    },
  },
  // Configure environment variables
  envDir: './',
  envPrefix: 'VITE_'
});