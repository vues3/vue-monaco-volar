import type { PathOrFileDescriptor } from "fs";
import type { InputOption } from "rollup";
import type {
  BuildEnvironmentOptions,
  LibraryFormats,
  LibraryOptions,
  Plugin,
  PluginOption,
} from "vite";

import replace from "@rollup/plugin-replace";
import pluginVue from "@vitejs/plugin-vue";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

/** Base public path when served in development or production. */
const base = "./";
/**
 * The name of the package file output. The default file name is the name option
 * of the project package.json. It can also be defined as a function taking the
 * format as an argument.
 */
const fileName = "vue-monaco-volar";
/** Output format for worker bundle */
const format: LibraryFormats = "es";
/**
 * Build in library mode. The value should be the global name of the lib in UMD
 * mode. This will produce esm + cjs + umd bundle formats with default
 * configurations that are suitable for distributing libraries.
 */
const lib: LibraryOptions = (() => {
  /** Path of library entry */
  const entry: InputOption = resolve(resolve("src"), "index.ts");
  /** Output bundle formats */
  const formats = [format];
  return { entry, fileName, formats };
})();
/** Build specific options */
const build: BuildEnvironmentOptions = {
  commonjsOptions: {
    ignore: ["typescript"],
  },
  cssCodeSplit: true,
  lib,
  minify: false,
};
const worker = (() => {
  /** Prevents replacing strings where they are followed by a single equals sign. */
  const preventAssignment = true;
  /** You can separate values to replace from other options. */
  const values = {
    "process.env.NODE_ENV": JSON.stringify("production"),
  };
  /**
   * Vite plugins that apply to worker bundle. The plugins returned by this
   * function should be new instances every time it is called, because they are
   * used for each rollup worker bundling process.
   */
  const plugins = () => [replace({ preventAssignment, values })];
  return { format, plugins };
})();
const plugins: PluginOption[] = (() => {
  /** Rollup type declaration files after emitting them. */
  const rollupTypes = true;
  const patchCssFiles: Plugin = (() => {
    /** Apply the plugin only for serve or build, or on certain conditions. */
    const apply = "build";
    const name = "patch-css";
    const writeBundle = () => {
      const filePath: PathOrFileDescriptor = resolve(
        resolve("dist", `${fileName}.js`),
      );
      writeFileSync(
        filePath,
        // `import "./${fileName}.css";\n${readFileSync(filePath, "utf-8")}`,
        `import "./index.css";\n${readFileSync(filePath, "utf-8")}`,
      );
    };
    return { apply, name, writeBundle };
  })();
  return [pluginVue(), dts({ rollupTypes }), patchCssFiles];
})();
export default defineConfig({ base, build, plugins, worker });
