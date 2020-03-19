import React from 'react';
import './FilePreview.css';

interface Props {
  header: string[];
  rows: { [key: string]: string }[];
}

const FilePreview: React.FC<Props> = (props: Props) => {
  const renderHeader = ({ header }: Props): JSX.Element | null => {
    if (header.length === 0) {
      return null;
    }

    return (
      <tr>
        {
          header.map((colName, index) => <th key={index}>{colName}</th>)
        }
      </tr>
    );
  };

  const renderRows = ({ header, rows }: Props): JSX.Element[] => (
    rows.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {
          header.map((colName, colIndex) => <td key={colIndex}>{row[colName]}</td>)
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
