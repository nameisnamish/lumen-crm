import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LeadWizardDialog } from "../../src/components/leads/LeadWizardDialog";
import { leadsApi } from "../../src/lib/services";

describe("LeadWizardDialog Multi-step & Async Validation", () => {
  it("progresses from Step 1 to Step 2", async () => {
    render(
      <LeadWizardDialog open={true} onClose={vi.fn()} onSaved={vi.fn()} />
    );

    expect(screen.getByText("Company Name")).toBeInTheDocument();
    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText(/primary contact name/i)).toBeInTheDocument();
    });
  });

  it("blocks Step 2 progression when required name is empty", async () => {
    render(
      <LeadWizardDialog open={true} onClose={vi.fn()} onSaved={vi.fn()} />
    );

    // Go to Step 2
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText(/primary contact name/i)).toBeInTheDocument();
    });

    // Try to advance without name
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    });

    // Should still be on Step 2
    expect(screen.getByText(/primary contact name/i)).toBeInTheDocument();
  });

  it("displays duplicate email error during async validation check", async () => {
    vi.spyOn(leadsApi, "checkEmail").mockResolvedValue({ exists: true });

    render(
      <LeadWizardDialog open={true} onClose={vi.fn()} onSaved={vi.fn()} />
    );

    // Advance to Step 2
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText(/primary contact name/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText("sarah@company.com");
    fireEvent.change(emailInput, { target: { value: "existing@company.com" } });

    await waitFor(() => {
      expect(
        screen.getByText(/a lead with this email already exists in the system/i)
      ).toBeInTheDocument();
    });
  });
});
