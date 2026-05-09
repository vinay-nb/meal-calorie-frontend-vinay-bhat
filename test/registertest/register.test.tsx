import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthForm from "@/components/ui/AuthForm";
import * as api from "@/lib/api";

jest.mock("@/lib/api", () => ({
  post: jest.fn(),
}));

describe("Register Form Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows validation errors for empty submissions", async () => {
    render(<AuthForm mode="register" />);
    
    // Click submit without entering anything
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getAllByText(/This field is required/i).length).toBeGreaterThan(0);
    });
    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    
    // API should not be called
    expect(api.post).not.toHaveBeenCalled();
  });

  test("shows password validation rules when constraints are violated", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="register" />);
    
    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    
    // Missing uppercase and special char
    await user.type(passwordInputs[0], "password");
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    
    await waitFor(() => {
      expect(screen.getByText(/Password must contain at least 1 uppercase letter/i)).toBeInTheDocument();
    });

    // Contains more than 2 continuous numbers
    await user.clear(passwordInputs[0]);
    await user.type(passwordInputs[0], "Pass1234!");
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText(/No more than 2 continuous numbers are allowed/i)).toBeInTheDocument();
    });
  });

  test("submits successfully with valid payload", async () => {
    const mockPost = api.post as jest.Mock;
    mockPost.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "fake-token", user: { id: 1 } }),
    });

    const user = userEvent.setup();
    render(<AuthForm mode="register" />);
    
    await user.type(screen.getByPlaceholderText("Jane"), "Jane");
    await user.type(screen.getByPlaceholderText("Doe"), "Doe");
    await user.type(screen.getByPlaceholderText("you@company.com"), "jane.doe@example.com");
    
    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    await user.type(passwordInputs[0], "Password12!"); // Password
    await user.type(passwordInputs[1], "Password12!"); // Confirm Password
    
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/api/auth/register", {
        first_name: "Jane",
        last_name: "Doe",
        email: "jane.doe@example.com",
        password: "Password12!",
      });
    });
  });

  test("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="register" />);
    
    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    await user.type(passwordInputs[0], "Password12!");
    await user.type(passwordInputs[1], "Password123!");
    
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });
});
