import { getConnectBaseViteConfig } from "@powerhousedao/builder-tools";
import { join } from "node:path";
import { defineConfig, mergeConfig, type UserConfig } from "vite";

export default defineConfig(({ mode }) => {
  const baseConnectViteConfig = getConnectBaseViteConfig({
    mode,
    dirname: import.meta.dirname,
  });

  const additionalViteConfig: UserConfig = {
    // add your own vite config here
    resolve: {
      alias: {
        ["@powerhousedao/document-editor-builder"]: join(import.meta.dirname),
      },
    },
  };

  const config = mergeConfig(baseConnectViteConfig, additionalViteConfig);

  return config;
});
