// the original code is copied from https://github.com/codemirror/view/blob/main/src/placeholder.ts
import { MergeView } from '@codemirror/merge';
import { EditorState, Extension } from '@codemirror/state';
import { Rect, ViewPlugin, lineNumbers } from '@codemirror/view';
import { Decoration, DecorationSet, WidgetType } from '@codemirror/view';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
// import { clientRectsFor, flattenRect } from '@codemirror/view';

let doc = `one
two
three
four
five`;

class Placeholder extends WidgetType {
  constructor(readonly content: string) {
    super();
  }

  toDOM() {
    let wrap = document.createElement('div');

    let view = new MergeView({
      a: {
        doc,
        extensions: [
          basicSetup,
          lineNumbers({
            formatNumber: (lineNo, state) => {
              return String(lineNo+9);
              // return lineNo + 1 + state.doc.lineAt(lineNo).from;
            },
          }),
        ],
      },
      b: {
        doc: doc.replace(/t/g, 'T') + '\nSix',
        extensions: [
          basicSetup,
          EditorView.editable.of(false),
          EditorState.readOnly.of(true),
          lineNumbers({
            formatNumber: (lineNo, state) => {
              return String(lineNo+9);
              // return lineNo + 1 + state.doc.lineAt(lineNo).from;
            },
          }),
        ],
      },
      gutter: false,
      // revertControls: 'b-to-a',
      parent: wrap,
    });

    // wrap.appendChild(
    //   typeof this.content == 'string'
    //     ? document.createTextNode(this.content)
    //     : this.content
    // );
    // if (typeof this.content == 'string')
    //   wrap.setAttribute('aria-label', 'placeholder ' + this.content);
    // else wrap.setAttribute('aria-hidden', 'true');
    return wrap;
  }

  // export function flattenRect(rect: Rect, left: boolean) {
  //   let x = left ? rect.left : rect.right
  //   return {left: x, right: x, top: rect.top, bottom: rect.bottom}
  // }

  // coordsAt(dom: HTMLElement) {
  //   // let rects = dom.firstChild ? clientRectsFor(dom.firstChild) : [];
  //   let rects = dom.firstChild ? dom.getClientRects() : [];
  //   if (!rects.length) return null;
  //   let style = window.getComputedStyle(dom.parentNode as HTMLElement);
  //   // let rect = flattenRect(rects[0], style.direction != 'rtl');
  //   // let rect = {left: rects[0].left, right: rects[0].left, top: rects[0].top, bottom: rects[0].bottom}
  //   let rect = rects[0]
  //   let lineHeight = parseInt(style.lineHeight);
  //   if (rect.bottom - rect.top > lineHeight * 1.5)
  //     return {
  //       left: rect.left,
  //       right: 400,
  //       top: rect.top,
  //       bottom: rect.top + lineHeight,
  //     };
  //   return {
  //     ...rect,
  //     left: 0
  //   };
  // }

  // get estimatedHeight(): number {
  //   return 100;
  // }

  ignoreEvent() {
    return true;
  }

  // get lineBreaks(): number {
  //   return 3;
  // }
}

/// Extension that enables a placeholder—a piece of example content
/// to show when the editor is empty.
export function customPlaceholder(content: string): Extension {
  return ViewPlugin.fromClass(
    class {
      placeholder: DecorationSet;

      constructor(readonly view: EditorView) {
        const line = view.state.doc.line(9);

        this.placeholder = content
          ? Decoration.set([
              Decoration.widget({
                widget: new Placeholder(content),
                side: 1,
                // block: true,
              }).range(line.to),
            ])
          : Decoration.none;
      }

      update!: () => void; // Kludge to convince TypeScript that this is a plugin value

      get decorations() {
        return this.placeholder;
        // return this.view.state.doc.length ? Decoration.none : this.placeholder;
      }
    },
    { decorations: (v) => v.decorations }
  );
}
