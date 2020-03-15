import React from 'react';
import './App.css';

import FileImportButton from './FileImportButton';
import FilePreview from './FilePreview';

const App = (props) => {
  const [header, setHeader] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  const updateFilePreview = (header, rows) => {
    setHeader(header);
    setRows(rows);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello Worker!</h1>
      </header>

      <main>
        <FileImportButton setTable={updateFilePreview} />
        <FilePreview header={header} rows={rows} />
      </main>
    </div>
  );
};

export default App;
