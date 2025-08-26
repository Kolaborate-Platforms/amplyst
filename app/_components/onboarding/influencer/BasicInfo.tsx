'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { validateBasicInfo, ValidationResult } from "../../../../lib/validation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

interface BasicInfoData {
  firstName: string;
  lastName: string;
  bio: string;
  niche: string;
  followerCount: string; 
  location: string;
}

interface BasicInfoProps {
  data: BasicInfoData;
  onUpdate: (data: Partial<BasicInfoData>) => void;
  onValidationChange?: (validation: ValidationResult) => void;
}

const BasicInfo = ({ data, onUpdate, onValidationChange }: BasicInfoProps) => {
  const [validation, setValidation] = useState<ValidationResult>({ isValid: false, errors: [] });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const niches = [
    "Beauty & Skincare",
    "Fashion & Style",
    "Fitness & Health",
    "Food & Cooking",
    "Travel",
    "Technology",
    "Lifestyle",
    "Gaming",
    "Education",
    "Entertainment",
    "Business",
    "Parenting",
    "Home & Garden",
    "Arts & Crafts",
    "Music",
    "Sports",
    "Photography",
    "Other"
  ];

  const followerRanges = [
    "1K - 5K",
    "5K - 10K", 
    "10K - 25K",
    "25K - 50K",
    "50K - 100K",
    "100K+"
  ];

  const convertFollowerRangeToNumber = (range: string): number | undefined => {
    if (!range) return undefined;
    if (range === "100K+") {
      return 100000; // Or a higher representative number
    }
    const parts = range.replace(/K/g, "000").split(" - ");
    if (parts.length === 2) {
      const lower = parseInt(parts[0]);
      const upper = parseInt(parts[1]);
      return (lower + upper) / 2;
    }
    return undefined;
  };

  const getFollowerRangeString = (count: number | undefined): string | undefined => {
    if (count === undefined) return undefined;
    if (count >= 100000) return "100K+";
    if (count >= 50000) return "50K - 100K";
    if (count >= 25000) return "25K - 50K";
    if (count >= 10000) return "10K - 25K";
    if (count >= 5000) return "5K - 10K";
    if (count >= 1000) return "1K - 5K";
    return undefined;
  };

  // Validate data whenever it changes
  useEffect(() => {
    const validationResult = validateBasicInfo(data);
    setValidation(validationResult);
    onValidationChange?.(validationResult);
  }, [data, onValidationChange]);

   const handleFieldChange = (field: keyof BasicInfoData, value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    onUpdate({ [field]: value });
  };

  const handleBlur = (field: keyof BasicInfoData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof BasicInfoData): string | undefined => {
    if (!touched[field]) return undefined;
    return validation.errors.find(error => 
      error.toLowerCase().includes(field.toLowerCase()) || 
      (field === 'firstName' && error.toLowerCase().includes('first name')) ||
      (field === 'lastName' && error.toLowerCase().includes('last name'))
    );
  };

  const isFieldValid = (field: keyof BasicInfoData): boolean => {
    return !getFieldError(field) && data[field]?.trim() !== '';
  };

  // Helper function to check if a field has a valid value
  const hasValidValue = (field: keyof BasicInfoData): boolean => {
    const value = data[field];
    return value != null && value.toString().trim() !== '';
  };

  // Calculate completion percentage
  const completionPercentage = Math.round(
    Object.keys(data).filter(key => hasValidValue(key as keyof BasicInfoData)).length / 6 * 100
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Validation Summary */}
      {validation.errors.length > 0 && Object.keys(touched).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please complete the following required fields:
            <ul className="mt-2 list-disc list-inside">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Warnings */}
      {validation.warnings && validation.warnings.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validation.warnings.map((warning, index) => (
                <li key={index} className="text-sm">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">Tell us about yourself</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center">
              First Name <span className="text-red-500 ml-1">*</span>
              {isFieldValid('firstName') && <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />}
            </Label>

           <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="Enter your first name"
              className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
                getFieldError('firstName') ? 'border-red-500' : 
                isFieldValid('firstName') ? 'border-green-500' : ''
              }`}
            />
            {getFieldError('firstName') && (
              <p className="text-red-500 text-sm">{getFieldError('firstName')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center">
              Last Name <span className="text-red-500 ml-1">*</span>
              {isFieldValid('lastName') && <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />}
            </Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder="Enter your last name"
              className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
                getFieldError('lastName') ? 'border-red-500' : 
                isFieldValid('lastName') ? 'border-green-500' : ''
              }`}
            />
            {getFieldError('lastName') && (
              <p className="text-red-500 text-sm">{getFieldError('lastName')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="flex items-center">
          Bio <span className="text-red-500 ml-1">*</span>
          <span className="text-sm text-gray-500 ml-2">({data.bio?.length || 0}/500)</span>
          {isFieldValid('bio') && <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />}
        </Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => handleFieldChange('bio', e.target.value)}
          onBlur={() => handleBlur('bio')}
          placeholder="Tell us about yourself and your content style... (minimum 50 characters)"
          className={`min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary ${
            getFieldError('bio') ? 'border-red-500' : 
            isFieldValid('bio') ? 'border-green-500' : ''
          }`}
          maxLength={500}
        />
        {getFieldError('bio') && (
          <p className="text-red-500 text-sm">{getFieldError('bio')}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="niche" className="flex items-center">
            Primary Niche <span className="text-red-500 ml-1">*</span>
            {isFieldValid('niche') && <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />}
          </Label>
          <Select
            value={data.niche || undefined}
            onValueChange={(value: string) => {
              handleFieldChange('niche', value);
              setTouched(prev => ({ ...prev, niche: true }));
            }}
          >
            <SelectTrigger className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
              getFieldError('niche') ? 'border-red-500' : 
              isFieldValid('niche') ? 'border-green-500' : ''
            }`}>
              <SelectValue placeholder="Select your niche" />
            </SelectTrigger>
            <SelectContent>
              {niches.map((niche) => (
                <SelectItem key={niche} value={niche}>
                  {niche}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError('niche') && (
            <p className="text-red-500 text-sm">{getFieldError('niche')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="followerCount" className="flex items-center">
            Follower Count <span className="text-red-500 ml-1">*</span>
            {isFieldValid('followerCount') && <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />}
          </Label>

          <Select
            value={data.followerCount}
            onValueChange={(value: string) => {
              handleFieldChange('followerCount', value);
              setTouched(prev => ({ ...prev, followerCount: true }));
            }}
          >
            <SelectTrigger className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
              getFieldError('followerCount') ? 'border-red-500' : 
              isFieldValid('followerCount') ? 'border-green-500' : ''
            }`}>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {followerRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError('followerCount') && (
              <p className="text-red-500 text-sm">{getFieldError('followerCount')}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center">
          Location <span className="text-red-500 ml-1">*</span>
          {isFieldValid('location') && <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />}
        </Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => handleFieldChange('location', e.target.value)}
          onBlur={() => handleBlur('location')}
          placeholder="City, Country"
          className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
            getFieldError('location') ? 'border-red-500' : 
            isFieldValid('location') ? 'border-green-500' : ''
          }`}
        />
        {getFieldError('location') && (
          <p className="text-red-500 text-sm">{getFieldError('location')}</p>
        )}
      </div>
    </div>
  );
};

export default BasicInfo;