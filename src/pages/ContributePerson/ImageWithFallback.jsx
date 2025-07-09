// src/pages/ContributePerson/ImageWithFallback.jsx
import React from "react";

const fallbackImage = "https://placehold.co/300x450?text=No+Image";

// YouTube thumbnail alternatifleri (en yüksek kaliteden en düşüğe)
const getYouTubeThumbnailAlternatives = (originalUrl) => {
    if (!originalUrl.includes('img.youtube.com')) return [];
    
    // URL'den video ID'sini çıkar
    const match = originalUrl.match(/\/vi\/([^\/]+)\//);
    if (!match) return [];
    
    const videoId = match[1];
    return [
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, // 1280x720
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,    // 480x360
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,    // 320x180
        `https://img.youtube.com/vi/${videoId}/default.jpg`       // 120x90
    ];
};

const ImageWithFallback = React.forwardRef(({ src, alt, ...props }, ref) => {
    const [currentSrc, setCurrentSrc] = React.useState(src);
    const [triedAlternatives, setTriedAlternatives] = React.useState([]);
    
    React.useEffect(() => {
        setCurrentSrc(src);
        setTriedAlternatives([]);
    }, [src]);
    
    const handleError = (e) => {
        e.target.onerror = null;
        
        // YouTube thumbnail ise alternatifleri dene
        if (currentSrc.includes('img.youtube.com')) {
            const alternatives = getYouTubeThumbnailAlternatives(currentSrc);
            const untried = alternatives.filter(alt => !triedAlternatives.includes(alt) && alt !== currentSrc);
            
            if (untried.length > 0) {
                const nextSrc = untried[0];
                setTriedAlternatives(prev => [...prev, currentSrc]);
                setCurrentSrc(nextSrc);
                e.target.src = nextSrc;
                return;
            }
        }
        
        // Son çare: fallback image
        e.target.src = fallbackImage;
    };
    
    return (
        <img
            ref={ref}
            src={currentSrc}
            alt={alt}
            {...props}
            onError={handleError}
        />
    );
});

ImageWithFallback.displayName = 'ImageWithFallback';

export default ImageWithFallback;