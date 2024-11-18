import Editor from '@monaco-editor/react';
import { useCallback, useState } from 'react';
import * as monaco from 'monaco-editor';

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

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      onChange?.(value);
    },
    [onChange]
  );

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    // Enable Python-specific features
    if (language === 'python') {
      editor.updateOptions({
        suggest: {
          snippetsPreventQuickSuggestions: false,
        },
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true,
        },
        parameterHints: {
          enabled: true,
        },
        // semanticHighlighting: {
        //   enabled: true,
        // },
      });
    }
  };

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
        onChange={handleEditorChange}
        // onMount={handleEditorDidMount}
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
        }}
      />
    </div>
  );
}
