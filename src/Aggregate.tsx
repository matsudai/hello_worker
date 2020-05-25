import React from 'react';
import './Aggregate.css';
import moment from 'moment';

interface Props {
  // rows: { workOn: Date | null }[];
  dataRows: { [key: string]: string | number | Date | null }[];
  convertToString: (value: string | number | Date | null) => string | null;
}

type WorkWeekGroup = {
  rows: Props['dataRows'];
  workWeekFrom: Date | null;
  workWeekTo: Date | null;
  workWeekFromAsNumber: number;
  workWeekToAsNumber: number;
}

const Aggregate: React.FC<Props> = ({ dataRows, convertToString }: Props) => {
  const groupByWorkWeek = (rows: Props['dataRows']): WorkWeekGroup[] => rows.reduce((groups: WorkWeekGroup[], row) => {
    const workOn = row.workOn == null ? null : moment(row.workOn as Date);
    const workWeekFrom = workOn?.startOf('week')?.toDate() ?? null;
    const workWeekFromAsNumber = workWeekFrom?.valueOf() ?? 0;

    const groupSameWeek = groups.find((group) => group.workWeekFromAsNumber === workWeekFromAsNumber);
    if (groupSameWeek) {
      groupSameWeek.rows.push(row);
    } else {
      const workWeekTo = workOn?.endOf('week')?.toDate() ?? null;
      const workWeekToAsNumber = workWeekTo?.valueOf() ?? 0;
      groups.push({
        rows: [row],
        workWeekFrom,
        workWeekTo,
        workWeekFromAsNumber,
        workWeekToAsNumber
      });
    }

    return groups;
  }, []).sort((a, b) => {
    if (a.workWeekFromAsNumber > b.workWeekFromAsNumber) {
      return 1;
    }
    if (a.workWeekFromAsNumber < b.workWeekFromAsNumber) {
      return -1;
    }
    return 0;
  });

  const workDurationInWeekToString = (group: WorkWeekGroup): string => {
    if (group.workWeekFrom === null && group.workWeekTo === null) {
      return '';
    }

    return `${convertToString(group.workWeekFrom)}～${convertToString(group.workWeekTo)}`;
  };

  const workHourInWeekToString = (group: WorkWeekGroup): string => {
    const sumOfWorkHours = group.rows.reduce((sum: number, value) => {
      if (value.workHour === null) {
        return sum;
      }

      return sum + Number(value.workHour);
    }, 0);

    return convertToString(sumOfWorkHours / 60.0) ?? '';
  };

  return (
    <div className="Aggregate">
      {
        groupByWorkWeek(dataRows).map((group) => (
          <div key={group.workWeekFromAsNumber ?? 0}>
            { workDurationInWeekToString(group) }
            ：
            { workHourInWeekToString(group) }
          </div>
        ))
      }
    </div>
  );
};

export default Aggregate;
