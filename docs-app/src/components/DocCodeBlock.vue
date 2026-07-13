<script setup lang="ts">
import { inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { lineNumbers } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import type { LanguageSupport } from '@codemirror/language';
import { Copy, Check } from '@lucide/vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY) as I18nContext;

const props = defineProps<{ code: string }>();

const editorRef = ref<HTMLDivElement | null>(null);
let editorView: EditorView | null = null;
const copied = ref(false);

// Heuristic language detection from the raw snippet — docs examples don't
// carry a filename, only the code string, so we sniff its shape instead.
function detectLanguage(code: string): {
  lang: LanguageSupport;
  label: string;
} {
  const trimmed = code.trimStart();
  if (
    /^<(template|script|style|!doctype|html)/i.test(trimmed) ||
    /<template>/.test(code)
  ) {
    return {
      lang: html({ matchClosingTags: true, autoCloseTags: true }),
      label: 'markup',
    };
  }
  if (
    /^\s*[.#]?[\w-]+\s*\{[^{}]*:[^{}]*;/.test(trimmed) &&
    !/\b(import|function|const|class|export)\b/.test(code)
  ) {
    return { lang: css(), label: 'css' };
  }
  return {
    lang: javascript({ typescript: true, jsx: /<[a-zA-Z]/.test(code) }),
    label: 'ts',
  };
}

function buildExtensions() {
  const { lang } = detectLanguage(props.code);
  return [
    lineNumbers(),
    oneDark,
    EditorState.readOnly.of(true),
    EditorView.editable.of(false),
    EditorView.lineWrapping,
    EditorView.theme({
      '&': { height: 'auto', backgroundColor: 'transparent' },
      '.cm-scroller': {
        fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
        fontSize: '12.5px',
        lineHeight: '1.65',
      },
      '.cm-gutters': {
        backgroundColor: 'transparent',
        borderRight: '1px solid rgba(148,163,184,0.15)',
      },
      '.cm-content': { padding: '12px 0' },
    }),
    lang,
  ];
}

function initEditor(): void {
  if (!editorRef.value) {
    return;
  }
  destroyEditor();
  editorView = new EditorView({
    state: EditorState.create({
      doc: props.code,
      extensions: buildExtensions(),
    }),
    parent: editorRef.value,
  });
}

function destroyEditor(): void {
  editorView?.destroy();
  editorView = null;
}

async function copyCode(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    console.error('Failed to copy code snippet.');
  }
}

onMounted(() => nextTick(initEditor));
onBeforeUnmount(destroyEditor);
watch(
  () => props.code,
  () => nextTick(initEditor),
);
</script>

<template>
  <div
    class="overflow-hidden border rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950"
  >
    <div
      class="flex items-center justify-between px-3 py-1.5 border-b bg-slate-100/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60"
    >
      <span
        class="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500"
        >{{ detectLanguage(code).label }}</span
      >
      <button
        @click="copyCode"
        class="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium rounded-md transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800/70"
      >
        <Check v-if="copied" class="w-3 h-3 text-emerald-500" />
        <Copy v-else class="w-3 h-3" />
        {{ copied ? t('doc_section.copied') : t('doc_section.copy') }}
      </button>
    </div>
    <div ref="editorRef" class="overflow-x-auto"></div>
  </div>
</template>
