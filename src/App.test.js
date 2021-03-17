/* eslint-disable */
import {
  render,
  screen,
  fireEvent,
  userEvent,
  type,
} from "@testing-library/react";
import App from "./App";

test("Show login button", () => {
  render(<App />);
  const login_button = screen.getByText("Log in");
  expect(login_button).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "hey" } });
  fireEvent.click(login_button);
  expect(login_button).not.toBeInTheDocument();
});
test("Show leaderboard", () => {
  render(<App />);
  const login_button = screen.getByText("Log in");
  // userEvent.type(screen.getByRole('textbox'), 'Hello, World!');
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "hey" } });
  fireEvent.click(login_button);
  const show_rank_button = screen.getByText("Show rank");
  expect(show_rank_button).toBeInTheDocument();
  fireEvent.click(show_rank_button);
  const search_button = screen.getByText("Search");
  expect(search_button).toBeInTheDocument();
});
test("Show tchat", () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "hey" } });
  const login_button = screen.getByText("Log in");
  fireEvent.click(login_button);
  const tchat_button = screen.getByText("Post");
  expect(tchat_button).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "hey" } });
  const text = screen.getByText("hey");
  expect(text).toBeInTheDocument();
});
