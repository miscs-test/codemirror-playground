// myCodemirror.tsx
import React, { useRef, useEffect } from 'react';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { sql } from '@codemirror/lang-sql'; // 引入语言包
import { oneDark } from '@codemirror/theme-one-dark'
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';

// 自定义关键词函数
function myCompletions(context: CompletionContext) {
  let word = context.matchBefore(/\w*/) as any
  if (word.from === word.to && !context.explicit)
    return null
  return {
    from: word.from,
    options: [
      {label: "match", type: "keyword"},
      {label: "hello", type: "variable", info: "(World)"},
      {label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro"}
    ]
  }
}

const CodeMirror: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = EditorState.create({
      doc: 'hello world！',
      extensions: [
        basicSetup,
        sql(), // 在extensions中配置语言
        oneDark,
        EditorView.updateListener.of((v) => {
          console.log(v.state.doc.toString());
        }),
        autocompletion({ override: [myCompletions]})
      ],
    });

    const editor = new EditorView({
      state,
      parent: editorRef.current!,
    });

    return () => {
      editor.destroy();
    };
  }, []);

  return <div style={{height:200}} ref={editorRef}></div>;
};

export default CodeMirror;
