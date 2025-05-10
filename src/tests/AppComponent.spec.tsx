import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";
import { Record } from "../domain/record";
// import { fireEvent } from "@testing-library/react";
// import { insertData } from "../utils/Supabase-function";

const mockData = jest
  .fn()
  .mockResolvedValue([
    new Record("1", "課題a", "10"),
    new Record("2", "課題b", "5")
  ]);

jest.mock("../utils/Supabase-function.ts", () => {
  return {
    getData: () => mockData()
  };
});

describe("テスト1", () => {
  test("ローディング画面が存在している", () => {
    render(<App />);
    expect(screen.getByText("now loading...")).toBeInTheDocument();
  });
  // test("テーブルを見ることができる", async () => {
  //   render(<App />);
  //   await waitFor(() => {
  //     expect(screen.queryByRole("table")).toBeInTheDocument();
  //   });
  // });
  // test("新規登録ボタンがある", async () => {
  //
  //   render(<App />);
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByRole("button", { name: "新規追加" })
  //     ).toBeInTheDocument();
  //   });
  // });
  // test("タイトルがある", async () => {
  //
  //   render(<App />);
  //   await waitFor(() => {
  //     expect(screen.getByTestId("title")).toBeInTheDocument();
  //   });
  // });
  // test("モーダルが新規登録というタイトルになっている", async () => {
  //
  //   render(<App />);
  //   await waitFor(() => {
  //     const addButton = screen.queryByRole("button", {
  //       name: "新規追加"
  //     }) as Element;
  //     userEvent.click(addButton);
  //     expect(screen.getByText("新規登録")).toBeInTheDocument();
  //   });
  // });
  // test("モーダルの登録ができる", async () => {
  //
  //   await render(<App />);
  //   let tableNum: number;
  //   // 初期のテーブル数を取得する
  //   await waitFor(async () => {
  //     tableNum = await screen.getAllByTestId("data").length;
  //   });
  //   render(<App />);
  //   // モーダルの中のボタンを押す
  //   await waitFor(async () => {
  //     const registerButton = (await screen.queryByRole("button", {
  //       name: "新規追加"
  //     })) as Element;
  //     await userEvent.click(registerButton);
  //     // モックでフォームに入力する処理を作成
  //     // フォーム内のinput要素の取得
  //     const studyContentForm = await screen.getByRole("textbox");
  //     const studyTimeForm = await screen.getByRole("spinbutton");
  //     // フォームに値を挿入し、追加のボタンを押下
  //     await userEvent.type(studyContentForm, "課題3");
  //     await userEvent.type(studyTimeForm, "12");
  //     // モックでフォームに入力する処理を作成
  //     // 追加のボタンを押下
  //     // const addButton = (await screen.queryByRole("button", {
  //     //   name: "追加"
  //     // })) as Element;
  //     // await userEvent.click(addButton);
  //   });
  //   // ボタン押下後のボタンの数を数えて押下前と比較
  //   // await waitFor(async () => {
  //   //   const newTable = await screen.getAllByTestId("data");
  //   //   const newTableNum = await newTable.length;
  //   //   console.log(newTableNum);
  //   //   await expect(newTable).toHaveLength(tableNum + 1);
  //   // });
  // });
  // test("学習内容が記載されていないときに登録するとバリデーションエラーが発生する", async () => {
  //   jest.mock("../utils/Supabase-function", () => {
  //     return {
  //       getData: () => mockData()
  //     };
  //   });
  //   render(<App />);
  //   await waitFor(async () => {
  //     const registerButton = screen.queryByRole("button", {
  //       name: "新規追加"
  //     }) as Element;
  //     userEvent.click(registerButton);
  //     const studyTimeForm = await screen.getByRole("spinbutton");
  //     await userEvent.type(studyTimeForm, "20");
  //     const addButton = (await screen.queryByRole("button", {
  //       name: "追加"
  //     })) as Element;
  //     await userEvent.click(addButton);
  //     expect(screen.getByText("内容の入力は必須です")).toBeInTheDocument();
  //   });
  // });
  // test("時間が記載されていないときに登録するとバリデーションエラーが発生する", async () => {
  //   jest.mock("../utils/Supabase-function", () => {
  //     return {
  //       getData: () => mockData()
  //     };
  //   });
  //   render(<App />);
  //   await waitFor(async () => {
  //     const registerButton = screen.queryByRole("button", {
  //       name: "新規追加"
  //     }) as Element;
  //     userEvent.click(registerButton);
  //     const studyContentForm = await screen.getByRole("textbox");
  //     await userEvent.type(studyContentForm, "課題4");
  //     const addButton = (await screen.queryByRole("button", {
  //       name: "追加"
  //     })) as Element;
  //     await userEvent.click(addButton);
  //     expect(screen.getByText("時間の入力は必須です")).toBeInTheDocument();
  //   });
  // });
  // test("時間が負の値の時に登録すると0時間以上のバリデーションエラーが発生する", async () => {
  //   jest.mock("../utils/Supabase-function", () => {
  //     return {
  //       getData: () => mockData()
  //     };
  //   });
  //   render(<App />);
  //   await waitFor(async () => {
  //     const registerButton = screen.queryByRole("button", {
  //       name: "新規追加"
  //     }) as Element;
  //     userEvent.click(registerButton);
  //     const studyContentForm = await screen.getByRole("textbox");
  //     const studyTimeForm = await screen.getByRole("spinbutton");
  //     await userEvent.type(studyContentForm, "課題4");
  //     await fireEvent.change(studyTimeForm, { target: { value: "-3" } });
  //     const addButton = (await screen.queryByRole("button", {
  //       name: "追加"
  //     })) as Element;
  //     await userEvent.click(addButton);
  //     expect(
  //       screen.getByText("時間は0以上である必要があります")
  //     ).toBeInTheDocument();
  //   });
  // });
  // test("削除ボタンを押下したときに項目が削除される", async () => {
  //   render(<App />);
  //   let beforeTableNum: number;
  //   await waitFor(async () => {
  //     const targetDeleteBtn = screen.getAllByTestId("data");
  //     beforeTableNum = targetDeleteBtn.length;
  //     console.log(beforeTableNum);
  //   });
  // });
});
