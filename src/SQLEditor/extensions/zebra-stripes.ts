import {EditorView} from "@codemirror/view"
import {Facet} from "@codemirror/state"
import {Extension} from "@codemirror/state"
import {Decoration} from "@codemirror/view"
import {RangeSetBuilder} from "@codemirror/state"
import {ViewPlugin, DecorationSet, ViewUpdate} from "@codemirror/view"

//----------

const baseTheme = EditorView.baseTheme({
  "&light .cm-zebraStripe": {backgroundColor: "#d4fafa"},
  "&dark .cm-zebraStripe": {backgroundColor: "#1a2727"}
})

//----------

const stepSize = Facet.define<number, number>({
  combine: values => values.length ? Math.min(...values) : 2
})

//----------

const stripe = Decoration.line({
  attributes: {class: "cm-zebraStripe"}
})

function stripeDeco(view: EditorView) {
  let step = view.state.facet(stepSize)
  let builder = new RangeSetBuilder<Decoration>()
  for (let {from, to} of view.visibleRanges) {
    for (let pos = from; pos <= to;) {
      let line = view.state.doc.lineAt(pos)
      if ((line.number % step) == 0)
        builder.add(line.from, line.from, stripe)
      pos = line.to + 1
    }
  }
  return builder.finish()
}

const showStripes = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = stripeDeco(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged)
      this.decorations = stripeDeco(update.view)
  }
}, {
  decorations: v => v.decorations
})

//----------

export function zebraStripes(options: {step?: number} = {}): Extension {
  return [
    baseTheme,
    options.step == null ? [] : stepSize.of(options.step),
    showStripes
  ]
}
