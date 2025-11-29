import { createContext, useContext, useEffect, useState } from "react";
import type { CodeTheme } from "@shared/schema";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  codeTheme: CodeTheme;
  setTheme: (theme: Theme) => void;
  setCodeTheme: (theme: CodeTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme;
      if (stored) return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  const [codeTheme, setCodeThemeState] = useState<CodeTheme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("codeTheme") as CodeTheme;
      if (stored) return stored;
    }
    return "vscode-dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("codeTheme", codeTheme);
  }, [codeTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setCodeTheme = (newCodeTheme: CodeTheme) => {
    setCodeThemeState(newCodeTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, codeTheme, setTheme, setCodeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
