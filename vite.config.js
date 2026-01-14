import path from "node:path";
import react from "@vitejs/plugin-react";
import sharp from "sharp";
import { defineConfig } from "vite";

const dashboardWebpPlugin = () => ({
  name: "emit-dashboard-webp",
  apply: "build",
  async generateBundle() {
    const pngPath = path.resolve(process.cwd(), "public", "logo", "Sem títul3.png");

    try {
      const webp = await sharp(pngPath).webp({ quality: 82 }).toBuffer();
      this.emitFile({
        type: "asset",
        fileName: "logo/dashboard.webp",
        source: webp
      });
    } catch {
      return;
    }
  }
});

export default defineConfig({
  plugins: [react(), dashboardWebpPlugin()],
  server: {
    port: 5173,
    strictPort: true
  }
});
