import {EditorState, Compartment} from "@codemirror/state"
import {htmlLanguage, html} from "@codemirror/lang-html"
import {language} from "@codemirror/language"
import {javascript} from "@codemirror/lang-javascript"
import { sql } from '@codemirror/lang-sql';

export const languageConf = new Compartment

export const autoLanguage = EditorState.transactionExtender.of(tr => {
  if (!tr.docChanged) return null
  let docIsHTML = /^\s*</.test(tr.newDoc.sliceString(0, 100))
  let stateIsHTML = tr.startState.facet(language) == htmlLanguage
  if (docIsHTML == stateIsHTML) return null
  return {
    // effects: languageConf.reconfigure(docIsHTML ? html() : javascript())
    effects: languageConf.reconfigure(docIsHTML ? html() : sql())
  }
})
