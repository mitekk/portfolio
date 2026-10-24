import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // One stylesheet, not one per chunk. Splitting produced five render-blocking
    // <link>s on `/`, four of them under a kilobyte: all round trips, no bytes
    // saved. The whole site's CSS is ~31KB raw and ~6.5KB gzipped.
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Matched on the resolved module path, not the bare specifier: the object form
        // resolves "react-dom" to react-dom/index.js, which main.tsx never imports — it
        // imports react-dom/client, so that and scheduler stayed in the entry chunk.
        manualChunks(id) {
          if (
            /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(
              id,
            )
          ) {
            return "react-vendor";
          }
          if (/node_modules\/react-helmet-async\//.test(id)) {
            return "seo";
          }
          // ~65KB of embedded JSON that only the intro's tetromino grid reads.
          // Left to Rollup it lands in whichever shared chunk imports the UI
          // barrel, so every section page downloads and parses it to draw a
          // waves grid that never calls the tiler.
          if (/src\/assets\/templates\//.test(id)) {
            return "tiling";
          }
        },
      },
    },
  },
});
