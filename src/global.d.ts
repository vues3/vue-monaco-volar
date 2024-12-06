import type { Environment } from "monaco-editor-core";

declare global {
  interface Window {
    MonacoEnvironment?: Environment | undefined;
  }
}
