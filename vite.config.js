import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/movies-site/",   // مهم جدًا لـ GitHub Pages
  plugins: [react()],
});
