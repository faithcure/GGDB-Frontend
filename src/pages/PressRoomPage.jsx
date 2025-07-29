import React, { useState } from 'react';
import { FaNewspaper, FaDownload, FaCalendar, FaImage, FaVideo, FaFileAlt, FaEnvelope } from 'react-icons/fa';

const PressRoomPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const pressReleases = [
    {
      id: 1,
      title: "GGDB Reaches 1 Million User Reviews Milestone",
      date: "2024-01-15",
      category: "milestone",
      excerpt: "Gaming community celebrates as GGDB platform surpasses one million user-generated reviews, establishing itself as the leading gaming database.",
      featured: true
    },
    {
      id: 2,
      title: "GGDB Launches Advanced AI Recommendation Engine",
      date: "2024-01-10",
      category: "product",
      excerpt: "New machine learning algorithm provides personalized game recommendations based on user preferences and gaming history.",
      featured: false
    },
    {
      id: 3,
      title: "Partnership with Major Gaming Studios Announced",
      date: "2023-12-20",
      category: "partnership",
      excerpt: "GGDB partners with leading game developers to provide exclusive content and early access to upcoming titles.",
      featured: false
    },
    {
      id: 4,
      title: "GGDB Mobile App Downloads Surpass 500K",
      date: "2023-12-15",
      category: "milestone",
      excerpt: "Mobile application continues rapid growth with half a million downloads across iOS and Android platforms.",
      featured: false
    },
    {
      id: 5,
      title: "GGDB Pro Subscription Service Launches",
      date: "2023-12-01",
      category: "product",
      excerpt: "Premium subscription service offers ad-free experience, advanced analytics, and exclusive features for dedicated gamers.",
      featured: false
    }
  ];

  const mediaAssets = [
    {
      type: 'logo',
      title: 'GGDB Logo Package',
      description: 'High-resolution logos in various formats (PNG, SVG, EPS)',
      downloadUrl: '#'
    },
    {
      type: 'screenshot',
      title: 'Platform Screenshots',
      description: 'High-quality screenshots of the GGDB platform and mobile app',
      downloadUrl: '#'
    },
    {
      type: 'video',
      title: 'Product Demo Videos',
      description: 'Promotional and demo videos showcasing GGDB features',
      downloadUrl: '#'
    },
    {
      type: 'factsheet',
      title: 'Company Fact Sheet',
      description: 'Key statistics, milestones, and company information',
      downloadUrl: '#'
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      title: "CEO & Founder",
      bio: "Gaming industry veteran with 15+ years of experience in product development and community building.",
      image: "SJ"
    },
    {
      name: "Mike Chen",
      title: "CTO",
      bio: "Former Google engineer specializing in large-scale data systems and machine learning applications.",
      image: "MC"
    },
    {
      name: "Alex Rodriguez",
      title: "Head of Community",
      bio: "Community management expert with deep connections in the gaming industry and content creation space.",
      image: "AR"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Press Releases' },
    { id: 'product', label: 'Product Updates' },
    { id: 'milestone', label: 'Company Milestones' },
    { id: 'partnership', label: 'Partnerships' }
  ];

  const filteredReleases = selectedCategory === 'all' 
    ? pressReleases 
    : pressReleases.filter(release => release.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaNewspaper className="text-6xl text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Press Room</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Latest news, press releases, and media resources for journalists and media professionals.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              <FaEnvelope className="inline mr-2" />
              Media Contact
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              <FaDownload className="inline mr-2" />
              Media Kit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Press Releases Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Press Releases</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Press Releases List */}
          <div className="space-y-6">
            {filteredReleases.map(release => (
              <article key={release.id} className={`bg-gray-800 rounded-lg p-6 ${
                release.featured ? 'ring-2 ring-blue-500' : ''
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{release.title}</h3>
                      {release.featured && (
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <FaCalendar className="mr-2" />
                      {new Date(release.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <p className="text-gray-300 leading-relaxed">{release.excerpt}</p>
                  </div>
                  <button className="ml-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Read More
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Media Assets Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Media Assets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaAssets.map((asset, index) => {
              const getIcon = () => {
                switch(asset.type) {
                  case 'logo': return <FaImage className="text-yellow-500" />;
                  case 'screenshot': return <FaImage className="text-green-500" />;
                  case 'video': return <FaVideo className="text-red-500" />;
                  case 'factsheet': return <FaFileAlt className="text-blue-500" />;
                  default: return <FaFileAlt className="text-gray-500" />;
                }
              };

              return (
                <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                  <div className="flex items-center mb-4">
                    {getIcon()}
                    <h3 className="text-lg font-semibold ml-3">{asset.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{asset.description}</p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                    <FaDownload className="inline mr-2" />
                    Download
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-blue-400 font-medium mb-3">{member.title}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Company Stats */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Company Highlights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">1M+</div>
              <div className="text-gray-300">User Reviews</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">50K+</div>
              <div className="text-gray-300">Games Listed</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">500K+</div>
              <div className="text-gray-300">App Downloads</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">250K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
          </div>
        </section>

        {/* Media Contact */}
        <section className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Media Contact</h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-300 mb-6">
              For press inquiries, interview requests, or additional information, please contact our media relations team.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Emma Wilson</h3>
                <p className="text-gray-400">Head of Communications</p>
                <p className="text-blue-400">press@ggdb.com</p>
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Send Media Inquiry
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PressRoomPage;