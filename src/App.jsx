import { useState } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { loader } from '@monaco-editor/react';

import './App.css';

const monacoConfig = () => {
  loader.init().then((monaco) => {
    import('monaco-editor/esm/vs/basic-languages/python/python.contribution');
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
          language='python'
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
