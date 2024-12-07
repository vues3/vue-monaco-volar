import type { WorkerLanguageService } from "@volar/monaco/worker";
import type { App } from "vue";

import {
  activateAutoInsertion,
  activateMarkers,
  registerProviders,
} from "@volar/monaco";
import * as languageConfigs from "@vues3/monaco-volar-worker/src/language-configs";
import VueWorker from "@vues3/monaco-volar-worker/src/vue.worker?worker";
import { editor, languages } from "monaco-editor-core";
import EditorWorker from "monaco-editor-core/esm/vs/editor/editor.worker?worker";

import VMonacoVolar from "./VMonacoVolar.vue";

const getWorker = (workerId: string, label: string) =>
  label === "vue" ? new VueWorker() : new EditorWorker();
const languageId = ["vue", "javascript", "typescript", "css"];
const [label] = languageId;
const moduleId = "vs/language/vue/vueWorker";
const getSyncUris = () => editor.getModels().map(({ uri }) => uri);
const install = (app: App) => {
  window.MonacoEnvironment = { getWorker };
  ["vue", "js", "ts", "css"].forEach((value, index) => {
    const id = languageId[index];
    const extensions = [`.${value}`];
    languages.register({ extensions, id });
    languages.setLanguageConfiguration(
      id,
      languageConfigs[value as keyof typeof languageConfigs],
    );
  });
  const worker = editor.createWebWorker<WorkerLanguageService>({
    label,
    moduleId,
  });
  activateMarkers(worker, languageId, label, getSyncUris, editor);
  activateAutoInsertion(worker, languageId, getSyncUris, editor);
  registerProviders(worker, languageId, getSyncUris, languages).catch(() => {});
  app.component("VMonacoVolar", VMonacoVolar);
};
export default { install };
