import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://thesis-backend-m13g.onrender.com/",
        changeOrigin: true,
        secure: true,
        // require this to work
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
