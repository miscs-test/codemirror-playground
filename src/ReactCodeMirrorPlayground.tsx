import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { sql } from '@codemirror/lang-sql';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

const myTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#ffffff',
    backgroundImage: '',
    foreground: '#75baff',
    caret: '#5d00ff',
    selection: '#036dd626',
    selectionMatch: '#036dd626',
    lineHighlight: '#8a91991a',
    gutterBackground: '#fff',
    gutterForeground: '#8a919966',
  },
  styles: [
    { tag: t.comment, color: '#787b8099' },
    { tag: t.variableName, color: '#0080ff' },
    { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
    { tag: t.number, color: '#5c6166' },
    { tag: t.bool, color: '#5c6166' },
    { tag: t.null, color: '#5c6166' },
    { tag: t.keyword, color: '#5c6166' },
    { tag: t.operator, color: '#5c6166' },
    { tag: t.className, color: '#5c6166' },
    { tag: t.definition(t.typeName), color: '#5c6166' },
    { tag: t.typeName, color: '#5c6166' },
    { tag: t.angleBracket, color: '#5c6166' },
    { tag: t.tagName, color: '#5c6166' },
    { tag: t.attributeName, color: '#5c6166' },
  ],
});

function CodeMirror_() {
  const [value, setValue] = React.useState("console.log('hello world!');");

  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);

  const onUpdate = React.useCallback((e) => {
    // console.log('onUpdate:', e);
    console.log({'update-timestamp': new Date()})
    console.log({'selection:': e.state.selection.ranges[0]})
  }, [])

  return (
    <CodeMirror
      // theme={okaidia}
      theme={myTheme}
      value={value}
      height="200px"
      // extensions={[javascript({ jsx: true })]}
      extensions={[sql()]}
      onChange={onChange}
      onUpdate={onUpdate}
    />
  );
}

const CodeMirrorMemo = React.memo(CodeMirror_);

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count => count + 1);
    }, 3000)
    return () => clearInterval(intervalId);
  }, [])

  return <CodeMirrorMemo/>
}

export default App;
