<template>
  <div class="size-full" ref="monaco"></div>
</template>
<script setup lang="ts">
import type { Ref } from "vue";

import { registerHighlighter } from "@vues3/monaco-volar-worker/src/highlight";
import { getOrCreateModel } from "@vues3/monaco-volar-worker/src/utils";
import { editor, Uri } from "monaco-editor-core";
import uuid from "uuid-random";
import { onBeforeUnmount, onMounted, ref } from "vue";

const ambiguousCharacters = false;
const automaticLayout = true;
const fixedOverflowWidgets = true;
const scrollBeyondLastLine = false;
const unicodeHighlight = { ambiguousCharacters };
const { light: theme } = registerHighlighter();
const defaultOptions = {
  automaticLayout,
  fixedOverflowWidgets,
  scrollBeyondLastLine,
  theme,
  unicodeHighlight,
};
const props = withDefaults(
  defineProps<{
    id?: string;
    modelValue?: Promise<string> | string;
    options: editor.IStandaloneEditorConstructionOptions;
  }>(),
  {
    id: uuid(),
    modelValue: "",
    options: () => defaultOptions,
  },
);
const emit = defineEmits(["update:modelValue"]);
const monaco: Ref<HTMLElement | undefined> = ref();
let editorInstance: editor.IStandaloneCodeEditor | undefined;
const model = getOrCreateModel(
  Uri.parse(`file:///${props.id}.vue`),
  "vue",
  await props.modelValue,
);
onMounted(() => {
  if (monaco.value) {
    editorInstance = editor.create(monaco.value, {
      ...defaultOptions,
      ...props.options,
      model,
    });
    editorInstance.onDidChangeModelContent(() => {
      emit("update:modelValue", editorInstance?.getValue());
    });
    editorInstance.focus();
    const { _themeService: themeService } = editorInstance as unknown as Record<
      string,
      Record<string, Record<string, ((...args: never) => unknown) | boolean>>
    >;
    const { _theme: t } = themeService;
    t.semanticHighlighting = true;
    t.getTokenStyleMetadata = (type: string, modifiers: string[]) => {
      let foreground = 0;
      switch (type) {
        case "class":
          foreground = 11;
          break;
        case "function":
        case "method":
          foreground = 12;
          break;
        case "property":
        case "variable":
          foreground = modifiers.includes("readonly") ? 19 : 9;
          break;
        default:
      }
      return { foreground };
    };
  }
});
onBeforeUnmount(() => {
  editorInstance?.dispose();
});
</script>
<style scoped>
.size-full {
  height: 100%;
  width: 100%;
}
</style>
