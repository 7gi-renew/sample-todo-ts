import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";
import { Record } from "../domain/record";

const mockData = jest
  .fn()
  .mockResolvedValue([
    new Record("1", "課題a", 10),
    new Record("2", "課題b", 5)
  ]);

const mockInsertData = jest.fn().mockResolvedValue(undefined);
const mockUpdateData = jest.fn().mockResolvedValue(undefined);

jest.mock("../utils/Supabase-function.ts", () => {
  return {
    getData: () => mockData(),
    insertData: (...args: any[]) => mockInsertData(...args),
    deleteData: jest.fn(),
    updateData: (...args: any[]) => mockUpdateData(...args)
  };
});

describe("テスト1", () => {
  test("ローディング画面が存在している", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("now loading...")).toBeInTheDocument();
    });
  });

  test("テーブルを見ることができる", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.queryByRole("table")).toBeInTheDocument();
    });
  });

  test("新規登録ボタンがある", async () => {
    render(<App />);
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "新規追加" })
      ).toBeInTheDocument();
    });
  });

  test("タイトルがある", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("title")).toBeInTheDocument();
    });
  });

  test("モーダルが新規登録というタイトルになっている", async () => {
    render(<App />);
    await waitFor(() => {
      const addButton = screen.queryByRole("button", {
        name: "新規追加"
      }) as Element;
      userEvent.click(addButton);
      expect(screen.getByText("新規登録")).toBeInTheDocument();
    });
  });

  test("モーダルの登録ができる", async () => {
    render(<App />);

    await waitFor(async () => {
      const registerButton = (await screen.queryByRole("button", {
        name: "新規追加"
      })) as Element;
      await userEvent.click(registerButton);
      // モックでフォームに入力する処理を作成

      const studyContentForm = await screen.getByRole("textbox");
      const studyTimeForm = await screen.getByRole("spinbutton");
      // フォームに値を挿入し、追加のボタンを押下
      await userEvent.type(studyContentForm, "課題c");
      await userEvent.type(studyTimeForm, "12");

      // モックでフォームに入力する処理を作成
      // 追加のボタンを押下
      const addButton = (await screen.queryByRole("button", {
        name: "追加"
      })) as Element;

      await userEvent.click(addButton);
    });

    // フォーム内のinput要素の取得

    await waitFor(() => {
      expect(screen.getByText("課題c")).toBeInTheDocument();
      expect(screen.getByText("12時間")).toBeInTheDocument();
    });
  });

  test("学習内容が記載されていないときに登録するとバリデーションエラーが発生する", async () => {
    render(<App />);
    await waitFor(async () => {
      const registerButton = screen.queryByRole("button", {
        name: "新規追加"
      }) as Element;
      userEvent.click(registerButton);
      const studyTimeForm = await screen.getByRole("spinbutton");
      await userEvent.type(studyTimeForm, "20");
      const addButton = (await screen.queryByRole("button", {
        name: "追加"
      })) as Element;
      await userEvent.click(addButton);
      expect(screen.getByText("内容の入力は必須です")).toBeInTheDocument();
    });
  });

  test("時間が記載されていないときに登録するとバリデーションエラーが発生する", async () => {
    render(<App />);
    await waitFor(async () => {
      const registerButton = screen.queryByRole("button", {
        name: "新規追加"
      }) as Element;
      userEvent.click(registerButton);
      const studyContentForm = await screen.getByRole("textbox");
      await userEvent.type(studyContentForm, "課題4");
      const addButton = (await screen.queryByRole("button", {
        name: "追加"
      })) as Element;
      await userEvent.click(addButton);
      expect(screen.getByText("時間の入力は必須です")).toBeInTheDocument();
    });
  });

  test("時間が負の値の時に登録すると0時間以上のバリデーションエラーが発生する", async () => {
    render(<App />);
    await waitFor(async () => {
      const registerButton = screen.queryByRole("button", {
        name: "新規追加"
      }) as Element;
      userEvent.click(registerButton);
      const studyContentForm = await screen.getByRole("textbox");
      const studyTimeForm = await screen.getByRole("spinbutton");
      await userEvent.type(studyContentForm, "課題4");
      await fireEvent.change(studyTimeForm, { target: { value: "-3" } });
      const addButton = (await screen.queryByRole("button", {
        name: "追加"
      })) as Element;
      await userEvent.click(addButton);
      expect(
        screen.getByText("時間は0以上である必要があります")
      ).toBeInTheDocument();
    });
  });

  test("削除ボタンを押下したときに項目が削除される", async () => {
    render(<App />);
    let beforeTableNum: number;
    let AfterTableNum: number;

    await waitFor(async () => {
      const targetDeleteBtn = screen.getAllByTestId("data");
      beforeTableNum = targetDeleteBtn.length;

      const deleteTargetButton = targetDeleteBtn[
        beforeTableNum - 1
      ].querySelector("button") as Element;

      await screen.debug(deleteTargetButton);

      await userEvent.click(deleteTargetButton);

      AfterTableNum = await screen.getAllByTestId("data").length;
      await expect(AfterTableNum).toBe(beforeTableNum - 1);

      // beforeTableNum = targetDeleteBtn.length;
    });
  });

  test("編集ボタンを押した時のモーダルの名前が記録編集である", async () => {
    render(<App />);

    await waitFor(async () => {
      const editButton = screen.getByRole("button", { name: "編集" });
      await userEvent.click(editButton);
      await expect(screen.getByText("記録編集")).toBeInTheDocument();
    });
  });

  test("更新ボタンを押したときに新しい値に更新されている", async () => {
    render(<App />);

    // 編集ボタンをクリックする
    await waitFor(async () => {
      // モーダルに値を入れて更新ボタンを押す
      const editButton = screen.getByRole("button", { name: "編集" });

      await userEvent.click(editButton);

      // フォームに値を挿入し、追加のボタンを押下
      const studyContentForm = await screen.getByRole("textbox");
      const studyTimeForm = await screen.getByRole("spinbutton");

      await userEvent.clear(studyContentForm);
      await userEvent.clear(studyTimeForm);
      await userEvent.type(studyContentForm, "テスト課題A");
      await userEvent.type(studyTimeForm, "40");

      const updateButton = (await screen.queryByRole("button", {
        name: "更新"
      })) as Element;

      await userEvent.click(updateButton);
    });

    await waitFor(async () => {
      expect(screen.getByText("テスト課題A")).toBeInTheDocument();
      expect(screen.getByText("40時間")).toBeInTheDocument();
    });
  });
});
