
import React, { createContext, useState, useEffect } from "react";

// Create a context for the theme
const ThemeContext = createContext();

// Create a provider for the context
const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Toggle the theme and save it to localStorage
  const toggleTheme = () => {
    setIsDarkMode(prevMode =>  !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
