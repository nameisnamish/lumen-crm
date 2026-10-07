import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LeadsTable } from "../../src/pages/leads/LeadsTable";

describe("LeadsTable Component", () => {
  const mockLeads = [
    {
      _id: "lead_1",
      name: "Alice Johnson",
      company: "Acme Corp",
      status: "Qualified",
      priority: "High",
      source: "Website",
      value: 15000,
      updatedAt: "2026-03-01T12:00:00Z",
    },
    {
      _id: "lead_2",
      name: "Bob Smith",
      company: "Beta LLC",
      status: "New",
      priority: "Low",
      source: "Referral",
      value: 5000,
      updatedAt: "2026-03-02T12:00:00Z",
    },
  ];

  it("renders lead rows and formatted values correctly", () => {
    render(
      <MemoryRouter>
        <LeadsTable
          leads={mockLeads}
          selected={new Set()}
          onToggleRow={vi.fn()}
          onToggleAll={vi.fn()}
          allSelected={false}
          sort={{ field: "name", order: "asc" }}
          onSort={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText(/Acme Corp/i)).toBeInTheDocument();
    expect(screen.getByText("Qualified")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText(/Beta LLC/i)).toBeInTheDocument();
  });

  it("calls onSort when column headers are clicked", () => {
    const handleSort = vi.fn();
    render(
      <MemoryRouter>
        <LeadsTable
          leads={mockLeads}
          selected={new Set()}
          onToggleRow={vi.fn()}
          onToggleAll={vi.fn()}
          allSelected={false}
          sort={{ field: "name", order: "asc" }}
          onSort={handleSort}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </MemoryRouter>
    );

    const leadHeader = screen.getByText("Lead");
    fireEvent.click(leadHeader);
    expect(handleSort).toHaveBeenCalledWith("name");
  });
});
