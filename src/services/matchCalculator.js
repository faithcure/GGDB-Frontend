// Match Calculator Service - Dynamic game matching based on user preferences
import axios from 'axios';

/**
 * Calculate game match percentage based on user preferences
 * @param {Object} user - User object with preferences
 * @param {Object} game - Game object with details
 * @returns {number} Match percentage (0-100)
 */
export const calculateGameMatch = async (user, game) => {
  if (!user || !game) return null;

  try {
    let matchScore = 0;
    let maxScore = 100;

    // 1. Genre Matching (40% weight)
    const genreScore = calculateGenreMatch(user, game);
    matchScore += genreScore * 0.4;

    // 2. Rating Preference (25% weight)
    const ratingScore = calculateRatingMatch(user, game);
    matchScore += ratingScore * 0.25;

    // 3. Platform Compatibility (15% weight)
    const platformScore = calculatePlatformMatch(user, game);
    matchScore += platformScore * 0.15;

    // 4. Community Activity (10% weight)
    const communityScore = await calculateCommunityMatch(game);
    matchScore += communityScore * 0.1;

    // 5. User Activity History (10% weight)
    const historyScore = await calculateHistoryMatch(user, game);
    matchScore += historyScore * 0.1;

    return Math.round(Math.min(maxScore, Math.max(0, matchScore)));

  } catch (error) {
    console.error('Error calculating game match:', error);
    return null;
  }
};

/**
 * Calculate genre match score
 */
const calculateGenreMatch = (user, game) => {
  if (!user.favoriteGenres || !game.genres) return 0;

  const userGenres = user.favoriteGenres.map(g => 
    (g.key || g.name || g).toLowerCase()
  );
  
  const gameGenres = game.genres.map(g => g.toLowerCase());
  
  // Calculate overlap percentage
  const matchingGenres = gameGenres.filter(genre => 
    userGenres.some(userGenre => 
      userGenre.includes(genre) || genre.includes(userGenre)
    )
  );
  
  if (gameGenres.length === 0) return 0;
  
  const genreMatchPercentage = (matchingGenres.length / gameGenres.length) * 100;
  
  // Bonus for exact matches
  const exactMatches = gameGenres.filter(genre => userGenres.includes(genre));
  const exactMatchBonus = (exactMatches.length / gameGenres.length) * 20;
  
  return Math.min(100, genreMatchPercentage + exactMatchBonus);
};

/**
 * Calculate rating preference match
 */
const calculateRatingMatch = (user, game) => {
  // If user has rating preferences from their history
  const userAvgRating = user.stats?.averageRating || 7.5; // Default to 7.5
  const gameRating = game.ggdbRating || game.metacriticScore / 10 || 7;
  
  // Calculate how close the game rating is to user's preference
  const ratingDifference = Math.abs(userAvgRating - gameRating);
  
  // Score decreases as difference increases (max difference is 10)
  const ratingScore = Math.max(0, 100 - (ratingDifference * 15));
  
  // Bonus for highly rated games
  const highRatingBonus = gameRating >= 8.5 ? 10 : 0;
  
  return Math.min(100, ratingScore + highRatingBonus);
};

/**
 * Calculate platform compatibility
 */
const calculatePlatformMatch = (user, game) => {
  if (!user.platforms || !game.platforms) return 50; // Default neutral score
  
  const userPlatforms = user.platforms.map(p => 
    (p.platform || p.name || p).toLowerCase()
  );
  
  const gamePlatforms = game.platforms.map(p => p.toLowerCase());
  
  // Check if user has any compatible platform
  const hasCompatiblePlatform = gamePlatforms.some(platform => 
    userPlatforms.some(userPlatform => 
      userPlatform.includes(platform) || platform.includes(userPlatform)
    )
  );
  
  return hasCompatiblePlatform ? 100 : 0;
};

/**
 * Calculate community activity score
 */
const calculateCommunityMatch = async (game) => {
  try {
    // Temporarily disable API calls to prevent 500 errors
    // Use mock data based on game properties instead
    
    const gameRating = game.ggdbRating || game.rating || 0;
    const gameVotes = game.votes || 0;
    
    // Calculate score based on available game data
    let communityScore = 50; // Default neutral score
    
    // Rating-based scoring
    if (gameRating >= 9.0) {
      communityScore = 95;
    } else if (gameRating >= 8.5) {
      communityScore = 85;
    } else if (gameRating >= 8.0) {
      communityScore = 75;
    } else if (gameRating >= 7.5) {
      communityScore = 65;
    } else if (gameRating >= 7.0) {
      communityScore = 55;
    }
    
    // Votes-based bonus (popularity)
    const popularityBonus = Math.min(15, gameVotes / 100);
    communityScore += popularityBonus;
    
    // Special bonuses for trending/popular games
    if (game.isTrending) communityScore += 10;
    if (game.isTopRated) communityScore += 5;
    if (game.isNew) communityScore += 3;
    
    return Math.min(100, Math.max(0, communityScore));
    
  } catch (error) {
    console.error('Error calculating community match:', error);
    return 50; // Default neutral score
  }
};

/**
 * Calculate user history match
 */
const calculateHistoryMatch = async (user, game) => {
  try {
    // Temporarily disabled to prevent API errors
    // Return score based on basic user preferences instead
    
    if (!user || !game) return 50;
    
    let historyScore = 50; // Default neutral score
    
    // Use genre preferences as proxy for history
    if (user.favoriteGenres && game.genres) {
      const matchingGenres = game.genres.filter(genre => 
        user.favoriteGenres.some(fav => 
          (fav.key || fav.name || fav).toLowerCase().includes(genre.toLowerCase())
        )
      );
      
      const genreMatchRatio = matchingGenres.length / Math.max(1, game.genres.length);
      historyScore = 30 + (genreMatchRatio * 40); // Scale to 30-70 range
    }
    
    // Bonus for games that match user's preferred rating range
    if (user.stats?.averageRating && game.ggdbRating) {
      const ratingDiff = Math.abs(user.stats.averageRating - game.ggdbRating);
      if (ratingDiff <= 1) historyScore += 15;
      else if (ratingDiff <= 2) historyScore += 5;
    }
    
    return Math.min(100, Math.max(0, historyScore));
    
  } catch (error) {
    console.error('Error calculating history match:', error);
    return 50; // Default neutral score
  }
};

/**
 * Get match reasons for display
 */
export const getMatchReasons = (user, game, matchPercentage) => {
  const reasons = [];
  
  if (!user || !game || !matchPercentage) return reasons;
  
  // Genre reasons
  if (user.favoriteGenres && game.genres) {
    const matchingGenres = game.genres.filter(genre => 
      user.favoriteGenres.some(fav => 
        (fav.key || fav.name || fav).toLowerCase().includes(genre.toLowerCase())
      )
    );
    
    if (matchingGenres.length > 0) {
      reasons.push(`Matches your ${matchingGenres.slice(0, 2).join(' & ')} preferences`);
    }
  }
  
  // Rating reasons
  if (game.ggdbRating >= 8.5) {
    reasons.push('Highly rated by community');
  }
  
  // Platform reasons
  if (user.platforms && game.platforms) {
    const compatiblePlatforms = game.platforms.filter(platform => 
      user.platforms.some(userPlatform => 
        (userPlatform.platform || userPlatform.name || userPlatform)
          .toLowerCase().includes(platform.toLowerCase())
      )
    );
    
    if (compatiblePlatforms.length > 0) {
      reasons.push(`Available on your ${compatiblePlatforms[0]} platform`);
    }
  }
  
  // Match level reasons
  if (matchPercentage >= 90) {
    reasons.push('Perfect match for your taste!');
  } else if (matchPercentage >= 80) {
    reasons.push('Highly recommended for you');
  } else if (matchPercentage >= 70) {
    reasons.push('Good match based on your preferences');
  }
  
  return reasons.slice(0, 3); // Return top 3 reasons
};

/**
 * Get match color based on percentage
 */
export const getMatchColor = (matchPercentage) => {
  if (!matchPercentage) return 'text-gray-400';
  
  if (matchPercentage >= 90) return 'text-emerald-400';
  if (matchPercentage >= 80) return 'text-green-400';
  if (matchPercentage >= 70) return 'text-yellow-400';
  if (matchPercentage >= 60) return 'text-orange-400';
  return 'text-red-400';
};

/**
 * Get match description
 */
export const getMatchDescription = (matchPercentage) => {
  if (!matchPercentage) return 'Login to see match';
  
  if (matchPercentage >= 90) return 'Perfect Match';
  if (matchPercentage >= 80) return 'Excellent Match';
  if (matchPercentage >= 70) return 'Good Match';
  if (matchPercentage >= 60) return 'Fair Match';
  return 'Low Match';
};