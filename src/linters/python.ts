import * as monaco from 'monaco-editor';
import { loadPyodide } from 'pyodide';
export const monacoConfig = async () => {
  // Configure Python language features
  monaco.languages.register({ id: 'python' });

  // Configure Python language completion
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (_model, _position, _context, _token) => {
      const suggestions = [
        // Built-in functions
        ...['print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple'].map(
          (fn) => ({
            label: fn,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: fn + '(${1})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Built-in function',
          })
        ),

        // Control flow keywords
        ...['if', 'else', 'elif', 'for', 'while', 'try', 'except', 'finally'].map((keyword) => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText:
            keyword === 'if'
              ? 'if ${1:condition}:\n\t${2}'
              : keyword === 'for'
                ? 'for ${1:item} in ${2:items}:\n\t${3}'
                : keyword === 'while'
                  ? 'while ${1:condition}:\n\t${2}'
                  : keyword === 'try'
                    ? 'try:\n\t${1}\nexcept ${2:Exception} as ${3:e}:\n\t${4}'
                    : keyword,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Control flow',
        })),

        // Common data structures
        {
          label: 'list_comprehension',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '[${1:expression} for ${2:item} in ${3:items}]',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'List comprehension',
        },
        {
          label: 'dict_comprehension',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '{${1:key}: ${2:value} for ${3:item} in ${4:items}}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Dictionary comprehension',
        },

        // Function and class definitions
        {
          label: 'def',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'def ${1:function_name}(${2:parameters}):\n\t${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Function definition',
        },
        {
          label: 'class',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'class ${1:ClassName}:\n\tdef __init__(self):\n\t\t${2:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Class definition',
        },
      ];

      return { suggestions } as monaco.languages.ProviderResult<monaco.languages.CompletionList>;
    },
  });

  // not working as monaco is 💩
  monaco.languages.registerDocumentFormattingEditProvider('python', {
    async provideDocumentFormattingEdits(model) {
      const code = model.getValue();

      try {
        const pyodide = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });

        try {
          // Try to parse the code without executing it
          await pyodide.runPythonAsync(`
            import ast
            try:
                ast.parse('''${code}''')
            except SyntaxError as e:
                raise e
          `);

          // If we get here, there are no syntax errors
          monaco.editor.setModelMarkers(model, 'python-validator', []);
        } catch (error) {
          // Parse the error message to get line and column information
          const errorMsg = (error as Error).message;
          const lineMatch = errorMsg.match(/line (\d+)/);
          const line = lineMatch ? parseInt(lineMatch[1]) : 1;

          monaco.editor.setModelMarkers(model, 'python-validator', [
            {
              severity: monaco.MarkerSeverity.Error,
              startLineNumber: line,
              startColumn: 1,
              endLineNumber: line,
              endColumn: model.getLineLength(line) + 1,
              message: errorMsg,
              source: 'Python Syntax Checker',
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to initialize Pyodide:', error);
        monaco.editor.setModelMarkers(model, 'python-validator', []);
      }

      return [];
    },
  });
};
