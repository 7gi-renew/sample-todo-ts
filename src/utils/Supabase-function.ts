import { Supabase } from "../utils/Supabase";
import { Record } from "../domain/record";

// データの初期取得
export const getData = async () => {
  const response = await Supabase.from("study-record-ts").select("*");

  if (response.error) {
    throw new Error(response.error.message);
  }

  const responseData = response.data.map(value => {
    return new Record(value.id, value.title, value.time);
  });

  return responseData;
};

// データを挿入するための関数
export const insertData = async (name: string, time?: number) => {
  const { data, error } = await Supabase.from("study-record-ts").insert({
    title: name,
    time: time
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// データを削除するための関数
