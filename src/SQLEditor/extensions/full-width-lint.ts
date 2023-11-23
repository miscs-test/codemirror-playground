import { syntaxTree } from '@codemirror/language';
import { linter, Diagnostic } from '@codemirror/lint';

export const regexpLinter = linter((view) => {
  let diagnostics: Diagnostic[] = [];
  syntaxTree(view.state)
    .cursor()
    .iterate((node) => {
      if (node.name == 'RegExp')
        diagnostics.push({
          from: node.from,
          to: node.to,
          severity: 'warning',
          message: 'Regular expressions are FORBIDDEN',
          actions: [
            {
              name: 'Remove',
              apply(view, from, to) {
                view.dispatch({ changes: { from, to } });
              },
            },
          ],
        });
    });
  return diagnostics;
});

export const fullWidthLinter = linter((view) => {
  let diagnostics: Diagnostic[] = [];
  const content = view.state.doc.toString();
  for (let i = 0; i < content.length; i++) {
    const char = content.charAt(i);
    // console.log({ char: char, charCode: char.charCodeAt(0) });
    if (char.charCodeAt(0) > 127) {
      // console.log('full width char');
      diagnostics.push({
        from: i,
        to: i + 1,
        severity: 'warning',
        message: 'full width char',
        actions: [
          {
            name: 'Fix',
            apply(view, from, to) {
              view.dispatch({
                changes: {
                  from,
                  to,
                  insert: String.fromCharCode(char.charCodeAt(0) - 65248),
                },
              });
            },
          },
        ],
      });
    }
  }

  return diagnostics;
});
