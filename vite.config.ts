import type { LibraryFormats, Plugin } from "vite";

import pluginVue from "@vitejs/plugin-vue";
import fs from "fs";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const vue = "Vue";
const globals = { vue };
const output = { globals };
const external = ["vue"];
const rollupOptions = { external, output };
const rollupTypes = true;
const apply = "build";
const fileName = "vue-monaco-volar";
const filePath = `./dist/${fileName}.js`;
const writeBundle = () => {
  fs.writeFileSync(
    filePath,
    `import "./${fileName}.css";\n${fs.readFileSync(filePath, "utf-8")}`,
  );
};
const name = "patch-css";
const patchCssFiles: Plugin = { apply, name, writeBundle };
const plugins = [pluginVue(), dts({ rollupTypes }), patchCssFiles];
const entry = "./src/index.ts";
const formats: LibraryFormats[] = ["es"];
const lib = { entry, fileName, formats };
const build = { lib, rollupOptions };
// const base = "./";
const path = "path-browserify";
const alias = { path };
const resolve = { alias };
export default defineConfig({
  // base,
  build,
  plugins,
  resolve,
});
