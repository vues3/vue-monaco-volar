import pluginVue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const vue = "Vue";
const globals = { vue };
const output = { globals };
const external = ["vue"];
const rollupOptions = { external, output };
const rollupTypes = true;
const plugins = [pluginVue(), dts({ rollupTypes })];
const include = [
  "typescript",
  "monaco-editor-core/esm/vs/editor/editor.worker",
  "@vues3/monaco-volar-worker/dist/vue.worker",
];
const optimizeDeps = { include };
const name = "vue-monaco-volar";
const fileName = "vue-monaco-volar";
const entry = "./src/index.ts";
const lib = { entry, fileName, name };
const build = { lib, rollupOptions };
export default defineConfig({ build, optimizeDeps, plugins });
