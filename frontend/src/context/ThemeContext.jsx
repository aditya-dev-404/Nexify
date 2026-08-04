import { useState } from "react";
import { ThemeContext } from "./themeContext.js";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(false);

  const toggleTheme = () => {
    setTheme((prevTheme) => !prevTheme);
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}