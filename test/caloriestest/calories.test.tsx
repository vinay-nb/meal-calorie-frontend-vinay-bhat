import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CaloriesForm from "@/components/ui/CaloriesForm";
import * as api from "@/lib/api";

jest.mock("@/lib/api", () => ({
  post: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Calories Form Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("validates required dish name", async () => {
    const user = userEvent.setup();
    render(<CaloriesForm />);
    
    // Trigger validation with empty dish
    await user.click(screen.getByRole("button", { name: /Get Calories/i }));
    expect(await screen.findByText(/Meal name is required/i)).toBeInTheDocument();
    
    expect(api.post).not.toHaveBeenCalled();
  });

  test("submits form and displays ResultCard data on API success", async () => {
    const mockPost = api.post as jest.Mock;
    mockPost.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        dish_name: "Apple",
        servings: 1,
        calories_per_serving: 95,
        total_calories: 95,
        source: "Test DB",
        macros: { protein: 0.5, carbohydrates: 25, fat: 0.3 }
      }),
    });

    const user = userEvent.setup();
    render(<CaloriesForm />);

    await user.type(screen.getByPlaceholderText(/Chicken Caesar Salad/i), "Apple");
    
    await user.click(screen.getByRole("button", { name: /Get Calories/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/api/get-calories", {
        dish_name: "Apple",
        servings: 1,
      });
    });

    // Verify ResultCard renders the data
    await waitFor(() => {
      expect(screen.getByText(/Successfully retrieved calorie data!/i)).toBeInTheDocument();
      expect(screen.getAllByText(/95/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Test DB/i)).toBeInTheDocument();
    });
  });

  test("handles 429 rate limit with countdown", async () => {
    const mockPost = api.post as jest.Mock;
    mockPost.mockResolvedValueOnce({
      status: 429,
      ok: false,
      headers: new Headers({ "Retry-After": "10" }),
    });

    const user = userEvent.setup();
    render(<CaloriesForm />);

    await user.type(screen.getByPlaceholderText(/Chicken Caesar Salad/i), "Banana");
    await user.click(screen.getByRole("button", { name: /Get Calories/i }));

    await waitFor(() => {
      expect(screen.getByText(/Rate limit reached. Please try again in 10s./i)).toBeInTheDocument();
    });

    // Check if button is disabled (it might say "Get Calories" or "Analyzing..." depending on when loading state is cleared)
    // Actually, in finally loading is set to false, so it should say "Get Calories"
    const button = screen.getByRole("button", { name: /Get Calories/i });
    expect(button).toBeDisabled();
  });
});
