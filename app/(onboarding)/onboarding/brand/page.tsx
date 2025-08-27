// import BrandOnboarding from '@/app/_components/onboarding/BrandOnboarding'
// import React from 'react'

// const Page = () => {
//   return (
//     <BrandOnboarding userType="brand" />
//   )
// }

// export default Page



'use client'



import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Upload } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface BrandOnboardingProps {
  userType: 'brand' | 'agency';
}

const industries = [
  "Beauty & Skincare", "Fashion & Style", "Fitness & Health", "Food & Cooking",
  "Travel", "Technology", "Lifestyle", "Gaming", "Education", "Entertainment",
  "Business", "Parenting", "Home & Garden", "Arts & Crafts", "Music", "Sports",
  "Photography", "Other"
];

const campaignGoals = [
  "Brand Awareness", "Product Launch", "Sales/Conversions", 
  "User-Generated Content", "Event Promotion", "Other"
];

const influencerTypes = [
  "Nano (1K–10K)", "Micro (10K–100K)", "Macro (100K+)", "Celebrity"
];

const contentTypes = [
  "Instagram Post", "Instagram Story", "TikTok Video", 
  "YouTube Review", "Blog Post", "Other"
];

const BrandOnboarding = ({ userType }: BrandOnboardingProps) => {
  const insertBrandProfile = useMutation(api.brands.insertBrandProfile);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter(); // Next.js router
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    website: "",
    businessEmail: "",
    contactPerson: "",
    location: "",
    description: "",
    companySize: "",
    campaignGoal: "",
    targetAudience: "",
    influencerType: "",
    influencerNiche: "",
    budgetRange: "",
    contentType: "",
    campaignDescription: "",
    campaignGoals: [] as string[],
    preferredNiches: [] as string[],
    agreeToTerms: false,
  });

  const validateStep1 = () => {
    return (
      formData.companyName.trim() !== "" &&
      formData.industry !== "" &&
      formData.companySize !== "" &&
      formData.description.trim() !== ""
    );
  };

  const validateStep2 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      formData.contactPerson.trim() !== "" &&
      formData.businessEmail.trim() !== "" &&
      emailRegex.test(formData.businessEmail) &&
      formData.location.trim() !== ""
    );
  };

  const validateStep3 = () => {
    return (
      formData.budgetRange !== "" &&
      formData.campaignGoals.length > 0 &&
      formData.targetAudience.trim() !== "" &&
      formData.influencerType !== "" &&
      formData.contentType !== ""
    );
  };

  const validateStep4 = () => {
    return formData.agreeToTerms;
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string | string[] | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    return newArray;
  };

  const handleComplete = async () => {
    try {
      await insertBrandProfile({
        companyName: formData.companyName,
        industry: formData.industry,
        website: formData.website,
        businessEmail: formData.businessEmail,
        contactPerson: formData.contactPerson,
        location: formData.location,
        description: formData.description,
        companySize: formData.companySize,
        targetAudience: formData.targetAudience,
        influencerType: formData.influencerType,
        influencerNiche: formData.influencerNiche,
        budgetRange: formData.budgetRange,
        contentType: formData.contentType,
        campaignDescription: formData.campaignDescription,
        campaignGoal: formData.campaignGoal,
        campaignCount: 0,
        activeCampaigns: [],
        totalBudget: 0,
        influencerCollaborations: []
      });
      router.push('/dashboard/brand'); // Next.js navigation
    } catch (err) {
      console.error("Failed to save brand profile:", err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-2">Company Information</h2>
              <p className="text-primary-600">Tell us about your {userType === 'brand' ? 'company' : 'agency'}.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">{userType === 'brand' ? 'Company' : 'Agency'} Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  placeholder={`Enter your ${userType} name`}
                  required
                  className={formData.companyName.trim() === "" ? "border-red-300" : ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select 
                    onValueChange={(value: string) => updateFormData('industry', value)}
                    value={formData.industry}
                  >
                    <SelectTrigger className={formData.industry === "" ? "border-red-300" : ""}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size *</Label>
                  <Select 
                    onValueChange={(value: string) => updateFormData('companySize', value)}
                    value={formData.companySize}
                  >
                    <SelectTrigger className={formData.companySize === "" ? "border-red-300" : ""}>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  placeholder="https://www.yourcompany.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Company Description *</Label>
                <textarea
                  id="description"
                  className={`w-full p-3 border rounded-md resize-none h-24 ${
                    formData.description.trim() === "" ? "border-red-300" : "border-gray-300"
                  }`}
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Brief description of your company..."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-2">Contact Information</h2>
              <p className="text-primary-600">Primary contact details for campaign management.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Name *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => updateFormData('contactPerson', e.target.value)}
                  placeholder="Full name"
                  className={formData.contactPerson.trim() === "" ? "border-red-300" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Email Address *</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => updateFormData('businessEmail', e.target.value)}
                  placeholder="contact@company.com"
                  className={
                    formData.businessEmail.trim() === "" || 
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail) 
                      ? "border-red-300" : ""
                  }
                />
                {formData.businessEmail.trim() !== "" && 
                 !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail) && (
                  <p className="text-sm text-red-600">Please enter a valid email address</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                placeholder="City, Country"
                className={formData.location.trim() === "" ? "border-red-300" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload your company logo</p>
                <Button variant="outline" className="mt-2">Choose File</Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-2">Campaign Preferences</h2>
              <p className="text-primary-600">Help us understand your campaign goals and preferences.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Monthly Campaign Budget *</Label>
                <Select 
                  onValueChange={(value: string) => updateFormData('budgetRange', value)}
                  value={formData.budgetRange}
                >
                  <SelectTrigger className={formData.budgetRange === "" ? "border-red-300" : ""}>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1k-5k">$1K - $5K</SelectItem>
                    <SelectItem value="5k-10k">$5K - $10K</SelectItem>
                    <SelectItem value="10k-25k">$10K - $25K</SelectItem>
                    <SelectItem value="25k-50k">$25K - $50K</SelectItem>
                    <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                    <SelectItem value="100k+">$100K+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Primary Campaign Goals * {formData.campaignGoals.length === 0 && (
                  <span className="text-red-600 text-sm">(Select at least one)</span>
                )}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {campaignGoals.map((goal) => (
                    <Button
                      key={goal}
                      variant={formData.campaignGoals.includes(goal) ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFormData('campaignGoals', toggleArrayItem(formData.campaignGoals, goal))}
                      className="justify-start"
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <textarea
                  id="targetAudience"
                  className={`w-full p-3 border rounded-md resize-none h-24 ${
                    formData.targetAudience.trim() === "" ? "border-red-300" : "border-gray-300"
                  }`}
                  value={formData.targetAudience}
                  onChange={(e) => updateFormData('targetAudience', e.target.value)}
                  placeholder="Describe your target audience demographics and interests..."
                />
              </div>
              <div className="space-y-2">
                <Label>Influencer Type *</Label>
                <Select 
                  onValueChange={(value: string) => updateFormData('influencerType', value)}
                  value={formData.influencerType}
                >
                  <SelectTrigger className={formData.influencerType === "" ? "border-red-300" : ""}>
                    <SelectValue placeholder="Select influencer type" />
                  </SelectTrigger>
                  <SelectContent>
                    {influencerTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Content Type *</Label>
                <Select 
                  onValueChange={(value: string) => updateFormData('contentType', value)}
                  value={formData.contentType}
                >
                  <SelectTrigger className={formData.contentType === "" ? "border-red-300" : ""}>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-2">Review & Complete</h2>
              <p className="text-primary-600">Review your information before submitting.</p>
            </div>
            <Card className="bg-secondary-50 border-secondary-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Company Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Company Name</p>
                        <p className="font-medium">{formData.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Industry</p>
                        <p className="font-medium">{formData.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company Size</p>
                        <p className="font-medium">{formData.companySize}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Website</p>
                        <p className="font-medium">{formData.website || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Contact Person</p>
                        <p className="font-medium">{formData.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{formData.businessEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{formData.location || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Campaign Preferences</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Budget Range</p>
                        <p className="font-medium">{formData.budgetRange}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Campaign Goals</p>
                        <p className="font-medium">{formData.campaignGoals.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Influencer Type</p>
                        <p className="font-medium">{formData.influencerType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Content Type</p>
                        <p className="font-medium">{formData.contentType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked: boolean) => updateFormData('agreeToTerms', checked)}
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a> *
              </label>
            </div>
            {!formData.agreeToTerms && (
              <p className="text-sm text-red-600">Please agree to the terms and privacy policy to continue</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-accent-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="bg-secondary-100 text-secondary-700">
              {userType === 'brand' ? 'Brand' : 'Agency'} Setup
            </Badge>
            <span className="text-sm text-primary-600">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-secondary h-2 rounded-full"
              initial={{ width: "25%" }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-start mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (window.confirm("Are you sure you want to go back to role selection? Your current progress will be lost.")) {
                router.push('/onboarding');
              }
            }}
            className="text-secondary-600 hover:text-secondary-700 hover:bg-secondary-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Role Selection
          </Button>
        </div>

        <Card>
          <CardContent className="p-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="bg-secondary hover:bg-secondary-600"
                disabled={!isCurrentStepValid()}
              >
                {currentStep === totalSteps ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandOnboarding;