import React from 'react';
import './FileImportButton.css';
import iconv from 'iconv-lite';
import parseCsv from 'csv-parse';

const FileImportButton = (props) => {
  const importFile = (event) => {
    const files = event.target.files;

    if(files.length <= 0) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.addEventListener('loadend', () => {
      // アップロードが失敗した場合は処理しない
      if (fileReader.error != null) {
        alert('file upload error.');
        return;
      }

      const dataBuffer = new Buffer(fileReader.result, 'binary');
      const dataAsUtf8 = iconv.decode(dataBuffer, 'CP932').toString();
      parseCsv(dataAsUtf8, { columns: true, trim: true, skip_empty_lines: true }, (error, data) => {
        // ファイルをCSVとして解析できなかった場合は処理しない
        if (error != null) {
          alert('file parse error.');
          return;
        }
        // ファイルのデータ部がなかった場合は処理しない
        if (data.length <= 0) {
          alert('csv does not have data.');
          return;
        }

        const header = Object.keys(data[0]);
        const rows = data;

        props.setTable(header, rows);
      });
    });

    fileReader.readAsArrayBuffer(files[0]);
  };

  return (
    <div className="FileImportButton">
      <input type="file" onChange={importFile} />
    </div>
  );
};

export default FileImportButton;
