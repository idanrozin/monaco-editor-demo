import Editor from '@monaco-editor/react';
import { useCallback, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import { monacoConfig } from '../linters/python';

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
        onChange={handleEditorChange}
        theme={isDark ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: true, showSlider: 'always' },
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
          hover: {
            enabled: true,
          },
          links: true,
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 10,
        }}
      />
    </div>
  );
}
