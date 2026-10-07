import { describe, it, expect } from "vitest";

describe("Leads Filtering Logic", () => {
  const sampleLeads = [
    { _id: "1", name: "Alice", status: "New", priority: "High", value: 10000 },
    { _id: "2", name: "Bob", status: "Qualified", priority: "Medium", value: 20000 },
    { _id: "3", name: "Charlie", status: "Won", priority: "Low", value: 30000 },
    { _id: "4", name: "David", status: "New", priority: "Low", value: 15000 },
  ];

  it("filters leads accurately by stage status", () => {
    const filterByStatus = (list, status) =>
      status === "All" ? list : list.filter((l) => l.status === status);

    expect(filterByStatus(sampleLeads, "All")).toHaveLength(4);
    expect(filterByStatus(sampleLeads, "New")).toHaveLength(2);
    expect(filterByStatus(sampleLeads, "Won")).toHaveLength(1);
    expect(filterByStatus(sampleLeads, "Proposal")).toHaveLength(0);
  });

  it("filters leads accurately by priority", () => {
    const filterByPriority = (list, priority) =>
      priority === "All" ? list : list.filter((l) => l.priority === priority);

    expect(filterByPriority(sampleLeads, "High")).toHaveLength(1);
    expect(filterByPriority(sampleLeads, "Low")).toHaveLength(2);
    expect(filterByPriority(sampleLeads, "Medium")).toHaveLength(1);
  });

  it("combines multi-facet stage and priority filtering", () => {
    const multiFilter = (list, { status, priority }) =>
      list.filter((l) => {
        if (status !== "All" && l.status !== status) return false;
        if (priority !== "All" && l.priority !== priority) return false;
        return true;
      });

    const result = multiFilter(sampleLeads, { status: "New", priority: "Low" });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("David");
  });
});
