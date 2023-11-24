import React, { useRef, useEffect } from 'react';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState, Prec, EditorSelection } from '@codemirror/state';
import { sql } from '@codemirror/lang-sql'; // 引入语言包
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { zebraStripes } from './extensions/zebra-stripes';
import { toggleWith } from './extensions/toggle-with';
import { autoLanguage, languageConf } from './extensions/auto-language';
import { underlineKeymap } from './extensions/underline-cmd';
import { checkboxPlugin } from './extensions/boolean-toogle';
import { placeholders } from './extensions/atomic-ranges';
import { fullWidthLinter } from './extensions/full-width-lint';
import { jsExts } from './extensions/jsdoc-completion';
import { emptyLineGutter } from './extensions/emptyline-gutter';
import { helpPanel } from './extensions/help-panel';
import { docSizePlugin } from './extensions/doc-len';
import { myTheme } from './extensions/theme';
import { curSQLGutter } from './extensions/current-sql';
import { breakpointGutter } from './extensions/breakpoints';
import { breakpointGutter2 } from './extensions/highlight-cur-sql';

// const DOC = Array(20).fill('select * from test;').join('\n');
// const SQL_DOC = `
// /* Enter "USE {database};" to start exploring your data.
//    Type "-- your question" followed by the "ENTER" key to try out AI-generated SQL queries.*/
// USE sp500insight;
// SELECT sector, industry, COUNT(*) AS companies
// FROM companies c
// WHERE c.stock_symbol IN (SELECT stock_symbol FROM index_compositions WHERE index_symbol = "SP500；")
// GROUP BY sector, industry。
// ORDER BY sector, companies DESC LIMIT 10;；，
// `;

// const JS_DOC = `
// /** complete tags here
//     @pa
//  */
// `;

const SQL_DOC = `
/*
this is a block comment
*/

use test;

select * from test.tt /* this is a line comment */
limit 100;  /* this is another line comment */

`;

const SQLEditor: React.FC = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstRef = useRef<EditorView>();

  useEffect(() => {
    const state = EditorState.create({
      // doc: SQL_DOC,
      doc: SQL_DOC,
      extensions: [
        basicSetup,

        sql(), // 在extensions中配置语言
        // languageConf.of(sql()),
        // autoLanguage,

        // jsExts,

        // zebraStripes({ step: 4 }),
        EditorView.lineWrapping,
        toggleWith(
          'Mod-o',
          EditorView.editorAttributes.of({
            style: 'background: yellow',
          })
        ),
        // Mod-o is cmd+o
        underlineKeymap,
        checkboxPlugin,
        placeholders,
        fullWidthLinter,

        // emptyLineGutter,
        helpPanel(),
        docSizePlugin,
        // myTheme,
        curSQLGutter,
        // breakpointGutter,
        // breakpointGutter2,
      ],
    });

    const editor = new EditorView({
      state,
      parent: editorContainerRef.current!,
    });
    editorInstRef.current = editor;

    return () => {
      editor.destroy();
    };
  }, []);

  function clickTest() {
    if (!editorInstRef.current) return;

    const view = editorInstRef.current;
    // view.dispatch({ selection: { anchor: 2 } });

    // view.dispatch({
    //   selection: EditorSelection.create([
    //     EditorSelection.range(4, 5),
    //     EditorSelection.range(6, 7),
    //     EditorSelection.cursor(8)
    //   ], 1)
    // })

    // view.dispatch({
    //   changes: { from: 10, insert: '*' },
    //   selection: { anchor: 11 },
    // });

    // Insert text at the start of the document
    view.dispatch({
      changes: { from: 0, insert: '#!/usr/bin/env node\n' },
      selection: { anchor: 11 },
    });

    let text = view.state.doc.toString();
    console.log({ text });
  }

  return (
    <div>
      <div>
        <button onClick={clickTest}>test</button>
      </div>
      <div style={{ height: 200 }} ref={editorContainerRef}></div>
    </div>
  );
};

export default SQLEditor;
