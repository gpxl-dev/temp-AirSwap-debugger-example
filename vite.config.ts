import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { ValidateEnv } from "@julr/vite-plugin-validate-env";

export default defineConfig({
  plugins: [react(), ValidateEnv()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
