import React from 'react';

import './App.css';

import FileImportButton from './FileImportButton';
import FilePreview from './FilePreview';
import FileHeaderMapper from './FileHeaderMapper';

class DB {
  private static openOrCreateDB(onSuccess: (db: IDBDatabase) => void): void {
    const dbOpenRequest = window.indexedDB.open('helloWorker', 1);

    dbOpenRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const store = db.createObjectStore('fileHeaderMappers', { keyPath: ['user', 'key'] });
      store.createIndex('primaryKey', ['user', 'key'], { unique: true });
    };

    dbOpenRequest.onsuccess = (event: Event) => {
      onSuccess((event.target as IDBRequest<IDBDatabase>).result);
    };
  }

  static openFileHeaderMappers(mode: 'readonly' | 'readwrite' | 'versionchange' | undefined, onSuccess: (objectStore: IDBObjectStore) => void): void {
    DB.openOrCreateDB((db) => {
      const transaction = db.transaction('fileHeaderMappers', mode);
      if (transaction === null) {
        throw TypeError('DBのトランザクション構築に失敗しました。');
      }

      onSuccess(transaction.objectStore('fileHeaderMappers'));
    });
  }

  static fetchDefaultFileHeaderMappers(): { user: string, key: string, label: string, type: string, value: string | null }[] {
    return [
      {
        user: 'default',
        key: 'employee_number',
        type: 'string',
        label: '社員番号',
        value: null
      },
      {
        user: 'default',
        key: 'employee_name',
        type: 'string',
        label: '社員名',
        value: null
      },
      {
        user: 'default',
        key: 'work_on',
        type: 'date',
        label: '作業日',
        value: null
      },
      {
        user: 'default',
        key: 'project_number',
        type: 'string',
        label: 'プロジェクト番号',
        value: null
      },
      {
        user: 'default',
        key: 'project_name',
        type: 'string',
        label: 'プロジェクト名',
        value: null
      },
      {
        user: 'default',
        key: 'work_description',
        type: 'string',
        label: '作業内容',
        value: null
      },
      {
        user: 'default',
        key: 'work_hour',
        type: 'integer',
        label: '作業時間',
        value: null
      }
    ];
  }

  static updateFileHeaderMappers(fileHeaderMappers: ReturnType<typeof DB.fetchDefaultFileHeaderMappers>): void {
    DB.openFileHeaderMappers('readwrite', (objectStore: IDBObjectStore) => {
      fileHeaderMappers.forEach((value) => {
        objectStore.put(value);
      });
    });
  }
}

interface Props {}

const App: React.FC<Props> = () => {
  const [fileHeader, setFileHeader] = React.useState<string[]>([]);
  const [fileHeaderMappers, setFileHeaderMappers] = React.useState<ReturnType<typeof DB.fetchDefaultFileHeaderMappers>>(DB.fetchDefaultFileHeaderMappers());
  const [fileRows, setFileRows] = React.useState<{ [key: string]: string }[]>([]);
  const [dataRows, setDataRows] = React.useState<{ [key: string]: string | number | Date | null }[]>([]);

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
  };

  const updateFileHeaderMapperValue = (key: string, value: string | null): void => {
    const newFileHeaderMappers = fileHeaderMappers.map((mapper) => {
      if (mapper.key === key) {
        return { ...mapper, value };
      }
      return mapper;
    });

    setDataRows(fileRows.map((fileRow) => {
      const dataRow: typeof dataRows[0] = {};
      newFileHeaderMappers.forEach((mapper) => {
        if (mapper.value) {
          dataRow[mapper.value] = convertStringToTypeValue(mapper.type, fileRow[mapper.value]);
        }
      });
      return dataRow;
    }));

    setFileHeaderMappers(newFileHeaderMappers);
    DB.updateFileHeaderMappers(newFileHeaderMappers);
  };

  const updateFilePreview = (header: typeof fileHeader, rows: typeof fileRows): void => {
    setFileHeader(header);
    setFileRows(rows);

    DB.openFileHeaderMappers('readonly', (objectStore: IDBObjectStore) => {
      const fileHeaderMappersInDB = objectStore.openCursor();
      const overwrittenMappers: { key: string, value: string | null }[] = [];

      fileHeaderMappersInDB.onsuccess = (event: Event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
        if (cursor === null) {
          const newFileHeaderMappers = fileHeaderMappers.map((defaultMapper) => {
            const overwrittenMapper = overwrittenMappers.find(({ key }) => key === defaultMapper.key);
            if (overwrittenMapper !== undefined) {
              return { ...defaultMapper, ...overwrittenMapper };
            }
            return defaultMapper;
          });
          setFileHeaderMappers(newFileHeaderMappers);

          setDataRows(rows.map((fileRow) => {
            const dataRow: typeof dataRows[0] = {};
            newFileHeaderMappers.forEach(({ type, value }) => {
              if (value) {
                dataRow[value] = convertStringToTypeValue(type, fileRow[value]);
              }
            });
            return dataRow;
          }));

          return;
        }

        const cursorValue = cursor.value as ReturnType<typeof DB.fetchDefaultFileHeaderMappers>[0];
        overwrittenMappers.push(cursorValue);
        cursor.continue();
      };
    });
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
