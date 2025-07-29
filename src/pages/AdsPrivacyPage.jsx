import React, { useState } from 'react';
import { FaShieldAlt, FaToggleOn, FaToggleOff, FaEye, FaUserSecret, FaCog, FaInfo } from 'react-icons/fa';

const AdsPrivacyPage = () => {
  const [preferences, setPreferences] = useState({
    personalizedAds: true,
    crossSiteTracking: false,
    dataSharing: false,
    analyticsTracking: true,
    emailMarketing: false,
    thirdPartyPartners: false
  });

  const [showSaved, setShowSaved] = useState(false);

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const savePreferences = () => {
    // In a real app, this would save to backend
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const privacyOptions = [
    {
      key: 'personalizedAds',
      title: 'Personalized Advertisements',
      description: 'Show ads based on your gaming interests, browsing history, and platform usage.',
      details: 'This allows us to display gaming ads that are more relevant to your interests, such as games similar to ones you\'ve played or reviewed.',
      category: 'Advertising'
    },
    {
      key: 'crossSiteTracking',
      title: 'Cross-Site Tracking',
      description: 'Allow tracking across different websites to build a more complete profile.',
      details: 'This enables advertisers to show you relevant ads on other gaming websites and platforms you visit.',
      category: 'Tracking'
    },
    {
      key: 'dataSharing',
      title: 'Data Sharing with Partners',
      description: 'Share anonymized data with gaming industry partners for market research.',
      details: 'Your data helps improve gaming experiences industry-wide. All shared data is anonymized and cannot be traced back to you.',
      category: 'Data'
    },
    {
      key: 'analyticsTracking',
      title: 'Analytics and Performance',
      description: 'Help us improve GGDB by tracking how you use our platform.',
      details: 'This data helps us understand which features are most popular and identify areas for improvement.',
      category: 'Analytics'
    },
    {
      key: 'emailMarketing',
      title: 'Marketing Emails',
      description: 'Receive promotional emails about new games, features, and special offers.',
      details: 'Get notified about games you might like, GGDB updates, and exclusive gaming deals from our partners.',
      category: 'Communication'
    },
    {
      key: 'thirdPartyPartners',
      title: 'Third-Party Partner Integration',
      description: 'Allow integration with gaming platforms like Steam, Epic Games, and others.',
      details: 'This enables features like automatic game library sync and achievement tracking across platforms.',
      category: 'Integration'
    }
  ];

  const dataTypes = [
    {
      type: 'Personal Information',
      description: 'Email, username, profile information',
      usage: 'Account management and personalization',
      retention: '2 years after account deletion'
    },
    {
      type: 'Gaming Activity',
      description: 'Games played, reviews written, ratings given',
      usage: 'Recommendations and community features',
      retention: 'Until account deletion'
    },
    {
      type: 'Device Information',
      description: 'Browser type, operating system, device ID',
      usage: 'Platform optimization and security',
      retention: '1 year'
    },
    {
      type: 'Usage Analytics',
      description: 'Pages visited, time spent, features used',
      usage: 'Product improvement and analytics',
      retention: '6 months'
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Advertising': 'text-yellow-400',
      'Tracking': 'text-red-400',
      'Data': 'text-blue-400',
      'Analytics': 'text-green-400',
      'Communication': 'text-purple-400',
      'Integration': 'text-orange-400'
    };
    return colors[category] || 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaShieldAlt className="text-6xl text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Your Ads Privacy Choices</h1>
          <p className="text-xl text-gray-200 mb-4 max-w-3xl mx-auto">
            Control how your data is used for advertising and personalization on GGDB.
          </p>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto">
            We believe in transparency and giving you control over your privacy. Adjust these settings to match your comfort level.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Save Notification */}
        {showSaved && (
          <div className="mb-6 bg-green-600 text-white p-4 rounded-lg text-center">
            ✅ Your privacy preferences have been saved successfully!
          </div>
        )}

        {/* Privacy Controls */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Privacy Controls</h2>
          <div className="space-y-6">
            {privacyOptions.map((option) => (
              <div key={option.key} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold mr-3">{option.title}</h3>
                      <span className={`text-sm font-medium ${getCategoryColor(option.category)}`}>
                        {option.category}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-2">{option.description}</p>
                    <p className="text-sm text-gray-400">{option.details}</p>
                  </div>
                  <div className="ml-6">
                    <button
                      onClick={() => togglePreference(option.key)}
                      className="text-3xl transition-colors"
                    >
                      {preferences[option.key] ? (
                        <FaToggleOn className="text-green-500" />
                      ) : (
                        <FaToggleOff className="text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button 
              onClick={savePreferences}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Save Privacy Preferences
            </button>
          </div>
        </section>

        {/* Data We Collect */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Data We Collect</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {dataTypes.map((dataType, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">{dataType.type}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-300">What: </span>
                    <span className="text-gray-400">{dataType.description}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Why: </span>
                    <span className="text-gray-400">{dataType.usage}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Retention: </span>
                    <span className="text-gray-400">{dataType.retention}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Your Privacy Rights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <FaEye className="text-3xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access</h3>
              <p className="text-gray-300 text-sm">View all data we have about you</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <FaCog className="text-3xl text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Correct</h3>
              <p className="text-gray-300 text-sm">Update or fix your personal information</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <FaUserSecret className="text-3xl text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Delete</h3>
              <p className="text-gray-300 text-sm">Remove your data from our systems</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <FaShieldAlt className="text-3xl text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Portability</h3>
              <p className="text-gray-300 text-sm">Export your data to another service</p>
            </div>
          </div>
        </section>

        {/* Advertising Partners */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Our Advertising Partners</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-300 mb-6">
              We work with trusted advertising partners to show you relevant gaming content. Here are our current partners:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Gaming Ad Network</h4>
                <p className="text-sm text-gray-400">Specialized gaming advertising platform</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Google Ads</h4>
                <p className="text-sm text-gray-400">Display and search advertising</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Amazon DSP</h4>
                <p className="text-sm text-gray-400">Gaming products and services</p>
              </div>
            </div>
            <div className="mt-6">
              <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                View complete list of advertising partners →
              </button>
            </div>
          </div>
        </section>

        {/* Contact & Support */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Privacy Support</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Questions About Privacy?</h3>
              <p className="text-gray-300 mb-4">
                Our privacy team is here to help with any questions or concerns about how your data is used.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Contact Privacy Team
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Data Protection Officer</h3>
              <p className="text-gray-300 mb-4">
                For GDPR and other privacy regulation inquiries, contact our Data Protection Officer.
              </p>
              <div className="text-sm text-gray-400">
                <p>📧 privacy@ggdb.com</p>
                <p>📞 +1 (555) 123-PRIV</p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Information */}
        <section className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <FaInfo className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Legal Notice</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                These privacy choices are provided in compliance with various privacy laws including GDPR, CCPA, and other regional privacy regulations. 
                Your privacy preferences will be respected across all GGDB services and platforms.
              </p>
              <p className="text-gray-400 text-xs">
                Last updated: January 15, 2024 | 
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 ml-1">View full Privacy Policy</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdsPrivacyPage;