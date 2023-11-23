import { EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';

export const docSizePlugin = ViewPlugin.fromClass(
  class {
    private dom: HTMLElement;

    constructor(view: EditorView) {
      this.dom = view.dom.appendChild(document.createElement('div'));
      this.dom.style.cssText =
        'position: absolute; inset-block-start: 2px; inset-inline-end: 5px';
      this.dom.textContent = view.state.doc.length + '';
    }

    update(update: ViewUpdate) {
      if (update.docChanged)
        this.dom.textContent = update.state.doc.length + '';
    }

    destroy() {
      this.dom.remove();
    }
  }
);
