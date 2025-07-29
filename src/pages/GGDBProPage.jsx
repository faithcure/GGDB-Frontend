import React, { useState } from 'react';
import { FaCheck, FaCrown, FaStar, FaChartLine, FaShieldAlt, FaDownload, FaMobile, FaDesktop } from 'react-icons/fa';

const GGDBProPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const features = [
    {
      icon: <FaCrown className="text-yellow-500" />,
      title: "Ad-Free Experience",
      description: "Enjoy GGDB without any advertisements for a cleaner, faster browsing experience."
    },
    {
      icon: <FaChartLine className="text-blue-500" />,
      title: "Advanced Analytics",
      description: "Get detailed insights into your gaming habits, playtime statistics, and personalized recommendations."
    },
    {
      icon: <FaDownload className="text-green-500" />,
      title: "Export Your Data",
      description: "Download your gaming library, reviews, and statistics in various formats (CSV, JSON, PDF)."
    },
    {
      icon: <FaShieldAlt className="text-red-500" />,
      title: "Priority Support",
      description: "Get faster response times and dedicated support from our customer service team."
    },
    {
      icon: <FaStar className="text-purple-500" />,
      title: "Exclusive Features",
      description: "Access beta features, advanced filtering options, and exclusive content before everyone else."
    },
    {
      icon: <FaMobile className="text-orange-500" />,
      title: "Mobile App Premium",
      description: "Unlock premium features in our mobile app including offline mode and push notifications."
    }
  ];

  const plans = {
    monthly: {
      price: 9.99,
      period: "month",
      savings: null
    },
    yearly: {
      price: 89.99,
      period: "year",
      savings: "Save 25%"
    }
  };

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Gaming Enthusiast",
      avatar: "AC",
      comment: "GGDB Pro has completely transformed how I discover and track games. The analytics are incredible!"
    },
    {
      name: "Sarah Johnson",
      role: "Game Reviewer",
      avatar: "SJ",
      comment: "The ad-free experience and priority support make it worth every penny. Highly recommended!"
    },
    {
      name: "Mike Rodriguez",
      role: "Twitch Streamer",
      avatar: "MR",
      comment: "Export feature is a game-changer for content creators. I can easily share my gaming stats with viewers."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-900 to-orange-900 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaCrown className="text-6xl text-yellow-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6">GGDB Pro</h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Unlock the full potential of GGDB with premium features designed for serious gamers and content creators.
          </p>
          <div className="flex justify-center space-x-4">
            <FaDesktop className="text-2xl text-gray-300" />
            <FaMobile className="text-2xl text-gray-300" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Features Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Premium Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h2>
          
          {/* Plan Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                  selectedPlan === 'monthly'
                    ? 'bg-yellow-600 text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                  selectedPlan === 'yearly'
                    ? 'bg-yellow-600 text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-yellow-900 to-orange-900 rounded-lg p-8 text-center relative">
              {plans[selectedPlan].savings && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {plans[selectedPlan].savings}
                </div>
              )}
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2">
                  ${plans[selectedPlan].price}
                </div>
                <div className="text-gray-200">per {plans[selectedPlan].period}</div>
              </div>
              
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-4 px-8 rounded-lg text-lg transition-colors mb-6">
                Start Free Trial
              </button>
              
              <p className="text-sm text-gray-200">
                7-day free trial • Cancel anytime • No commitment
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Free vs Pro</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-700">
              <div className="font-semibold">Feature</div>
              <div className="font-semibold text-center">Free</div>
              <div className="font-semibold text-center">Pro</div>
            </div>
            
            {[
              { feature: "Browse Games", free: true, pro: true },
              { feature: "Create Reviews", free: true, pro: true },
              { feature: "Basic Stats", free: true, pro: true },
              { feature: "Ad-Free Experience", free: false, pro: true },
              { feature: "Advanced Analytics", free: false, pro: true },
              { feature: "Data Export", free: false, pro: true },
              { feature: "Priority Support", free: false, pro: true },
              { feature: "Beta Features", free: false, pro: true },
              { feature: "Mobile App Premium", free: false, pro: true }
            ].map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 border-b border-gray-700 last:border-b-0">
                <div>{item.feature}</div>
                <div className="text-center">
                  {item.free ? (
                    <FaCheck className="text-green-500 mx-auto" />
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </div>
                <div className="text-center">
                  {item.pro ? (
                    <FaCheck className="text-green-500 mx-auto" />
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Pro Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-black font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your GGDB Pro subscription at any time. Your premium features will remain active until the end of your current billing period."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes! We offer a 7-day free trial for all new GGDB Pro subscribers. You can explore all premium features without any commitment."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various local payment methods depending on your region."
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "You can switch between monthly and yearly plans at any time. Changes will be reflected in your next billing cycle."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GGDBProPage;