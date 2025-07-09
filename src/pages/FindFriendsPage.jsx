import React from 'react';
import { Users, UserPlus, Search, TrendingUp } from 'lucide-react';
import ConnectionSuggestions from '../components/social/ConnectionSuggestions';
import { useUser } from '../context/UserContext';

const FindFriendsPage = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-400 mb-2">Please Login</h1>
          <p className="text-gray-500">You need to login to find and connect with other gamers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">Find Gaming Friends</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Connect with gamers who share your interests and gaming style
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-xl font-bold text-white">New Suggestions</h3>
                <p className="text-gray-400">Based on your gaming preferences</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <Search className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-xl font-bold text-white">Smart Matching</h3>
                <p className="text-gray-400">AI-powered compatibility score</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="text-xl font-bold text-white">Active Gamers</h3>
                <p className="text-gray-400">Recently active community members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Suggestions */}
        <ConnectionSuggestions limit={12} />

        {/* Tips Section */}
        <div className="mt-12 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Tips for Building Your Gaming Network</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-500 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Complete Your Profile</h3>
                  <p className="text-gray-400 text-sm">Add your favorite genres, platforms, and gaming interests to get better suggestions.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-500 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Be Active</h3>
                  <p className="text-gray-400 text-sm">Rate games, write reviews, and engage with the community to show up in others' suggestions.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-500 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Join Conversations</h3>
                  <p className="text-gray-400 text-sm">Comment on reviews and participate in game discussions to connect with like-minded gamers.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-500 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Share Your Gaming Setup</h3>
                  <p className="text-gray-400 text-sm">Add your gaming platforms and connect your accounts to find others with similar setups.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-500 font-bold">5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Start Conversations</h3>
                  <p className="text-gray-400 text-sm">Don't be shy! Send a message about a game you both enjoy or ask for game recommendations.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-500 font-bold">6</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Build Gradually</h3>
                  <p className="text-gray-400 text-sm">Quality over quantity - focus on building meaningful connections with fellow gamers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindFriendsPage;