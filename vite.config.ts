import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Repo name is "3D-UX" — Pages serves the site under that path.
export default defineConfig({
  base: "/3D-UX/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
