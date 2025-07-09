import { useEffect } from 'react';

const SEOHead = ({
  title = '',
  description = '',
  keywords = '',
  image = '',
  url = '',
  type = 'website',
  author = '',
  publishedTime = '',
  modifiedTime = '',
  section = '',
  tags = [],
  noIndex = false,
  noFollow = false,
  canonical = '',
  // Game-specific SEO props
  gameTitle = '',
  gameDescription = '',
  gameGenres = [],
  gamePlatforms = [],
  gameRating = '',
  gameReleaseDate = '',
  gameDeveloper = '',
  gamePublisher = '',
  // User-specific SEO props
  userName = '',
  userBio = '',
  userGamesPlayed = 0,
  userJoinDate = ''
}) => {
  // Get settings from localStorage or use defaults
  const getSettings = () => {
    try {
      const settings = localStorage.getItem('seoSettings');
      return settings ? JSON.parse(settings) : {
        titleTemplate: '%s | GGDB - Gaming Database',
        defaultDescription: 'Discover, rate, and review the best games. Join GGDB community for comprehensive gaming database with reviews, ratings, and recommendations.',
        defaultKeywords: 'gaming, games, database, reviews, ratings, GGDB, game recommendations',
        canonicalUrl: 'https://ggdb.com',
        ogImage: 'https://ggdb.com/og-image.jpg',
        twitterCard: 'summary_large_image',
        twitterSite: '@GGDB'
      };
    } catch {
      return {
        titleTemplate: '%s | GGDB - Gaming Database',
        defaultDescription: 'Discover, rate, and review the best games. Join GGDB community for comprehensive gaming database with reviews, ratings, and recommendations.',
        defaultKeywords: 'gaming, games, database, reviews, ratings, GGDB, game recommendations',
        canonicalUrl: 'https://ggdb.com',
        ogImage: 'https://ggdb.com/og-image.jpg',
        twitterCard: 'summary_large_image',
        twitterSite: '@GGDB'
      };
    }
  };

  const settings = getSettings();

  // Generate title
  const generateTitle = () => {
    if (!title) return 'GGDB - Gaming Database';
    return settings.titleTemplate.replace('%s', title);
  };

  // Generate description
  const generateDescription = () => {
    if (description) return description;
    if (gameDescription) return gameDescription;
    if (userBio) return userBio;
    return settings.defaultDescription;
  };

  // Generate keywords
  const generateKeywords = () => {
    const keywordArray = [];
    
    if (keywords) keywordArray.push(keywords);
    if (gameGenres.length > 0) keywordArray.push(...gameGenres);
    if (gamePlatforms.length > 0) keywordArray.push(...gamePlatforms);
    if (tags.length > 0) keywordArray.push(...tags);
    if (gameDeveloper) keywordArray.push(gameDeveloper);
    if (gamePublisher) keywordArray.push(gamePublisher);
    
    keywordArray.push(settings.defaultKeywords);
    
    return keywordArray.join(', ');
  };

  // Generate image URL
  const generateImageUrl = () => {
    if (image) return image;
    return settings.ogImage;
  };

  // Generate canonical URL
  const generateCanonicalUrl = () => {
    if (canonical) return canonical;
    if (url) return `${settings.canonicalUrl}${url}`;
    return settings.canonicalUrl;
  };

  // Generate robots meta
  const generateRobots = () => {
    const robots = [];
    if (noIndex) robots.push('noindex');
    if (noFollow) robots.push('nofollow');
    if (robots.length === 0) robots.push('index', 'follow');
    return robots.join(', ');
  };

  // Generate JSON-LD structured data
  const generateStructuredData = () => {
    if (gameTitle) {
      // Game structured data
      return {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "name": gameTitle,
        "description": gameDescription || generateDescription(),
        "genre": gameGenres,
        "gamePlatform": gamePlatforms,
        "author": {
          "@type": "Organization",
          "name": gameDeveloper
        },
        "publisher": {
          "@type": "Organization", 
          "name": gamePublisher
        },
        "datePublished": gameReleaseDate,
        "aggregateRating": gameRating ? {
          "@type": "AggregateRating",
          "ratingValue": gameRating,
          "ratingCount": "100"
        } : undefined,
        "url": generateCanonicalUrl(),
        "image": generateImageUrl()
      };
    } else if (userName) {
      // User profile structured data
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": userName,
        "description": userBio || generateDescription(),
        "memberOf": {
          "@type": "Organization",
          "name": "GGDB Gaming Community"
        },
        "url": generateCanonicalUrl(),
        "image": generateImageUrl(),
        "dateCreated": userJoinDate
      };
    } else {
      // Website structured data
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "GGDB - Gaming Database",
        "description": generateDescription(),
        "url": settings.canonicalUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${settings.canonicalUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };
    }
  };

  // Function to set meta tag
  const setMetaTag = (name, content, isProperty = false) => {
    if (!content) return;
    
    const attribute = isProperty ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  // Function to set link tag
  const setLinkTag = (rel, href) => {
    if (!href) return;
    
    let link = document.querySelector(`link[rel="${rel}"]`);
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', href);
  };

  // Function to set structured data
  const setStructuredData = (data) => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Add new structured data
    if (data) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    }
  };

  useEffect(() => {
    const finalTitle = generateTitle();
    const finalDescription = generateDescription();
    const finalKeywords = generateKeywords();
    const finalImage = generateImageUrl();
    const finalCanonical = generateCanonicalUrl();
    const finalRobots = generateRobots();
    const structuredData = generateStructuredData();

    // Set document title
    document.title = finalTitle;

    // Set basic meta tags
    setMetaTag('description', finalDescription);
    setMetaTag('keywords', finalKeywords);
    setMetaTag('robots', finalRobots);
    
    // Set author and article info
    if (author) setMetaTag('author', author);
    if (publishedTime) setMetaTag('article:published_time', publishedTime);
    if (modifiedTime) setMetaTag('article:modified_time', modifiedTime);
    if (section) setMetaTag('article:section', section);
    
    // Set article tags
    tags.forEach((tag, index) => {
      setMetaTag(`article:tag${index}`, tag);
    });

    // Set Open Graph meta tags
    setMetaTag('og:title', finalTitle, true);
    setMetaTag('og:description', finalDescription, true);
    setMetaTag('og:image', finalImage, true);
    setMetaTag('og:url', finalCanonical, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', 'GGDB - Gaming Database', true);
    
    // Set game-specific Open Graph
    gameGenres.forEach((genre, index) => {
      setMetaTag(`og:video:tag${index}`, genre, true);
    });
    
    // Set Twitter Card meta tags
    setMetaTag('twitter:card', settings.twitterCard);
    setMetaTag('twitter:site', settings.twitterSite);
    setMetaTag('twitter:title', finalTitle);
    setMetaTag('twitter:description', finalDescription);
    setMetaTag('twitter:image', finalImage);
    
    // Set mobile meta tags
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    setMetaTag('theme-color', '#1f2937');
    
    // Set additional SEO meta tags
    setMetaTag('language', 'en');
    setMetaTag('revisit-after', '7 days');
    setMetaTag('rating', 'general');
    
    // Set canonical link
    setLinkTag('canonical', finalCanonical);
    
    // Set structured data
    setStructuredData(structuredData);

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      // We don't remove meta tags on cleanup to avoid flickering
      // They will be updated by the next component that renders
    };
  }, [
    title, description, keywords, image, url, type, author,
    publishedTime, modifiedTime, section, tags, noIndex, noFollow,
    canonical, gameTitle, gameDescription, gameGenres, gamePlatforms,
    gameRating, gameReleaseDate, gameDeveloper, gamePublisher,
    userName, userBio, userGamesPlayed, userJoinDate
  ]);

  // This component doesn't render anything visible
  return null;
};

export default SEOHead;