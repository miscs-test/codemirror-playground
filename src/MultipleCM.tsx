// myCodemirror.tsx
import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useLayoutEffect,
} from 'react';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { sql } from '@codemirror/lang-sql'; // 引入语言包
import { oneDark } from '@codemirror/theme-one-dark';

const FILES = [
  'select * from file1 limit 1;',
  'select * from file2 limit 2;',
  'select * from file3 limit 3;',
];

const CodeMirror: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFile, setActiveFile] = useState(0);

  const editors = useMemo(() => {
    return FILES.map((doc) => {
      const state = EditorState.create({
        doc,
        extensions: [
          basicSetup,
          sql(),
          // oneDark,
          // EditorView.updateListener.of((v) => {
          //   console.log(v.state.doc.toString());
          // }),
        ],
      });

      const editor = new EditorView({
        state,
      });
      return editor;
    });
  }, []);

  function handleNavClick(index: number) {
    setActiveFile(index);
  }

  useLayoutEffect(() => {
  // useEffect(() => {
    console.log('activeFile changes in useLayoutEffect', activeFile)

    if (!editorRef.current) {
      return;
    }

    const editor = editors[activeFile];
    editorRef.current.appendChild(editor.dom);

    return () => {
      editorRef.current?.removeChild(editor.dom);
    };
  }, [activeFile]);

  useEffect(() => {
    console.log('activeFile changes in useEffect', activeFile)
  }, [activeFile])

  return (
    <div>
      <nav>
        <button onClick={() => handleNavClick(0)}>file 1</button>
        <button onClick={() => handleNavClick(1)}>file 2</button>
        <button onClick={() => handleNavClick(2)}>file 3</button>
      </nav>
      <div style={{ height: 200 }} ref={editorRef}></div>;
    </div>
  );
};

export default CodeMirror;
