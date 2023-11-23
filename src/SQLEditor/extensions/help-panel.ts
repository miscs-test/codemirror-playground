import { EditorView, showPanel, Panel, keymap } from '@codemirror/view';
import { StateField, StateEffect } from '@codemirror/state';

const toggleHelp = StateEffect.define<boolean>();

const helpPanelState = StateField.define<boolean>({
  create: () => false,
  update(value, tr) {
    for (let e of tr.effects) if (e.is(toggleHelp)) value = e.value;
    return value;
  },
  provide: (f) => showPanel.from(f, (on) => (on ? createHelpPanel : null)),
});

function createHelpPanel(view: EditorView) {
  let dom = document.createElement('div');
  dom.textContent = 'F1: Toggle the help panel';
  dom.className = 'cm-help-panel';
  return { top: true, dom };
}

const helpKeymap = [
  {
    key: 'F1',
    run(view: EditorView) {
      view.dispatch({
        effects: toggleHelp.of(!view.state.field(helpPanelState)),
      });
      return true;
    },
  },
];

const helpTheme = EditorView.baseTheme({
  '.cm-help-panel': {
    padding: '5px 10px',
    backgroundColor: '#fffa8f',
    fontFamily: 'monospace',
  },
});

export function helpPanel() {
  return [helpPanelState, keymap.of(helpKeymap), helpTheme];
}
