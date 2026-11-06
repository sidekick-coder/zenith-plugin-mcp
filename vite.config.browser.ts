import { mergeConfig } from "vite";
import baseConfig from "./vite.config.base.ts";

export default mergeConfig(baseConfig, {
  build: {
      outDir: "dist/client-browser",
      lib: {
          name: "client-node",
          entry: "src/client/index.ts",
          formats: ["es"],
      }
  }
})
