import { useEffect, useState } from 'react';
import { API_BASE } from '../config/api';

const useFavicon = () => {
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');
  const [lastUpdate, setLastUpdate] = useState(null);

  // Function to update favicon in the DOM
  const updateFaviconInDOM = (url, timestamp = null) => {
    try {
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(link => link.remove());

      // Use direct file URL with cache busting instead of API endpoint
      const cacheBuster = timestamp || Date.now();
      let faviconUrlWithCache;
      
      if (url && url !== '/favicon.ico') {
        // Use the direct file URL for custom favicons
        faviconUrlWithCache = `${url}?v=${cacheBuster}`;
      } else {
        // Use default favicon
        faviconUrlWithCache = `/favicon.ico?v=${cacheBuster}`;
      }

      // Add new favicon link
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = url && url.endsWith('.png') ? 'image/png' : 'image/x-icon';
      link.href = faviconUrlWithCache;
      
      // Add it to head
      document.head.appendChild(link);

      // Also add as shortcut icon for broader compatibility
      const shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      shortcutLink.type = link.type;
      shortcutLink.href = faviconUrlWithCache;
      document.head.appendChild(shortcutLink);

      console.log('Favicon updated in DOM:', faviconUrlWithCache);
    } catch (error) {
      console.error('Error updating favicon in DOM:', error);
    }
  };

  // Function to fetch current favicon settings
  const fetchFaviconSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/public/settings`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const newFaviconUrl = data.data.faviconUrl || '/favicon.ico';
        const newLastUpdate = data.data.lastIconUpdate;
        
        // Only update if something changed
        if (newFaviconUrl !== faviconUrl || newLastUpdate !== lastUpdate) {
          setFaviconUrl(newFaviconUrl);
          setLastUpdate(newLastUpdate);
          
          // Update favicon in DOM with timestamp for cache busting
          const timestamp = newLastUpdate ? new Date(newLastUpdate).getTime() : Date.now();
          updateFaviconInDOM(newFaviconUrl, timestamp);
        }
      }
    } catch (error) {
      console.error('Error fetching favicon settings:', error);
      // Fallback to default
      if (faviconUrl !== '/favicon.ico') {
        setFaviconUrl('/favicon.ico');
        updateFaviconInDOM('/favicon.ico');
      }
    }
  };

  // Initialize favicon on mount
  useEffect(() => {
    fetchFaviconSettings();
  }, []);

  // Set up periodic checking for favicon updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFaviconSettings();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [faviconUrl, lastUpdate]);

  // Manual refresh function for immediate updates
  const refreshFavicon = () => {
    fetchFaviconSettings();
  };

  return {
    faviconUrl,
    lastUpdate,
    refreshFavicon,
    updateFaviconInDOM
  };
};

export default useFavicon;