import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { themes } from '../../config/themes';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';

export const ThemeSettings = () => {
    const { theme, setTheme, availableThemes } = useTheme();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-white mb-4">Theme</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {availableThemes.map((themeKey) => {
                        const themeColors = themes[themeKey];
                        const isActive = theme === themeKey;
                        
                        return (
                            <button
                                key={themeKey}
                                onClick={() => setTheme(themeKey)}
                                className={`
                                    relative group rounded-xl border-2 transition-all p-1
                                    ${isActive 
                                        ? 'border-primary' 
                                        : 'border-transparent hover:border-slate-700'}
                                `}
                            >
                                <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-800 shadow-sm relative">
                                    {/* Preview */}
                                    <div 
                                        className="absolute inset-0 flex flex-col"
                                        style={{ backgroundColor: themeColors.background }}
                                    >
                                        <div className="h-2 w-full" style={{ backgroundColor: themeColors.primary }} />
                                        <div className="flex-1 p-2 flex gap-2">
                                            <div className="w-1/3 h-full rounded bg-slate-500/10" style={{ backgroundColor: themeColors.card }} />
                                            <div className="flex-1 flex flex-col gap-2">
                                                <div className="h-2 w-3/4 rounded bg-slate-500/20" />
                                                <div className="h-2 w-1/2 rounded bg-slate-500/20" />
                                                <div 
                                                    className="mt-auto h-6 w-full rounded" 
                                                    style={{ backgroundColor: themeColors.primary, opacity: 0.2 }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Active Check */}
                                    {isActive && (
                                        <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-lg">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                                <span className="block mt-2 text-sm font-medium text-slate-300 capitalize group-hover:text-white transition-colors">
                                    {themeKey}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            
            {/* Custom Color Overrides could go here */}
        </div>
    );
};
