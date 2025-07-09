import { useState, useEffect } from 'react';

const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceInfo, setMaintenanceInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_URL}/api/games`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 503) {
          const data = await response.json();
          if (data.maintenance) {
            setIsMaintenanceMode(true);
            setMaintenanceInfo(data);
          }
        } else {
          setIsMaintenanceMode(false);
          setMaintenanceInfo(null);
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
        // If there's an error, assume no maintenance mode
        setIsMaintenanceMode(false);
        setMaintenanceInfo(null);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenanceMode();

    // Check maintenance mode every 30 seconds
    const interval = setInterval(checkMaintenanceMode, 30000);

    return () => clearInterval(interval);
  }, []);

  return { isMaintenanceMode, maintenanceInfo, loading };
};

export default useMaintenanceMode;