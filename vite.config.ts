import type { LibraryFormats, Plugin } from "vite";

import pluginVue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";
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
const filePath = path.resolve(path.resolve("dist"), `${fileName}.js`);
const writeBundle = () => {
  const content = fs.readFileSync(filePath, "utf-8");
  fs.writeFileSync(filePath, `import './${fileName}.css'\n${content}`);
};
const name = "patch-css";
const patchCssFiles: Plugin = { apply, name, writeBundle };
const plugins = [pluginVue(), dts({ rollupTypes }), patchCssFiles];
const entry = "./src/index.ts";
const formats: LibraryFormats[] = ["es"];
const lib = { entry, fileName, formats };
const build = { lib, rollupOptions };
const base = "./";
export default defineConfig({ base, build, plugins });
