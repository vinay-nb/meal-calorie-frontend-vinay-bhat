import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "@/components/ui/AuthForm";
import * as api from "@/lib/api";

jest.mock("@/lib/api", () => ({
  post: jest.fn(),
}));

describe("Login Form Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form correctly without name fields", () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@company.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    
    // First/last name shouldn't be rendered in login mode
    expect(screen.queryByPlaceholderText("Jane")).not.toBeInTheDocument();
  });

  test("submits login form and validates API call on success", async () => {
    const mockPost = api.post as jest.Mock;
    mockPost.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "fake-token", user: { id: 1, email: "test@example.com" } }),
    });

    render(<AuthForm mode="login" />);
    
    fireEvent.change(screen.getByPlaceholderText("you@company.com"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "Password12!" } });
    
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/api/auth/login", {
        email: "test@example.com",
        password: "Password12!",
      });
    });
  });
});
