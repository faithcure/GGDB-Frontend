import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaSearch, FaGamepad, FaUser, FaStar, FaQuestionCircle } from 'react-icons/fa';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const helpCategories = [
    {
      title: "Getting Started",
      icon: <FaGamepad className="text-yellow-500" />,
      articles: [
        "How to create an account",
        "Setting up your profile",
        "Finding games on GGDB",
        "Understanding game ratings"
      ]
    },
    {
      title: "Account & Profile",
      icon: <FaUser className="text-blue-500" />,
      articles: [
        "Managing your profile",
        "Privacy settings",
        "Changing your password",
        "Deleting your account"
      ]
    },
    {
      title: "Reviews & Ratings",
      icon: <FaStar className="text-orange-500" />,
      articles: [
        "How to write a review",
        "Rating guidelines",
        "Reporting inappropriate content",
        "Understanding review scores"
      ]
    },
    {
      title: "Technical Support",
      icon: <FaQuestionCircle className="text-red-500" />,
      articles: [
        "Site not loading properly",
        "Mobile app issues",
        "Browser compatibility",
        "Reporting bugs"
      ]
    }
  ];

  const faqs = [
    {
      question: "How do I create an account on GGDB?",
      answer: "To create an account, click the 'Sign Up' button in the top right corner of any page. Fill in your email, username, and password, then verify your email address."
    },
    {
      question: "Is GGDB free to use?",
      answer: "Yes! GGDB is completely free to use. We also offer GGDB Pro with additional features for users who want an enhanced experience."
    },
    {
      question: "How do I add a game to my library?",
      answer: "Visit any game page and click the 'Add to Library' button. You can organize your games into different categories like 'Playing', 'Completed', 'Wishlist', etc."
    },
    {
      question: "Can I edit or delete my reviews?",
      answer: "Yes, you can edit or delete your reviews at any time. Go to your profile, find the review you want to modify, and use the edit or delete options."
    },
    {
      question: "How does the recommendation system work?",
      answer: "Our recommendation system analyzes your game preferences, ratings, and similar users' tastes to suggest games you might enjoy."
    },
    {
      question: "What should I do if I find incorrect game information?",
      answer: "You can report incorrect information by clicking the 'Report Issue' button on any game page. Our team will review and update the information as needed."
    }
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-gray-300 mb-8">Find answers to your questions and get support</p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Help Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <div className="flex items-center mb-4">
                  {category.icon}
                  <h3 className="text-xl font-semibold ml-3">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <FaChevronDown className="text-yellow-500" />
                  ) : (
                    <FaChevronRight className="text-gray-400" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="mt-16 bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
          <p className="text-gray-300 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
              Contact Support
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Community Forum
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;