import React from 'react';
import './Aggregate.css';
import WorkRecord from './WorkRecord';

interface Props {
  dataRows: { [key: string]: string | number | Date | null }[];
  convertToString: (value: string | number | Date | null) => string | null;
}

const Aggregate: React.FC<Props> = ({ dataRows, convertToString }: Props) => {
  const workRecords = dataRows.map((row) => new WorkRecord(row));

  const groupByWorkWeek = () => WorkRecord.groupByWorkWeek(workRecords).filter((group) => group.header != null);
  const groupByProject = () => WorkRecord.groupByProject(workRecords).filter((group) => group.header != null);

  const workDurationInWeekToString = (group: ReturnType<typeof groupByWorkWeek>[0]): string => {
    if (group.header == null) {
      return '';
    }
    return `${group.header.startOfWorkWeek.getMonth() + 1}月${group.header.workWeekOfMonth}週（${convertToString(group.header.startOfWorkWeek)}～${convertToString(group.header.endOfWorkWeek)}）`;
  };

  const projectToString = (group: ReturnType<typeof groupByProject>[0]): string => {
    if (group.header == null) {
      return '';
    }
    return `${group.header.projectNumber}／${group.header.projectName}`;
  };

  const workHourInWeekToString = (records: WorkRecord[]): string => {
    const sumOfWorkHours = records.reduce((sum: number, record) => {
      if (record.workHour === null) {
        return sum;
      }

      return sum + Number(record.workHour);
    }, 0);

    return convertToString(sumOfWorkHours / 60.0) ?? '';
  };

  return (
    <div className="Aggregate">
      <div>
        週単位の集計
      </div>
      <table>
        <tbody>
          {
            groupByWorkWeek().map((group) => (
              <tr key={group.key}>
                <td>
                  { workDurationInWeekToString(group) }
                </td>
                <td>
                  { workHourInWeekToString(group.records) }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div>
        プロジェクト単位の集計
      </div>
      <table>
        <tbody>
          {
            groupByProject().map((group) => (
              <tr key={group.key}>
                <td>
                  { projectToString(group) }
                </td>
                <td>
                  { workHourInWeekToString(group.records) }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default Aggregate;
