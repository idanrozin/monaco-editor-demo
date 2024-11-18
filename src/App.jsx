import { useState } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

import './App.css';

const monacoConfig = async () => {
  await loader.init();

  // Configure Python language features
  monaco.languages.register({ id: 'custom-python' });
  monaco.languages.setMonarchTokensProvider('custom-python', {
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
  monaco.languages.registerCompletionItemProvider('custom-python', {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        {
          label: 'def',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'def ${1:function_name}(${2:parameters}):\n\t${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Define a new function',
        },
        {
          label: 'class',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'class ${1:ClassName}:\n\tdef __init__(self):\n\t\t${2:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Define a new class',
        },
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'if ${1:condition}:\n\t${2:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If statement',
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'for ${1:item} in ${2:items}:\n\t${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'For loop',
        },
      ];

      return suggestions;
    },
  });
};

monacoConfig();

function App() {
  const [code, setCode] = useState(`# Write your code here
def example():
  print("Hello, Monaco!")

`);

  return (
    <div className='min-h-[calc(100vh-64  px)] p-8 bg-gray-900'>
      <div className='w-full mx-auto space-y-6'>
        <h1 className='text-3xl font-bold text-white'>Monaco Editor Example</h1>
        <CodeEditor
          value={code}
          onChange={setCode}
          language='custom-python'
          height='calc(100vh - 500px)'
        />
        <div className='p-4 bg-gray-800 rounded-lg'>
          <h2 className='text-xl font-semibold text-white mb-2'>Current Code:</h2>
          <pre className='text-gray-300 overflow-auto max-h-[200px]'>
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
