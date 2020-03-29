import React from 'react';
import './FileHeaderMapper.css';

interface Props {
  header: string[];
  mappers: { key: string, label: string, value: string | null }[];
  setMapperValue: (key: string, value: string) => void;
}

const FileHeaderMapper: React.FC<Props> = ({ header, mappers, setMapperValue }: Props) => (
  <div className="FileHeaderMapper">
    <table>
      <tbody>
        {
          mappers.map((mapper) => (
            <tr key={mapper.key}>
              <th>{mapper.label}</th>
              <td>
                <select value={mapper.value || ''} onChange={(e) => setMapperValue(mapper.key, e.target.value)}>
                  {
                    header.length > 0 ? <option>{}</option> : null
                  }
                  {
                    header.map((colName) => (
                      <option key={colName} value={colName}>{colName}</option>
                    ))
                  }
                </select>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

export default FileHeaderMapper;
