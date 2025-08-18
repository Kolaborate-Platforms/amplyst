"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import RoleSelection from "../_components/RoleSelection";
import { Users, TrendingUp, BarChart3 } from "lucide-react";
import { SignUp, useSignUp } from "@clerk/clerk-react";

const Register = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useSignUp();

  const roleParam = searchParams.get("role");
  const [selectedRole, setSelectedRole] = useState(roleParam || "");
  const [step, setStep] = useState(roleParam ? "details" : "role");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const roleIcons = {
    influencer: Users,
    brand: TrendingUp,
    agency: BarChart3,
  };

  const roleLabels = {
    influencer: "Creator/Influencer",
    brand: "Brand/SME",
    agency: "Marketing Agency",
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signUp?.create({
        emailAddress: form.email,
        password: form.password,
        unsafeMetadata: { role: selectedRole },
      });

      await signUp?.prepareEmailAddressVerification();
      router.push(`/onboarding/${selectedRole}`);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign up failed");
    }
  };

  if (step === "role") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-5xl animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900 font-poppins">Amplyst</span>
            </div>
            <CardTitle className="text-2xl font-poppins">Welcome to Amplyst</CardTitle>
            <CardDescription>
              The smart platform connecting nano & micro-influencers with brands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoleSelection onRoleSelect={handleRoleSelect} />
            <div className="text-center mt-8">
              <Link href="/" className="text-sm text-gray-600 hover:text-primary transition-colors duration-200">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "details" && selectedRole) {
    const RoleIcon = roleIcons[selectedRole as keyof typeof roleIcons];

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-100">
                <RoleIcon className="h-4 w-4 mr-1" />
                {roleLabels[selectedRole as keyof typeof roleLabels]}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-poppins">Create your account</CardTitle>
            <CardDescription>
              {selectedRole === "influencer" &&
                "Start monetizing your content and building brand partnerships"}
              {selectedRole === "brand" &&
                "Discover authentic nano & micro-influencers for your campaigns"}
              {selectedRole === "agency" &&
                "Manage influencer campaigns at scale for your clients"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit}>
              {selectedRole === "influencer" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="@Angella" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followerCount">Approximate follower count</Label>
                    <select
                      title="Approximate follower count"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select range...</option>
                      <option value="1k-5k">1K - 5K followers</option>
                      <option value="5k-10k">5K - 10K followers</option>
                      <option value="10k-25k">10K - 25K followers</option>
                      <option value="25k-50k">25K - 50K followers</option>
                      <option value="50k-100k">50K - 100K followers</option>
                    </select>
                  </div>
                </>
              )}

              {selectedRole === "brand" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company name</Label>
                    <Input id="companyName" placeholder="EcoWear" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" placeholder="https://ecowear.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <select
                      title="Industry"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select industry...</option>
                      <option value="fashion">Fashion & Apparel</option>
                      <option value="beauty">Beauty & Skincare</option>
                      <option value="health">Health & Wellness</option>
                      <option value="food">Food & Beverage</option>
                      <option value="tech">Technology</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="fitness">Fitness</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </>
              )}

              {selectedRole === "agency" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="agencyName">Agency name</Label>
                    <Input id="agencyName" placeholder="Bright Ideas Agency" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCount">Number of clients</Label>
                    <select
                      title="Number of clients"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select range...</option>
                      <option value="1-5">1-5 clients</option>
                      <option value="6-15">6-15 clients</option>
                      <option value="16-30">16-30 clients</option>
                      <option value="30+">30+ clients</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-poppins"
              >
                Create Account
              </Button>
            </form>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="text-center">
              <Button
                onClick={() => setStep("role")}
                className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
              >
                ← Change role
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Register;
