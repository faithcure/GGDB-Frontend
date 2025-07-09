import React from 'react';

const AdComponent = ({ size = "banner" }) => {
    const dimensions = size === "skyscraper"
        ? { width: '100%', height: '600px', label: '300 × 600' }
        : { width: '100%', height: '250px', label: '300 × 250' };

    return (
        <div
            className="bg-gray-800/30 border-2 border-dashed border-gray-600/50 rounded-lg flex flex-col items-center justify-center text-gray-500/70 hover:border-gray-500/70 transition-colors"
            style={{ width: dimensions.width, height: dimensions.height }}
        >
            <div className="text-4xl mb-2">📢</div>
            <div className="text-sm font-medium">Advertisement</div>
            <div className="text-xs mt-1 opacity-70">{dimensions.label}</div>
        </div>
    );
};

export default AdComponent;