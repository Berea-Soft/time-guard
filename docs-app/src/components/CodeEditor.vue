<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import type { LanguageSupport } from '@codemirror/language';

const props = defineProps<{
  files: Record<string, string>;
  activeFile?: string;
  readOnly?: boolean;
}>();

const emit = defineEmits<{
  'update:activeFile': [path: string];
  'file-change': [payload: { path: string; content: string }];
}>();

const editorRef = ref<HTMLDivElement | null>(null);
let editorView: EditorView | null = null;

/** Track file changes locally (overrides from props.files) */
const localEdits = ref<Record<string, string>>({});

// Sort files: main files first, then alphabetical
const fileList = computed(() => {
  const entries = Object.entries(props.files);
  const priority = (path: string): number => {
    if (path.includes('snippet.ts') || path.includes('main.')) {
      return 0;
    }
    if (path.includes('App.')) {
      return 1;
    }
    if (path.endsWith('.vue') || path.endsWith('.svelte')) {
      return 2;
    }
    return 3;
  };
  return entries
    .sort((a, b) => {
      const pa = priority(a[0]),
        pb = priority(b[0]);
      if (pa !== pb) {
        return pa - pb;
      }
      return a[0].localeCompare(b[0]);
    })
    .map(([path]) => path);
});

const selectedFile = ref(props.activeFile ?? fileList.value[0] ?? '');
const fileContent = computed(
  () =>
    localEdits.value[selectedFile.value] ??
    props.files[selectedFile.value] ??
    '',
);

// Filename for display
function displayName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

// Language support detection per file extension
function langForFile(path: string): LanguageSupport | undefined {
  if (path.endsWith('.ts') || path.endsWith('.tsx')) {
    return javascript({ typescript: true, jsx: path.endsWith('.tsx') });
  }
  if (path.endsWith('.js') || path.endsWith('.jsx')) {
    return javascript({ jsx: path.endsWith('.jsx') });
  }
  if (path.endsWith('.html') || path.endsWith('.htm')) {
    return html();
  }
  if (path.endsWith('.css')) {
    return css();
  }
  if (path.endsWith('.vue') || path.endsWith('.svelte')) {
    return html({ matchClosingTags: true, autoCloseTags: true });
  }
  if (path.endsWith('.json')) {
    return javascript();
  } // JSON as JS
  return undefined;
}

function getLanguageExtensions(): LanguageSupport[] {
  const lang = langForFile(selectedFile.value);
  return lang ? [lang] : [];
}

function initEditor(): void {
  if (!editorRef.value) {
    return;
  }
  destroyEditor();

  const extensions = [
    basicSetup,
    oneDark,
    keymap.of(defaultKeymap),
    EditorState.readOnly.of(props.readOnly ?? false),
    EditorView.editable.of(!(props.readOnly ?? false)),
    EditorView.updateListener.of((update) => {
      if (update.docChanged && !props.readOnly) {
        const newContent = update.state.doc.toString();
        // Store locally
        localEdits.value = {
          ...localEdits.value,
          [selectedFile.value]: newContent,
        };
        // Emit so parent can sync to sandpack
        emit('file-change', { path: selectedFile.value, content: newContent });
      }
    }),
    EditorView.theme({
      '&': { height: '100%', minHeight: '0' },
      '.cm-scroller': {
        height: '100%',
        overflow: 'auto',
        fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
        fontSize: '12.5px',
        lineHeight: '1.65',
      },
      '.cm-gutters': { borderRight: '1px solid rgba(75,85,99,0.3)' },
      '.cm-activeLine': { backgroundColor: 'transparent' },
    }),
    ...getLanguageExtensions(),
  ];

  const state = EditorState.create({
    doc: String(fileContent.value ?? ''),
    extensions,
  });

  editorView = new EditorView({
    state,
    parent: editorRef.value,
  });
}

function destroyEditor(): void {
  if (editorView) {
    editorView.destroy();
    editorView = null;
  }
}

function selectFile(path: string): void {
  selectedFile.value = path;
  emit('update:activeFile', path);
  nextTick(() => initEditor());
}

/** Reset local edits (e.g. when framework changes) */
function resetEdits(): void {
  localEdits.value = {};
}

defineExpose({ resetEdits });

// Rebuild editor when selected file changes
watch(selectedFile, () => {
  nextTick(() => initEditor());
});

// When files prop changes (framework switch), rebuild editor but PRESERVE localEdits.
// If the new framework doesn't have the previously selected file, switch to the new activeFile or default.
watch(
  () => props.files,
  (newFiles) => {
    if (!newFiles[selectedFile.value]) {
      selectedFile.value = props.activeFile ?? fileList.value[0] ?? '';
    }
    nextTick(() => initEditor());
  },
  { deep: true },
);

onMounted(() => {
  nextTick(() => initEditor());
});

onBeforeUnmount(() => {
  destroyEditor();
});
</script>

<template>
  <div
    class="flex flex-col h-full min-h-0 overflow-hidden bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-200"
  >
    <!-- File tabs (hidden if readOnly and only 1 file) -->
    <div
      v-if="!readOnly || fileList.length > 1"
      class="flex overflow-x-auto border-b shrink-0 dark:bg-slate-900/80 dark:border-slate-800/60 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700/50 scrollbar-thumb-rounded hover:scrollbar-thumb-slate-700/80"
    >
      <button
        v-for="path in fileList"
        :key="path"
        @click="selectFile(path)"
        :class="[
          'shrink-0 px-3 py-1.5 text-[11px] font-medium tracking-wide border-r transition-colors duration-150',
          selectedFile === path
            ? 'bg-slate-800 text-white border-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200'
            : 'bg-transparent text-slate-950 hover:text-white hover:bg-slate-800/50 dark:hover:bg-slate-700/50 border-slate-800/40 dark:border-slate-600/40 dark:text-slate-200/80',
        ]"
        :title="path"
      >
        {{ displayName(path) }}
      </button>
    </div>

    <!-- CodeMirror editor -->
    <div
      ref="editorRef"
      class="flex-1 min-h-0 overflow-auto bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-200"
    />
  </div>
</template>
