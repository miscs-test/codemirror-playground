import { acceptChunk, rejectChunk, unifiedMergeView } from '@codemirror/merge';
import { Compartment, Prec } from '@codemirror/state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  WidgetType,
  keymap,
} from '@codemirror/view';

const copilotPluginCompartment = new Compartment();
const unifiedMergeViewCompartment = new Compartment();

const copilotKeyMaps = Prec.highest(
  keymap.of([
    {
      key: 'Mod-i',
      run: (view) => {
        if (copilotPluginCompartment.get(view.state) == copilotPlugin) {
          view.dispatch({
            effects: copilotPluginCompartment.reconfigure([]),
          });
        } else {
          view.dispatch({
            effects: copilotPluginCompartment.reconfigure(copilotPlugin),
          });
        }
        return true;
      },
    },
  ])
);

const copilotTheme = EditorView.baseTheme({
  '.cm-copilot-root': {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '8px',
    maxWidth: '400px',
    boxShadow: '0 0 5px #ddd',
    marginTop: '8px',
    marginBottom: '-12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  '.cm-copilot-root input': {
    padding: '4px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    caretColor: 'blue',
  },
  '.cm-copilot-btns': {
    display: 'flex',
    gap: '8px',
  },
});

function replaceSelectedContent(view: EditorView, content: string) {
  const { from, to } = view.state.selection.main;
  const oriDoc = view.state.doc.toString();

  view.dispatch({
    changes: { from, to, insert: content },
    selection: { anchor: from + content.length },
  });

  view.dispatch({
    effects: unifiedMergeViewCompartment.reconfigure(
      unifiedMergeView({
        original: oriDoc,
        highlightChanges: true,
        gutter: false,
        syntaxHighlightDeletions: true,
        mergeControls: false,
      })
    ),
  });
}

class CopilotWidget extends WidgetType {
  constructor(readonly view: EditorView) {
    super();
  }

  toDOM() {
    let form = document.createElement('form');
    form.className = 'cm-copilot-root';
    form.onsubmit = (e) => {
      e.preventDefault();
      replaceSelectedContent(this.view, input.value);
    };

    let input = document.createElement('input');
    input.placeholder = 'Replace with ...';
    form.appendChild(input);

    let btnsContainer = document.createElement('div');
    btnsContainer.className = 'cm-copilot-btns';
    form.appendChild(btnsContainer);

    let replaceBtn = document.createElement('button');
    replaceBtn.innerText = 'Replace';
    replaceBtn.style.display = 'none';
    btnsContainer.appendChild(replaceBtn);

    let acceptBtn = document.createElement('button');
    acceptBtn.innerText = 'Accept';
    acceptBtn.type = 'button';
    acceptBtn.onclick = () => {
      acceptChunk(this.view);
      this.view.dispatch({
        effects: copilotPluginCompartment.reconfigure([]),
      });
    };
    btnsContainer.appendChild(acceptBtn);

    let rejectBtn = document.createElement('button');
    rejectBtn.innerText = 'Reject';
    acceptBtn.type = 'button';
    rejectBtn.onclick = () => {
      rejectChunk(this.view);
      this.view.dispatch({
        effects: copilotPluginCompartment.reconfigure([]),
      });
    };
    btnsContainer.appendChild(rejectBtn);

    setTimeout(() => {
      input.focus();
    }, 100);

    return form;
  }

  ignoreEvent() {
    // when true, widget handles events by self and stop propagation
    // when false, let copilotPlugin to handle events in the `eventHandlers`
    return true;
  }
}

const copilotPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      const sel = view.state.selection.main;
      const line = view.state.doc.lineAt(sel.from);
      let pos = line.from - 1;
      if (pos < 0) pos = 0;

      this.decorations = Decoration.set([
        Decoration.widget({
          widget: new CopilotWidget(view),
          side: 1,
        }).range(pos),
      ]);
    }

    update!: () => void; // Kludge to convince TypeScript that this is a plugin value
  },
  {
    decorations: (v) => v.decorations,

    // eventHandlers: {
    //   mousedown: (e, view) => {
    //     console.log('mousedown', e);
    //     let target = e.target as HTMLElement;
    //     if (target.nodeName == 'INPUT')
    //       // return toggleBoolean(view, view.posAtDOM(target));
    //       return true;
    //   },
    // },
  }
);

export function copilot() {
  return [
    copilotKeyMaps,
    copilotTheme,
    copilotPluginCompartment.of([]),
    unifiedMergeViewCompartment.of([]),
  ];
}
