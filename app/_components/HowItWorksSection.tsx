"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';

export default function HowItWorksSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const contentBlocks = [
    {
      title: "The Social Singularity is Here",
      content: "Social platforms have overtaken TV in audience size—flipping the marketing landscape forever."
    },
    {
      title: "Creator Economy Revolution",
      content: "The creator economy is now worth over $100 billion, with creators becoming the new media companies and distribution channels."
    },
    {
      title: "Authentic Connections Drive Results",
      content: "Consumers trust creators more than traditional advertising. Authentic partnerships deliver 3x higher engagement rates."
    }
  ];

  // Auto-advance content blocks every 9 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % contentBlocks.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const flipVariants = {
    enter: {
      rotateY: -90,
      opacity: 0,
      scale: 0.8,
    },
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6
      }
    },
    exit: {
      rotateY: 90,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="how-it-works" className="w-full bg-white relative">
      <div className="container mx-auto py-12 md:py-20 px-4">
        {/* Top Section - Centered Text */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Make Creator Strategy a Marketing Pillar
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Influencer marketing is no longer a test—it's a strategic necessity.
          </p>
        </div>

        {/* Content Blocks with Flip Animation */}
        <div className="max-w-4xl mx-auto">
          <div className="min-h-[200px] relative" style={{ perspective: '1000px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={flipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex flex-col justify-center text-center"
              >
                <h3 className="text-2xl font-bold text-[#3A7CA5] mb-4">
                  {contentBlocks[currentIndex].title}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {contentBlocks[currentIndex].content}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
