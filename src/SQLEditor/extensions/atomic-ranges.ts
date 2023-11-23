import {
  Decoration,
  MatchDecorator,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';

class PlaceholderWidget extends WidgetType {
  constructor(readonly content: string) {
    super();
  }

  eq(other: PlaceholderWidget) {
    return other.content == this.content;
  }

  toDOM() {
    let wrap = document.createElement('span');
    wrap.innerText = this.content;
    wrap.style.backgroundColor = 'red';
    // wrap.setAttribute('aria-hidden', 'true');
    // wrap.className = 'cm-boolean-toggle';
    // let box = wrap.appendChild(document.createElement('input'));
    // box.type = 'checkbox';
    // box.checked = this.checked;
    return wrap;
  }

  ignoreEvent() {
    return true;
  }
}

const placeholderMatcher = new MatchDecorator({
  regexp: /\[\[(\w+)\]\]/g,
  decoration: (match) =>
    Decoration.replace({
      widget: new PlaceholderWidget(match[1]),
    }),
});

export const placeholders = ViewPlugin.fromClass(
  class {
    placeholders: DecorationSet;
    constructor(view: EditorView) {
      this.placeholders = placeholderMatcher.createDeco(view);
    }
    update(update: ViewUpdate) {
      this.placeholders = placeholderMatcher.updateDeco(
        update,
        this.placeholders
      );
    }
  },
  {
    decorations: (instance) => instance.placeholders,
    provide: (plugin) =>
      EditorView.atomicRanges.of((view) => {
        return view.plugin(plugin)?.placeholders || Decoration.none;
      }),
  }
);
