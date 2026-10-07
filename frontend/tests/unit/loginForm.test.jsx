import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/pages/auth/Login";
import * as AuthContext from "../../src/context/AuthContext";

describe("Login Form Component & Validation", () => {
  it("displays validation errors on empty submission", async () => {
    const mockLogin = vi.fn();
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: mockLogin,
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("submits valid credentials and calls login service", async () => {
    const mockLogin = vi.fn().mockResolvedValue({ id: "u1", name: "Alex Carter" });
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      login: mockLogin,
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("you@company.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "demo@lumencrm.com" } });
    fireEvent.change(passwordInput, { target: { value: "demo1234" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "demo@lumencrm.com",
        password: "demo1234",
      });
    });
  });
});
