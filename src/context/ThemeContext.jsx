import { createContext, useState, useEffect } from 'react';
import { themes } from '../constants/themes.js';

// Create theme context
const ThemeContext = createContext();

// Theme provider component
export default function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  
  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('gameSheetTheme');
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);
  
  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('gameSheetTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const currentTheme = themes[isDarkMode ? 'dark' : 'light'];
  
  return (
    <ThemeContext.Provider value={{
      theme: currentTheme,
      isDarkMode,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };