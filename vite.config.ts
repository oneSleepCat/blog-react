import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 添加你需要的别名
      // 添加更多别名...
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://120.26.123.78:8000',
        changeOrigin: true,
      }
    }
  }
})
