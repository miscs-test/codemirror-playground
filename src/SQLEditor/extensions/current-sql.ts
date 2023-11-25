import {
  EditorView,
  gutter,
  GutterMarker,
  ViewPlugin,
  ViewUpdate,
} from '@codemirror/view';
import { StateField, StateEffect, RangeSet } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
// import _ from 'lodash';

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
      if (effect.is(markSQL)) {
        // console.log('sqlField update', effect.value);
        return effect.value;
      }
    }
    return value;
  },
});
const curSQLLineField = StateField.define<RangeSet<SQLMarker>>({
  create() {
    return RangeSet.empty;
  },
  update(value, tr) {
    for (let effect of tr.effects) {
      if (effect.is(markSQL)) {
        // console.log('curSQLLineField update', effect.value);
        let v = RangeSet.empty;
        if (effect.value.from !== -1) {
          for (let i = effect.value.from; i <= effect.value.to; ) {
            const line = tr.state.doc.lineAt(i);
            v = v.update({ add: [sqlMarker.range(line.from)] });
            i = line.to + 1;
          }
        }
        // console.log({ vLen: v.size });
        return v;
      }
    }
    return value;
  },
});

const sqlGutter = gutter({
  class: 'cm-sql-gutter',
  initialSpacer: () => sqlMarker,
  markers: (view) => view.state.field(curSQLLineField),
  // lineMarker(view, line) {
  //   let { from, to } = view.state.field(sqlField);
  //   if (line.from >= from && line.from <= to) return sqlMarker;
  //   return null;
  // },
  // lineMarkerChange: () => true,
});

let timer: number | undefined;
const sqlHighlighter = EditorView.updateListener.of((v: ViewUpdate) => {
  // console.log('sqlHighlighter1')
  if (!v.selectionSet) return;
  // console.log('sqlHighlighter2')

  timer && clearTimeout(timer);
  timer = setTimeout(() => {
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
    console.log('------curSQL:', '\n' + effectPayload.SQLs.join('\n'));
    v.view.dispatch({ effects: markSQL.of(effectPayload) });
  }, 200);
});

const curSQLView = ViewPlugin.fromClass(
  class {
    private dom: HTMLElement;

    constructor(view: EditorView) {
      this.dom = view.dom.appendChild(document.createElement('div'));
      this.dom.style.cssText =
        'position: absolute; inset-block-start: 2px; inset-inline-end: 5px';
      // this.dom.textContent = view.state.doc.length + '';
      this.dom.textContent = view.state
        .field(sqlField)
        .SQLs.join(' | ')
        .slice(0, 200);
    }

    update(update: ViewUpdate) {
      this.dom.textContent = update.state
        .field(sqlField)
        .SQLs.join(' | ')
        .slice(0, 200);
      // if (update.selectionSet) {
      // }
      // if (update.docChanged)
      //   this.dom.textContent = update.state.doc.length + '';
    }

    destroy() {
      this.dom.remove();
    }
  }
);

export const curSQLGutter = [
  sqlGutter,
  sqlField,
  curSQLLineField,
  sqlHighlighter,
  EditorView.baseTheme({
    '.cm-sql-gutter .cm-gutterElement': {
      width: '2px',
    },
  }),
  // curSQLView,
];
