import type { LibraryFormats, Plugin } from "vite";

import pluginVue from "@vitejs/plugin-vue";
import fs from "fs";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

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
const plugins = [pluginVue(), dts(), patchCssFiles];
const entry = "./src/index.ts";
const formats: LibraryFormats[] = ["es"];
const lib = { entry, fileName, formats };
const build = { lib };
const base = "./";
export default defineConfig({ base, build, plugins });
