import React from 'react';
import './FilePreview.css';

const FilePreview = (props) => {
  const renderHeader = (header) => {
    if (header.length == 0) {
      return null;
    } else {
      return (
        <tr>
          {
            header.map((col_name, index) => <th key={index}>{col_name}</th>)
          }
        </tr>
      )
    }
  };

  const renderRows = (header, rows) => {
    return (
      rows.map((row, index) => {
        return (
          <tr key={index}>
            {
              header.map((col_name, index) => <td key={index}>{row[col_name]}</td>)
            }
          </tr>
        );
      })
    );
  };

  return (
    <div className="FilePreview">
      <table>
        <thead>
          {renderHeader(props.header)}
        </thead>

        <tbody>
          {renderRows(props.header, props.rows)}
        </tbody>
      </table>
    </div>
  );
};

export default FilePreview;
