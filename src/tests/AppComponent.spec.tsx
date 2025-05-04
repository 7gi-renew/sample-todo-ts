import { render, screen } from "@testing-library/react";
// import userEvent from '@testing-library/user-event'
import "@testing-library/jest-dom";
import App from "../App";

describe("テスト1", () => {
  test("タイトルが存在している", async () => {
    render(<App />);
    expect(screen.getByText("学習記録アプリ")).toBeInTheDocument();
  });
});
