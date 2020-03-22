import React from 'react';

import './App.css';

import FileImportButton from './FileImportButton';
import FilePreview from './FilePreview';
import FileHeaderMapper from './FileHeaderMapper';

const fetchFileHeaderMapper = (): { key: string, label: string, type: string, value: string | null }[] => [
  {
    key: 'employee_number',
    type: 'string',
    label: '社員番号',
    value: null
  },
  {
    key: 'employee_name',
    type: 'string',
    label: '社員名',
    value: null
  },
  {
    key: 'work_on',
    type: 'date',
    label: '作業日',
    value: null
  },
  {
    key: 'project_number',
    type: 'string',
    label: 'プロジェクト番号',
    value: null
  },
  {
    key: 'project_name',
    type: 'string',
    label: 'プロジェクト名',
    value: null
  },
  {
    key: 'work_description',
    type: 'string',
    label: '作業内容',
    value: null
  },
  {
    key: 'work_hour',
    type: 'integer',
    label: '作業時間',
    value: null
  }
];

interface Props {}

const App: React.FC<Props> = () => {
  const [fileHeader, setFileHeader] = React.useState<string[]>([]);
  const [fileHeaderMappers, setFileHeaderMappers] = React.useState<ReturnType<typeof fetchFileHeaderMapper>>(fetchFileHeaderMapper());
  const [fileRows, setFileRows] = React.useState<{ [key: string]: string }[]>([]);
  const [dataRows, setDataRows] = React.useState<{ [key: string]: string | number | Date | null }[]>([]);

  const updateFilePreview = (header: typeof fileHeader, rows: typeof fileRows): void => {
    setFileHeader(header);
    setFileRows(rows);
  };

  const convertStringToTypeValue = (type: string, value: string | null): string | number | Date | null => {
    switch (type) {
      case 'string': {
        return value;
      }
      case 'integer': {
        if (value === null || !value.match(/^\d+$/g)) {
          return null;
        }
        return parseInt(value, 10);
      }
      case 'date': {
        if (value === null || !value.match(/^\d{4}\/\d{2}\/\d{2}$/g)) {
          return null;
        }
        return new Date(value);
      }
      default: {
        throw TypeError('引数の型には対応していません');
      }
    }
  };

  const convertTypeValueToString = (value: ReturnType<typeof convertStringToTypeValue>): string | null => {
    switch (typeof value) {
      case 'string': {
        return value;
      }
      case 'bigint':
      case 'number': {
        return value.toString();
      }
      default: {
        if (value === null) {
          return null;
        }
        if (value.constructor === Date) {
          return value.toLocaleDateString();
        }
        throw TypeError('引数の型には対応していません');
      }
    }
  }

  const updateFileHeaderMapperValue = (key: string, value: string): void => {
    const newFileHeaderMappers = fileHeaderMappers.map((mapper) => {
      if (mapper.key === key) {
        return { ...mapper, value };
      }
      return mapper;
    })
    setFileHeaderMappers(newFileHeaderMappers);

    setDataRows(fileRows.map((fileRow) => {
      const dataRow: typeof dataRows[0] = {};
      newFileHeaderMappers.forEach((mapper) => {
        if (mapper.value) {
          dataRow[mapper.value] = convertStringToTypeValue(mapper.type, fileRow[mapper.value]);
        }
      });
      return dataRow;
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello Worker!</h1>
      </header>

      <main>
        <FileImportButton setTable={updateFilePreview} />
        <FileHeaderMapper header={fileHeader} mappers={fileHeaderMappers} setMapperValue={updateFileHeaderMapperValue} />
        <FilePreview cols={fileHeaderMappers} rows={dataRows} convertToString={convertTypeValueToString} />
      </main>
    </div>
  );
};

export default App;
