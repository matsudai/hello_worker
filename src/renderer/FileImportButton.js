import React from 'react';
import './FileImportButton.css';

import electron from 'electron';
const dialog = electron.remote.dialog;
const current_window = electron.remote.getCurrentWindow();



function FileImportButton() {
  function selectImportFile() {
    dialog.showOpenDialog(current_window, {
      properties: ['openFile'],
      title: 'Select a file',
      defaultPath: '.',
      filters: [
        { name: 'csv',  extensions: ['csv'] },
        { name: 'text', extensions: ['txt'] },
        { name: 'any',  extensions: ['*'] }
      ]
    }).then(result => {
      // ファイルが選択されなかった場合はファイル取り込み処理を実行しない
      if (result.canceled) {
        alert('CA');
        return;
      }
      alert('AC');
    });
  }

  return (
    <div className="FileImportButton">
      <button onClick={selectImportFile}>import csv file</button>
    </div>
  );
}

export default FileImportButton;
