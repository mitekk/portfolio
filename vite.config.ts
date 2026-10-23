import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
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
        },
      },
    },
  },
});
