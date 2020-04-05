import React from 'react';
import './FilePreview.css';

interface Props {
  cols: { key: string, label: string, type: string, value: string | null }[];
  rows: { [key: string]: string | number | Date | null }[];
  convertToString: (value: string | number | Date | null) => string | null;
}

const FilePreview: React.FC<Props> = ({ cols, rows, convertToString }: Props) => (
  <div className="FilePreview">
    <table>
      <thead>
        <tr>
          {
            cols.map((col) => <th key={col.key}>{col.label}</th>)
          }
        </tr>
      </thead>
      <tbody>
        {
          rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {
                cols.map((col) => <td key={col.key}>{col.value ? convertToString(row[col.key]) : ''}</td>)
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

export default FilePreview;
