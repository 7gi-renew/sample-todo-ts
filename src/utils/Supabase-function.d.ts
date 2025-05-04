import { Record } from "../domain/record";
export declare const getData: () => Promise<Record[]>;
export declare const insertData: (title: string, time?: number | string) => Promise<null>;
export declare const deleteData: (title: string, time?: number | string) => Promise<void>;
