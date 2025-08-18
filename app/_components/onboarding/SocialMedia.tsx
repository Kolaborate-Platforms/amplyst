"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Instagram, Music, Youtube, Twitter, CheckCircle } from "lucide-react";
import { runTikTokActor, TikTokProfileData } from "../../services/tiktokService";
import { InstagramProfileData, runInstagramActor } from "../../services/instagramService";

export interface SocialMediaAccount {
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
}

export interface SocialMediaProfileData {
  tiktok?: TikTokProfileData;
  instagram?: InstagramProfileData;
}

export interface SocialMediaData {
  socialAccounts: SocialMediaAccount;
  profileData?: SocialMediaProfileData;
  primaryPlatform?: string;
}

interface SocialMediaLinkedProps {
  data: SocialMediaData;
  onUpdate: (data: SocialMediaData) => void;
}

const SocialMediaLinked = ({ data, onUpdate }: SocialMediaLinkedProps) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});
  const [profileData, setProfileData] = useState<TikTokProfileData | null>(null);
  const [instaProfileData, setInstaProfileData] = useState<InstagramProfileData | null>(null);
  const [primaryAccount, setPrimaryAccount] = useState<string | null>(null);

  type SocialPlatform = keyof SocialMediaAccount;

  const updateSocialAccount = (platform: SocialPlatform, value: string) => {
    onUpdate({
      ...data,
      socialAccounts: {
        ...data.socialAccounts,
        [platform]: value,
      },
    });
  };

  const setPrimaryAndPassData = (
    platform: SocialPlatform,
    profileData: TikTokProfileData | InstagramProfileData
  ) => {
    setPrimaryAccount(platform);

    onUpdate({
      ...data,
      socialAccounts: {
        ...data.socialAccounts,
        [platform]: data.socialAccounts[platform],
      },
      profileData: {
        ...data.profileData,
        [platform]: profileData,
      },
      primaryPlatform: platform,
    });
  };

  const verifyAccount = async (platform: SocialPlatform, username: string) => {
    if (!username) {
      setError((prev) => ({ ...prev, [platform]: "Please enter a username" }));
      return;
    }

    setLoading((prev) => ({ ...prev, [platform]: true }));
    setError((prev) => ({ ...prev, [platform]: "" }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // placeholder
      updateSocialAccount(platform, username);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError((prev) => ({
          ...prev,
          [platform]: err.message || "Failed to verify account. Please try again.",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          [platform]: "An unknown error occurred during verification.",
        }));
      }
    } finally {
      setLoading((prev) => ({ ...prev, [platform]: false }));
    }
  };

  async function verifyTikTok(username: string) {
    setLoading((prev) => ({ ...prev, tiktok: true }));
    setError((prev) => ({ ...prev, tiktok: "" }));

    try {
      const profiles = await runTikTokActor(username);

      if (profiles.length === 0) {
        setError((prev) => ({ ...prev, tiktok: "No profile found for this username." }));
      } else {
        updateSocialAccount("tiktok", username);
        setProfileData(profiles[0]);
        setPrimaryAndPassData("tiktok", profiles[0]);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError((prev) => ({
          ...prev,
          tiktok: e.message || "Error verifying TikTok profile",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          tiktok: "An unknown error occurred during TikTok verification.",
        }));
      }
    } finally {
      setLoading((prev) => ({ ...prev, tiktok: false }));
    }
  }

  async function verifyInsta(username: string) {
    setLoading((prev) => ({ ...prev, instagram: true }));
    setError((prev) => ({ ...prev, instagram: "" }));

    try {
      const profiles = await runInstagramActor(username);

      if (profiles.length === 0) {
        setError((prev) => ({
          ...prev,
          instagram: "No profile found for this username.",
        }));
      } else {
        updateSocialAccount("instagram", username);
        setInstaProfileData(profiles[0]);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError((prev) => ({
          ...prev,
          instagram: e.message || "Error verifying Instagram profile",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          instagram: "An unknown error occurred during Instagram verification.",
        }));
      }
    } finally {
      setLoading((prev) => ({ ...prev, instagram: false }));
    }
  }

  const socialPlatforms = [
    {
      id: "instagram"as SocialPlatform,
      name: "Instagram",
      icon: Instagram,
      placeholder: "@yourusername",
      color: "text-pink-600",
      verifyAction: verifyInsta,
    },
    {
      id: "tiktok" as SocialPlatform,
      name: "TikTok",
      icon: Music,
      placeholder: "@yourusername",
      color: "text-black",
      verifyAction: verifyTikTok,
    },
    {
      id: "youtube" as SocialPlatform,
      name: "YouTube",
      icon: Youtube,
      placeholder: "Channel URL or @handle",
      color: "text-red-600",
      verifyAction: (username: string) => verifyAccount("youtube", username),
    },
    {
      id: "twitter" as SocialPlatform,
      name: "Twitter/X",
      icon: Twitter,
      placeholder: "@yourusername",
      color: "text-blue-600",
      verifyAction: (username: string) => verifyAccount("twitter", username),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {socialPlatforms.map((platform) => {
        const Icon = platform.icon;
        const isConnected = data.socialAccounts[platform.id];
        return (
          <div key={platform.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon className={`h-5 w-5 ${platform.color}`} />
              <Label htmlFor={platform.id} className="font-medium">
                {platform.name}
              </Label>
              {isConnected && (
                <CheckCircle className="h-4 w-4 text-secondary animate-scale-in" />
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                id={platform.id}
                value={data.socialAccounts[platform.id] || ""}
                onChange={(e) => updateSocialAccount(platform.id, e.target.value)}
                placeholder={platform.placeholder}
                className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={loading[platform.id]}
                onClick={() => platform.verifyAction(data.socialAccounts[platform.id])}
                className="hover:bg-primary hover:text-white transition-colors duration-200"
              >
                {loading[platform.id] ? "Verifying..." : "Verify"}
              </Button>
            </div>

            {platform.id === "tiktok" && profileData && (
              <div className="mt-2 p-2 border rounded bg-gray-50 text-sm">
                <p>
                  <strong>Username:</strong> {profileData.name || "N/A"}
                </p>
                <p>
                  <strong>Followers:</strong> {profileData.fans || "N/A"}
                </p>
                <p>
                  <strong>Likes:</strong> {profileData.heart || "N/A"}
                </p>
                <p>
                  <strong>Following:</strong> {profileData.following || "N/A"}
                </p>
              </div>
            )}

            {platform.id === "instagram" && instaProfileData && (
              <div className="mt-2 p-2 border rounded bg-gray-50 text-sm">
                <p>
                  <strong>Full Name:</strong> {instaProfileData.fullName || "N/A"}
                </p>
                <p>
                  <strong>Username:</strong> {instaProfileData.username || "N/A"}
                </p>
                <p>
                  <strong>Followers:</strong> {instaProfileData.followersCount ?? "N/A"}
                </p>
                <p>
                  <strong>Following:</strong> {instaProfileData.followsCount ?? "N/A"}
                </p>
                <p>
                  <strong>Bio:</strong> {instaProfileData.biography || "N/A"}
                </p>
                <p>
                  <strong>Private:</strong> {instaProfileData.private ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Verified:</strong> {instaProfileData.verified ? "Yes" : "No"}
                </p>
              </div>
            )}

            {error[platform.id] && (
              <div className="text-red-600 text-sm mt-1">{error[platform.id]}</div>
            )}
          </div>
        );
      })}

      {(profileData || instaProfileData) && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Select your primary account</h4>
          <p className="text-sm text-green-700 mb-3">
            Choose the account with your highest following to showcase in your portfolio
          </p>

          <div className="flex space-x-3">
            {profileData && (
              <Button
                variant={primaryAccount === "tiktok" ? "default" : "outline"}
                onClick={() => setPrimaryAndPassData("tiktok", profileData)}
                className="flex items-center space-x-2"
              >
                <Music className="h-4 w-4" />
                <span>TikTok ({profileData.fans || 0} followers)</span>
              </Button>
            )}

            {instaProfileData && (
              <Button
                variant={primaryAccount === "instagram" ? "default" : "outline"}
                onClick={() => setPrimaryAndPassData("instagram", instaProfileData)}
                className="flex items-center space-x-2"
              >
                <Instagram className="h-4 w-4" />
                <span>Instagram ({instaProfileData.followersCount || 0} followers)</span>
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Why connect your accounts?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Automatically pull your follower count and engagement metrics</li>
          <li>• Show brands your authentic audience and reach</li>
          <li>• Track campaign performance in real-time</li>
          <li>• Build trust with verified social media presence</li>
        </ul>
      </div>
    </div>
  );
};

export default SocialMediaLinked;
