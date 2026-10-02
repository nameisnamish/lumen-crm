import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../../src/hooks/useDebounce";

describe("useDebounce", () => {
  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes until delay has elapsed", () => {
    vi.useFakeTimers();
    let value = "first";
    const { result, rerender } = renderHook(() => useDebounce(value, 300));

    expect(result.current).toBe("first");

    value = "second";
    rerender();

    // Value should still be old value before delay
    expect(result.current).toBe("first");

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("second");
    vi.useRealTimers();
  });
});
