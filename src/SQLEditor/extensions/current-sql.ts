// import { EditorView, gutter, GutterMarker } from '@codemirror/view';

// const curSQLMarker = new (class extends GutterMarker {
//   toDOM() {
//     return document.createTextNode(' ');
//   }
// })();

// export const curSQLGutter = [
//   gutter({
//     class: 'cm-cur-sql-gutter',
//     initialSpacer: () => curSQLMarker,
//     lineMarker(view, line, otherMarkers) {
//       if (otherMarkers.some((m) => m == curSQLMarker)) return curSQLMarker;
//       return null;
//     },
//   }),
//   EditorView.baseTheme({
//     '.cm-cur-sql-gutter .cm-gutterElement': {
//       background: 'red',
//       width: '2px',
//     },
//   }),
// ];
import { EditorView, gutter, GutterMarker, ViewUpdate } from '@codemirror/view';
import {
  StateField,
  StateEffect,
  StateEffectType,
  EditorSelection,
  RangeSet,
} from '@codemirror/state';

class SQLMarker extends GutterMarker {
  toDOM() {
    return document.createTextNode('a');
  }
}
const sqlMarker = new SQLMarker();

const markSQL = StateEffect.define<{ from: number; to: number }>({
  map: (val, mapping) => ({
    from: mapping.mapPos(val.from),
    to: mapping.mapPos(val.to),
  }),
});
// const breakpointEffect = StateEffect.define<{pos: number, on: boolean}>({
//   map: (val, mapping) => ({pos: mapping.mapPos(val.pos), on: val.on})
// })

const breakpointState = StateField.define<RangeSet<GutterMarker>>({
  create() {
    return RangeSet.empty;
  },
  update(set, transaction) {
    // set = set.map(transaction.changes);
    // for (let e of transaction.effects) {
    //   if (e.is(breakpointEffect)) {
    //     if (e.value.on)
    //       set = set.update({ add: [breakpointMarker.range(e.value.pos)] });
    //     else set = set.update({ filter: (from) => from != e.value.pos });
    //   }
    // }
    // let newSet = RangeSet.empty;
    // for (let effect of transaction.effects) {
    //   if (effect.is(markSQL)) {
    //     newSet = newSet.update({
    //       add: [sqlMarker.range(effect.value.from, effect.value.to)],
    //     });
    //   }
    // }
    // return newSet;
    console.log({ set });
    return set;
  },
});

const sqlField = StateField.define({
  create() {
    return { from: 0, to: 0 };
  },
  update(value, tr) {
    for (let effect of tr.effects) {
      if (effect.is(markSQL)) return effect.value;
    }
    return value;
  },
  // provide: f => EditorView.decorations.from(f, ({from, to}) => {
  //   return {widget: new SQLMarker(), range: from};
  // })
});

const sqlGutter = gutter({
  class: 'cm-sql-gutter',
  initialSpacer: () => sqlMarker,
  // markers: (view) => view.state.field(breakpointState),
  lineMarker(view, line) {
    console.log({ lineFrom: line.from, lineTo: line.to });
    let { from, to } = view.state.field(sqlField);
    console.log({ from, to });
    if (line.from >= from && line.to <= to + 1 && line.from !== line.to)
      return sqlMarker;
    return null;
  },
  lineMarkerChange: () => true,
});

const sqlHighlighter = EditorView.updateListener.of((v: ViewUpdate) => {
  if (!v.selectionSet) return;
  let { state } = v.view,
    sel = state.selection.main,
    doc = state.doc,
    content = doc.toString();

  console.log({ sel });
  console.log({ content });

  let sqlStart = content.lastIndexOf(';', sel.from) + 1;
  let sqlEnd = content.indexOf(';', sel.to);

  // let sqlStart = doc.lastIndexOf(';', sel.from) + 1;
  // let sqlEnd = doc.indexOf(';', sel.to);

  if (sqlEnd < 0) sqlEnd = doc.length;
  console.log({ sqlStart, sqlEnd });
  v.view.dispatch({ effects: markSQL.of({ from: sqlStart, to: sqlEnd }) });
});

export const curSQLGutter = [
  sqlGutter,
  sqlField,
  sqlHighlighter,
  EditorView.baseTheme({
    '.cm-sql-gutter .cm-gutterElement': {
      // background: 'red',
      width: '12px',
    },
  }),
];
