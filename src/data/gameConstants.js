import { 
  FaSteam, 
  FaPlaystation, 
  FaXbox, 
  FaDesktop, 
  FaGooglePlay, 
  FaApple, 
  FaAmazon,
  FaBattleNet,
  FaGamepad,
  FaWindows,
  FaGoogle,
  FaShoppingCart,
  FaStore,
  FaCloud,
  FaRocket,
  FaGlobe
} from "react-icons/fa";

import { 
  SiEpicgames, 
  SiNintendoswitch, 
  SiGogdotcom, 
  SiOrigin, 
  SiUbisoft, 
  SiItchdotio, 
  SiDiscord, 
  SiHumblebundle,
  SiNvidia
} from "react-icons/si";
import React from "react";
import {

  FaMobile,
  FaTv,
  FaVrCardboard
} from "react-icons/fa";
import {

  SiNintendo3Ds,
  SiNintendogamecube,
  SiSteam,

  SiAtari,
  SiSega,
  SiAndroid,
  SiApple as SiAppleIcon,
  SiGooglechrome,
  SiOculus,
  SiValve
} from "react-icons/si";

export const STUDIOS = [
    "Naughty Dog LLC",
    "Nixxes Software",
    "Rockstar Games",
    "CD Projekt Red",
    "Ubisoft",
    "FromSoftware",
    "Bethesda",
  ];
  
  export const PUBLISHERS = [
    "PlayStation Publishing LLC",
    "Valve",
    "Xbox Game Studios",
    "Nintendo",
    "Activision",
  ];
  
  export const GENRES = [
    "Action",
    "RPG",
    "Shooter",
    "Horror",
    "Puzzle",
    "Post-Apocalyptic",
    "Adventure",
    "Platformer",
    "Simulation",
    "Stealth",
  ];
  
  export const TAGS = [
    "Zengin Hikâye",
    "Kıyamet Sonrası",
    "TPS",
    "LGBTİ+",
    "Roguelike",
    "Hayatta Kalma",
    "Mod Desteği",
    "Çok Oyunculu",
    "Tek Oyunculu",
  ];
  
  export const FEATURES = [
    "Tek Oyunculu",
    "Steam Başarımları",
    "Steam Cloud",
    "HDR Desteği",
    "Aile Paylaşımı",
  ];
  
  export const CONTROLLER_SUPPORT = [
    "Xbox Kontrolcüleri",
    "PlayStation Kontrolcüleri",
    "Steam Girdisi API",
  ];
  
  export const LANGUAGES = [
    { name: "Türkçe", interface: true, audio: true, subtitle: true },
    { name: "İngilizce", interface: true, audio: true, subtitle: true },
    { name: "Fransızca", interface: true, audio: true, subtitle: true },
    { name: "İtalyanca", interface: true, audio: true, subtitle: true },
    { name: "Almanca", interface: true, audio: true, subtitle: true },
    // + daha fazlası eklenebilir
  ];
  
  export const RATINGS = [
    { label: "PEGI 3", value: 3 },
    { label: "PEGI 7", value: 7 },
    { label: "PEGI 12", value: 12 },
    { label: "PEGI 16", value: 16 },
    { label: "PEGI 18", value: 18 },
  ];
  
  export const EULA_TYPES = [
    "3. Parti EULA gerektirir",
    "Varsayılan Steam Kullanıcı Sözleşmesi",
  ];

export const PLATFORM_LIST = [
  { key: "steam", label: "Steam", icon: <FaSteam /> },
  { key: "epic", label: "Epic Games", icon: <SiEpicgames /> },
  { key: "gog", label: "GOG", icon: <SiGogdotcom /> },
  { key: "origin", label: "Origin", icon: <SiOrigin /> },
  { key: "eaapp", label: "EA App", icon: <SiOrigin /> },
  { key: "ubisoft", label: "Ubisoft Connect", icon: <SiUbisoft /> },
  { key: "uplay", label: "Uplay", icon: <SiUbisoft /> },
  { key: "battlenet", label: "Battle.net", icon: <FaBattleNet /> },
  { key: "rockstar", label: "Rockstar Games Launcher", icon: <FaRocket /> },
  { key: "xboxstore", label: "Xbox Store", icon: <FaXbox /> },
  { key: "microsoftstore", label: "Microsoft Store", icon: <FaWindows /> },
  { key: "psstore", label: "PlayStation Store", icon: <FaPlaystation /> },
  { key: "nintendoeshop", label: "Nintendo eShop", icon: <SiNintendoswitch /> },
  { key: "itchio", label: "itch.io", icon: <SiItchdotio /> },
  { key: "amazon", label: "Amazon Games", icon: <FaAmazon /> },
  { key: "googleplay", label: "Google Play", icon: <FaGooglePlay /> },
  { key: "appstore", label: "Apple App Store", icon: <FaApple /> },
  { key: "applearcade", label: "Apple Arcade", icon: <FaApple /> },
  { key: "humblestore", label: "Humble Store", icon: <SiHumblebundle /> },
  { key: "discord", label: "Discord", icon: <SiDiscord /> },
  { key: "bethesda", label: "Bethesda.net", icon: <FaDesktop /> },
  { key: "windowsstore", label: "Windows Store", icon: <FaWindows /> },
  { key: "samsung", label: "Samsung Galaxy Store", icon: <FaStore /> },
  { key: "viveport", label: "VIVEPORT", icon: <FaGamepad /> },
  { key: "oculus", label: "Oculus Store", icon: <FaGamepad /> },
  { key: "stadia", label: "Google Stadia", icon: <FaGoogle /> },
  { key: "amazonluna", label: "Amazon Luna", icon: <FaCloud /> },
  { key: "geforcenow", label: "GeForce NOW", icon: <SiNvidia /> },
  { key: "shadow", label: "Shadow", icon: <FaCloud /> },
  { key: "greenmangaming", label: "Green Man Gaming", icon: <FaStore /> },
  { key: "fanatical", label: "Fanatical", icon: <FaStore /> },
  { key: "direct2drive", label: "Direct2Drive", icon: <FaShoppingCart /> },
  { key: "indiegala", label: "IndieGala", icon: <FaStore /> },
  { key: "playasia", label: "PlayAsia", icon: <FaGlobe /> },
  { key: "nuuvem", label: "Nuuvem", icon: <FaStore /> },
  { key: "gamersgate", label: "GamersGate", icon: <FaStore /> },
  { key: "moddb", label: "ModDB", icon: <FaGamepad /> },
  { key: "kartridge", label: "Kartridge", icon: <FaGamepad /> },
  { key: "desura", label: "Desura", icon: <FaGamepad /> },
  { key: "gamejolt", label: "Game Jolt", icon: <FaGamepad /> },
  { key: "arenanet", label: "ArenaNet", icon: <FaGamepad /> },
  { key: "cafebazaar", label: "Café Bazaar", icon: <FaStore /> },
  { key: "qooapp", label: "QooApp", icon: <FaGamepad /> },
  { key: "taptap", label: "TapTap", icon: <FaGamepad /> },
  { key: "gametop", label: "GameTop", icon: <FaGamepad /> },
  { key: "polygon", label: "Polygon", icon: <FaGamepad /> },
  { key: "squareenix", label: "Square Enix Store", icon: <FaGamepad /> },
  { key: "twogame", label: "2Game", icon: <FaStore /> },
  { key: "arcgames", label: "Arc Games", icon: <FaGamepad /> },
  { key: "wargaming", label: "Wargaming.net", icon: <FaGamepad /> },
  { key: "mycom", label: "My.com Game Center", icon: <FaGamepad /> },
  { key: "mailru", label: "Mail.ru Games", icon: <FaGamepad /> },
  { key: "tencent", label: "Tencent WeGame", icon: <FaGamepad /> },
  { key: "enmasse", label: "En Masse Launcher", icon: <FaGamepad /> },
  { key: "antstream", label: "Antstream Arcade", icon: <FaGamepad /> },
];

export const GENRES_LIST = [
  // Main Genres
  { key: "action", label: "Action" },
  { key: "adventure", label: "Adventure" },
  { key: "rpg", label: "RPG" },
  { key: "strategy", label: "Strategy" },
  { key: "simulation", label: "Simulation" },
  { key: "sports", label: "Sports" },
  { key: "racing", label: "Racing" },
  { key: "puzzle", label: "Puzzle" },
  { key: "horror", label: "Horror" },
  { key: "indie", label: "Indie" },
  { key: "shooter", label: "Shooter" },
  { key: "platformer", label: "Platformer" },
  
  // Sub-genres and Specific Types
  { key: "mmo", label: "MMO" },
  { key: "mmorpg", label: "MMORPG" },
  { key: "jrpg", label: "JRPG" },
  { key: "moba", label: "MOBA" },
  { key: "battle-royale", label: "Battle Royale" },
  { key: "fps", label: "FPS" },
  { key: "tps", label: "Third-Person Shooter" },
  { key: "rts", label: "RTS" },
  { key: "turn-based", label: "Turn-Based" },
  { key: "roguelike", label: "Roguelike" },
  { key: "roguelite", label: "Roguelite" },
  { key: "metroidvania", label: "Metroidvania" },
  { key: "soulslike", label: "Souls-like" },
  
  // Themes and Settings
  { key: "postapocalyptic", label: "Post-Apocalyptic" },
  { key: "stealth", label: "Stealth" },
  { key: "survival", label: "Survival" },
  { key: "sandbox", label: "Sandbox" },
  { key: "open-world", label: "Open World" },
  { key: "linear", label: "Linear" },
  { key: "sci-fi", label: "Sci-Fi" },
  { key: "fantasy", label: "Fantasy" },
  { key: "medieval", label: "Medieval" },
  { key: "cyberpunk", label: "Cyberpunk" },
  { key: "steampunk", label: "Steampunk" },
  { key: "western", label: "Western" },
  { key: "historical", label: "Historical" },
  { key: "military", label: "Military" },
  { key: "zombie", label: "Zombie" },
  { key: "superhero", label: "Superhero" },
  { key: "space", label: "Space" },
  
  // Art and Visual Styles
  { key: "pixel-art", label: "Pixel Art" },
  { key: "retro", label: "Retro" },
  { key: "minimalist", label: "Minimalist" },
  { key: "cartoon", label: "Cartoon" },
  { key: "realistic", label: "Realistic" },
  { key: "cel-shaded", label: "Cel-Shaded" },
  
  // Gameplay Mechanics
  { key: "crafting", label: "Crafting" },
  { key: "base-building", label: "Base Building" },
  { key: "tower-defense", label: "Tower Defense" },
  { key: "card-game", label: "Card Game" },
  { key: "board-game", label: "Board Game" },
  { key: "rhythm", label: "Rhythm" },
  { key: "music", label: "Music" },
  { key: "dancing", label: "Dancing" },
  { key: "fighting", label: "Fighting" },
  { key: "beat-em-up", label: "Beat 'em Up" },
  { key: "hack-and-slash", label: "Hack and Slash" },
  { key: "bullet-hell", label: "Bullet Hell" },
  { key: "physics", label: "Physics-Based" },
  { key: "time-manipulation", label: "Time Manipulation" },
  
  // Multiplayer Types
  { key: "single-player", label: "Single Player" },
  { key: "multiplayer", label: "Multiplayer" },
  { key: "co-op", label: "Co-op" },
  { key: "competitive", label: "Competitive" },
  { key: "pvp", label: "PvP" },
  { key: "pve", label: "PvE" },
  { key: "local-multiplayer", label: "Local Multiplayer" },
  { key: "online-multiplayer", label: "Online Multiplayer" },
  
  // Specific Game Types
  { key: "visual-novel", label: "Visual Novel" },
  { key: "interactive-fiction", label: "Interactive Fiction" },
  { key: "walking-simulator", label: "Walking Simulator" },
  { key: "photography", label: "Photography" },
  { key: "cooking", label: "Cooking" },
  { key: "farming", label: "Farming" },
  { key: "fishing", label: "Fishing" },
  { key: "city-builder", label: "City Builder" },
  { key: "tycoon", label: "Tycoon" },
  { key: "management", label: "Management" },
  { key: "educational", label: "Educational" },
  { key: "trivia", label: "Trivia" },
  { key: "party", label: "Party Game" },
  { key: "casual", label: "Casual" },
  { key: "arcade", label: "Arcade" },
  { key: "pinball", label: "Pinball" },
  
  // Age and Content
  { key: "family-friendly", label: "Family Friendly" },
  { key: "mature", label: "Mature" },
  { key: "violent", label: "Violent" },
  { key: "non-violent", label: "Non-Violent" },
  
  // Technology and Features
  { key: "vr", label: "VR" },
  { key: "ar", label: "AR" },
  { key: "motion-control", label: "Motion Control" },
  { key: "touch-control", label: "Touch Control" },
  { key: "voice-control", label: "Voice Control" },
  
  // Narrative and Story
  { key: "story-rich", label: "Story Rich" },
  { key: "choices-matter", label: "Choices Matter" },
  { key: "multiple-endings", label: "Multiple Endings" },
  { key: "episodic", label: "Episodic" },
  { key: "mystery", label: "Mystery" },
  { key: "detective", label: "Detective" },
  { key: "noir", label: "Noir" },
  { key: "comedy", label: "Comedy" },
  { key: "drama", label: "Drama" },
  { key: "romance", label: "Romance" },
  
  // Platform Specific
  { key: "mobile", label: "Mobile" },
  { key: "console", label: "Console" },
  { key: "pc", label: "PC" },
  { key: "handheld", label: "Handheld" },
  { key: "browser", label: "Browser Game" },
  
  // Difficulty and Accessibility
  { key: "difficult", label: "Difficult" },
  { key: "relaxing", label: "Relaxing" },
  { key: "accessible", label: "Accessible" },
  { key: "colorblind-friendly", label: "Colorblind Friendly" },
  
  // Length and Replayability
  { key: "short", label: "Short" },
  { key: "long", label: "Long" },
  { key: "endless", label: "Endless" },
  { key: "replay-value", label: "High Replay Value" },
  
  // Experimental and Unique
  { key: "experimental", label: "Experimental" },
  { key: "abstract", label: "Abstract" },
  { key: "surreal", label: "Surreal" },
  { key: "philosophical", label: "Philosophical" },
  { key: "atmospheric", label: "Atmospheric" },
  { key: "immersive", label: "Immersive" },
];

export const CONSOLES_LIST = [
  // 🎮 Current Generation (2020+)
  { key: "ps5", label: "PlayStation 5", icon: <FaPlaystation />, generation: "9th Gen" },
  { key: "xbox-series-x", label: "Xbox Series X", icon: <FaXbox />, generation: "9th Gen" },
  { key: "xbox-series-s", label: "Xbox Series S", icon: <FaXbox />, generation: "9th Gen" },
  { key: "nintendo-switch", label: "Nintendo Switch", icon: <SiNintendoswitch />, generation: "8th Gen" },
  { key: "nintendo-switch-oled", label: "Nintendo Switch OLED", icon: <SiNintendoswitch />, generation: "8th Gen" },
  { key: "steam-deck", label: "Steam Deck", icon: <SiSteam />, generation: "Handheld PC" },

  // 💻 PC Gaming Platforms
  { key: "pc-windows", label: "PC (Windows)", icon: <FaDesktop />, generation: "PC" },
  { key: "mac", label: "Mac", icon: <FaApple />, generation: "PC" },
  { key: "linux", label: "Linux PC", icon: <FaDesktop />, generation: "PC" },
  { key: "steam", label: "Steam", icon: <SiSteam />, generation: "PC Platform" },
  { key: "epic-games", label: "Epic Games Store", icon: <SiEpicgames />, generation: "PC Platform" },
  { key: "gog", label: "GOG", icon: <FaDesktop />, generation: "PC Platform" },

  // 📱 Mobile Gaming
  { key: "ios", label: "iPhone/iPad", icon: <SiAppleIcon />, generation: "Mobile" },
  { key: "android", label: "Android", icon: <SiAndroid />, generation: "Mobile" },
  { key: "nintendo-3ds", label: "Nintendo 3DS", icon: <SiNintendo3Ds />, generation: "Handheld" },
  { key: "nintendo-2ds", label: "Nintendo 2DS", icon: <SiNintendo3Ds />, generation: "Handheld" },
  { key: "ps-vita", label: "PlayStation Vita", icon: <FaPlaystation />, generation: "Handheld" },
  { key: "psp", label: "PlayStation Portable", icon: <FaPlaystation />, generation: "Handheld" },

  // 🎯 8th Generation (2012-2020)
  { key: "ps4", label: "PlayStation 4", icon: <FaPlaystation />, generation: "8th Gen" },
  { key: "ps4-pro", label: "PlayStation 4 Pro", icon: <FaPlaystation />, generation: "8th Gen" },
  { key: "xbox-one", label: "Xbox One", icon: <FaXbox />, generation: "8th Gen" },
  { key: "xbox-one-s", label: "Xbox One S", icon: <FaXbox />, generation: "8th Gen" },
  { key: "xbox-one-x", label: "Xbox One X", icon: <FaXbox />, generation: "8th Gen" },
  { key: "wii-u", label: "Nintendo Wii U", icon: <FaGamepad />, generation: "8th Gen" },

  // 🔥 7th Generation (2005-2012)
  { key: "ps3", label: "PlayStation 3", icon: <FaPlaystation />, generation: "7th Gen" },
  { key: "xbox-360", label: "Xbox 360", icon: <FaXbox />, generation: "7th Gen" },
  { key: "nintendo-wii", label: "Nintendo Wii", icon: <FaGamepad />, generation: "7th Gen" },
  { key: "nintendo-ds", label: "Nintendo DS", icon: <FaGamepad />, generation: "Handheld" },

  // ⚡ 6th Generation (1998-2005)
  { key: "ps2", label: "PlayStation 2", icon: <FaPlaystation />, generation: "6th Gen" },
  { key: "xbox-original", label: "Original Xbox", icon: <FaXbox />, generation: "6th Gen" },
  { key: "nintendo-gamecube", label: "Nintendo GameCube", icon: <SiNintendogamecube />, generation: "6th Gen" },
  { key: "dreamcast", label: "Sega Dreamcast", icon: <SiSega />, generation: "6th Gen" },
  { key: "gba", label: "Game Boy Advance", icon: <FaGamepad />, generation: "Handheld" },

  // 🏆 5th Generation (1993-1998) - Classic Era
  { key: "ps1", label: "PlayStation", icon: <FaPlaystation />, generation: "5th Gen" },
  { key: "nintendo-64", label: "Nintendo 64", icon: <FaGamepad />, generation: "5th Gen" },
  { key: "sega-saturn", label: "Sega Saturn", icon: <SiSega />, generation: "5th Gen" },
  { key: "gameboy-color", label: "Game Boy Color", icon: <FaGamepad />, generation: "Handheld" },

  // 🎭 4th Generation (1987-1993) - 16-bit Era
  { key: "snes", label: "Super Nintendo (SNES)", icon: <FaGamepad />, generation: "4th Gen" },
  { key: "sega-genesis", label: "Sega Genesis/Mega Drive", icon: <SiSega />, generation: "4th Gen" },
  { key: "gameboy", label: "Game Boy", icon: <FaGamepad />, generation: "Handheld" },
  { key: "neo-geo", label: "Neo Geo", icon: <FaGamepad />, generation: "4th Gen" },

  // 🎪 3rd Generation (1983-1987) - 8-bit Era
  { key: "nes", label: "Nintendo Entertainment System", icon: <FaGamepad />, generation: "3rd Gen" },
  { key: "sega-master-system", label: "Sega Master System", icon: <SiSega />, generation: "3rd Gen" },

  // 🕹️ Retro/Classic Consoles (Pre-1983)
  { key: "atari-2600", label: "Atari 2600", icon: <SiAtari />, generation: "2nd Gen" },
  { key: "atari-5200", label: "Atari 5200", icon: <SiAtari />, generation: "2nd Gen" },
  { key: "atari-7800", label: "Atari 7800", icon: <SiAtari />, generation: "3rd Gen" },
  { key: "intellivision", label: "Intellivision", icon: <FaGamepad />, generation: "2nd Gen" },
  { key: "colecovision", label: "ColecoVision", icon: <FaGamepad />, generation: "2nd Gen" },
  { key: "odyssey", label: "Magnavox Odyssey", icon: <FaGamepad />, generation: "1st Gen" },

  // 🥽 VR/AR Gaming
  { key: "oculus-quest", label: "Meta Quest (Oculus)", icon: <SiOculus />, generation: "VR" },
  { key: "oculus-rift", label: "Oculus Rift", icon: <SiOculus />, generation: "VR" },
  { key: "htc-vive", label: "HTC Vive", icon: <FaVrCardboard />, generation: "VR" },
  { key: "valve-index", label: "Valve Index", icon: <SiValve />, generation: "VR" },
  { key: "psvr", label: "PlayStation VR", icon: <FaPlaystation />, generation: "VR" },
  { key: "psvr2", label: "PlayStation VR2", icon: <FaPlaystation />, generation: "VR" },
  { key: "apple-vision-pro", label: "Apple Vision Pro", icon: <FaApple />, generation: "AR/VR" },

  // 📺 TV/Streaming Gaming
  { key: "apple-tv", label: "Apple TV", icon: <FaApple />, generation: "Streaming" },
  { key: "nvidia-shield", label: "NVIDIA Shield TV", icon: <FaTv />, generation: "Streaming" },
  { key: "amazon-fire-tv", label: "Amazon Fire TV", icon: <FaTv />, generation: "Streaming" },
  { key: "chromecast", label: "Google Chromecast", icon: <SiGooglechrome />, generation: "Streaming" },

  // 🎮 Handheld Gaming Devices
  { key: "rog-ally", label: "ASUS ROG Ally", icon: <FaGamepad />, generation: "Handheld PC" },
  { key: "ayn-odin", label: "AYN Odin", icon: <FaGamepad />, generation: "Handheld PC" },
  { key: "gpd-win", label: "GPD Win Series", icon: <FaGamepad />, generation: "Handheld PC" },
  { key: "analogue-pocket", label: "Analogue Pocket", icon: <FaGamepad />, generation: "Retro Handheld" },

  // 🕹️ Arcade & Mini Consoles
  { key: "arcade", label: "Arcade Machines", icon: <FaGamepad />, generation: "Arcade" },
  { key: "nes-classic", label: "NES Classic Mini", icon: <FaGamepad />, generation: "Mini Console" },
  { key: "snes-classic", label: "SNES Classic Mini", icon: <FaGamepad />, generation: "Mini Console" },
  { key: "ps-classic", label: "PlayStation Classic", icon: <FaPlaystation />, generation: "Mini Console" },
  { key: "sega-genesis-mini", label: "Sega Genesis Mini", icon: <SiSega />, generation: "Mini Console" },

  // 🌐 Cloud Gaming Services
  { key: "xbox-cloud", label: "Xbox Cloud Gaming", icon: <FaXbox />, generation: "Cloud Gaming" },
  { key: "geforce-now", label: "GeForce Now", icon: <FaDesktop />, generation: "Cloud Gaming" },
  { key: "amazon-luna", label: "Amazon Luna", icon: <FaGamepad />, generation: "Cloud Gaming" },
  { key: "stadia", label: "Google Stadia (Legacy)", icon: <SiGooglechrome />, generation: "Cloud Gaming" },

  // 🎯 Special/Unique Consoles
  { key: "steam-machine", label: "Steam Machine", icon: <SiSteam />, generation: "PC Console" },
  { key: "ouya", label: "OUYA (Legacy)", icon: <FaGamepad />, generation: "Android Console" },
  { key: "alienware-alpha", label: "Alienware Alpha", icon: <FaDesktop />, generation: "PC Console" },

  // 🔧 Development/Professional
  { key: "unity", label: "Unity Development", icon: <FaDesktop />, generation: "Dev Platform" },
  { key: "unreal", label: "Unreal Engine", icon: <FaDesktop />, generation: "Dev Platform" },
  { key: "dev-kit", label: "Development Kits", icon: <FaGamepad />, generation: "Development" }
];

// Helper function to get consoles by generation
export const getConsolesByGeneration = () => {
  const generations = {};

  CONSOLES_LIST.forEach(console => {
    const gen = console.generation;
    if (!generations[gen]) {
      generations[gen] = [];
    }
    generations[gen].push(console);
  });

  return generations;
};

// Helper function to get console by key
export const getConsoleByKey = (key) => {
  return CONSOLES_LIST.find(console => console.key === key);
};

// Predefined console sets for quick selection
export const CONSOLE_QUICK_SETS = {
  currentGen: {
    name: "Current Generation",
    consoles: ["ps5", "xbox-series-x", "nintendo-switch", "steam-deck"],
    description: "Latest gaming consoles"
  },
  pcGaming: {
    name: "PC Gaming",
    consoles: ["pc-windows", "steam", "epic-games", "gog"],
    description: "PC gaming platforms"
  },
  retro: {
    name: "Retro Gaming",
    consoles: ["nes", "snes", "ps1", "nintendo-64", "sega-genesis"],
    description: "Classic retro consoles"
  },
  handheld: {
    name: "Handheld Gaming",
    consoles: ["nintendo-switch", "steam-deck", "nintendo-3ds", "ps-vita"],
    description: "Portable gaming devices"
  },
  vr: {
    name: "VR Gaming",
    consoles: ["oculus-quest", "psvr2", "valve-index", "htc-vive"],
    description: "Virtual reality platforms"
  },
  mobile: {
    name: "Mobile Gaming",
    consoles: ["ios", "android"],
    description: "Mobile gaming platforms"
  },
  streaming: {
    name: "Cloud Gaming",
    consoles: ["xbox-cloud", "geforce-now", "amazon-luna"],
    description: "Cloud gaming services"
  },
  professional: {
    name: "Game Development",
    consoles: ["unity", "unreal", "dev-kit", "pc-windows"],
    description: "For VFX artists & game developers"
  }
};