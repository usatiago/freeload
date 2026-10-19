// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "workout-tracker-theme";
const LIGHT_CHROME = "#faf8f4";
const DARK_CHROME = "#141210";

const ThemeContext = createContext({ dark: false, setDark: () => {} });

function applyTheme(dark) {
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? DARK_CHROME : LIGHT_CHROME);
}

/**
 * Remembers whether the app is shown in dark mode. The server always renders the
 * light theme, so the stored choice is applied once the app runs in the browser —
 * that keeps the first paint and the hydrated markup identical.
 */
export function ThemeProvider({ children }) {
  const [dark, setDarkState] = useState(false);

  useEffect(() => {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored === "dark") {
      setDarkState(true);
      applyTheme(true);
    }
  }, []);

  const setDark = useCallback((next) => {
    setDarkState(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // A browser with storage blocked still gets the theme for this session.
    }
  }, []);

  return <ThemeContext.Provider value={{ dark, setDark }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}