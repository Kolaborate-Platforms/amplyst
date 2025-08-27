/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface BasicInfoValidation {
  firstName: string;
  lastName: string;
  bio: string;
  niche: string;
  followerCount: string;
  location: string;
}

export interface SocialMediaValidation {
  socialAccounts: {
    instagram: string;
    tiktok: string;
    youtube: string;
    twitter: string;
  };
  profileData?: any;
  primaryPlatform?: string;
}

export interface PortfolioValidation {
  portfolio: Array<{
    id?: number;
    type: string;
    title: string;
    description: string;
    url: string;
    metrics: {
      followers: string;
      likes: string;
      comments: string;
      shares: string;
    };
  }>;
}

// Step 1: Basic Info Validation
export const validateBasicInfo = (data: BasicInfoValidation): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validations
  if (!data.firstName?.trim()) {
    errors.push("First name is required");
  } else if (data.firstName.trim().length < 2) {
    errors.push("First name must be at least 2 characters long");
  }

  if (!data.lastName?.trim()) {
    errors.push("Last name is required");
  } else if (data.lastName.trim().length < 2) {
    errors.push("Last name must be at least 2 characters long");
  }

  if (!data.bio?.trim()) {
    errors.push("Bio is required");
  } else if (data.bio.trim().length < 50) {
    warnings.push("Consider adding more details to your bio (minimum 50 characters recommended)");
  } else if (data.bio.trim().length > 500) {
    errors.push("Bio must be less than 500 characters");
  }

  if (!data.niche?.trim()) {
    errors.push("Primary niche selection is required");
  }

  // if (!data.followerCount?.trim()) {
  //   errors.push("Follower count range is required");
  // }

  if (!data.location?.trim()) {
    errors.push("Location is required");
  } else if (data.location.trim().length < 3) {
    errors.push("Please enter a valid location");
  }

  // Name validation (no numbers, special characters)
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (data.firstName && !nameRegex.test(data.firstName)) {
    errors.push("First name should only contain letters, spaces, hyphens, and apostrophes");
  }
  if (data.lastName && !nameRegex.test(data.lastName)) {
    errors.push("Last name should only contain letters, spaces, hyphens, and apostrophes");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Step 2: Social Media Validation
export const validateSocialMedia = (data: SocialMediaValidation): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // At least one social media account is required
  const hasAnySocialAccount = Object.values(data.socialAccounts).some(account => account?.trim());
  
  if (!hasAnySocialAccount) {
    errors.push("At least one social media account is required");
  }

  // Validate username formats
  const socialValidations = {
    instagram: {
      pattern: /^[a-zA-Z0-9._]+$/,
      message: "Instagram username can only contain letters, numbers, periods, and underscores"
    },
    tiktok: {
      pattern: /^[a-zA-Z0-9._]+$/,
      message: "TikTok username can only contain letters, numbers, periods, and underscores"
    },
    twitter: {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "Twitter username can only contain letters, numbers, and underscores"
    },
    youtube: {
      pattern: /^(@[a-zA-Z0-9._-]+|https?:\/\/(www\.)?(youtube\.com\/|youtu\.be\/)).*/,
      message: "Please enter a valid YouTube channel URL or @handle"
    }
  };

  // Validate each provided social account
  Object.entries(data.socialAccounts).forEach(([platform, username]) => {
    if (username?.trim()) {
      const validation = socialValidations[platform as keyof typeof socialValidations];
      if (validation && !validation.pattern.test(username.trim())) {
        errors.push(validation.message);
      }
    }
  });

  // Check if at least one account is verified (has profile data)
  if (hasAnySocialAccount && !data.profileData) {
    warnings.push("Consider verifying at least one social media account for better profile completion");
  }

  // If profile data exists, check for primary platform selection
  if (data.profileData && Object.keys(data.profileData).length > 1 && !data.primaryPlatform) {
    errors.push("Please select your primary social media platform");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Step 3: Portfolio Validation
export const validatePortfolio = (data: PortfolioValidation): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // At least one portfolio item is required
  if (!data.portfolio || data.portfolio.length === 0) {
    errors.push("At least one portfolio item is required to showcase your work");
    return { isValid: false, errors, warnings };
  }

  // Validate each portfolio item
  data.portfolio.forEach((item, index) => {
    const itemNumber = index + 1;

    if (!item.title?.trim()) {
      errors.push(`Portfolio item ${itemNumber}: Title is required`);
    }

    if (!item.description?.trim()) {
      errors.push(`Portfolio item ${itemNumber}: Description is required`);
    } else if (item.description.trim().length < 20) {
      warnings.push(`Portfolio item ${itemNumber}: Consider adding more details to the description`);
    }

    if (!item.url?.trim()) {
      errors.push(`Portfolio item ${itemNumber}: Content URL is required`);
    } else {
      // Basic URL validation
      const urlPattern = /^(https?:\/\/)|(www\.)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/;
      if (!urlPattern.test(item.url.trim())) {
        errors.push(`Portfolio item ${itemNumber}: Please enter a valid URL`);
      }
    }

    // Check if at least one metric is provided
    const hasMetrics = Object.values(item.metrics).some(metric => metric?.trim());
    if (!hasMetrics) {
      warnings.push(`Portfolio item ${itemNumber}: Adding performance metrics will strengthen your portfolio`);
    }

    // Validate numeric metrics
    Object.entries(item.metrics).forEach(([metricName, value]) => {
      if (value?.trim() && isNaN(Number(value.replace(/[^\d]/g, '')))) {
        warnings.push(`Portfolio item ${itemNumber}: ${metricName} should be a number`);
      }
    });
  });

  // Recommend minimum portfolio items
  if (data.portfolio.length < 3) {
    warnings.push("Consider adding at least 3 portfolio items to showcase your range and expertise");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Overall validation function
export const validateCurrentStep = (
  step: number,
  data?: any
): ValidationResult => {
  switch (step) {
    case 1:
      return validateBasicInfo(data);
    case 2:
      return validateSocialMedia(data);
    case 3:
      return validatePortfolio(data);
    case 4:
      return { isValid: true, errors: [] }; // Completion step doesn't need validation
    default:
      return { isValid: false, errors: ["Invalid step"] };
  }
};

// Helper function to get step completion percentage
export const getStepCompletionPercentage = (
  step: number,
  data?: any
): number => {
  const validation = validateCurrentStep(step, data);
  if (validation.isValid) return 100;

  // Calculate partial completion based on filled fields
  switch (step) {
    case 1: {
      const basicData = data as BasicInfoValidation;
      const fields = ['firstName', 'lastName', 'bio', 'niche', 'followerCount', 'location'];
      const filledFields = fields.filter(field => basicData[field as keyof BasicInfoValidation]?.trim());
      return Math.round((filledFields.length / fields.length) * 100);
    }
    case 2: {
      const socialData = data as SocialMediaValidation;
      const hasAccount = Object.values(socialData.socialAccounts).some(account => account?.trim());
      const hasVerification = !!socialData.profileData;
      const hasPrimary = !!socialData.primaryPlatform;
      
      let completion = 0;
      if (hasAccount) completion += 50;
      if (hasVerification) completion += 30;
      if (hasPrimary) completion += 20;
      
      return completion;
    }
    case 3: {
      const portfolioData = data as PortfolioValidation;
      if (!portfolioData.portfolio?.length) return 0;
      return Math.min(100, (portfolioData.portfolio.length / 3) * 100);
    }
    default:
      return 0;
  }
};