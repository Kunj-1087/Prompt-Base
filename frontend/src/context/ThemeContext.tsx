import React, { createContext, useContext, useEffect, useState } from 'react';
import { themes, type ThemeColors } from '../config/themes';

interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
    availableThemes: string[];
    customColors?: Partial<ThemeColors>;
    updateCustomColor: (key: keyof ThemeColors, value: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    setTheme: () => {},
    availableThemes: [],
    updateCustomColor: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<string>(() => {
        return localStorage.getItem('theme') || 'dark';
    });
    
    // Allow custom overrides (advanced feature)
    const [customColors, setCustomColors] = useState<Partial<ThemeColors>>(() => {
        const saved = localStorage.getItem('custom_theme_colors');
        return saved ? JSON.parse(saved) : {};
    });

    const setTheme = (newTheme: string) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const updateCustomColor = (key: keyof ThemeColors, value: string) => {
        const newColors = { ...customColors, [key]: value };
        setCustomColors(newColors);
        localStorage.setItem('custom_theme_colors', JSON.stringify(newColors));
    };

    useEffect(() => {
        // Determine active dataset
        const baseTheme: ThemeColors = themes[theme] || themes['dark'];
        const activeTheme = { ...baseTheme, ...customColors };

        // Apply CSS variables
        const root = document.documentElement;
        Object.entries(activeTheme).forEach(([key, value]) => {
            if (value) root.style.setProperty(`--color-${key}`, value);
        });

        if (theme === 'light') {
            root.classList.remove('dark');
        } else {
            root.classList.add('dark');
        }

    }, [theme, customColors]);

    return (
        <ThemeContext.Provider value={{ 
            theme, 
            setTheme, 
            availableThemes: Object.keys(themes),
            customColors,
            updateCustomColor
        }}>
            {children}
        </ThemeContext.Provider>
    );
};
