import React from 'react';
import './App.css';

import FileImportButton from './FileImportButton';
import FilePreview from './FilePreview';
import FileHeaderMapper from './FileHeaderMapper';

interface Props {}

const App: React.FC<Props> = () => {
  const [fileHeader, setFileHeader] = React.useState<string[]>([]);
  const [fileHeaderMapper, setFileHeaderMapper] = React.useState<{ [key: string]: string }[]>([]);
  const [fileRows, setFileRows] = React.useState<{ [key: string]: string }[]>([]);

  const updateFilePreview = (header: typeof fileHeader, rows: typeof fileRows): void => {
    setFileHeader(header);
    setFileRows(rows);
  };

  const updateFileHeaderMapper = (mapper: typeof fileHeaderMapper): void => {
    setFileHeaderMapper(mapper);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello Worker!</h1>
      </header>

      <main>
        <FileImportButton setTable={updateFilePreview} />
        <FileHeaderMapper setMapper={updateFileHeaderMapper} header={fileHeader} />
        <FilePreview header={fileHeader} rows={fileRows} />
      </main>
    </div>
  );
};

export default App;
