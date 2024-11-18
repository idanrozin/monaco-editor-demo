import Editor from '@monaco-editor/react';
import { useCallback, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';

const monacoConfig = async () => {
  // await loader.init();
  // Configure Python language features
  monaco.languages.register({ id: 'python' });
  monaco.languages.setMonarchTokensProvider('python', {
    defaultToken: '',
    tokenPostfix: '.python',

    keywords: [
      'and',
      'as',
      'assert',
      'break',
      'class',
      'continue',
      'def',
      'del',
      'elif',
      'else',
      'except',
      'exec',
      'finally',
      'for',
      'from',
      'global',
      'if',
      'import',
      'in',
      'is',
      'lambda',
      'not',
      'or',
      'pass',
      'print',
      'raise',
      'return',
      'try',
      'while',
      'with',
      'yield',
      'async',
      'await',
      'None',
      'True',
      'False',
    ],

    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.square' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' },
    ],

    tokenizer: {
      root: [
        { include: '@whitespace' },
        { include: '@numbers' },
        { include: '@strings' },

        [/[,:;]/, 'delimiter'],
        [/[{}\[\]()]/, '@brackets'],

        [/@[a-zA-Z]\w*/, 'tag'],
        [
          /[a-zA-Z]\w*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier',
            },
          },
        ],
      ],

      whitespace: [
        [/\s+/, 'white'],
        [/(^#.*$)/, 'comment'],
      ],

      numbers: [
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/\d+/, 'number'],
      ],

      strings: [
        [/'/, { token: 'string.quote', bracket: '@open', next: '@string_single' }],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string_double' }],
      ],

      string_single: [
        [/[^']+/, 'string'],
        [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
      ],

      string_double: [
        [/[^"]+/, 'string'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
      ],
    },
  });

  // Configure Python language completion
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model, position, context, token) => {
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

  // Simple Python syntax validation rules
  const pythonSyntaxRules = {
    checkIndentation: (line: string) => {
      const indentLevel = line.search(/\S/);
      return indentLevel % 4 === 0;
    },

    checkColonInBlock: (line: string) => {
      const blockStarters = /^[\s]*(if|for|while|def|class|else|elif|try|except|finally)\b(?!.*:)/;
      return !blockStarters.test(line);
    },

    checkParentheses: (text: string) => {
      const stack = [];
      const pairs = { '(': ')', '[': ']', '{': '}' };

      for (let char of text) {
        if ('([{'.includes(char)) {
          stack.push(char);
        } else if (')]}'.includes(char)) {
          if (stack.length > 0 && pairs[stack.pop() as keyof typeof pairs] !== char) {
            return false;
          }
          if (!stack.length) {
            return false;
          }
        }
      }
      return stack.length === 0;
    },
  };

  // Register diagnostics provider
  // monaco.languages.registerDiagnosticProvider('python', {
  //   provideDiagnostics: (model: monaco.editor.ITextModel) => {
  //     const text = model.getValue();
  //     const lines = text.split('\n');
  //     const problems = [];

  //     lines.forEach((line, index) => {
  //       // Skip empty lines
  //       if (!line.trim()) return;

  //       // Check indentation
  //       if (!pythonSyntaxRules.checkIndentation(line)) {
  //         problems.push({
  //           severity: monaco.MarkerSeverity.Error,
  //           startLineNumber: index + 1,
  //           startColumn: 1,
  //           endLineNumber: index + 1,
  //           endColumn: line.length + 1,
  //           message: 'Invalid indentation. Use 4 spaces per level.',
  //         });
  //       }

  //       // Check for missing colons in block statements
  //       if (!pythonSyntaxRules.checkColonInBlock(line)) {
  //         problems.push({
  //           severity: monaco.MarkerSeverity.Error,
  //           startLineNumber: index + 1,
  //           startColumn: 1,
  //           endLineNumber: index + 1,
  //           endColumn: line.length + 1,
  //           message: 'Missing colon after block statement',
  //         });
  //       }
  //     });

  //     // Check parentheses matching
  //     if (!pythonSyntaxRules.checkParentheses(text)) {
  //       problems.push({
  //         severity: monaco.MarkerSeverity.Error,
  //         startLineNumber: 1,
  //         startColumn: 1,
  //         endLineNumber: lines.length,
  //         endColumn: lines[lines.length - 1].length + 1,
  //         message: 'Mismatched parentheses, brackets, or braces',
  //       });
  //     }

  //     return {
  //       markers: problems,
  //       dispose: () => {},
  //     };
  //   },
  // });
};

interface CodeEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  height?: string | number;
}

export function CodeEditor({
  value,
  onChange,
  language = 'python',
  height = '500px',
}: CodeEditorProps) {
  const [isDark, setIsDark] = useState(true);
  const [isMonacoReady, setIsMonacoReady] = useState(false);

  // Initialize Monaco once when the component mounts
  useEffect(() => {
    loader.config({ monaco });
    monacoConfig()
      .then(() => {
        setIsMonacoReady(true);
      })
      .catch((error) => {
        console.error('Failed to initialize Monaco:', error);
      });
  }, []);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      onChange?.(value);
    },
    [onChange]
  );

  // Don't render the editor until Monaco is ready
  if (!isMonacoReady) {
    return <div>Loading editor...</div>; // Or your preferred loading state
  }

  return (
    <div className='w-full rounded-lg overflow-hidden border border-gray-700'>
      <div className='flex justify-end p-2 bg-gray-800'>
        <button
          onClick={() => setIsDark(!isDark)}
          className='px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm'
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      <Editor
        height={height}
        defaultLanguage={language}
        value={value}
        onMount={monacoConfig}
        onChange={handleEditorChange}
        theme={isDark ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          tabCompletion: 'on',
          quickSuggestions: true,
          formatOnType: true,
          formatOnPaste: true,
          renderValidationDecorations: 'on',
          // semanticHighlighting: true,
          hover: {
            enabled: true,
          },
          links: true,
        }}
      />
    </div>
  );
}
