import React, { useState } from 'react';
import { FaBullhorn, FaChartLine, FaUsers, FaGamepad, FaMobile, FaDesktop, FaEye, FaClock } from 'react-icons/fa';

const AdvertisingPage = () => {
  const [selectedPackage, setSelectedPackage] = useState('premium');

  const audienceStats = [
    { label: 'Monthly Active Users', value: '2.5M+', icon: <FaUsers className="text-blue-500" /> },
    { label: 'Page Views/Month', value: '15M+', icon: <FaEye className="text-green-500" /> },
    { label: 'Average Session Time', value: '8.5min', icon: <FaClock className="text-yellow-500" /> },
    { label: 'Mobile Users', value: '65%', icon: <FaMobile className="text-purple-500" /> }
  ];

  const adFormats = [
    {
      title: 'Banner Advertisements',
      description: 'Traditional display ads in various sizes and positions',
      specs: ['728x90 Leaderboard', '300x250 Rectangle', '160x600 Skyscraper'],
      pricing: 'From $2.50 CPM'
    },
    {
      title: 'Sponsored Content',
      description: 'Native advertising integrated into game reviews and articles',
      specs: ['Game reviews', 'Featured articles', 'Developer spotlights'],
      pricing: 'From $5,000/month'
    },
    {
      title: 'Video Advertisements',
      description: 'Pre-roll and mid-roll video ads in gaming content',
      specs: ['15-30 second videos', 'HD quality required', 'Gaming-focused content'],
      pricing: 'From $8.00 CPM'
    },
    {
      title: 'Newsletter Sponsorship',
      description: 'Reach engaged users through our weekly gaming newsletter',
      specs: ['50k+ subscribers', 'High engagement rate', 'Gaming enthusiasts'],
      pricing: 'From $3,000/edition'
    }
  ];

  const packages = {
    starter: {
      name: 'Starter Package',
      price: '$2,500',
      period: 'per month',
      features: [
        '1M impressions included',
        'Banner ads only',
        'Basic targeting',
        'Monthly reporting',
        'Email support'
      ]
    },
    premium: {
      name: 'Premium Package',
      price: '$7,500',
      period: 'per month',
      features: [
        '5M impressions included',
        'All ad formats',
        'Advanced targeting',
        'Weekly reporting',
        'Dedicated account manager',
        'Custom creative support'
      ]
    },
    enterprise: {
      name: 'Enterprise Package',
      price: 'Custom',
      period: 'pricing',
      features: [
        'Unlimited impressions',
        'Priority placement',
        'Custom ad formats',
        'Real-time reporting',
        'Campaign optimization',
        'Direct support line',
        'Brand safety guarantee'
      ]
    }
  };

  const demographics = [
    { category: 'Age', data: [
      { label: '18-24', percentage: 35 },
      { label: '25-34', percentage: 40 },
      { label: '35-44', percentage: 20 },
      { label: '45+', percentage: 5 }
    ]},
    { category: 'Gaming Platforms', data: [
      { label: 'PC', percentage: 45 },
      { label: 'Console', percentage: 35 },
      { label: 'Mobile', percentage: 30 },
      { label: 'VR', percentage: 10 }
    ]},
    { category: 'Interests', data: [
      { label: 'AAA Games', percentage: 70 },
      { label: 'Indie Games', percentage: 55 },
      { label: 'Gaming Hardware', percentage: 45 },
      { label: 'Esports', percentage: 40 }
    ]}
  ];

  const testimonials = [
    {
      company: 'GameTech Studios',
      logo: 'GTS',
      testimonial: 'GGDB helped us reach our target audience effectively. The engagement rates exceeded our expectations by 40%.',
      author: 'Sarah Chen, Marketing Director'
    },
    {
      company: 'Phoenix Gaming',
      logo: 'PG',
      testimonial: 'The sponsored content format allowed us to showcase our game authentically. Great ROI and professional service.',
      author: 'Mike Rodriguez, Brand Manager'
    },
    {
      company: 'Velocity Interactive',
      logo: 'VI',
      testimonial: 'Working with GGDB has been fantastic. Their audience is exactly who we need to reach for our gaming products.',
      author: 'Alex Johnson, CMO'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaBullhorn className="text-6xl text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Advertise with GGDB</h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Reach millions of passionate gamers with targeted advertising solutions designed for the gaming industry.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Start Campaign
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Download Media Kit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Audience Stats */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Reach Gaming Enthusiasts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audienceStats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}\n          </div>
        </section>

        {/* Ad Formats */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Advertising Formats</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {adFormats.map((format, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">{format.title}</h3>
                <p className="text-gray-300 mb-4">{format.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Specifications:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    {format.specs.map((spec, specIndex) => (
                      <li key={specIndex}>• {spec}</li>
                    ))}\n                  </ul>
                </div>
                <div className="text-purple-400 font-semibold">{format.pricing}</div>
              </div>
            ))}\n          </div>
        </section>

        {/* Packages */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Advertising Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(packages).map(([key, pkg]) => (
              <div key={key} className={`bg-gray-800 rounded-lg p-6 ${
                key === 'premium' ? 'ring-2 ring-purple-500 relative' : ''
              }`}>
                {key === 'premium' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold mb-1">{pkg.price}</div>
                <div className="text-gray-400 mb-6">{pkg.period}</div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  key === 'premium'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}>
                  {key === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Demographics */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Audience Demographics</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {demographics.map((demo, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6 text-center">{demo.category}</h3>
                <div className="space-y-4">
                  {demo.data.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{item.label}</span>
                        <span className="text-sm font-semibold">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Advertise */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose GGDB?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <FaGamepad className="text-4xl text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gaming-Focused</h3>
              <p className="text-gray-300 text-sm">100% gaming audience ensures your ads reach the right people</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <FaChartLine className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">High Engagement</h3>
              <p className="text-gray-300 text-sm">Above-industry-average engagement rates and session times</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <FaDesktop className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Multi-Platform</h3>
              <p className="text-gray-300 text-sm">Reach users across web, mobile, and upcoming platforms</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <FaEye className="text-4xl text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Brand Safe</h3>
              <p className="text-gray-300 text-sm">Premium, moderated environment for your brand</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Client Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.logo}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.company}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic mb-4">"{testimonial.testimonial}"</p>
                <p className="text-sm text-gray-400">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Campaign?</h2>
          <p className="text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
            Get in touch with our advertising team to create a custom campaign that drives results for your gaming business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors">
              Contact Sales Team
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Schedule Demo
            </button>
          </div>
          <div className="mt-6 text-sm text-gray-300">
            <p>📞 +1 (555) 123-4567 | 📧 advertising@ggdb.com</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdvertisingPage;