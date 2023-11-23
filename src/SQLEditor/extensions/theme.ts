import { EditorView } from '@codemirror/view';

export let myTheme = EditorView.theme(
  {
    '&': {
      color: 'white',
      backgroundColor: '#034',
      // maxHeight: '600px',
      // minHeight: '300px',
    },
    '.cm-content, .cm-gutter': { minHeight: '400px' },
    '.cm-content': {
      caretColor: '#0e9',
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#0e9',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: '#074',
    },
    '.cm-gutters': {
      backgroundColor: '#045',
      color: '#ddd',
      border: 'none',
    },
  },
  { dark: true }
);
