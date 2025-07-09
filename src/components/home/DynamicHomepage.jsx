// src/components/home/DynamicHomepage.jsx
import React, { useState, useEffect } from 'react';

// Import all available section components
import FeaturedSection from './FeaturedSection';
import FeaturedTodaySection from './FeaturedTodaySection';
import MostVisitedCreditsSection from './MostVisitedCreditsSection';
import WhatToPlaySection from './WhatToPlaySection';
import UpcomingGamesSection from './UpcomingGamesSection';
import TopSection from './TopSection';
import TopCompanySection from './TopCompanySection';

const DynamicHomepage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Component mapping for dynamic rendering
  const componentMap = {
    'FeaturedSection': FeaturedSection,
    'FeaturedTodaySection': FeaturedTodaySection,
    'MostVisitedCreditsSection': MostVisitedCreditsSection,
    'WhatToPlaySection': WhatToPlaySection,
    'UpcomingGamesSection': UpcomingGamesSection,
    'TopSection': TopSection,
    'TopCompanySection': TopCompanySection
  };

  // Default sections if no admin configuration exists
  const defaultSections = [
    {
      id: 'featured',
      name: 'Featured Section',
      component: 'FeaturedSection',
      enabled: true
    },
    {
      id: 'featuredtoday',
      name: 'Featured Today',
      component: 'FeaturedTodaySection',
      enabled: true
    },
    {
      id: 'mostvisited',
      name: 'Most Visited Credits',
      component: 'MostVisitedCreditsSection',
      enabled: true
    },
    {
      id: 'whattoplay',
      name: 'What to Play',
      component: 'WhatToPlaySection',
      enabled: true
    },
    {
      id: 'upcoming',
      name: 'Upcoming Games',
      component: 'UpcomingGamesSection',
      enabled: true
    },
    {
      id: 'topgames',
      name: 'Top Games',
      component: 'TopSection',
      enabled: true
    },
    {
      id: 'topcompanies',
      name: 'Top Companies',
      component: 'TopCompanySection',
      enabled: true
    }
  ];

  const loadSectionOrder = () => {
    try {
      setLoading(true);
      
      console.log('DynamicHomepage: Loading section order...');
      console.log('DynamicHomepage: Current localStorage keys:', Object.keys(localStorage));
      
      // Load section order from localStorage (set by admin panel)
      const savedOrder = localStorage.getItem('homeSectionOrder');
      console.log('DynamicHomepage: Raw localStorage data:', savedOrder);
      console.log('DynamicHomepage: localStorage length:', savedOrder ? savedOrder.length : 'null');
      
      if (savedOrder && savedOrder.trim() !== '') {
        try {
          const parsedSections = JSON.parse(savedOrder);
          console.log('DynamicHomepage: Parsed sections from localStorage:', parsedSections);
          console.log('DynamicHomepage: Number of sections:', parsedSections.length);
          console.log('DynamicHomepage: Enabled sections:', parsedSections.filter(s => s.enabled).length);
          setSections(parsedSections);
        } catch (parseError) {
          console.error('DynamicHomepage: JSON parse error:', parseError);
          console.log('DynamicHomepage: Using default sections due to parse error');
          setSections(defaultSections);
        }
      } else {
        console.log('DynamicHomepage: No saved order found, using default sections');
        console.log('DynamicHomepage: Default sections:', defaultSections);
        setSections(defaultSections);
      }
    } catch (error) {
      console.error('DynamicHomepage: Error loading section order:', error);
      setSections(defaultSections);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('DynamicHomepage: useEffect triggered');
    
    // Small delay to ensure localStorage is available
    const timer = setTimeout(() => {
      loadSectionOrder();
    }, 100);

    // Listen for storage changes (when admin updates the order)
    const handleStorageChange = (e) => {
      if (e.key === 'homeSectionOrder') {
        console.log('DynamicHomepage: Storage change detected');
        loadSectionOrder();
      }
    };

    // Listen for custom events (for same-tab updates)
    const handleCustomUpdate = (event) => {
      console.log('DynamicHomepage: Received custom update event', event.detail);
      loadSectionOrder();
    };

    console.log('DynamicHomepage: Adding event listeners');
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('homepageSectionsUpdated', handleCustomUpdate);
    console.log('DynamicHomepage: Event listeners added');
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('homepageSectionsUpdated', handleCustomUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        <span className="ml-3 text-gray-400">Loading homepage...</span>
      </div>
    );
  }


  const enabledSections = sections.filter(section => section.enabled);
  console.log('Rendering sections:', enabledSections.map(s => `${s.name} (${s.component})`));

  return (
    <>
      {enabledSections.map((section, index) => {
        const Component = componentMap[section.component];
        
        if (!Component) {
          console.warn(`Component ${section.component} not found`);
          return null;
        }

        console.log(`Rendering: ${section.name} (${section.component})`);

        return (
          <React.Fragment key={section.id}>
            <Component />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default DynamicHomepage;