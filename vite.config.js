import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  plugins: [
    react()
  ],
  // cho phép vite chạy https
  // server: {
  //   https: {
  //     key: "./key.pem",
  //     cert: "./certificate.pem"
  //   }
  // },
  // import bị lỗi
  resolve: {
    alias: {
      src: "/src",
      'simple-peer': 'simple-peer/simplepeer.min.js', // fix lỗi TypeError: Cannot read properties of undefined (reading 'call') khi dùng simple peer
    }
  },
  // định nghĩa global để sử dụng simple peer
  define: {
    global: "globalThis" // fix lỗi TypeError: Cannot read properties of undefined (reading 'call') khi dùng simple peer
  }
})
