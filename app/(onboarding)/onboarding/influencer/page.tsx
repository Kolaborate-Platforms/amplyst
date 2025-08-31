"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import BasicInfo from "../../../_components/onboarding/influencer/BasicInfo";
import SocialMediaLinked from "../../../_components/onboarding/influencer/SocialMedia";
import PortfolioSetup from "../../../_components/onboarding/influencer/PortfolioSetup";
import CompletionStep from "../../../_components/onboarding/influencer/CompletionStep";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation"; // Next.js navigation
import { useUser } from "@clerk/nextjs"; // Next.js Clerk
import { SocialMediaData, SocialMediaAccount, SocialMediaProfileData } from "../../../_components/onboarding/influencer/SocialMedia";
import { PortfolioItem } from "../../../_components/onboarding/influencer/PortfolioSetup";
import { useConvexUserSync } from "../../../hooks/useConvexUserSync";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InfluencerFormData {
  firstName: string;
  lastName: string;
  role: string;
  bio: string;
  niche: string;
  location: string;
  followerCount: string;
  socialAccounts: SocialMediaAccount;
  portfolio: PortfolioItem[];
  profileData?: SocialMediaProfileData;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

 const validateBasicInfo = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!data.firstName?.trim()) {
    errors.push("First name is required");
  }
  
  if (!data.lastName?.trim()) {
    errors.push("Last name is required");
  }
  
  if (!data.bio?.trim()) {
    errors.push("Bio is required");
  } else if (data.bio.trim().length < 50) {
    errors.push("Bio must be at least 50 characters long");
  }
  
  if (!data.niche?.trim()) {
    errors.push("Primary niche is required");
  }
  
  // if (!data.followerCount?.trim()) {
  //   errors.push("Follower count is required");
  // }
  
  if (!data.location?.trim()) {
    errors.push("Location is required");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

 const validateSocialMedia = (data: any): ValidationResult => {
  const errors: string[] = [];
  const socialAccounts = data.socialAccounts || {};
  
  const hasConnectedAccount = Object.values(socialAccounts).some(account => 
    typeof account === 'string' && account.trim() !== ''
  );
  
  if (!hasConnectedAccount) {
    errors.push("At least one social media account must be connected and verified");
  }
  
  const profileData = data.profileData || {};
  const hasProfileData = Object.keys(profileData).some(platform => 
    profileData[platform] !== undefined && profileData[platform] !== null
  );
  
  if (hasConnectedAccount && !hasProfileData) {
    errors.push("Please verify at least one connected social media account");
  }
  
  const verifiedPlatforms = Object.keys(profileData).filter(platform => 
    profileData[platform] !== undefined && profileData[platform] !== null
  );
  
  if (verifiedPlatforms.length > 1 && !data.primaryPlatform) {
    errors.push("Please select your primary social media platform");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

 const validatePortfolio = (data: any): ValidationResult => {
  const errors: string[] = [];
  const portfolio = data.portfolio || [];
  
  if (portfolio.length === 0) {
    errors.push("At least one portfolio item is required");
  }
  
  portfolio.forEach((item: any, index: number) => {
    if (!item.title?.trim()) {
      errors.push(`Portfolio item ${index + 1}: Title is required`);
    }
    
    if (!item.url?.trim()) {
      errors.push(`Portfolio item ${index + 1}: URL is required`);
    }
    
    if (!item.description?.trim()) {
      errors.push(`Portfolio item ${index + 1}: Description is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

 const validateStep = (step: number, data: any): ValidationResult => {
  switch (step) {
    case 1:
      return validateBasicInfo(data);
    case 2:
      return validateSocialMedia(data);
    case 3:
      return validatePortfolio(data);
    case 4:
      return { isValid: true, errors: [] };
    default:
      return { isValid: false, errors: ["Invalid step"] };
  }
};

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepValidation, setStepValidation] = useState<Record<number, ValidationResult>>({});
  const [formData, setFormData] = useState<InfluencerFormData>({
    firstName: "",
    lastName: "",
    bio: "",
    role: "influencer",
    niche: "",
    location: "",
    followerCount: "",
    socialAccounts: {
      instagram: "",
      tiktok: "",
      youtube: "",
      twitter: ""
    },
    portfolio: [],
    profileData: {
      tiktok: undefined,
      instagram: undefined
    }
  });


  const insertProfile = useMutation(api.users.insertProfile);
  const { user } = useUser();
  const router = useRouter(); 

  useConvexUserSync();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Memoize the validation function to prevent unnecessary re-runs
  const validateCurrentStep = useCallback((step: number, data: InfluencerFormData) => {
    return validateStep(step, data);
  }, []);

  // Use useEffect to handle validation when formData or currentStep changes
  useEffect(() => {
    const validation = validateCurrentStep(currentStep, formData);
    setStepValidation(prev => {
      // Only update if validation actually changed to prevent infinite loops
      if (JSON.stringify(prev[currentStep]) !== JSON.stringify(validation)) {
        return { ...prev, [currentStep]: validation };
      }
      return prev;
    });
  }, [formData, currentStep, validateCurrentStep]);

  const handleNext = useCallback(() => {
    const validation = validateCurrentStep(currentStep, formData);
    
    if (validation.isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      // Update validation state only if needed
      setStepValidation(prev => ({ ...prev, [currentStep]: validation }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, formData, totalSteps, validateCurrentStep]);

  const handleComplete = useCallback(async () => {
    try {
      console.log("Submitting profile data:", formData);
      
      const portfolio = formData.portfolio.length > 0 ? formData.portfolio : [{
        id: Date.now(), 
        type: "image" as const,
        title: "Profile",
        description: "Profile metrics",
        url: "",
        metrics: {
          username: "",
          followers: formData.followerCount || "0",
          likes: "0",
          following: "0"
        }
      }];

      await insertProfile({
        role: "influencer" as const,
        name: `${formData.firstName} ${formData.lastName}`,
        bio: formData.bio,
        profilePictureUrl: user?.imageUrl,
        niche: formData.niche,
        location: formData.location,
        socialAccounts: formData.socialAccounts,
        followerCount: formData.followerCount,
        portfolio: portfolio.map((item, index) => ({
          ...item,
          id: item.id ?? index,
          metrics: {
            ...item.metrics,
            followers: formData.followerCount
          }
        })),
      });
      router.push("/dashboard/influencer"); 
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  }, [formData, insertProfile, user?.imageUrl, router]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Simplified updateFormData function - remove the validation call
  const updateFormData = useCallback((data: Partial<InfluencerFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Memoize validation check to prevent unnecessary re-renders
  const canProceedToNextStep = useCallback((): boolean => {
    const validation = stepValidation[currentStep];
    return validation?.isValid === true;
  }, [stepValidation, currentStep]);

  const getCurrentStepValidation = useCallback((): ValidationResult | null => {
    return stepValidation[currentStep] || null;
  }, [stepValidation, currentStep]);

  // Memoize step rendering to prevent unnecessary re-renders
  const renderStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfo 
            data={formData} 
            onUpdate={updateFormData}
            // Remove the onValidationChange prop to prevent direct state updates
          />
        );
      case 2:
        return <SocialMediaLinked data={formData} onUpdate={updateFormData} />;
      case 3:
        return <PortfolioSetup data={formData} onUpdate={updateFormData} />;
      case 4:
        return <CompletionStep data={formData} />;
      default:
        return <BasicInfo data={formData} onUpdate={updateFormData} />;
    }
  }, [currentStep, formData, updateFormData]);

  const stepTitles = [
    "Basic Information",
    "Social Media Accounts", 
    "Portfolio Setup",
    "Complete Setup"
  ];

  const currentValidation = getCurrentStepValidation();
  const isCurrentStepInvalid = currentValidation && !currentValidation.isValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900 font-poppins">Amplyst</span>
          </div>
          <CardTitle className="text-2xl font-poppins">Complete Your Profile</CardTitle>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium text-primary">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2 font-sofia">{stepTitles[currentStep - 1]}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentValidation && !currentValidation.isValid && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please complete the following before proceeding:
                <ul className="mt-2 list-disc list-inside">
                  {currentValidation.errors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="animate-slide-in-right" key={currentStep}>
            {renderStep()}
          </div>
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-primary hover:bg-primary-600"
                disabled={Boolean(isCurrentStepInvalid)}
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="bg-secondary hover:bg-secondary-600"
                onClick={handleComplete}
              >
                Complete Setup
              </Button>
            )}
          </div>
          
          <div className="flex justify-center space-x-2 pt-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
              const validation = stepValidation[step];
              const isCompleted = validation?.isValid === true;
              const isCurrent = step === currentStep;
              
              return (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    isCompleted
                      ? "bg-green-500"
                      : isCurrent
                      ? "bg-primary"
                      : "bg-gray-300"
                  }`}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;