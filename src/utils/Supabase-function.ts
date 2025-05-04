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
export const insertData = async (title: string, time?: number | string) => {
  const { data, error } = await Supabase.from("study-record-ts").insert({
    title: title,
    time: time
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// データを削除するための関数
export const deleteData = async (title: string, time?: number | string) => {
  const { error } = await Supabase.from("study-record-ts")
    .delete()
    .match({ title, time });

  if (error) {
    throw new Error(error.message);
  }
};
