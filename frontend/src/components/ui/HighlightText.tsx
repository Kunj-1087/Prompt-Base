import React from 'react';

export const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight || highlight.length < 2) return <>{text}</>;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <>
            {parts.map((part, i) => 
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-500/30 text-white rounded px-0.5">{part}</mark>
                ) : (
                    part
                )
            )}
        </>
    );
};
