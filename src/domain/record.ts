export class Record {
  constructor(
    public id: string | number,
    public title: string,
    public time: number
  ) {}

  public static newRecord(
    id: string | number,
    title: string,
    time: number
  ): Record {
    return new Record(id, title, time);
  }
}
