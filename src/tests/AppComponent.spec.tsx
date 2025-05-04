import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from '@testing-library/user-event'
import "@testing-library/jest-dom";
import App from "../App";

describe("テスト1", () => {
  test("タイトルが存在している", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("学習記録アプリ")).toBeInTheDocument();
    });
  });
});
