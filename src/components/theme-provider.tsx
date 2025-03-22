
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "clauze-ui-theme",
  ...props
}: ThemeProviderProps) {
  // Fix for "null is not an object" error: Use a safe initial value
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Update theme after component mounts to avoid SSR issues
  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedTheme = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
        return (savedTheme as Theme) || defaultTheme;
      } catch (e) {
        console.error("Error accessing localStorage:", e);
        return defaultTheme;
      }
    };
    
    setTheme(loadTheme());
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, theme);
        }
        setTheme(theme);
      } catch (e) {
        console.error("Error setting theme:", e);
        setTheme(theme); // Still update state even if localStorage fails
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
