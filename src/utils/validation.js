// Comprehensive validation utilities for forms

// Email validation with comprehensive pattern
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }
  
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailPattern.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }
  
  if (email.length > 254) {
    return { isValid: false, message: "Email address is too long" };
  }
  
  return { isValid: true, message: "" };
};

// Username validation
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: "Username is required" };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: "Username must be at least 3 characters long" };
  }
  
  if (username.length > 20) {
    return { isValid: false, message: "Username must be no more than 20 characters long" };
  }
  
  // Allow letters, numbers, underscores, and hyphens
  const usernamePattern = /^[a-zA-Z0-9_-]+$/;
  if (!usernamePattern.test(username)) {
    return { isValid: false, message: "Username can only contain letters, numbers, underscores, and hyphens" };
  }
  
  // Prevent usernames that start or end with special characters
  if (username.startsWith('_') || username.startsWith('-') || username.endsWith('_') || username.endsWith('-')) {
    return { isValid: false, message: "Username cannot start or end with underscore or hyphen" };
  }
  
  // Prevent reserved usernames
  const reservedUsernames = ['admin', 'administrator', 'root', 'api', 'www', 'mail', 'support', 'help', 'info', 'contact', 'about', 'privacy', 'terms', 'null', 'undefined'];
  if (reservedUsernames.includes(username.toLowerCase())) {
    return { isValid: false, message: "This username is reserved and cannot be used" };
  }
  
  return { isValid: true, message: "" };
};

// Password strength validation
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required", strength: 0 };
  }
  
  let strength = 0;
  let feedback = [];
  
  // Length check
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long", strength: 0 };
  }
  
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Character variety checks
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password);
  
  if (hasLowercase) strength += 1;
  if (hasUppercase) strength += 1;
  if (hasNumbers) strength += 1;
  if (hasSpecialChars) strength += 1;
  
  // Feedback messages
  if (!hasLowercase) feedback.push("Add lowercase letters");
  if (!hasUppercase) feedback.push("Add uppercase letters");
  if (!hasNumbers) feedback.push("Add numbers");
  if (!hasSpecialChars) feedback.push("Add special characters");
  
  // Common patterns check
  const commonPatterns = [
    /(.)\1{2,}/, // Repeated characters
    /123|234|345|456|567|678|789/, // Sequential numbers
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i, // Sequential letters
    /password|123456|qwerty|admin|letmein|welcome|monkey|dragon/i // Common passwords
  ];
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      feedback.push("Avoid common patterns and words");
      strength = Math.max(0, strength - 1);
      break;
    }
  }
  
  // Determine strength level
  let strengthText = "";
  let strengthColor = "";
  
  if (strength <= 2) {
    strengthText = "Weak";
    strengthColor = "text-red-400";
  } else if (strength <= 4) {
    strengthText = "Fair";
    strengthColor = "text-yellow-400";
  } else if (strength <= 5) {
    strengthText = "Good";
    strengthColor = "text-blue-400";
  } else {
    strengthText = "Strong";
    strengthColor = "text-green-400";
  }
  
  const isValid = strength >= 3; // Require at least Fair strength
  
  return {
    isValid,
    message: isValid ? "" : "Password is too weak. " + feedback.join(", "),
    strength,
    strengthText,
    strengthColor,
    feedback
  };
};

// Date of birth validation (18+ requirement)
export const validateDateOfBirth = (dob) => {
  if (!dob) {
    return { isValid: false, message: "Date of birth is required" };
  }
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(birthDate.getTime())) {
    return { isValid: false, message: "Please enter a valid date" };
  }
  
  // Check if date is not in the future
  if (birthDate > today) {
    return { isValid: false, message: "Date of birth cannot be in the future" };
  }
  
  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Check minimum age requirement
  if (age < 13) {
    return { isValid: false, message: "You must be at least 13 years old to register" };
  }
  
  // Warning for users under 18
  if (age < 18) {
    return { 
      isValid: true, 
      message: "", 
      warning: "You are under 18. Parental consent may be required for certain features." 
    };
  }
  
  return { isValid: true, message: "" };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: "Please confirm your password" };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }
  
  return { isValid: true, message: "" };
};

// Email domain suggestions
export const getEmailSuggestions = (email) => {
  if (!email || !email.includes('@')) return [];
  
  const [localPart, domain] = email.split('@');
  const commonDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'icloud.com', 'protonmail.com', 'aol.com', 'live.com'
  ];
  
  const suggestions = [];
  const inputDomain = domain.toLowerCase();
  
  // Find similar domains using Levenshtein distance
  for (const commonDomain of commonDomains) {
    const distance = levenshteinDistance(inputDomain, commonDomain);
    if (distance <= 2 && distance > 0) {
      suggestions.push(`${localPart}@${commonDomain}`);
    }
  }
  
  return suggestions.slice(0, 3); // Return max 3 suggestions
};

// Helper function for Levenshtein distance
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Comprehensive form validation
export const validateRegistrationForm = (formData, step) => {
  const errors = {};
  let isValid = true;
  
  if (step === 1) {
    // Step 1: Email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
      isValid = false;
    }
  } else if (step === 2) {
    // Step 2: All field validation
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.message;
      isValid = false;
    }
    
    const dobValidation = validateDateOfBirth(formData.dob);
    if (!dobValidation.isValid) {
      errors.dob = dobValidation.message;
      isValid = false;
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
      isValid = false;
    }
    
    const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.message;
      isValid = false;
    }
  }
  
  return { isValid, errors };
};