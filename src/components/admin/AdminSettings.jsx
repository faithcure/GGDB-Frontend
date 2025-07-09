import React, { useState, useEffect } from 'react';
import {
  FaCog,
  FaShieldAlt,
  FaBell,
  FaDatabase,
  FaCloud,
  FaUsers,
  FaGamepad,
  FaSave,
  FaUndo,
  FaSearch,
  FaPalette,
  FaUpload,
  FaImage,
  FaCircle,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('general');
  const [originalSettings, setOriginalSettings] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState({
    general: false,
    security: false,
    content: false,
    seo: false
  });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [settings, setSettings] = useState({
    general: {
      siteName: 'GGDB',
      siteDescription: 'The Ultimate Gaming Database',
      maintenanceMode: false,
      allowRegistrations: true
    },
    security: {
      enableTwoFactor: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      adminAlerts: true,
      userReports: true
    },
    content: {
      autoModeration: true,
      requireGameApproval: true,
      allowUserReviews: true,
      maxFileSize: 10
    },
    seo: {
      titleTemplate: '%s | GGDB - Gaming Database',
      defaultDescription: 'Discover, rate, and review the best games. Join GGDB community for comprehensive gaming database with reviews, ratings, and recommendations.',
      defaultKeywords: 'gaming, games, database, reviews, ratings, GGDB, game recommendations',
      canonicalUrl: 'https://ggdb.com',
      ogImage: 'https://ggdb.com/og-image.jpg',
      twitterCard: 'summary_large_image',
      twitterSite: '@GGDB',
      enableSitemap: true,
      enableJsonLd: true,
      enableAnalytics: true,
      googleAnalyticsId: '',
      googleSearchConsole: '',
      bingWebmasterTools: ''
    },
    branding: {
      faviconUrl: '/favicon.ico',
      faviconSizes: {},
      themeColor: '#1f2937',
      backgroundColor: '#000000',
      appleTouchIcon: '/apple-touch-icon.png',
      manifestUrl: '/manifest.json',
      msApplicationTileColor: '#1f2937',
      lastIconUpdate: null
    }
  });

  const handleSettingChange = (category, key, value) => {
    // Basic validation
    if (value === null || value === undefined) {
      console.warn(`Invalid value for ${category}.${key}:`, value);
      return;
    }
    
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      };
      
      // Check if this category has unsaved changes
      const hasChanges = originalSettings[category] 
        ? JSON.stringify(newSettings[category]) !== JSON.stringify(originalSettings[category])
        : true;
      
      setHasUnsavedChanges(prevChanges => ({
        ...prevChanges,
        [category]: hasChanges
      }));
      
      return newSettings;
    });
  };

  // API çağrıları
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        // Merge with default values to ensure all fields exist
        const mergedSettings = {
          general: {
            siteName: 'GGDB',
            siteDescription: 'The Ultimate Gaming Database',
            maintenanceMode: false,
            allowRegistrations: true,
            ...data.data.general
          },
          security: {
            enableTwoFactor: true,
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            passwordMinLength: 8,
            ...data.data.security
          },
          content: {
            autoModeration: true,
            requireGameApproval: true,
            allowUserReviews: true,
            maxFileSize: 10,
            ...data.data.content
          },
          seo: {
            titleTemplate: '%s | GGDB - Gaming Database',
            defaultDescription: 'Discover, rate, and review the best games. Join GGDB community for comprehensive gaming database with reviews, ratings, and recommendations.',
            defaultKeywords: 'gaming, games, database, reviews, ratings, GGDB, game recommendations',
            canonicalUrl: 'https://ggdb.com',
            ogImage: 'https://ggdb.com/og-image.jpg',
            twitterCard: 'summary_large_image',
            twitterSite: '@GGDB',
            enableSitemap: true,
            enableJsonLd: true,
            enableAnalytics: false,
            googleAnalyticsId: '',
            googleSearchConsole: '',
            bingWebmasterTools: '',
            ...data.data.seo
          },
          branding: {
            faviconUrl: '/favicon.ico',
            faviconSizes: {},
            themeColor: '#1f2937',
            backgroundColor: '#000000',
            appleTouchIcon: '/apple-touch-icon.png',
            manifestUrl: '/manifest.json',
            msApplicationTileColor: '#1f2937',
            lastIconUpdate: null,
            ...data.data.branding
          }
        };
        
        setSettings(mergedSettings);
        setOriginalSettings(mergedSettings);
        // Reset unsaved changes when loading fresh data
        setHasUnsavedChanges({
          general: false,
          security: false,
          content: false,
          seo: false
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        // Update original settings and reset unsaved changes
        setOriginalSettings(settings);
        setHasUnsavedChanges({
          general: false,
          security: false,
          content: false,
          seo: false
        });
        // Auto-hide success message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleFaviconUpload = async (file) => {
    if (!file) return;
    
    // Validate file type - only PNG and ICO
    const allowedTypes = ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please upload a valid favicon file (.ico or .png only)' });
      return;
    }
    
    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 1MB' });
      return;
    }
    
    // Define upload function first
    const uploadFavicon = async () => {
      try {
        setUploading(true);
        setMessage({ type: '', text: '' });
        
        const formData = new FormData();
        formData.append('icon', file);
      
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/admin/upload/favicon`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload favicon');
        }
        
        const data = await response.json();
      if (data.success) {
        // Update settings with new favicon URL
        setSettings(prev => ({
          ...prev,
          branding: {
            ...prev.branding,
            faviconUrl: data.data.faviconUrl,
            faviconWidth: data.data.width,
            faviconHeight: data.data.height,
            faviconFormat: data.data.format,
            lastIconUpdate: data.data.lastUpdate
          }
        }));
        
        // Update the site favicon dynamically
        updateSiteFavicon(data.data.faviconUrl);
        
        setMessage({ type: 'success', text: 'Favicon uploaded successfully!' });
        setFaviconPreview(null);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
      } catch (error) {
        console.error('Error uploading favicon:', error);
        setMessage({ type: 'error', text: 'Failed to upload favicon' });
      } finally {
        setUploading(false);
      }
    };
    
    // Validate image dimensions (max 64x64)
    const img = new Image();
    img.onload = () => {
      if (img.width > 64 || img.height > 64) {
        setMessage({ type: 'error', text: `Image dimensions too large. Maximum size is 64x64 pixels. Current: ${img.width}x${img.height}` });
        return;
      }
      // If validation passes, proceed with upload
      uploadFavicon();
    };
    img.onerror = () => {
      setMessage({ type: 'error', text: 'Invalid image file' });
    };
    img.src = URL.createObjectURL(file);
  };

  const updateSiteFavicon = (faviconUrl) => {
    try {
      // Remove existing favicon links
      const existingLinks = document.querySelectorAll('link[rel*="icon"]');
      existingLinks.forEach(link => link.remove());
      
      // Use direct file URL with cache busting
      const timestamp = Date.now();
      const directFaviconUrl = `${faviconUrl}?v=${timestamp}`;
      
      // Create new favicon link
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = faviconUrl.endsWith('.ico') ? 'image/x-icon' : 'image/png';
      link.href = directFaviconUrl;
      
      // Add to head
      document.head.appendChild(link);
      
      // Also add as shortcut icon for broader compatibility
      const shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      shortcutLink.type = link.type;
      shortcutLink.href = directFaviconUrl;
      document.head.appendChild(shortcutLink);
      
      console.log('Site favicon updated:', directFaviconUrl);
    } catch (error) {
      console.error('Failed to update site favicon:', error);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all settings to default values?')) {
      return;
    }
    
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/settings/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset settings');
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...data.data
        }));
        setOriginalSettings(data.data);
        setHasUnsavedChanges({
          general: false,
          security: false,
          content: false,
          seo: false
        });
        setMessage({ type: 'success', text: 'Settings reset to defaults successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      setMessage({ type: 'error', text: 'Failed to reset settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleForceLogout = async () => {
    if (!window.confirm('Are you sure you want to force logout from all devices? This will invalidate all current sessions and you will need to log in again.')) {
      return;
    }
    
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/force-logout-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to force logout');
      }
      
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Successfully logged out from all devices! You will be redirected to login page in 3 seconds.' });
        
        // Clear local storage and redirect to login after 3 seconds
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 3000);
      }
    } catch (error) {
      console.error('Error during force logout:', error);
      setMessage({ type: 'error', text: 'Failed to force logout from all devices' });
    } finally {
      setSaving(false);
    }
  };

  // Component mount edildiğinde ayarları yükle
  useEffect(() => {
    fetchSettings();
  }, []);

  const SettingSection = ({ title, icon, children }) => (
    <div className="glass-effect rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );

  const SettingRow = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
      <div>
        <div className="text-white font-medium">{label}</div>
        {description && <div className="text-white/60 text-sm">{description}</div>}
      </div>
      <div>{children}</div>
    </div>
  );

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-yellow-500' : 'bg-white/20'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const Input = ({ value, onChange, type = 'text', min, max, ...props }) => {
    const handleChange = (e) => {
      let newValue = e.target.value;
      
      if (type === 'number') {
        newValue = parseInt(newValue);
        if (isNaN(newValue)) newValue = min || 0;
        if (min !== undefined && newValue < min) newValue = min;
        if (max !== undefined && newValue > max) newValue = max;
      }
      
      onChange(newValue);
    };
    
    return (
      <input
        type={type}
        value={value || ''}
        onChange={handleChange}
        min={min}
        max={max}
        className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder-white/40"
        {...props}
      />
    );
  };

  const TextArea = ({ value, onChange, rows = 3, ...props }) => (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none placeholder-white/40"
      {...props}
    />
  );

  const Select = ({ value, onChange, options, ...props }) => (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors"
      style={{ minWidth: '150px' }}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-gray-800 text-white">
          {option.label}
        </option>
      ))}
    </select>
  );

  const FileUpload = ({ label, description, accept, onFileSelect, preview, currentFile, loading }) => {
    const fileInputRef = React.useRef();
    
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setFaviconPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        
        onFileSelect(file);
      }
    };
    
    const clearPreview = () => {
      setFaviconPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaUpload />
            {loading ? 'Uploading...' : 'Choose File'}
          </button>
          
          {/* Current favicon preview */}
          {currentFile && (
            <div className="flex items-center gap-2">
              <img 
                src={currentFile} 
                alt="Current favicon" 
                className="w-8 h-8 rounded border border-white/20"
                onError={(e) => { 
                  e.target.style.display = 'none';
                  console.warn('Failed to load favicon:', currentFile);
                }}
                crossOrigin="anonymous"
              />
              <span className="text-white/60 text-sm">Current</span>
            </div>
          )}
          
          {/* New file preview */}
          {preview && (
            <div className="flex items-center gap-2">
              <img 
                src={preview} 
                alt="Favicon preview" 
                className="w-8 h-8 rounded border border-yellow-500"
              />
              <span className="text-yellow-500 text-sm">New</span>
              <button
                onClick={clearPreview}
                className="text-red-400 hover:text-red-300 p-1"
                title="Remove preview"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {description && (
          <div className="text-white/60 text-sm">{description}</div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'general', name: 'General Settings', icon: <FaCog className="text-blue-500" /> },
    { id: 'security', name: 'Security Settings', icon: <FaShieldAlt className="text-red-500" /> },
    { id: 'content', name: 'Content Management', icon: <FaGamepad className="text-green-500" /> },
    { id: 'seo', name: 'SEO Settings', icon: <FaSearch className="text-purple-500" /> }
  ];

  const TabButton = ({ tab, isActive, onClick, hasChanges }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 relative ${
        isActive
          ? 'bg-yellow-500 text-black shadow-lg'
          : 'bg-white/10 text-white hover:bg-white/20'
      }`}
    >
      {tab.icon}
      {tab.name}
      {hasChanges && (
        <FaCircle className="text-orange-500 text-xs ml-1" title="Unsaved changes" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        <span className="ml-3 text-white">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaUndo />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-lg mb-4 ${
          message.type === 'success' 
            ? 'bg-green-500/20 border border-green-500/50 text-green-300' 
            : 'bg-red-500/20 border border-red-500/50 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            hasChanges={hasUnsavedChanges[tab.id]}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <SettingSection title="General Settings" icon={<FaCog className="text-blue-500" />}>
          <SettingRow label="Site Name" description="The name of your gaming platform">
            <Input
              value={settings.general.siteName}
              onChange={(value) => handleSettingChange('general', 'siteName', value)}
            />
          </SettingRow>
          <SettingRow label="Site Description" description="A brief description of your platform">
            <Input
              value={settings.general.siteDescription}
              onChange={(value) => handleSettingChange('general', 'siteDescription', value)}
            />
          </SettingRow>
          <SettingRow label="Maintenance Mode" description="Temporarily disable the site for maintenance">
            <Toggle
              checked={settings.general.maintenanceMode}
              onChange={(value) => handleSettingChange('general', 'maintenanceMode', value)}
            />
          </SettingRow>
          <SettingRow label="Allow Registrations" description="Enable new user registrations">
            <Toggle
              checked={settings.general.allowRegistrations}
              onChange={(value) => handleSettingChange('general', 'allowRegistrations', value)}
            />
          </SettingRow>
          <SettingRow label="Site Favicon" description="Upload your site's favicon (.ico or .png only, max 64x64 pixels, max 1MB)">
            <FileUpload
              accept=".ico,.png"
              onFileSelect={handleFaviconUpload}
              preview={faviconPreview}
              currentFile={settings.branding?.faviconUrl ? settings.branding.faviconUrl : null}
              loading={uploading}
            />
          </SettingRow>
        </SettingSection>
      )}

      {activeTab === 'security' && (
        <SettingSection title="Security Settings" icon={<FaShieldAlt className="text-red-500" />}>
          <SettingRow label="Two-Factor Authentication" description="Require 2FA for admin accounts">
            <Toggle
              checked={settings.security.enableTwoFactor}
              onChange={(value) => handleSettingChange('security', 'enableTwoFactor', value)}
            />
          </SettingRow>
          <SettingRow label="Session Timeout" description="Minutes before automatic logout">
            <Input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(value) => handleSettingChange('security', 'sessionTimeout', value)}
              min="5"
              max="480"
            />
          </SettingRow>
          <SettingRow label="Max Login Attempts" description="Failed attempts before account lockout">
            <Input
              type="number"
              value={settings.security.maxLoginAttempts}
              onChange={(value) => handleSettingChange('security', 'maxLoginAttempts', value)}
              min="3"
              max="10"
            />
          </SettingRow>
          <SettingRow label="Password Min Length" description="Minimum password length requirement">
            <Input
              type="number"
              value={settings.security.passwordMinLength}
              onChange={(value) => handleSettingChange('security', 'passwordMinLength', value)}
              min="6"
              max="32"
            />
          </SettingRow>
          <SettingRow label="Force Logout from All Devices" description="Log out from all devices (useful for security breaches)">
            <button
              onClick={handleForceLogout}
              disabled={uploading || saving}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <FaSignOutAlt className="text-sm" />
              {uploading || saving ? 'Processing...' : 'Force Logout All'}
            </button>
          </SettingRow>
        </SettingSection>
      )}


      {activeTab === 'content' && (
        <SettingSection title="Content Management" icon={<FaGamepad className="text-green-500" />}>
          <SettingRow label="Auto Moderation" description="Automatically moderate user content">
            <Toggle
              checked={settings.content.autoModeration}
              onChange={(value) => handleSettingChange('content', 'autoModeration', value)}
            />
          </SettingRow>
          <SettingRow label="Require Game Approval" description="All new games need admin approval">
            <Toggle
              checked={settings.content.requireGameApproval}
              onChange={(value) => handleSettingChange('content', 'requireGameApproval', value)}
            />
          </SettingRow>
          <SettingRow label="Allow User Reviews" description="Users can post game reviews">
            <Toggle
              checked={settings.content.allowUserReviews}
              onChange={(value) => handleSettingChange('content', 'allowUserReviews', value)}
            />
          </SettingRow>
          <SettingRow label="Max File Size (MB)" description="Maximum upload size for images">
            <Input
              type="number"
              value={settings.content.maxFileSize}
              onChange={(value) => handleSettingChange('content', 'maxFileSize', value)}
              min="1"
              max="100"
            />
          </SettingRow>
        </SettingSection>
      )}

      {activeTab === 'seo' && (
        <SettingSection title="SEO Settings" icon={<FaSearch className="text-purple-500" />}>
          <SettingRow label="Title Template" description="Template for page titles. Use %s for page title">
            <Input
              value={settings.seo.titleTemplate}
              onChange={(value) => handleSettingChange('seo', 'titleTemplate', value)}
              placeholder="%s | GGDB - Gaming Database"
              style={{ minWidth: '300px' }}
            />
          </SettingRow>
          <SettingRow label="Default Meta Description" description="Default description when page-specific description is not available">
            <TextArea
              value={settings.seo.defaultDescription}
              onChange={(value) => handleSettingChange('seo', 'defaultDescription', value)}
              rows={3}
              placeholder="Discover, rate, and review the best games..."
              style={{ minWidth: '400px' }}
            />
          </SettingRow>
          <SettingRow label="Default Keywords" description="Comma-separated keywords for meta tags">
            <Input
              value={settings.seo.defaultKeywords}
              onChange={(value) => handleSettingChange('seo', 'defaultKeywords', value)}
              placeholder="gaming, games, database, reviews, ratings"
              style={{ minWidth: '300px' }}
            />
          </SettingRow>
          <SettingRow label="Canonical URL" description="Base URL for canonical links">
            <Input
              value={settings.seo.canonicalUrl}
              onChange={(value) => handleSettingChange('seo', 'canonicalUrl', value)}
              placeholder="https://ggdb.com"
              style={{ minWidth: '250px' }}
            />
          </SettingRow>
          <SettingRow label="Default Open Graph Image" description="Default social media sharing image URL">
            <Input
              value={settings.seo.ogImage}
              onChange={(value) => handleSettingChange('seo', 'ogImage', value)}
              placeholder="https://ggdb.com/og-image.jpg"
              style={{ minWidth: '300px' }}
            />
          </SettingRow>
          <SettingRow label="Twitter Card Type" description="Twitter card format for social sharing">
            <Select
              value={settings.seo.twitterCard}
              onChange={(value) => handleSettingChange('seo', 'twitterCard', value)}
              options={[
                { value: 'summary', label: 'Summary' },
                { value: 'summary_large_image', label: 'Summary Large Image' },
                { value: 'app', label: 'App' },
                { value: 'player', label: 'Player' }
              ]}
            />
          </SettingRow>
          <SettingRow label="Twitter Site Handle" description="Your site's Twitter username">
            <Input
              value={settings.seo.twitterSite}
              onChange={(value) => handleSettingChange('seo', 'twitterSite', value)}
              placeholder="@GGDB"
              style={{ minWidth: '150px' }}
            />
          </SettingRow>
          <SettingRow label="Generate Sitemap" description="Automatically generate XML sitemap">
            <Toggle
              checked={settings.seo.enableSitemap}
              onChange={(value) => handleSettingChange('seo', 'enableSitemap', value)}
            />
          </SettingRow>
          <SettingRow label="JSON-LD Schema" description="Enable structured data markup">
            <Toggle
              checked={settings.seo.enableJsonLd}
              onChange={(value) => handleSettingChange('seo', 'enableJsonLd', value)}
            />
          </SettingRow>
          <SettingRow label="Analytics Tracking" description="Enable analytics tracking codes">
            <Toggle
              checked={settings.seo.enableAnalytics}
              onChange={(value) => handleSettingChange('seo', 'enableAnalytics', value)}
            />
          </SettingRow>
          {settings.seo.enableAnalytics && (
            <>
              <SettingRow label="Google Analytics ID" description="Google Analytics measurement ID (G-XXXXXXXXXX)">
                <Input
                  value={settings.seo.googleAnalyticsId}
                  onChange={(value) => handleSettingChange('seo', 'googleAnalyticsId', value)}
                  placeholder="G-XXXXXXXXXX"
                  style={{ minWidth: '200px' }}
                />
              </SettingRow>
              <SettingRow label="Google Search Console" description="Google Search Console verification code">
                <Input
                  value={settings.seo.googleSearchConsole}
                  onChange={(value) => handleSettingChange('seo', 'googleSearchConsole', value)}
                  placeholder="google-site-verification=..."
                  style={{ minWidth: '300px' }}
                />
              </SettingRow>
              <SettingRow label="Bing Webmaster Tools" description="Bing Webmaster Tools verification code">
                <Input
                  value={settings.seo.bingWebmasterTools}
                  onChange={(value) => handleSettingChange('seo', 'bingWebmasterTools', value)}
                  placeholder="msvalidate.01=..."
                  style={{ minWidth: '300px' }}
                />
              </SettingRow>
            </>
          )}
        </SettingSection>
      )}
    </div>
  );
};

export default AdminSettings;