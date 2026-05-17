import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from custom domain root (3d-ux.curioux.com).
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
