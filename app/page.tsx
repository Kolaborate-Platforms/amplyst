"use client";

import {
  Navigation,
  HeroSection,
  InfluencerSection,
  HowItWorksSection,
  FeaturesSection,
  SuccessStoriesSection,
  Footer
} from './_components';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3A7CA5]/5 to-[#88B04B]/5">
      <Navigation />
      <HeroSection />
      <InfluencerSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SuccessStoriesSection />
      <Footer />
    </div>
  );
}
