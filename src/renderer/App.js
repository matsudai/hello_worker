import React from 'react';
import './App.css';

import FileImportButton from './FileImportButton';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello Worker!</h1>
      </header>

      <main>
        <FileImportButton />
      </main>
    </div>
  );
}

export default App;
