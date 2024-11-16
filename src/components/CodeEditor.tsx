import Editor from '@monaco-editor/react';
import { useCallback, useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  height?: string | number;
}

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  height = '500px',
}: CodeEditorProps) {
  const [isDark, setIsDark] = useState(true);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      onChange?.(value);
    },
    [onChange]
  );

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
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          tabCompletion: 'on',
          quickSuggestions: true,
        }}
      />
    </div>
  );
}
