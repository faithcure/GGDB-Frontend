// src/components/home/TopCompanySection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBuilding, 
  FaChevronLeft, 
  FaChevronRight,
  FaStar,
  FaGamepad,
  FaTrophy,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChartLine
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TopCompanySection = () => {
  const [selectedCategory, setSelectedCategory] = useState('topstudios');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hovering, setHovering] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scrollByAmount = 300;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  // Categories for companies
  const categories = [
    { id: 'topstudios', label: 'Top Studios', icon: FaBuilding, color: 'text-purple-500' },
    { id: 'aaa', label: 'AAA Studios', icon: FaTrophy, color: 'text-yellow-500' },
    { id: 'indie', label: 'Indie Champions', icon: FaStar, color: 'text-green-500' },
    { id: 'rising', label: 'Rising Studios', icon: FaChartLine, color: 'text-blue-500' },
    { id: 'publishers', label: 'Top Publishers', icon: FaUsers, color: 'text-red-500' }
  ];

  // Mock company data
  const mockCompanies = {
    topstudios: [
      {
        id: "studio1",
        name: "CD Projekt RED",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xo.webp",
        country: "Poland",
        founded: 2002,
        employees: "800+",
        rating: 9.2,
        gamesCount: 12,
        popularGames: ["The Witcher 3", "Cyberpunk 2077", "The Witcher 2"],
        description: "Masters of open-world RPGs with incredible storytelling",
        headquarter: "Warsaw, Poland",
        website: "cdprojektred.com",
        type: "Developer"
      },
      {
        id: "studio2",
        name: "Larian Studios",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xp.webp",
        country: "Belgium",
        founded: 1996,
        employees: "400+",
        rating: 9.4,
        gamesCount: 8,
        popularGames: ["Baldur's Gate 3", "Divinity: Original Sin 2", "Divinity: Original Sin"],
        description: "RPG innovators pushing the boundaries of player choice",
        headquarter: "Ghent, Belgium",
        website: "larian.com",
        type: "Developer"
      },
      {
        id: "studio3",
        name: "FromSoftware",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xq.webp",
        country: "Japan",
        founded: 1986,
        employees: "300+",
        rating: 9.1,
        gamesCount: 25,
        popularGames: ["Elden Ring", "Dark Souls III", "Sekiro"],
        description: "Creators of challenging, atmospheric action RPGs",
        headquarter: "Tokyo, Japan",
        website: "fromsoftware.jp",
        type: "Developer"
      },
      {
        id: "studio4",
        name: "Rockstar Games",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xr.webp",
        country: "USA",
        founded: 1998,
        employees: "2000+",
        rating: 8.9,
        gamesCount: 15,
        popularGames: ["GTA V", "Red Dead Redemption 2", "GTA San Andreas"],
        description: "Open-world pioneers with unmatched production values",
        headquarter: "New York, USA",
        website: "rockstargames.com",
        type: "Developer"
      },
      {
        id: "studio5",
        name: "Insomniac Games",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xs.webp",
        country: "USA",
        founded: 1994,
        employees: "275+",
        rating: 8.7,
        gamesCount: 30,
        popularGames: ["Spider-Man 2", "Ratchet & Clank", "Spider-Man"],
        description: "Masters of fun, colorful action-adventure games",
        headquarter: "Burbank, USA",
        website: "insomniacgames.com",
        type: "Developer"
      }
    ],
    aaa: [
      {
        id: "aaa1",
        name: "Rockstar Games",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xr.webp",
        country: "USA",
        founded: 1998,
        employees: "2000+",
        rating: 8.9,
        gamesCount: 15,
        popularGames: ["GTA V", "Red Dead Redemption 2", "GTA San Andreas"],
        description: "Industry leaders in open-world game development",
        headquarter: "New York, USA",
        website: "rockstargames.com",
        type: "Developer"
      },
      {
        id: "aaa2",
        name: "Bethesda Game Studios",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xt.webp",
        country: "USA",
        founded: 1986,
        employees: "400+",
        rating: 8.3,
        gamesCount: 20,
        popularGames: ["Skyrim", "Fallout 4", "Starfield"],
        description: "Creators of massive open-world RPG experiences",
        headquarter: "Rockville, USA",
        website: "bethesdagamestudios.com",
        type: "Developer"
      },
      {
        id: "aaa3",
        name: "Naughty Dog",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xu.webp",
        country: "USA",
        founded: 1984,
        employees: "320+",
        rating: 9.0,
        gamesCount: 18,
        popularGames: ["The Last of Us", "Uncharted 4", "The Last of Us Part II"],
        description: "Storytelling masters with cinematic excellence",
        headquarter: "Santa Monica, USA",
        website: "naughtydog.com",
        type: "Developer"
      },
      {
        id: "aaa4",
        name: "Santa Monica Studio",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xv.webp",
        country: "USA",
        founded: 1999,
        employees: "300+",
        rating: 8.8,
        gamesCount: 8,
        popularGames: ["God of War", "God of War Ragnarök", "God of War III"],
        description: "Action-adventure perfection with Norse mythology",
        headquarter: "Los Angeles, USA",
        website: "sms.playstation.com",
        type: "Developer"
      },
      {
        id: "aaa5",
        name: "Guerrilla Games",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xw.webp",
        country: "Netherlands",
        founded: 2000,
        employees: "400+",
        rating: 8.6,
        gamesCount: 12,
        popularGames: ["Horizon Zero Dawn", "Horizon Forbidden West", "Killzone"],
        description: "Technical wizards creating stunning open worlds",
        headquarter: "Amsterdam, Netherlands",
        website: "guerrilla-games.com",
        type: "Developer"
      }
    ],
    indie: [
      {
        id: "indie1",
        name: "Team Cherry",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xx.webp",
        country: "Australia",
        founded: 2014,
        employees: "3",
        rating: 9.3,
        gamesCount: 2,
        popularGames: ["Hollow Knight", "Hollow Knight: Silksong"],
        description: "Small team creating metroidvania masterpieces",
        headquarter: "Adelaide, Australia",
        website: "teamcherry.com.au",
        type: "Developer"
      },
      {
        id: "indie2",
        name: "Supergiant Games",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xy.webp",
        country: "USA",
        founded: 2009,
        employees: "20+",
        rating: 9.1,
        gamesCount: 4,
        popularGames: ["Hades", "Bastion", "Transistor"],
        description: "Narrative-driven indie games with incredible art",
        headquarter: "San Francisco, USA",
        website: "supergiantgames.com",
        type: "Developer"
      },
      {
        id: "indie3",
        name: "ConcernedApe",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2xz.webp",
        country: "USA",
        founded: 2011,
        employees: "1",
        rating: 9.0,
        gamesCount: 1,
        popularGames: ["Stardew Valley"],
        description: "Solo developer creating farming simulation perfection",
        headquarter: "Seattle, USA",
        website: "concernedape.com",
        type: "Developer"
      },
      {
        id: "indie4",
        name: "Studio MDHR",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2y0.webp",
        country: "Canada",
        founded: 2010,
        employees: "25+",
        rating: 8.8,
        gamesCount: 1,
        popularGames: ["Cuphead"],
        description: "Hand-drawn animation masters in gaming",
        headquarter: "Ontario, Canada",
        website: "studiomdhr.com",
        type: "Developer"
      },
      {
        id: "indie5",
        name: "InnerSloth",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2y1.webp",
        country: "USA",
        founded: 2015,
        employees: "10+",
        rating: 8.5,
        gamesCount: 3,
        popularGames: ["Among Us", "The Henry Stickmin Collection"],
        description: "Viral sensation creators with simple yet addictive games",
        headquarter: "Redmond, USA",
        website: "innersloth.com",
        type: "Developer"
      }
    ],
    rising: [
      {
        id: "rising1",
        name: "Zeekerss",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2y2.webp",
        country: "Finland",
        founded: 2020,
        employees: "1",
        rating: 8.8,
        gamesCount: 3,
        popularGames: ["Lethal Company", "It Steals"],
        description: "Solo horror game developer taking the world by storm",
        headquarter: "Helsinki, Finland",
        website: "zeekerss.itch.io",
        type: "Developer"
      },
      {
        id: "rising2",
        name: "Pocketpair",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2y3.webp",
        country: "Japan",
        founded: 2015,
        employees: "50+",
        rating: 8.6,
        gamesCount: 5,
        popularGames: ["Palworld", "Craftopia"],
        description: "Innovative Japanese studio blending genres creatively",
        headquarter: "Tokyo, Japan",
        website: "pocketpair.jp",
        type: "Developer"
      },
      {
        id: "rising3",
        name: "Black Salt Games",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2y4.webp",
        country: "New Zealand",
        founded: 2018,
        employees: "8",
        rating: 8.3,
        gamesCount: 2,
        popularGames: ["Dredge", "Backpack Hero"],
        description: "Atmospheric indie games with unique concepts",
        headquarter: "Auckland, New Zealand",
        website: "blacksaltgames.com",
        type: "Developer"
      },
      {
        id: "rising4",
        name: "Team Reptile",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2y5.webp",
        country: "Netherlands",
        founded: 2015,
        employees: "15+",
        rating: 8.5,
        gamesCount: 3,
        popularGames: ["Bomb Rush Cyberfunk", "Lethal League"],
        description: "Stylish indie games with incredible street culture vibes",
        headquarter: "Utrecht, Netherlands",
        website: "teamreptile.com",
        type: "Developer"
      },
      {
        id: "rising5",
        name: "DON'T NOD",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2y6.webp",
        country: "France",
        founded: 2008,
        employees: "300+",
        rating: 8.4,
        gamesCount: 8,
        popularGames: ["Life is Strange", "Jusant", "Vampyr"],
        description: "Narrative-focused games with emotional depth",
        headquarter: "Paris, France",
        website: "dont-nod.com",
        type: "Developer"
      }
    ],
    publishers: [
      {
        id: "pub1",
        name: "Sony Interactive Entertainment",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2y7.webp",
        country: "Japan",
        founded: 1993,
        employees: "2500+",
        rating: 8.8,
        gamesCount: 200,
        popularGames: ["God of War", "Spider-Man", "Horizon"],
        description: "PlayStation's powerhouse publisher with exclusive hits",
        headquarter: "Tokyo, Japan",
        website: "sie.com",
        type: "Publisher"
      },
      {
        id: "pub2",
        name: "Xbox Game Studios",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2y8.webp",
        country: "USA",
        founded: 2000,
        employees: "1500+",
        rating: 8.5,
        gamesCount: 150,
        popularGames: ["Halo", "Forza", "Gears of War"],
        description: "Microsoft's gaming division with diverse portfolio",
        headquarter: "Redmond, USA",
        website: "xbox.com",
        type: "Publisher"
      },
      {
        id: "pub3",
        name: "Nintendo",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2y9.webp",
        country: "Japan",
        founded: 1889,
        employees: "6000+",
        rating: 9.2,
        gamesCount: 500,
        popularGames: ["Mario", "Zelda", "Pokémon"],
        description: "Gaming legends with timeless franchises",
        headquarter: "Kyoto, Japan",
        website: "nintendo.com",
        type: "Publisher"
      },
      {
        id: "pub4",
        name: "Valve Corporation",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2ya.webp",
        country: "USA",
        founded: 1996,
        employees: "350+",
        rating: 8.9,
        gamesCount: 12,
        popularGames: ["Half-Life", "Portal", "Counter-Strike"],
        description: "PC gaming pioneers and Steam creators",
        headquarter: "Bellevue, USA",
        website: "valvesoftware.com",
        type: "Publisher"
      },
      {
        id: "pub5",
        name: "Devolver Digital",
        logo: "https://images.igdb.com/igdb/image/upload/t_logo_med/cl2yb.webp",
        country: "USA",
        founded: 2009,
        employees: "100+",
        rating: 8.7,
        gamesCount: 80,
        popularGames: ["Hotline Miami", "Katana ZERO", "Fall Guys"],
        description: "Indie publisher with bold, unique games",
        headquarter: "Austin, USA",
        website: "devolverdigital.com",
        type: "Publisher"
      }
    ]
  };

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setCompanies(mockCompanies[selectedCategory] || []);
        setLoading(false);
      }, 300);
    };

    loadCompanies();
  }, [selectedCategory]);

  // Auto-scroll every 8 seconds when not hovering
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hovering) scrollRight();
    }, 8000);
    return () => clearInterval(interval);
  }, [hovering]);

  const CompanyCard = ({ company }) => (
    <div className="bg-gray-900 rounded-lg p-6 h-full flex flex-col">
      {/* Company Logo */}
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mr-4">
          <FaBuilding className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">{company.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FaMapMarkerAlt className="w-3 h-3" />
            {company.country}
          </div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-yellow-400 text-sm font-semibold">Rating</div>
          <div className="text-white text-lg font-bold flex items-center gap-1">
            <FaStar className="w-4 h-4 text-yellow-400" />
            {company.rating}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-blue-400 text-sm font-semibold">Games</div>
          <div className="text-white text-lg font-bold flex items-center gap-1">
            <FaGamepad className="w-4 h-4 text-blue-400" />
            {company.gamesCount}
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="flex-grow">
        <p className="text-gray-300 text-sm mb-3">{company.description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">Founded: {company.founded}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUsers className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">Employees: {company.employees}</span>
          </div>
        </div>
      </div>

      {/* Popular Games */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-white text-sm font-semibold mb-2">Popular Games:</div>
        <div className="flex flex-wrap gap-1">
          {company.popularGames.slice(0, 3).map((game, index) => (
            <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
              {game}
            </span>
          ))}
        </div>
      </div>

      {/* Company Type Badge */}
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          company.type === 'Developer' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {company.type}
        </span>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-slate-950 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-purple-400"></div>
              <h2 className="text-3xl font-bold text-white">
                Top Companies
              </h2>
            </div>
            <p className="text-gray-400 text-sm">
              Leading game developers and publishers shaping the industry
            </p>
          </div>
        </motion.div>

        {/* Category Pills */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-purple-400 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${selectedCategory === category.id ? 'text-black' : category.color}`} />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Companies Horizontal Scroll */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              <span className="ml-3 text-gray-400">Loading companies...</span>
            </div>
          ) : (
            <div 
              className="relative group"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {/* Scroll Navigation Buttons */}
              <button
                onClick={scrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-gray-800 text-white p-3 rounded-full shadow hover:bg-gray-700 transition hidden group-hover:block"
              >
                <FaChevronLeft size={20} />
              </button>

              <button
                onClick={scrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-gray-800 text-white p-3 rounded-full shadow hover:bg-gray-700 transition hidden group-hover:block"
              >
                <FaChevronRight size={20} />
              </button>

              {/* Horizontal Scroll Container */}
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4 px-8"
                style={{ scrollPaddingLeft: "2rem", scrollPaddingRight: "2rem" }}
              >
                <AnimatePresence mode="wait">
                  {companies.map((company, index) => (
                    <motion.div
                      key={`${selectedCategory}-${company.id}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="min-w-[320px] max-w-[320px] flex-shrink-0 relative"
                    >
                      <CompanyCard company={company} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopCompanySection;