<template>
  <div class="size-full" ref="monaco"></div>
</template>
<script setup lang="ts">
import type { Ref } from "vue";

import { registerHighlighter } from "@vues3/monaco-volar-worker/src/highlight";
import { getOrCreateModel } from "@vues3/monaco-volar-worker/src/utils";
import { editor, Uri } from "monaco-editor-core";
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    id?: string;
    modelValue?: Promise<string> | string;
    options: editor.IStandaloneEditorConstructionOptions;
  }>(),
  {
    id: "",
    modelValue: "",
    options: () => ({}),
  },
);
const emit = defineEmits(["update:modelValue"]);
const monaco: Ref<HTMLElement | undefined> = ref();
let editorInstance: editor.IStandaloneCodeEditor | undefined;
onMounted(async () => {
  editorInstance = await (async () => {
    const automaticLayout = true;
    const fixedOverflowWidgets = true;
    const model = getOrCreateModel(
      Uri.parse(`file:///${props.id}.vue`),
      "vue",
      await props.modelValue,
    );
    const scrollBeyondLastLine = false;
    const { light: theme } = registerHighlighter();
    const unicodeHighlight = (() => {
      const ambiguousCharacters = false;
      return { ambiguousCharacters };
    })();
    return (
      monaco.value &&
      editor.create(monaco.value, {
        ...{
          automaticLayout,
          fixedOverflowWidgets,
          model,
          scrollBeyondLastLine,
          theme,
          unicodeHighlight,
        },
        ...props.options,
      })
    );
  })();
  editorInstance?.onDidChangeModelContent(() => {
    emit("update:modelValue", editorInstance?.getValue());
  });
  editorInstance?.focus();
  // const { _themeService: themeService } = editorInstance as unknown as Record<
  //   string,
  //   Record<string, Record<string, ((...args: never) => unknown) | boolean>>
  // >;
  // const { _theme: t } = themeService;
  // t.semanticHighlighting = true;
  // t.getTokenStyleMetadata = (type: string, modifiers: string[]) => {
  //   let foreground = 0;
  //   switch (type) {
  //     case "class":
  //       foreground = 11;
  //       break;
  //     case "function":
  //     case "method":
  //       foreground = 12;
  //       break;
  //     case "property":
  //     case "variable":
  //       foreground = modifiers.includes("readonly") ? 19 : 9;
  //       break;
  //     default:
  //   }
  //   return { foreground };
  // };
  // Support for semantic highlighting
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, no-underscore-dangle, @typescript-eslint/no-unsafe-assignment
  const t = (editorInstance as any)._themeService._theme;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  t.semanticHighlighting = true;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  t.getTokenStyleMetadata = (type: string, modifiers: string[]) => {
    switch (type) {
      case "class":
        return { foreground: 11 };
      case "function":
      case "method":
        return { foreground: 12 };
      case "property":
      case "variable":
        return { foreground: modifiers.includes("readonly") ? 19 : 9 };
      default:
        return { foreground: 0 };
    }
  };
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
