import React from 'react';
import * as XLSX from 'xlsx';
import './WorkRecordEditor.css';
import WorkRecordEditorField from './WorkRecordEditorField';

interface Props {
}

const WorkRecordEditor: React.FC<Props> = () => {
  // [TODO] use parent's work-record instead of this
  // const [workRecords, setWorkRecords] = React.useState <WorkRecord[]>([new WorkRecord()]);
  const [fieldRows, setFieldRows] = React.useState <string[][]>([]);
  const [fieldFocus, setFieldFocus] = React.useState <{ rowIndex: number, colIndex: number } | null>(null);
  // const [fieldRowsHistories, setFieldRowsHistories] = React.useState <string[][][]>([]);

  React.useEffect(() => {
    if (fieldFocus != null) {
      setFieldFocus(null);
    }
  });

  const generateEmptyRow = () => [...Array(15)].map(() => '');

  const stackAndDeepCopyFieldRows = () => (
    fieldRows.map((row) => [...row])
  );

  const isFocussed = (rowIndex: number, colIndex: number) => {
    if (fieldFocus == null) {
      return false;
    }

    return fieldFocus.rowIndex === rowIndex && fieldFocus.colIndex === colIndex;
  };

  const addRow = (originRowIndex: number | null = null) => {
    const rows = stackAndDeepCopyFieldRows();

    let newRow: string[];
    if (originRowIndex != null) {
      newRow = [...fieldRows[originRowIndex]];
    } else {
      newRow = generateEmptyRow();
    }

    rows.splice(originRowIndex ?? 0, 0, newRow);
    setFieldRows(rows);
  };

  const removeRow = (rowIndex: number) => {
    const rows = stackAndDeepCopyFieldRows().filter((_, index) => index !== rowIndex);
    setFieldRows(rows.length === 0 ? [generateEmptyRow()] : rows);
  };

  const functionOfOnKeyDownOnField = (rowIndex: number, colIndex: number) => ((event: React.KeyboardEvent <HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (event.ctrlKey && event.shiftKey) {
        removeRow(rowIndex);
        setFieldFocusPreviousRow(rowIndex, colIndex);
      } else if (event.ctrlKey) {
        addRow(rowIndex);
        setFieldFocusNextRow(rowIndex, colIndex);
      } else if (event.shiftKey) {
        setFieldFocusPreviousRow(rowIndex, colIndex);
      } else {
        setFieldFocusNextRow(rowIndex, colIndex);
      }
    }
  });

  const setFieldFocusPreviousRow = (rowIndex: number, colIndex: number) => {
    const previousRowIndex = rowIndex - 1 < 0 ? 0 : rowIndex - 1;
    setFieldFocus({ rowIndex: previousRowIndex, colIndex });
  };

  const setFieldFocusNextRow = (rowIndex: number, colIndex: number) => {
    const nextRowIndex = rowIndex + 1 >= fieldRows.length ? rowIndex : rowIndex + 1;
    setFieldFocus({ rowIndex: nextRowIndex, colIndex });
  };

  const functionOfSetFieldValue = (rowIndex: number, colIndex: number) => ((value: string) => {
    const rows = stackAndDeepCopyFieldRows();
    rows[rowIndex][colIndex] = value;
    setFieldRows(rows);
  });

  // const suggestionValues = (colIndex: number): string[] => (
  //   [...new Set(fieldRows.map((row) => row[colIndex]).filter((val) => val != null))]
  // );

  if (fieldRows.length === 0) {
    addRow();
  }

  const downloadXlsx = () => {
    const header = [
      '対象日',           // 作業日
      '社員コード',       // 社員番号
      '社員名',           // 社員名
      '勤務内容コード',   // 勤務内容1
      '勤務内容名',       // 勤務内容2
      '作業開始時刻',     // 作業開始時刻
      '作業終了時刻',     // 作業終了時刻
      '休憩時間',         // 休憩時間
      '実働時間',
      'プロジェクト番号', // プロジェクト番号1
      '受注番号',         // プロジェクト番号2
      '受注行番号',       // プロジェクト番号3
      '契約名',           // プロジェクト名
      '負担部門',
      '負担部門名',
      '作業内容コード',   // 作業内容1
      '作業内容名',       // 作業内容2
      '作業内訳1コード',
      '作業内訳2コード',
      '作業時間',         // 作業時間
      '備考'
    ];

    const fieldRowsWithoutBlank = fieldRows.filter((row) => row.some((value) => value !== ''));
    const body = fieldRowsWithoutBlank.map((row) => [
      row[0],  // 作業日
      row[1],  // 社員番号
      row[2],  // 社員名
      row[3],  // 勤務内容1
      row[4],  // 勤務内容2
      row[7],  // 作業開始時刻
      row[8],  // 作業終了時刻
      row[13], // 休憩時間
      null,
      row[9],  // プロジェクト番号1
      row[10], // プロジェクト番号2
      row[11], // プロジェクト番号3
      row[12], // プロジェクト名
      null,
      null,
      row[5],  // 作業内容1
      row[6],  // 作業内容2
      null,
      null,
      row[14], // 作業時間
      null
    ]);

    const arraySheet = [header, ...body];

    const sheet = XLSX.utils.aoa_to_sheet(arraySheet);
    XLSX.utils.sheet_add_json(sheet, []);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Sheet1');
    const data = XLSX.write(book, { bookType: 'xlsx', bookSST: true, type: 'array' });
    const buffer = new Uint8Array(data);

    // const data     = new Blob([res], { type: 'text/csv' });
    const csvURL = window.URL.createObjectURL(new Blob([buffer], { type: 'application/octet-binary' }));
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'file.xlsx');
    tempLink.click();
  };

  return (
    <div className="WorkRecordEditor">
      <button type="button" onClick={downloadXlsx}>Download Excel</button>
      <table>
        <thead>
          <tr>
            <th className="workOn">作業日</th>
            <th className="employeeNumber">社員番号</th>
            <th className="employeeName">社員名</th>
            <th className="workCategory1">勤務内容1</th>
            <th className="workCategory2">勤務内容2</th>
            <th className="workDescription1">作業内容1</th>
            <th className="workDescription2">作業内容2</th>
            <th className="workBeginningAt">作業開始時刻</th>
            <th className="workEndAt">作業終了時刻</th>
            <th className="projectNumber1">プロジェクト番号1</th>
            <th className="projectNumber2">プロジェクト番号2</th>
            <th className="projectNumber3">プロジェクト番号3</th>
            <th className="projectName">プロジェクト名</th>
            <th className="workBreakHour">休憩時間</th>
            <th className="workHour">作業時間</th>
          </tr>
        </thead>
        <tbody>
          {
            fieldRows.map((fieldRow, rowIndex) => (
              <tr key={rowIndex}>
                <td><WorkRecordEditorField value={fieldRow[0]} suggestionListKey="WorkRecordEditor-suggests-workOn" setFieldValue={functionOfSetFieldValue(rowIndex, 0)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 0)} isFocussed={isFocussed(rowIndex, 0)} /></td>
                <td><WorkRecordEditorField value={fieldRow[1]} suggestionListKey="WorkRecordEditor-suggests-employeeNumber" setFieldValue={functionOfSetFieldValue(rowIndex, 1)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 1)} isFocussed={isFocussed(rowIndex, 1)} /></td>
                <td><WorkRecordEditorField value={fieldRow[2]} suggestionListKey="WorkRecordEditor-suggests-employeeName" setFieldValue={functionOfSetFieldValue(rowIndex, 2)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 2)} isFocussed={isFocussed(rowIndex, 2)} /></td>
                <td><WorkRecordEditorField value={fieldRow[3]} suggestionListKey="WorkRecordEditor-suggests-workCategory1" setFieldValue={functionOfSetFieldValue(rowIndex, 3)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 3)} isFocussed={isFocussed(rowIndex, 3)} /></td>
                <td><WorkRecordEditorField value={fieldRow[4]} suggestionListKey="WorkRecordEditor-suggests-workCategory2" setFieldValue={functionOfSetFieldValue(rowIndex, 4)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 4)} isFocussed={isFocussed(rowIndex, 4)} /></td>
                <td><WorkRecordEditorField value={fieldRow[5]} suggestionListKey="WorkRecordEditor-suggests-workDescription1" setFieldValue={functionOfSetFieldValue(rowIndex, 5)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 5)} isFocussed={isFocussed(rowIndex, 5)} /></td>
                <td><WorkRecordEditorField value={fieldRow[6]} suggestionListKey="WorkRecordEditor-suggests-workDescription2" setFieldValue={functionOfSetFieldValue(rowIndex, 6)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 6)} isFocussed={isFocussed(rowIndex, 6)} /></td>
                <td><WorkRecordEditorField value={fieldRow[7]} suggestionListKey="WorkRecordEditor-suggests-workBeginningAt" setFieldValue={functionOfSetFieldValue(rowIndex, 7)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 7)} isFocussed={isFocussed(rowIndex, 7)} /></td>
                <td><WorkRecordEditorField value={fieldRow[8]} suggestionListKey="WorkRecordEditor-suggests-workEndAt" setFieldValue={functionOfSetFieldValue(rowIndex, 8)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 8)} isFocussed={isFocussed(rowIndex, 8)} /></td>
                <td><WorkRecordEditorField value={fieldRow[9]} suggestionListKey="WorkRecordEditor-suggests-projectNumber1" setFieldValue={functionOfSetFieldValue(rowIndex, 9)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 9)} isFocussed={isFocussed(rowIndex, 9)} /></td>
                <td><WorkRecordEditorField value={fieldRow[10]} suggestionListKey="WorkRecordEditor-suggests-projectNumber2" setFieldValue={functionOfSetFieldValue(rowIndex, 10)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 10)} isFocussed={isFocussed(rowIndex, 10)} /></td>
                <td><WorkRecordEditorField value={fieldRow[11]} suggestionListKey="WorkRecordEditor-suggests-projectNumber3" setFieldValue={functionOfSetFieldValue(rowIndex, 11)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 11)} isFocussed={isFocussed(rowIndex, 11)} /></td>
                <td><WorkRecordEditorField value={fieldRow[12]} suggestionListKey="WorkRecordEditor-suggests-projectName" setFieldValue={functionOfSetFieldValue(rowIndex, 12)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 12)} isFocussed={isFocussed(rowIndex, 12)} /></td>
                <td><WorkRecordEditorField value={fieldRow[13]} suggestionListKey="WorkRecordEditor-suggests-workBreakHour" setFieldValue={functionOfSetFieldValue(rowIndex, 13)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 13)} isFocussed={isFocussed(rowIndex, 13)} /></td>
                <td><WorkRecordEditorField value={fieldRow[14]} suggestionListKey="WorkRecordEditor-suggests-workHour" setFieldValue={functionOfSetFieldValue(rowIndex, 14)} onKeyDown={functionOfOnKeyDownOnField(rowIndex, 14)} isFocussed={isFocussed(rowIndex, 14)} /></td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <div className="suggests" id="WorkRecordEditor-suggests">
        {/* {
          [
            'workOn',
            'employeeNumber',
            'employeeName',
            'workCategory1',
            'workCategory2',
            'workDescription1',
            'workDescription2',
            'workBeginningAt',
            'workEndAt',
            'projectNumber1',
            'projectNumber2',
            'projectNumber3',
            'projectName',
            'workBreakHour',
            'workHour'
          ].map((colKey, colIndex) => (
            <datalist key={colKey} className={colKey} id={`WorkRecordEditor-suggests-${colKey}`}>
              {
                suggestionValues(colIndex).map((value) => (
                  <option key={value}>{value}</option>
                ))
              }
            </datalist>
          ))
        } */}
      </div>
    </div>
  );
};

export default WorkRecordEditor;
