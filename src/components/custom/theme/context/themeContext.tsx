import  { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeName } from '../utils/themeUtils';




interface ThemeContextProps {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}


const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeName>("green");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

