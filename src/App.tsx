import React from 'react';
import './App.css';

import FileImportButton from './FileImportButton';
import FilePreview from './FilePreview';

interface Props {}

const App: React.FC<Props> = () => {
  const [fileHeader, setFileHeader] = React.useState<string[]>([]);
  const [fileRows, setFileRows] = React.useState<{ [key: string]: string }[]>([]);

  const updateFilePreview = (header: typeof fileHeader, rows: typeof fileRows) => {
    setFileHeader(header);
    setFileRows(rows);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello Worker!</h1>
      </header>

      <main>
        <FileImportButton setTable={updateFilePreview} />
        <FilePreview header={fileHeader} rows={fileRows} />
      </main>
    </div>
  );
};

export default App;
