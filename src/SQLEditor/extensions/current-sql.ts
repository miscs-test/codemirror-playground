import { EditorView, gutter, GutterMarker, ViewUpdate } from '@codemirror/view';
import { StateField, StateEffect, RangeSet } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';

class SQLMarker extends GutterMarker {
  toDOM() {
    const el = document.createElement('div');
    el.style.background = 'red';
    el.style.height = '100%';
    return el;
  }
}
const sqlMarker = new SQLMarker();

type MarkSQLPayload = {
  from: number;
  to: number;
  SQLs: string[];
};
const markSQL = StateEffect.define<MarkSQLPayload>({
  map: (val, mapping) => ({
    from: mapping.mapPos(val.from),
    to: mapping.mapPos(val.to),
    SQLs: val.SQLs,
  }),
});

const sqlField = StateField.define<MarkSQLPayload>({
  create() {
    return { from: -1, to: -1, SQLs: [] };
  },
  update(value, tr) {
    for (let effect of tr.effects) {
      if (effect.is(markSQL)) return effect.value;
    }
    return value;
  },
});

const sqlGutter = gutter({
  class: 'cm-sql-gutter',
  initialSpacer: () => sqlMarker,
  lineMarker(view, line) {
    let { from, to } = view.state.field(sqlField);
    if (line.from >= from && line.from <= to) return sqlMarker;
    return null;
  },
  lineMarkerChange: () => true,
});

const sqlHighlighter = EditorView.updateListener.of((v: ViewUpdate) => {
  if (!v.selectionSet) return;
  let { state } = v.view,
    sel = state.selection.main;

  // console.log({ nodeSelFrom: sel.from, nodeSelTo: sel.to });

  // step 0
  // debounce

  // step 1
  // extend the selection, make the from start the line from, and to end the line to
  const newFrom = state.doc.lineAt(sel.from).from;
  const newTo = state.doc.lineAt(sel.to).to;
  // console.log({ newFrom, newTo });

  const effectPayload: MarkSQLPayload = { from: -1, to: -1, SQLs: [] };

  syntaxTree(state)
    .cursor()
    .iterate((node) => {
      // console.log({
      //   nodeName: node.name,
      //   nodeFrom: node.from,
      //   nodeTo: node.to,
      //   content: state.sliceDoc(node.from, node.to),
      // });
      if (node.name === 'Script') {
        // root node
        return true;
      }
      if (node.name === 'Statement') {
        if (node.to >= newFrom && node.from <= newTo) {
          const content = state.sliceDoc(node.from, node.to);
          // console.log('found it: ', content);
          if (content !== ';') {
            effectPayload.SQLs.push(content);
            if (effectPayload.from === -1) {
              effectPayload.from = node.from;
            }
            if (node.to > effectPayload.to) {
              effectPayload.to = node.to;
            }
          }
        }
      }
      return false;
    });

  // console.log({ effectPayload });
  v.view.dispatch({ effects: markSQL.of(effectPayload) });
});

export const curSQLGutter = [
  sqlGutter,
  sqlField,
  sqlHighlighter,
  EditorView.baseTheme({
    '.cm-sql-gutter .cm-gutterElement': {
      width: '4px',
    },
  }),
];
