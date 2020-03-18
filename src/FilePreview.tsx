import React from 'react';
import './FilePreview.css';

interface Props {
  header: string[];
  rows: { [key: string]: string }[];
}

const FilePreview: React.FC<Props> = (props: Props) => {
  const renderHeader = (args: { header: string[] }): JSX.Element | null => {
    if (args.header.length === 0) {
      return null;
    }

    return (
      <tr>
        {
          args.header.map((colName, index) => <th key={index}>{colName}</th>)
        }
      </tr>
    );
  };

  const renderRows = (args: { header: string[], rows: { [key: string]: string }[] }): JSX.Element[] => (
    args.rows.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {
          args.header.map((colName, colIndex) => <td key={colIndex}>{row[colName]}</td>)
        }
      </tr>
    ))
  );

  return (
    <div className="FilePreview">
      <table>
        <thead>
          {renderHeader(props)}
        </thead>

        <tbody>
          {renderRows(props)}
        </tbody>
      </table>
    </div>
  );
};

export default FilePreview;
