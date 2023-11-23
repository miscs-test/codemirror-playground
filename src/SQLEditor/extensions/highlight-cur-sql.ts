import { StateField, StateEffect, RangeSet } from '@codemirror/state';
import { EditorView, GutterMarker, gutter } from '@codemirror/view';

const breakpointEffect = StateEffect.define<{ pos: number; on: boolean }>({
  map: (val, mapping) => ({ pos: mapping.mapPos(val.pos), on: val.on }),
});

const breakpointState = StateField.define<RangeSet<GutterMarker>>({
  create() {
    return RangeSet.empty;
  },
  update(set, transaction) {
    set = set.map(transaction.changes);
    for (let e of transaction.effects) {
      console.log({ e });
      if (e.is(breakpointEffect)) {
        console.log({ be: e });
        if (e.value.on)
          set = set.update({ add: [breakpointMarker.range(e.value.pos)] });
        else set = set.update({ filter: (from) => from != e.value.pos });
      }
    }
    console.log({ set });
    return set;
  },
});

function toggleBreakpoint(view: EditorView, pos: number) {
  let breakpoints = view.state.field(breakpointState);
  let hasBreakpoint = false;
  breakpoints.between(pos, pos, () => {
    hasBreakpoint = true;
  });
  view.dispatch({
    effects: breakpointEffect.of({ pos, on: !hasBreakpoint }),
  });
}

const breakpointMarker = new (class extends GutterMarker {
  toDOM() {
    const el = document.createElement('div');
    el.style.background = 'red';
    el.style.height = '100%';
    // el.appendChild(document.createTextNode(' '));
    return el;
    // return document.createElement('div').append(document.createTextNode(' '));
    // return document.createTextNode('💔');
  }
})();

export const breakpointGutter2 = [
  breakpointState,
  gutter({
    class: 'cm-sql-gutter',
    markers: (v) => v.state.field(breakpointState),
    initialSpacer: () => breakpointMarker,
    domEventHandlers: {
      mousedown(view, line) {
        toggleBreakpoint(view, line.from);
        return true;
      },
    },
  }),
  EditorView.baseTheme({
    '.cm-sql-gutter .cm-gutterElement': {
      width: '8px',
      // color: 'red',
      // paddingLeft: '5px',
      // cursor: 'default',
    },
  }),
];
