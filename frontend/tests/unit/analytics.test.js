import { describe, it, expect } from "vitest";

function calculateConversionRate(wonCount, lostCount) {
  const totalClosed = wonCount + lostCount;
  if (totalClosed === 0) return 0;
  return Math.round((wonCount / totalClosed) * 100);
}

function calculateStageTotals(deals) {
  return deals.reduce((acc, deal) => {
    acc[deal.status] = (acc[deal.status] || 0) + (deal.value || 0);
    return acc;
  }, {});
}

describe("Sales Analytics & Pipeline Calculation Rules", () => {
  it("calculates conversion rate correctly", () => {
    expect(calculateConversionRate(10, 10)).toBe(50);
    expect(calculateConversionRate(3, 1)).toBe(75);
    expect(calculateConversionRate(0, 0)).toBe(0);
  });

  it("calculates deal totals per pipeline stage", () => {
    const deals = [
      { status: "New", value: 10000 },
      { status: "New", value: 15000 },
      { status: "Won", value: 50000 },
    ];
    const totals = calculateStageTotals(deals);
    expect(totals.New).toBe(25000);
    expect(totals.Won).toBe(50000);
  });
});
