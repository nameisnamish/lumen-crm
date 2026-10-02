import { useEffect } from "react";

export function useKeyboardShortcut(keyCombo, callback) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const key = keyCombo.toLowerCase();

      if (keyCombo.startsWith("Ctrl+") || keyCombo.startsWith("Cmd+")) {
        const targetKey = keyCombo.split("+")[1].toLowerCase();
        if (isCtrlOrCmd && event.key.toLowerCase() === targetKey) {
          event.preventDefault();
          callback(event);
        }
      } else if (event.key.toLowerCase() === key) {
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyCombo, callback]);
}
