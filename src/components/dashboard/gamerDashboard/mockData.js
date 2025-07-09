import {
  FaGamepad, FaClock, FaBolt, FaEdit, FaChartLine, FaCheckCircle, FaStar, FaCamera,
  FaShieldAlt, FaTwitch, FaYoutube, FaDiscord, FaXbox, FaSteam, FaPlaystation, FaRocket
} from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
export const navigationTabs = [
  { id: 'overview', label: 'Overview', icon: <FaGamepad /> },
  { id: 'library', label: 'Game Library', icon: <FaClock /> },
  { id: 'activity', label: 'Activity', icon: <FaBolt /> },
  { id: 'statistics', label: 'Statistics', icon: <FaChartLine /> },
  { id: 'recommendations', label: 'Recommendations', icon: <FaRocket /> }
];

export const predefinedCovers = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3"
];

export const gamer = {
  username: "ShadowNinja",
  realName: "Alex Chen",
  level: 32,
  xp: 4250,
  xpToNext: 5000,
  avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop",
  country: "US",
  memberSince: "2019",
  rank: "Professional",
  title: "Esports Athlete • Content Creator",
  bio: "",
  location: "Los Angeles, California",
  website: "www.shadowninja.gg",
  userTypes: [
    { type: "Professional", icon: <FaCheckCircle className="text-blue-400" />, colorClass: "bg-blue-500/20 text-blue-400 border-blue-400/50" },
    { type: "Gamer", icon: <FaStar className="text-purple-400" />, colorClass: "bg-purple-500/20 text-purple-400 border-purple-400/50" },
    { type: "Streamer", icon: <FaCamera className="text-red-400" />, colorClass: "bg-red-500/20 text-red-400 border-red-400/50" }
  ],
  roles: [
    { name: "FPS Player", icon: <FaStar className="text-yellow-300" /> },
    { name: "MOBA Expert", icon: <FaStar className="text-yellow-300" /> },
    { name: "Content Creator", icon: <FaStar className="text-yellow-300" /> },
    { name: "Team Captain", icon: <FaStar className="text-yellow-300" /> },
  ],
  stats: {
    totalGames: 342,
    totalHours: 1893,
    completionRate: 87,
    followers: 45200,
    following: 289
  },
  connections: {
    mutual: 156,
    teams: 4,
    sponsorships: 3
  },
  ratings: {
    overall: 4.8,
    totalReviews: 156,
    breakdown: {
      5: 78,
      4: 52,
      3: 18,
      2: 6,
      1: 2
    }
  },
  favoriteGenres: [
 
  ],
  platforms: [

  ],
  socials: [
    { platform: "Twitch", icon: <FaTwitch />, followers: "12.5K", link: "#", color: "#9146FF" },
    { platform: "YouTube", icon: <FaYoutube />, followers: "34.2K", link: "#", color: "#FF0000" },
    { platform: "Discord", icon: <FaDiscord />, members: "892", link: "#", color: "#5865F2" },
    { platform: "Twitter", icon: <FaXTwitter />, followers: "8.3K", link: "#", color: "#1DA1F2" }
  ],
  favoriteGames: [
    {
      id: 1,
      title: "The Witcher 3: Wild Hunt",
      cover: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400",
      hours: 487,
      rating: 5,
      userRating: 9.8,
      status: "completed",
      platform: "PC",
      lastPlayed: "2 days ago"
    },
    {
      id: 2,
      title: "Elden Ring",
      cover: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&h=400",
      hours: 312,
      rating: 5,
      userRating: 9.5,
      status: "playing",
      platform: "PS5",
      lastPlayed: "Yesterday"
    },
    {
      id: 3,
      title: "Cyberpunk 2077",
      cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400",
      hours: 124,
      rating: 4,
      userRating: 8.7,
      status: "completed",
      platform: "PC",
      lastPlayed: "1 week ago"
    },
    {
      id: 4,
      title: "Hades",
      cover: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=400",
      hours: 89,
      rating: 5,
      userRating: 9.2,
      status: "completed",
      platform: "PC",
      lastPlayed: "2 weeks ago"
    }
  ],
  recentActivity: [
    {
      type: "review",
      game: "Baldur's Gate 3",
      title: "Posted a review",
      rating: 5,
      time: "Yesterday",
      icon: <FaEdit />,
      color: "text-yellow-400"
    },
    {
      type: "milestone",
      title: "Reached 2000 hours total playtime",
      time: "3 days ago",
      icon: <FaClock />,
      color: "text-blue-400"
    }
  ]
};
