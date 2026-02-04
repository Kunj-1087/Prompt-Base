import React, { createContext, useContext, useEffect, useState } from 'react';
import { themes, type ThemeColors } from '../config/themes';

interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
    availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    setTheme: () => {},
    availableThemes: [],
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<string>(() => {
        const saved = localStorage.getItem('theme');
        // Default to 'light' if not set, or if set to an invalid value (e.g. from old version)
        if (saved === 'dark') return 'dark';
        return 'light';
    });

    const setTheme = (newTheme: string) => {
        // Enforce valid themes
        const validTheme = newTheme === 'dark' ? 'dark' : 'light';
        setThemeState(validTheme);
        localStorage.setItem('theme', validTheme);
    };

    useEffect(() => {
        // Determine active dataset
         // Default to light if theme key missing (robustness)
        const baseTheme: ThemeColors = themes[theme] || themes['light'];
        
        // Apply CSS variables
        const root = document.documentElement;
        Object.entries(baseTheme).forEach(([key, value]) => {
            if (value) root.style.setProperty(`--color-${key}`, value);
        });

        // Add/remove dark class for Tailwind
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

    }, [theme]);

    return (
        <ThemeContext.Provider value={{ 
            theme, 
            setTheme, 
            availableThemes: Object.keys(themes),
        }}>
            {children}
        </ThemeContext.Provider>
    );
};
