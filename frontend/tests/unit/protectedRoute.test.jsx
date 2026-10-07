import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../src/components/layout/ProtectedRoute";
import * as AuthContext from "../../src/context/AuthContext";

describe("ProtectedRoute Component", () => {
  it("redirects unauthenticated user to /login", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page Mock</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Private Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page Mock")).toBeInTheDocument();
    expect(screen.queryByText("Private Dashboard")).not.toBeInTheDocument();
  });

  it("renders children for authenticated user", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: { id: "u1", name: "Alex Carter", email: "demo@lumencrm.com" },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page Mock</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Private Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Private Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Login Page Mock")).not.toBeInTheDocument();
  });

  it("renders loading spinner when auth is loading", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: null,
      loading: true,
    });

    const { container } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>Private Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Private Dashboard")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
