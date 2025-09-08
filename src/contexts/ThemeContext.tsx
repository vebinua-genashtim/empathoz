import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'default' | 'high-contrast' | 'accessible-view';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('empathoz-theme') as Theme;
    if (savedTheme && (savedTheme === 'default' || savedTheme === 'high-contrast' || savedTheme === 'accessible-view')) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('empathoz-theme', theme);
    
    // Apply theme class to document root
    const themeClass = theme === 'high-contrast' ? 'theme-high-contrast' : 
                      theme === 'accessible-view' ? 'theme-accessible-view' : 'theme-default';
    document.documentElement.className = themeClass;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};