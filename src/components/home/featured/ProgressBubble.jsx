// src/components/home/featured/ProgressBubble.jsx

import React, { useEffect, useState } from "react";
import { getMotivationMessage } from "./featuredUtils";

const ProgressBubble = ({ currentProgress = 0, onProgressChange, onSave }) => {
    const [progress, setProgress] = useState(currentProgress);

    useEffect(() => {
        setProgress(currentProgress);
    }, [currentProgress]);

    const handleProgressChange = (newProgress) => {
        setProgress(newProgress);
        onProgressChange(newProgress);
    };

    const handleSave = () => {
        onSave();
    };

    return (
        <div className="relative">
            {/* Arrow positioned for right offset */}
            <div className="absolute -bottom-1 left-8 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black/80"></div>

            {/* Bubble */}
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-3 w-64">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-xs">Progress</span>
                    <span className="text-white font-medium text-sm">{progress}%</span>
                </div>

                {/* Motivation Message */}
                {getMotivationMessage(progress) && (
                    <div className="mb-2 text-center">
            <span className="text-xs font-medium text-yellow-300 animate-pulse">
              {getMotivationMessage(progress)}
            </span>
                    </div>
                )}

                {/* Slider with OK button */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                            style={{
                                background: `linear-gradient(to right, #60a5fa 0%, #34d399 ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`
                            }}
                        />
                    </div>

                    {/* OK Button */}
                    <button
                        onClick={handleSave}
                        className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xs rounded-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                        OK
                    </button>
                </div>

                <style>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            border: 2px solid #3b82f6;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            border: 2px solid #3b82f6;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .slider::-webkit-slider-track {
            background: transparent;
          }
          .slider::-moz-range-track {
            background: transparent;
          }
        `}</style>
            </div>
        </div>
    );
};

export default ProgressBubble;