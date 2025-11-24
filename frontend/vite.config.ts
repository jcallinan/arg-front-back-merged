// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { visualizer } from "rollup-plugin-visualizer";

// Support __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
   const env = loadEnv(mode, process.cwd(), "");

   return {
      plugins: [
         react(),
         // Add bundle analyzer in production builds
         mode === "production" &&
            visualizer({
               filename: "dist/stats.html",
               open: false,
               gzipSize: true,
               brotliSize: true,
            }),
      ].filter(Boolean),
      server: {
         host: "0.0.0.0",
         port: parseInt(env.VITE_PORT || "5173", 10),
         strictPort: true,
         allowedHosts: [
            "dev-damco.amref.com",
            "dev-app-damco.amref.com",
            "dev-web-damco.amref.com",
            "dev-auth-damco.amref.com",
            "qa-damco.amref.com",
            "qa-web-damco.amref.com",
            "qa-app-damco.amref.com",
            "qa-auth-damco.amref.com",
            "test-app-damco.amref.com",
            "test-web-damco.amref.com",
            "test-auth-damco.amref.com",
         ],
      },
      build: {
         // Enable code splitting
         rollupOptions: {
            output: {
               manualChunks: {
                  // Vendor chunks
                  vendor: ["react", "react-dom"],
                  antd: ["antd", "@ant-design/icons"],
                  router: ["react-router-dom"],
                  state: ["@reduxjs/toolkit", "react-redux"],
                  query: ["@tanstack/react-query"],
                  utils: ["lodash", "dayjs", "axios"],
               },
               // Optimize chunk naming
               chunkFileNames: () => {
                  return `js/[name]-[hash].js`;
               },
               entryFileNames: "js/[name]-[hash].js",
               assetFileNames: "assets/[name]-[hash].[ext]",
            },
         },
         // Enable source maps for debugging (disable in production)
         sourcemap: mode === "development",
         // Optimize chunk size
         chunkSizeWarningLimit: 1000,
         // Minify CSS
         cssMinify: true,
         // Enable tree shaking
         minify: "terser",
         terserOptions: {
            compress: {
               drop_console: mode === "production",
               drop_debugger: mode === "production",
            },
         },
         assetsInlineLimit: 0, // do not inline assets as base64 to keep JS parse light
      },
      css: {
         preprocessorOptions: {
            scss: {
               additionalData: `
                  // Global SCSS imports removed to avoid namespace conflicts
                  // Individual SCSS files now import what they need locally
               `,
               // Add SCSS path aliases
               includePaths: [
                  path.resolve(__dirname, "src/assets/styles"),
                  path.resolve(__dirname, "src"),
               ],
            },
         },
      },
      resolve: {
         alias: {
            "@": path.resolve(__dirname, "src"),
            "@shared-components": path.resolve(
               __dirname,
               "src/shared-components"
            ),
            "@modules": path.resolve(__dirname, "src/modules"),
            "@core": path.resolve(__dirname, "src/core"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@api": path.resolve(__dirname, "src/api"),
            "@constants": path.resolve(__dirname, "src/constants"),
            "@context": path.resolve(__dirname, "src/context"),
            "@services": path.resolve(__dirname, "src/services"),
            "@store": path.resolve(__dirname, "src/store"),
            "@type-definitions": path.resolve(__dirname, "src/types"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@widget-library": path.resolve(__dirname, "src/widget-library"),
         },
      },
      define: {
         __APP_ENV__: JSON.stringify(env.APP_ENV),
         __VITE_ENV__: JSON.stringify(env.VITE_ENV),
         __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE),
      },
      // Optimize dependencies
      optimizeDeps: {
         include: [
            "react",
            "react-dom",
            "react-router-dom",
            "antd",
            "@ant-design/icons",
            "@reduxjs/toolkit",
            "react-redux",
            "@tanstack/react-query",
            "lodash",
            "dayjs",
            "axios",
         ],
      },
   };
});
