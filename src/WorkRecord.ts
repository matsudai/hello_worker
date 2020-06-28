import moment from 'moment';

interface WorkRecordGroup {
  key: any;
  records: any[];
  header?: any;
}

// interface WorkRecordGroupByEmployee {
//   key: string;
//   records: WorkRecordGroup[];
//   header?: {
//     employeeNumber: string;
//     employeeName: string;
//   }
// }

interface WorkRecordGroupByProject extends WorkRecordGroup {
  key: string;
  records: WorkRecord[];
  header?: {
    projectNumber: string;
    projectName: string;
  }
}


interface WorkRecordGroupByWorkWeek extends WorkRecordGroup {
  key: number;
  records: WorkRecord[];
  header?: {
    startOfWorkWeek: Date;
    startOfWorkWeekAsNumber: number;
    endOfWorkWeek: Date;
    endOfWorkWeekAsNumber: number;
    workWeekOfMonth: number;
  }
}

export default class WorkRecord {
  employeeNumber?: string;
  employeeName?: string;
  workOn?: Date;
  projectNumbers?: (string | undefined)[];
  projectName?: string;
  workDescriptions?: (string | undefined)[];
  workHour?: Number;

  constructor(params: Partial<WorkRecord> = {}) {
    Object.assign(this, params);
  }

  get projectNumber(): string | undefined {
    if (this.projectNumbers == null) {
      return this.projectNumbers;
    }

    return this.projectNumbers.filter((value) => value != null).join('-');
  }

  set projectNumber(value: string | undefined) {
    this.projectNumbers = [value];
  }

  get workDescription(): string | undefined {
    if (this.workDescriptions == null) {
      return this.workDescriptions;
    }

    return this.workDescriptions.filter((value) => value != null).join('-');
  }

  set workDescription(value) {
    this.workDescriptions = [value];
  }

  canBeTalliedByWorkOn(): boolean {
    return this.workHour != null && this.workOn != null;
  }

  canBeTalliedByProjectNumber(): boolean {
    return this.workHour != null && this.employeeNumber != null;
  }

  canBeTalliedByProjectName(): boolean {
    return this.workHour != null && this.employeeName != null;
  }

  workOnAsMoment(): moment.Moment | undefined {
    if (this.workOn == null) {
      return undefined;
    }
    return moment(this.workOn);
  }

  workWeekOfMonth(): number | undefined {
    const weekOfWorkOn = this.workOnAsMoment()?.week();
    const weekOfStartOfWorkMonth = this.workOnAsMoment()?.startOf('month')?.week();

    if (weekOfWorkOn == null || weekOfStartOfWorkMonth == null) {
      return undefined;
    }
    return weekOfWorkOn - weekOfStartOfWorkMonth + 1;
  }

  startOfWorkWeek(): WorkRecord['workOn'] {
    return this.workOnAsMoment()?.startOf('week')?.toDate();
  }

  startOfWorkWeekAsNumber(): number {
    return this.startOfWorkWeek()?.valueOf() ?? 0;
  }

  startOfWorkMonth(): WorkRecord['workOn'] {
    return this.workOnAsMoment()?.startOf('month')?.toDate();
  }

  startOfWorkMonthAsNumber(): number {
    return this.startOfWorkMonth()?.valueOf() ?? 0;
  }

  endOfWorkWeek(): WorkRecord['workOn'] {
    return this.workOnAsMoment()?.endOf('week')?.toDate();
  }

  endOfWorkWeekAsNumber(): number {
    return this.endOfWorkWeek()?.valueOf() ?? 0;
  }

  endOfWorkMonth(): WorkRecord['workOn'] {
    return this.workOnAsMoment()?.endOf('month')?.toDate();
  }

  endOfWorkMonthAsNumber(): number {
    return this.endOfWorkMonth()?.valueOf() ?? 0;
  }

  static groupByProject(workRecords: WorkRecord[]): WorkRecordGroupByProject[] {
    const createHeader = (workRecord: WorkRecord) => {
      if (workRecord.projectNumber == null) {
        return undefined;
      }

      return {
        projectNumber: workRecord.projectNumber ?? '',
        projectName: workRecord.projectName ?? ''
      };
    };

    const groupsByProject = workRecords.reduce((groups: WorkRecordGroupByProject[], workRecord) => {
      const key = workRecord.projectNumber ?? '';
      const group = groups.find(({ key: _key }) => _key === key);

      if (group == null) {
        groups.push({ key, header: createHeader(workRecord), records: [workRecord] });
      } else {
        group.records.push(workRecord);
      }

      return groups;
    }, []);

    return groupsByProject.sort((a, b) => a.key.localeCompare(b.key));
  }

  static groupByWorkWeek(workRecords: WorkRecord[]): WorkRecordGroupByWorkWeek[] {
    const createHeader = (workRecord: WorkRecord) => {
      const startOfWorkWeek = workRecord.startOfWorkWeek();
      const endOfWorkWeek = workRecord.endOfWorkWeek();
      const workWeekOfMonth = workRecord.workWeekOfMonth();

      if (startOfWorkWeek == null || endOfWorkWeek == null || workWeekOfMonth == null) {
        return undefined;
      }

      return {
        startOfWorkWeek,
        startOfWorkWeekAsNumber: workRecord.startOfWorkWeekAsNumber(),
        endOfWorkWeek,
        endOfWorkWeekAsNumber: workRecord.endOfWorkWeekAsNumber(),
        workWeekOfMonth
      };
    };

    const groupsByWorkWeek = workRecords.reduce((groups: WorkRecordGroupByWorkWeek[], workRecord) => {
      const key = workRecord.startOfWorkWeekAsNumber();
      const group = groups.find(({ key: _key }) => _key === key);

      if (group == null) {
        groups.push({ key, header: createHeader(workRecord), records: [workRecord] });
      } else {
        group.records.push(workRecord);
      }

      return groups;
    }, []);

    return groupsByWorkWeek.sort((a, b) => {
      if (a.key > b.key) { return 1; }
      if (a.key < b.key) { return -1; }
      return 0;
    });
  }
}
