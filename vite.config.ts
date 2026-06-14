import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import fs from 'fs';
import type { Plugin } from 'vite';

const copyAssetsPlugin = (): Plugin => ({
  name: 'copy-assets',
  apply: 'build',
  async closeBundle() {
    const srcAssets = path.resolve(__dirname, 'src/assets');
    const distAssets = path.resolve(__dirname, 'dist/src/assets');
    
    if (fs.existsSync(srcAssets)) {
      fs.mkdirSync(path.dirname(distAssets), { recursive: true });
      
      const copyDir = (src: string, dest: string): void => {
        fs.mkdirSync(dest, { recursive: true });
        const files = fs.readdirSync(src);
        files.forEach(file => {
          const srcFile = path.join(src, file);
          const destFile = path.join(dest, file);
          if (fs.statSync(srcFile).isDirectory()) {
            copyDir(srcFile, destFile);
          } else {
            fs.copyFileSync(srcFile, destFile);
          }
        });
      };
      
      copyDir(srcAssets, distAssets);
    }
  }
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [react(), tailwindcss(), copyAssetsPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
