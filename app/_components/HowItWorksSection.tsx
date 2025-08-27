"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import how from '../../public/assets/favicon.ico'

interface ContentBlock {
  title: string;
  content: string;
}

interface HowItWorksSectionProps {
  videoSrc?: string;
  contentBlocks?: ContentBlock[];
  autoPlayInterval?: number;
}

const defaultContentBlocks: ContentBlock[] = [
  {
    title: "Discover & Connect",
    content: "Find and connect with authentic creators who align with your brand values and target audience through our advanced matching algorithm."
  },
  {
    title: "Campaign Management",
    content: "Streamline your influencer campaigns with our comprehensive management tools. Track progress, manage contracts, and ensure seamless collaboration."
  },
  {
    title: "Performance Analytics",
    content: "Get detailed insights and analytics on campaign performance. Track ROI, engagement rates, and measure the true impact of your influencer partnerships."
  },
  {
    title: "Scale & Optimize",
    content: "Use data-driven insights to optimize future campaigns and scale your influencer marketing strategy for maximum impact and growth."
  }
];

const HowItWorksSection = ({
  videoSrc = "/assets/how-it-works.webm", // Default path - adjust as needed
  contentBlocks = defaultContentBlocks,
  autoPlayInterval = 4000
}: HowItWorksSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate content blocks
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % contentBlocks.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [contentBlocks.length, autoPlayInterval]);

  // Flip animation variants
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
        duration: 0.6,
        ease: "easeOut",
      },
    },
    exit: {
      rotateY: 90,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.6,
        ease: "easeIn",
      },
    },
  };

  return (
    <section id="how-it-works" className="w-full bg-white relative">
      <div className="container mx-auto py-12 md:py-20 px-4">
        {/* Top Section - Centered Text */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Make Creator Strategy a Marketing Pillar
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Influencer marketing is no longer a test—it's a strategic necessity.
          </motion.p>
        </motion.div>

        {/* Desktop Layout - Video Left, Content Right */}
        <div className="hidden lg:flex relative items-start gap-8">
          {/* Video - Sticky on Left */}
          <motion.div 
            className="sticky top-20 w-1/2 flex-shrink-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative">
              <motion.video
                className="w-full h-auto rounded-lg shadow-lg bg-transparent"
                autoPlay
                muted
                loop
                playsInline
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <source src={videoSrc} type="video/webm" />
                Your browser does not support the video tag.
              </motion.video>
              
              {/* Video overlay for better integration */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-transparent to-white/10 pointer-events-none" />
            </div>
          </motion.div>

          {/* Content Blocks - Scrollable on Right with Flip Animation */}
          <motion.div 
            className="w-1/2 flex-shrink-0" 
            id="how-it-works-content"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <div className="min-h-[300px] lg:min-h-[400px] relative flex items-center" style={{ perspective: '1000px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={flipVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-6">
                    {contentBlocks[currentIndex].title}
                  </h3>
                  <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                    {contentBlocks[currentIndex].content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            {/* <div className="flex justify-start space-x-3 mt-8">
              {contentBlocks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                    index === currentIndex 
                      ? 'bg-primary shadow-lg shadow-primary/30' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div> */}
          </motion.div>
        </div>

        {/* Mobile/Tablet Layout - Stacked */}
        <div className="lg:hidden">
          {/* Video */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <video
                className="w-full h-auto rounded-lg shadow-lg bg-transparent"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={videoSrc} type="video/webm" />
                Your browser does not support the video tag.
              </video>
              
              {/* Mobile video overlay */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />
            </div>
          </motion.div>

          {/* Content with Flip Animation */}
          <motion.div 
            className="min-h-[300px] md:min-h-[250px] relative flex items-center" 
            style={{ perspective: '1000px' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={flipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex flex-col justify-center text-center px-4"
              >
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
                  {contentBlocks[currentIndex].title}
                </h3>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  {contentBlocks[currentIndex].content}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Mobile Navigation Dots */}
          {/* <div className="flex justify-center space-x-3 mt-8">
            {contentBlocks.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  index === currentIndex 
                    ? 'bg-primary shadow-lg shadow-primary/30' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div> */}
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-0 w-24 h-24 bg-primary/5 rounded-full"
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-0 w-32 h-32 bg-secondary/5 rounded-full"
          animate={{
            x: [0, -25, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  );
};

export default HowItWorksSection;























// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from 'framer-motion';

// export default function HowItWorksSection() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const contentBlocks = [
//     {
//       title: "The Social Singularity is Here",
//       content: "Social platforms have overtaken TV in audience size—flipping the marketing landscape forever."
//     },
//     {
//       title: "Creator Economy Revolution",
//       content: "The creator economy is now worth over $100 billion, with creators becoming the new media companies and distribution channels."
//     },
//     {
//       title: "Authentic Connections Drive Results",
//       content: "Consumers trust creators more than traditional advertising. Authentic partnerships deliver 3x higher engagement rates."
//     }
//   ];

//   // Auto-advance content blocks every 9 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % contentBlocks.length);
//     }, 9000);
//     return () => clearInterval(interval);
//   }, []);

//   const flipVariants = {
//     enter: {
//       rotateY: -90,
//       opacity: 0,
//       scale: 0.8,
//     },
//     center: {
//       rotateY: 0,
//       opacity: 1,
//       scale: 1,
//       transition: {
//         duration: 0.6
//       }
//     },
//     exit: {
//       rotateY: 90,
//       opacity: 0,
//       scale: 0.8,
//       transition: {
//         duration: 0.6
//       }
//     }
//   };

//   return (
//     <section id="how-it-works" className="w-full bg-white relative">
//       <div className="container mx-auto py-12 md:py-20 px-4">
//         {/* Top Section - Centered Text */}
//         <div className="text-center mb-12 md:mb-16">
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
//             Make Creator Strategy a Marketing Pillar
//           </h2>
//           <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
//             Influencer marketing is no longer a test—it's a strategic necessity.
//           </p>
//         </div>

//         {/* Content Blocks with Flip Animation */}
//         <div className="max-w-4xl mx-auto">
//           <div className="min-h-[200px] relative" style={{ perspective: '1000px' }}>
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentIndex}
//                 variants={flipVariants}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 className="absolute inset-0 flex flex-col justify-center text-center"
//               >
//                 <h3 className="text-2xl font-bold text-[#3A7CA5] mb-4">
//                   {contentBlocks[currentIndex].title}
//                 </h3>
//                 <p className="text-lg text-gray-700 leading-relaxed">
//                   {contentBlocks[currentIndex].content}
//                 </p>
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
