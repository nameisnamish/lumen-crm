import { createContext, useContext, useCallback, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  theme: "system",       // "light" | "dark" | "system"
  compactView: false,
  defaultLeadView: "table", // "table" | "grid"
  notificationsEnabled: true,
  currency: "USD",
  dateFormat: "dd MMM yyyy",
};

/**
 * SettingsContext backed by useLocalStorage for persistence across sessions.
 * Demonstrates useContext + custom hook composition.
 */
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage("lumen_crm_settings", DEFAULT_SETTINGS);

  const updateSetting = useCallback(
    (key, value) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setSettings]
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  const value = useMemo(
    () => ({ settings, updateSetting, resetSettings }),
    [settings, updateSetting, resetSettings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
