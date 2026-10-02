import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../../src/hooks/useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return initial value when storage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("should return stored value from localStorage if present", () => {
    window.localStorage.setItem("testKey", JSON.stringify("storedValue"));
    const { result } = renderHook(() => useLocalStorage("testKey", "default"));
    expect(result.current[0]).toBe("storedValue");
  });

  it("should update state and localStorage when setter is called", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));
    act(() => {
      result.current[1]("updated");
    });
    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(window.localStorage.getItem("testKey"))).toBe("updated");
  });
});
