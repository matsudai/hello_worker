import React from 'react';
import './Aggregate.css';
import moment from 'moment';

interface Props {
  // rows: { workOn: Date | null }[];
  dataRows: { [key: string]: string | number | Date | null }[]
}

type WorkWeekGroup = {
  rows: Props['dataRows'];
  workWeekFrom: Date | null;
  workWeekTo: Date | null;
  workWeekFromAsNumber: number;
  workWeekToAsNumber: number;
}

const Aggregate: React.FC<Props> = ({ dataRows }: Props) => {
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

  return (
    <div className="Aggregate">
      {
        groupByWorkWeek(dataRows).map((group) => (
          <div key={group.workWeekFromAsNumber ?? 0}>
            { group.workWeekFrom?.toString() ?? '' }
            {
              group.rows.map((row, rowId) => (
                <div key={rowId}>
                  &gt;&gt;
                  {
                    row.workOn?.toString()
                  }
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  );
};

export default Aggregate;
