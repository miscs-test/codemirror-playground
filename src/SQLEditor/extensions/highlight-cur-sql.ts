import {
  StateField,
  StateEffect,
  RangeSet,
  Extension,
} from '@codemirror/state';
import { EditorView, GutterMarker, gutter } from '@codemirror/view';

const breakpointEffect = StateEffect.define<{ pos: number; on: boolean }>({
  map: (val, mapping) => ({ pos: mapping.mapPos(val.pos), on: val.on }),
});

// const breakpointState = StateField.define<RangeSet<GutterMarker>>({
//   create() {
//     return RangeSet.empty;
//   },
//   update(set, transaction) {
//     set = set.map(transaction.changes);
//     for (let e of transaction.effects) {
//       console.log({ e });
//       if (e.is(breakpointEffect)) {
//         console.log({ be: e });
//         if (e.value.on)
//           set = set.update({ add: [breakpointMarker.range(e.value.pos)] });
//         else set = set.update({ filter: (from) => from != e.value.pos });
//       }
//     }
//     console.log({ set });
//     return set;
//   },
// });

const breakpointState2 = StateField.define<number[]>({
  create() {
    return [];
  },
  update(value, transaction) {
    for (let e of transaction.effects) {
      if (e.is(breakpointEffect)) {
        if (e.value.on) {
          // value.push(e.value.pos);
          value = value.concat(e.value.pos);
        } else {
          value = value.filter((v) => v != e.value.pos);
          // value.splice(value.indexOf(e.value.pos), 1);
        }
      }
    }
    return value;
  },
});

function toggleBreakpoint(view: EditorView, pos: number) {
  let breakpoints = view.state.field(breakpointState2);
  let hasBreakpoint = false;
  if (breakpoints.includes(pos)) hasBreakpoint = true;
  // breakpoints.between(pos, pos, () => {
  //   hasBreakpoint = true;
  // });
  console.log({hasBreakpoint, pos})
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
  breakpointState2,
  gutter({
    class: 'cm-sql-gutter',
    // markers: (v) => v.state.field(breakpointState),
    initialSpacer: () => breakpointMarker,
    lineMarker(view, line, otherMarkers) {
      const state = view.state.field(breakpointState2);
      console.log({state, lineFrom: line.from})
      if (state.includes(line.from)) return breakpointMarker;
      return null;
    },
    lineMarkerChange: () => true,
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

// function myExt(): Extension {
//   return { aa: 1 };
// }

// const ex: Extension = [StateFiled<string>.define({create: () => {return 'a'})];

// class TestEx {
//   get extension(): Extension {
//     return this;
//   }
// }

// const
// const ex: Extension = [new TestEx()];
