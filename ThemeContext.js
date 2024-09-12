import React, { createContext, useState, useContext } from 'react';

// Create the Theme Context
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle between dark and light modes
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Define the light and dark theme styles
const theme = {
  colors: {
    background: isDarkMode ? '#333' : '#B3B7EE',  // Dark mode background is dark, light mode uses #B3B7EE
    text: isDarkMode ? '#fff' : '#000',            // Text color changes dynamically
    box: isDarkMode ? '#444' : '#D3D4FA',         // Box color adjusts for both modes
    box2: isDarkMode ? '#555' : '#E6E7FB',        // Secondary box color adjusts as needed
    inputBackground: isDarkMode ? '#444' : '#fff', // Input background for visibility
    inputBorder: isDarkMode ? '#777' : '#000',     // Input border for visibility
  },
  isDarkMode,
  toggleTheme,
};

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
