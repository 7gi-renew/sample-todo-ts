export declare class Record {
    id: string | number;
    title: string;
    time: number;
    constructor(id: string | number, title: string, time: number);
    static newRecord(id: string | number, title: string, time: number): Record;
}
