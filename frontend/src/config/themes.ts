export interface ThemeColors {
    primary: string;
    'primary-foreground': string;
    secondary: string;
    'secondary-foreground': string;
    background: string;
    foreground: string;
    card: string;
    'card-foreground': string;
    border: string;
    input: string;
    ring: string;
    [key: string]: string;
}

export interface Themes {
    [key: string]: ThemeColors;
}

export const themes: Themes = {
    light: {
        primary: '#2563eb', // blue-600
        'primary-foreground': '#ffffff',
        secondary: '#f1f5f9', // slate-100
        'secondary-foreground': '#0f172a', // slate-900
        background: '#ffffff',
        foreground: '#0f172a',
        card: '#ffffff',
        'card-foreground': '#0f172a',
        border: '#e2e8f0', // slate-200
        input: '#e2e8f0',
        ring: '#2563eb',
    },
    dark: {
        primary: '#3b82f6', // blue-500
        'primary-foreground': '#ffffff',
        secondary: '#1e293b', // slate-800
        'secondary-foreground': '#f8fafc', // slate-50
        background: '#020617', // slate-950
        foreground: '#f8fafc',
        card: '#0f172a', // slate-900
        'card-foreground': '#f8fafc',
        border: '#1e293b', // slate-800
        input: '#1e293b',
        ring: '#1d4ed8',
    },
    ocean: {
        primary: '#06b6d4', // cyan-500
        'primary-foreground': '#ffffff',
        secondary: '#164e63', // cyan-900
        'secondary-foreground': '#cffafe', // cyan-100
        background: '#083344', // cyan-950
        foreground: '#ecfeff', // cyan-50
        card: '#155e75', // cyan-800
        'card-foreground': '#ecfeff',
        border: '#155e75',
        input: '#155e75',
        ring: '#06b6d4',
    },
    sunset: {
        primary: '#f43f5e', // rose-500
        'primary-foreground': '#ffffff',
        secondary: '#881337', // rose-900
        'secondary-foreground': '#ffe4e6', // rose-100
        background: '#4c0519', // rose-950
        foreground: '#fff1f2',
        card: '#be123c', // rose-700
        'card-foreground': '#fff1f2',
        border: '#9f1239',
        input: '#9f1239',
        ring: '#f43f5e',
    }
};
