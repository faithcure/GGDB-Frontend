import React, { useState } from 'react';
import { FaCode, FaCopy, FaCheck, FaKey, FaBook, FaRocket, FaShieldAlt } from 'react-icons/fa';

const APIPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      endpoint: '/api/games',
      description: 'Get a list of games with pagination and filtering',
      parameters: [
        { name: 'page', type: 'integer', description: 'Page number (default: 1)' },
        { name: 'limit', type: 'integer', description: 'Items per page (default: 20, max: 100)' },
        { name: 'genre', type: 'string', description: 'Filter by genre' },
        { name: 'platform', type: 'string', description: 'Filter by platform' },
        { name: 'year', type: 'integer', description: 'Filter by release year' }
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/games/{id}',
      description: 'Get detailed information about a specific game',
      parameters: [
        { name: 'id', type: 'string', description: 'Game ID or slug' }
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/games/{id}/reviews',
      description: 'Get reviews for a specific game',
      parameters: [
        { name: 'id', type: 'string', description: 'Game ID' },
        { name: 'page', type: 'integer', description: 'Page number' },
        { name: 'sort', type: 'string', description: 'Sort by: newest, oldest, rating' }
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/search',
      description: 'Search for games, developers, or studios',
      parameters: [
        { name: 'q', type: 'string', description: 'Search query' },
        { name: 'type', type: 'string', description: 'Search type: games, people, studios' },
        { name: 'limit', type: 'integer', description: 'Results limit' }
      ]
    }
  ];

  const codeExamples = {
    javascript: `// JavaScript/Node.js Example
const GGDB_API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.ggdb.com/v1';

async function getTopRatedGames() {
  try {
    const response = await fetch(\`\${BASE_URL}/games?sort=rating&limit=10\`, {
      headers: {
        'Authorization': \`Bearer \${GGDB_API_KEY}\`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log(data.games);
    return data.games;
  } catch (error) {
    console.error('Error fetching games:', error);
  }
}

getTopRatedGames();`,
    python: `# Python Example
import requests
import json

GGDB_API_KEY = 'your_api_key_here'
BASE_URL = 'https://api.ggdb.com/v1'

def get_top_rated_games():
    headers = {
        'Authorization': f'Bearer {GGDB_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(
        f'{BASE_URL}/games?sort=rating&limit=10',
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        return data['games']
    else:
        print(f'Error: {response.status_code}')
        return None

games = get_top_rated_games()
print(json.dumps(games, indent=2))`,
    curl: `# cURL Example
curl -X GET "https://api.ggdb.com/v1/games?sort=rating&limit=10" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json"`
  };

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      requests: '1,000/month',
      rateLimit: '10/minute',
      support: 'Community',
      features: ['Basic game data', 'Search functionality', 'Public reviews']
    },
    {
      name: 'Developer',
      price: '$29',
      requests: '50,000/month',
      rateLimit: '100/minute',
      support: 'Email',
      features: ['All game data', 'Advanced search', 'User data', 'Analytics']
    },
    {
      name: 'Business',
      price: '$99',
      requests: '500,000/month',
      rateLimit: '500/minute',
      support: 'Priority',
      features: ['Everything in Developer', 'White-label option', 'Custom endpoints']
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      requests: 'Unlimited',
      rateLimit: 'Custom',
      support: 'Dedicated',
      features: ['Everything in Business', 'SLA guarantee', 'On-premise option']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaCode className="text-6xl text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6">GGDB API</h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Access comprehensive gaming data with our powerful RESTful API. Perfect for developers, researchers, and gaming applications.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Get API Key
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap mb-8 border-b border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: <FaBook /> },
            { id: 'endpoints', label: 'Endpoints', icon: <FaRocket /> },
            { id: 'examples', label: 'Examples', icon: <FaCode /> },
            { id: 'pricing', label: 'Pricing', icon: <FaKey /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <FaKey className="text-3xl text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">1. Get API Key</h3>
                  <p className="text-gray-300">Register for a free account and generate your API key in the developer dashboard.</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <FaCode className="text-3xl text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">2. Make Requests</h3>
                  <p className="text-gray-300">Use your API key to authenticate requests to our RESTful endpoints.</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <FaRocket className="text-3xl text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">3. Build Amazing Apps</h3>
                  <p className="text-gray-300">Integrate gaming data into your applications, websites, or research projects.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6">Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Comprehensive Game Database</h3>
                  <p className="text-gray-300 mb-4">Access data for over 50,000 games including metadata, reviews, ratings, and media.</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Game details and descriptions</li>
                    <li>• Release dates and platforms</li>
                    <li>• Developer and publisher information</li>
                    <li>• Screenshots and trailers</li>
                  </ul>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Real-time Data</h3>
                  <p className="text-gray-300 mb-4">Get up-to-date information with real-time synchronization and webhooks.</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Live ratings and reviews</li>
                    <li>• New game releases</li>
                    <li>• Updated game information</li>
                    <li>• Webhook notifications</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Endpoints Tab */}
        {activeTab === 'endpoints' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">API Endpoints</h2>
            {endpoints.map((endpoint, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded text-sm font-bold mr-4 ${
                    endpoint.method === 'GET' ? 'bg-green-600' : 'bg-blue-600'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono text-blue-400">{endpoint.endpoint}</code>
                </div>
                <p className="text-gray-300 mb-4">{endpoint.description}</p>
                {endpoint.parameters && (
                  <div>
                    <h4 className="font-semibold mb-2">Parameters:</h4>
                    <div className="space-y-2">
                      {endpoint.parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex items-start gap-4 text-sm">
                          <code className="text-yellow-400 font-mono">{param.name}</code>
                          <span className="text-gray-500">({param.type})</span>
                          <span className="text-gray-300 flex-1">{param.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Code Examples</h2>
            {Object.entries(codeExamples).map(([language, code]) => (
              <div key={language} className="bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <h3 className="text-xl font-semibold capitalize">{language}</h3>
                  <button
                    onClick={() => copyToClipboard(code, language)}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    {copiedCode === language ? <FaCheck className="text-green-500" /> : <FaCopy />}
                    {copiedCode === language ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-gray-300">{code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-12">API Pricing Plans</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingTiers.map((tier, index) => (
                <div key={index} className={`bg-gray-800 rounded-lg p-6 ${
                  tier.name === 'Developer' ? 'ring-2 ring-blue-500 relative' : ''
                }`}>
                  {tier.name === 'Developer' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold mb-4">{tier.price}</div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Requests:</span>
                      <span>{tier.requests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rate Limit:</span>
                      <span>{tier.rateLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Support:</span>
                      <span>{tier.support}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    tier.name === 'Developer'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}>
                    {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-16 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FaShieldAlt className="text-green-500 text-2xl mr-3" />
            <h3 className="text-xl font-semibold">Security & Best Practices</h3>
          </div>
          <ul className="space-y-2 text-gray-300">
            <li>• Keep your API key secure and never expose it in client-side code</li>
            <li>• Use HTTPS for all API requests</li>
            <li>• Implement proper rate limiting in your applications</li>
            <li>• Cache responses when possible to reduce API calls</li>
            <li>• Monitor your API usage through the developer dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APIPage;