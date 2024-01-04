// the original code is copied from https://github.com/codemirror/view/blob/main/src/placeholder.ts
import { Extension } from '@codemirror/state';
import { Rect, ViewPlugin } from '@codemirror/view';
import { Decoration, DecorationSet, WidgetType } from '@codemirror/view';
import { EditorView } from '@codemirror/view';
// import { clientRectsFor, flattenRect } from '@codemirror/view';

class Placeholder extends WidgetType {
  constructor(readonly content: string) {
    super();
  }

  toDOM() {
    let wrap = document.createElement('div');
    wrap.style.border = '1px solid #ddd';
    wrap.style.display = 'block';
    wrap.style.width = '400px';
    wrap.className = 'cm-placeholder';
    // wrap.style.pointerEvents = 'none';

    let input = document.createElement('input')
    input.style.width = '80%'
    wrap.appendChild(input)
    // input.onclick = (e) => {
    //   input.focus()
    // }
    let span = document.createElement('div');
    span.appendChild(document.createTextNode(this.content))
    wrap.appendChild(span)

    let button = document.createElement('button')
    button.innerText = 'click'
    button.onclick = function() {
      console.log(input.value)
    }
    wrap.appendChild(button)

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
