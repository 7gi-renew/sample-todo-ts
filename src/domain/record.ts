export class Record {
  constructor(
    public id: string | number,
    public title: string,
    public time: string | number
  ) {}

  public static newRecord(
    id: string | number,
    title: string,
    time: string | number
  ): Record {
    return new Record(id, title, time);
  }
}
