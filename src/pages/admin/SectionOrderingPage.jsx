// src/pages/admin/SectionOrderingPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaGripVertical, 
  FaSave, 
  FaUndo, 
  FaEye, 
  FaEyeSlash,
  FaHome,
  FaGamepad,
  FaTrophy,
  FaBuilding,
  FaCalendarAlt,
  FaStar,
  FaUsers,
  FaChevronUp,
  FaChevronDown
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const SectionOrderingPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initial section data with icons and descriptions
  const initialSections = [
    {
      id: 'featured',
      name: 'Featured Section',
      description: 'Main hero section with featured games carousel',
      icon: FaStar,
      color: 'text-yellow-500',
      enabled: true,
      component: 'FeaturedSection'
    },
    {
      id: 'featuredtoday',
      name: 'Featured Today',
      description: 'Daily featured games showcase',
      icon: FaGamepad,
      color: 'text-blue-500',
      enabled: true,
      component: 'FeaturedTodaySection'
    },
    {
      id: 'mostvisited',
      name: 'Most Visited Credits',
      description: 'Popular cast and crew members',
      icon: FaUsers,
      color: 'text-green-500',
      enabled: true,
      component: 'MostVisitedCreditsSection'
    },
    {
      id: 'whattoplay',
      name: 'What to Play',
      description: 'Personalized game recommendations',
      icon: FaGamepad,
      color: 'text-purple-500',
      enabled: true,
      component: 'WhatToPlaySection'
    },
    {
      id: 'upcoming',
      name: 'Upcoming Games',
      description: 'Most anticipated upcoming releases',
      icon: FaCalendarAlt,
      color: 'text-blue-400',
      enabled: true,
      component: 'UpcomingGamesSection'
    },
    {
      id: 'topgames',
      name: 'Top Games',
      description: 'Highest rated games across categories',
      icon: FaTrophy,
      color: 'text-yellow-400',
      enabled: true,
      component: 'TopSection'
    },
    {
      id: 'topcompanies',
      name: 'Top Companies',
      description: 'Leading game developers and publishers',
      icon: FaBuilding,
      color: 'text-purple-400',
      enabled: true,
      component: 'TopCompanySection'
    }
  ];

  useEffect(() => {
    console.log('Admin: Component mounted, loading sections...');
    loadSectionOrder();
  }, []);

  const loadSectionOrder = async () => {
    console.log('Admin: loadSectionOrder called');
    setLoading(true);
    try {
      // Simulate API call - in real app, fetch from backend
      const savedOrder = localStorage.getItem('homeSectionOrder');
      console.log('Admin: localStorage data:', savedOrder);
      
      if (savedOrder) {
        const parsed = JSON.parse(savedOrder);
        console.log('Admin: Using saved sections:', parsed);
        setSections(parsed);
      } else {
        console.log('Admin: Using initial sections:', initialSections);
        setSections(initialSections);
      }
    } catch (error) {
      console.error('Error loading section order:', error);
      setSections(initialSections);
    } finally {
      setLoading(false);
      console.log('Admin: Loading complete');
    }
  };

  const moveSection = (fromIndex, toIndex) => {
    console.log('Admin: moveSection called', fromIndex, 'to', toIndex);
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, reorderedItem);

    setSections(items);
    setHasChanges(true);
    
    // Auto-save after move
    autoSave(items);
  };

  const toggleSectionEnabled = (sectionId) => {
    console.log('Admin: toggleSectionEnabled called for', sectionId);
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, enabled: !section.enabled }
        : section
    );
    
    console.log('Admin: Updated sections:', updatedSections);
    setSections(updatedSections);
    setHasChanges(true);
    
    // Auto-save after toggle
    autoSave(updatedSections);
  };

  const autoSave = (sectionsToSave) => {
    try {
      console.log('Admin: Auto-saving sections:', sectionsToSave);
      
      // Save to localStorage
      localStorage.setItem('homeSectionOrder', JSON.stringify(sectionsToSave));
      console.log('Admin: Saved to localStorage');
      
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new CustomEvent('homepageSectionsUpdated', {
        detail: { sections: sectionsToSave }
      }));
      console.log('Admin: Dispatched custom event');
      
      // Verify localStorage
      const stored = localStorage.getItem('homeSectionOrder');
      console.log('Admin: Verification - stored data:', stored);
      
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const saveSectionOrder = async () => {
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('homeSectionOrder', JSON.stringify(sections));
      
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new CustomEvent('homepageSectionsUpdated', {
        detail: { sections }
      }));
      
      // Trigger storage event to notify other tabs/windows
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'homeSectionOrder',
        newValue: JSON.stringify(sections),
        url: window.location.href
      }));
      
      // Here you would make an actual API call
      // await axios.post('/api/admin/section-order', { sections });
      
      toast.success('Section order saved successfully! Homepage updated.');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving section order:', error);
      toast.error('Failed to save section order');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefault = () => {
    setSections(initialSections);
    setHasChanges(true);
    
    // Auto-save after reset
    autoSave(initialSections);
    
    toast.info('Reset to default order');
  };

  const SectionCard = ({ section, index, isDragging }) => {
    if (!section) return null;
    
    const IconComponent = section.icon;
    
    return (
      <div className={`bg-gray-800 rounded-lg p-4 mb-3 transition-all duration-200 ${
        isDragging ? 'shadow-2xl rotate-2 scale-105' : 'hover:bg-gray-750'
      } ${!section.enabled ? 'opacity-60' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">            
            {/* Section Icon */}
            <div className={`p-3 rounded-lg bg-gray-700 ${section.color || 'text-gray-400'}`}>
              {IconComponent ? <IconComponent size={20} /> : <FaHome size={20} />}
            </div>
            
            {/* Section Info */}
            <div>
              <h3 className="text-white font-semibold text-lg">{section.name || 'Unknown Section'}</h3>
              <p className="text-gray-400 text-sm">{section.description || 'No description'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  {section.component || 'Unknown'}
                </span>
                <span className="text-xs text-gray-500">Order: {index + 1}</span>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => moveSection(index, Math.max(0, index - 1))}
              disabled={index === 0}
              className="p-2 rounded-lg transition-colors bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              title="Move up"
            >
              <FaChevronUp size={14} />
            </button>
            <button
              onClick={() => moveSection(index, Math.min(sections.length - 1, index + 1))}
              disabled={index === sections.length - 1}
              className="p-2 rounded-lg transition-colors bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              title="Move down"
            >
              <FaChevronDown size={14} />
            </button>
            <button
              onClick={() => toggleSectionEnabled(section.id)}
              className={`p-2 rounded-lg transition-colors ${
                section.enabled 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
              }`}
              title={section.enabled ? 'Hide section' : 'Show section'}
            >
              {section.enabled ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">Loading sections...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FaHome size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Homepage Section Ordering</h1>
              <p className="text-gray-400">Drag and drop to reorder homepage sections</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={saveSectionOrder}
              disabled={!hasChanges || loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                hasChanges && !loading
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaSave size={16} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              <FaUndo size={16} />
              Reset to Default
            </button>
            
            {hasChanges && (
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm">You have unsaved changes</span>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-blue-400 font-semibold mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Use the up/down arrows to reorder sections</li>
            <li>• Click the eye icon to show/hide sections</li>
            <li>• Changes are applied to the homepage immediately after saving</li>
            <li>• Use "Reset to Default" to restore the original order</li>
          </ul>
        </div>

        {/* Section List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Homepage Sections</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-400">Loading sections...</span>
            </div>
          ) : (
            <div className="min-h-[400px]">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SectionCard 
                    section={section} 
                    index={index}
                    isDragging={false}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Info */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Current Section Order:</h3>
          <div className="flex flex-wrap gap-2">
            {sections.filter(s => s.enabled).map((section, index) => (
              <span 
                key={section.id}
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
              >
                {index + 1}. {section.name}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Enabled sections: {sections.filter(s => s.enabled).length} / {sections.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionOrderingPage;