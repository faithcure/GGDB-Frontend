import React from 'react';
import { FaGamepad, FaUsers, FaStar, FaNewspaper, FaCog, FaShieldAlt } from 'react-icons/fa';

const SiteIndexPage = () => {
  const siteMap = [
    {
      title: "Games",
      icon: <FaGamepad className="text-yellow-500" />,
      links: [
        { name: "Browse All Games", url: "/games" },
        { name: "Top Rated Games", url: "/top-rated" },
        { name: "New Releases", url: "/games/new" },
        { name: "Upcoming Games", url: "/games/upcoming" },
        { name: "Genres", url: "/genres" },
        { name: "Platforms", url: "/platforms" },
        { name: "Game Awards", url: "/awards" },
        { name: "Search Games", url: "/search" }
      ]
    },
    {
      title: "Community",
      icon: <FaUsers className="text-blue-500" />,
      links: [
        { name: "Community Hub", url: "/community" },
        { name: "Find Friends", url: "/find-friends" },
        { name: "User Profiles", url: "/profiles" },
        { name: "Gaming Groups", url: "/groups" },
        { name: "Forums", url: "/forums" },
        { name: "Leaderboards", url: "/leaderboards" },
        { name: "Tournaments", url: "/tournaments" }
      ]
    },
    {
      title: "Reviews & Ratings",
      icon: <FaStar className="text-orange-500" />,
      links: [
        { name: "Latest Reviews", url: "/reviews" },
        { name: "Featured Reviews", url: "/reviews/featured" },
        { name: "User Reviews", url: "/reviews/user" },
        { name: "Critic Reviews", url: "/reviews/critic" },
        { name: "Review Guidelines", url: "/reviews/guidelines" },
        { name: "Rating System", url: "/ratings/system" }
      ]
    },
    {
      title: "Content & Media",
      icon: <FaNewspaper className="text-green-500" />,
      links: [
        { name: "Gaming News", url: "/news" },
        { name: "Trailers", url: "/trailers" },
        { name: "Screenshots", url: "/screenshots" },
        { name: "Artwork", url: "/artwork" },
        { name: "Game Videos", url: "/videos" },
        { name: "Press Room", url: "/press" },
        { name: "Developer Interviews", url: "/interviews" }
      ]
    },
    {
      title: "Studio & Developers",
      icon: <FaCog className="text-purple-500" />,
      links: [
        { name: "All Studios", url: "/studios" },
        { name: "Featured Developers", url: "/developers" },
        { name: "Indie Games", url: "/indie" },
        { name: "AAA Studios", url: "/aaa-studios" },
        { name: "Publisher Directory", url: "/publishers" },
        { name: "Studio Profiles", url: "/studios/profiles" }
      ]
    },
    {
      title: "Account & Settings",
      icon: <FaShieldAlt className="text-red-500" />,
      links: [
        { name: "My Dashboard", url: "/my-dashboard" },
        { name: "Profile Settings", url: "/settings/profile" },
        { name: "Privacy Settings", url: "/settings/privacy" },
        { name: "Notification Settings", url: "/settings/notifications" },
        { name: "Account Security", url: "/settings/security" },
        { name: "Data Export", url: "/settings/export" },
        { name: "Delete Account", url: "/settings/delete" }
      ]
    }
  ];

  const businessLinks = [
    { name: "GGDB Pro", url: "/pro" },
    { name: "API Documentation", url: "/api" },
    { name: "Advertising", url: "/advertising" },
    { name: "Careers", url: "/jobs" },
    { name: "Partnership", url: "/partnership" },
    { name: "Developer Relations", url: "/developer-relations" }
  ];

  const legalLinks = [
    { name: "Terms of Service", url: "/terms" },
    { name: "Privacy Policy", url: "/privacy" },
    { name: "Cookie Policy", url: "/cookies" },
    { name: "Copyright Policy", url: "/copyright" },
    { name: "Community Guidelines", url: "/guidelines" },
    { name: "Your Ads Privacy Choices", url: "/ads-privacy" }
  ];

  const supportLinks = [
    { name: "Help Center", url: "/help" },
    { name: "Contact Support", url: "/support" },
    { name: "Bug Reports", url: "/bugs" },
    { name: "Feature Requests", url: "/features" },
    { name: "System Status", url: "/status" },
    { name: "Accessibility", url: "/accessibility" }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Site Index</h1>
          <p className="text-xl text-gray-300">Complete directory of all pages and features on GGDB</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Site Sections */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Main Sections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteMap.map((section, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {section.icon}
                  <h3 className="text-xl font-semibold ml-3">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href={link.url} 
                        className="text-gray-300 hover:text-yellow-400 transition-colors text-sm block py-1"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Business & Professional */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Business & Professional</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  className="text-gray-300 hover:text-yellow-400 transition-colors block py-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Legal & Policies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Legal & Policies</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {legalLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  className="text-gray-300 hover:text-yellow-400 transition-colors block py-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Support & Help */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Support & Help</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supportLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  className="text-gray-300 hover:text-yellow-400 transition-colors block py-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-6">GGDB by Numbers</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-yellow-500 mb-2">50,000+</div>
              <div className="text-gray-300">Games Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500 mb-2">1M+</div>
              <div className="text-gray-300">User Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">250K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">5,000+</div>
              <div className="text-gray-300">Game Studios</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SiteIndexPage;