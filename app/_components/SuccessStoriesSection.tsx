"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  imageSrc: string;
}

interface SuccessStoriesSectionProps {
  testimonials?: Testimonial[];
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  showProgressBar?: boolean;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director at TechFlow",
    quote: "Amplyst helped us connect with authentic creators who truly understood our brand. Our ROI increased by 300% in just 3 months.",
    imageSrc: "/assets/images/person.jpg"
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Content Creator & Influencer",
    quote: "The platform made it so easy to find brands that align with my values. I've built meaningful partnerships that feel authentic to my audience.",
    imageSrc: "/assets/images/person.jpg"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Brand Manager at StyleCo",
    quote: "The analytics and insights provided by Amplyst are incredible. We can track every aspect of our campaigns and optimize in real-time.",
    imageSrc: "/assets/images/person.jpg"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Lifestyle Influencer",
    quote: "Working with brands through Amplyst feels natural and authentic. The matching algorithm really understands my niche and audience.",
    imageSrc: "/assets/images/person.jpg"
  }
];

const SuccessStoriesSection = ({
  testimonials = defaultTestimonials,
  autoPlayInterval = 5000,
  showNavigation = false,
  showDots = false,
  showProgressBar = false
}: SuccessStoriesSectionProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);

  
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentTestimonial, autoPlayInterval]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentTestimonial((prev) => {
      if (newDirection === 1) {
        return prev === testimonials.length - 1 ? 0 : prev + 1;
      } else {
        return prev === 0 ? testimonials.length - 1 : prev - 1;
      }
    });
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const imageVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const textVariants = {
    enter: { opacity: 0, y: 50 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  return (
    <section id="success-stories" className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 md:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            Success Stories
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            Real stories from brands and creators who found success with Amplyst
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <div className="max-w-6xl mx-auto relative px-2 sm:px-4">
          <motion.div 
            className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentTestimonial}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.4 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="relative cursor-grab active:cursor-grabbing touch-pan-y"
              >
                {/* Split Background */}
                <div className="absolute inset-0">
                  <div className="w-full lg:w-1/3 h-full bg-gradient-to-br from-gray-50 to-gray-100"></div>
                  <div className="absolute right-0 top-0 w-full lg:w-2/3 h-full bg-gradient-to-br from-blue-50 to-indigo-100"></div>
                </div>

                {/* Content */}
                <div className="relative grid grid-cols-1 lg:grid-cols-3 min-h-[500px] sm:min-h-[450px] md:min-h-[400px] lg:min-h-[350px] xl:min-h-[400px]">
                  {/* Left Side - Image */}
                  <motion.div 
                    className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-0 order-1 lg:order-1"
                    variants={imageVariants}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={testimonials[currentTestimonial].imageSrc}
                        alt={testimonials[currentTestimonial].name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 33vw"
                        quality={90}
                        priority={currentTestimonial === 0}
                      />
                      {/* Mobile overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden"></div>
                    </div>
                  </motion.div>

                  {/* Right Side - Testimonial Text */}
                  <motion.div 
                    className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center lg:col-span-2 order-2 lg:order-2"
                    variants={textVariants}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="text-left max-w-none lg:max-w-2xl">
                      {/* Quote Icon */}
                      <motion.div 
                        className="mb-3 sm:mb-4 md:mb-6"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                        <Quote className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue-600 opacity-60" />
                      </motion.div>

                      {/* Quote */}
                      <motion.div 
                        className="mb-4 sm:mb-6 md:mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-blue-900 leading-relaxed font-medium">
                          "{testimonials[currentTestimonial].quote}"
                        </p>
                      </motion.div>

                      {/* Attribution */}
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      >
                        <div className="font-semibold text-blue-900 text-base sm:text-lg md:text-xl lg:text-2xl mb-1">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-blue-700 text-sm sm:text-base md:text-lg lg:text-xl">
                          {testimonials[currentTestimonial].role}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {showNavigation && (
              <>
                <motion.button
                  className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-20 backdrop-blur-sm touch-manipulation"
                  onClick={() => paginate(-1)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </motion.button>
                
                <motion.button
                  className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-20 backdrop-blur-sm touch-manipulation"
                  onClick={() => paginate(1)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Dots Indicator */}
          {showDots && (
            <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 space-x-2 px-4">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${
                    index === currentTestimonial 
                      ? 'bg-blue-600 w-6 sm:w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => {
                    setDirection(index > currentTestimonial ? 1 : -1);
                    setCurrentTestimonial(index);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {showProgressBar && (
            <div className="w-full bg-gray-200 h-1 rounded-full mt-3 sm:mt-4 overflow-hidden mx-auto max-w-xs sm:max-w-sm">
              <motion.div
                className="bg-blue-600 h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
                key={currentTestimonial}
              />
            </div>
          )}
        </div>

        {/* Testimonial Counter */}
        {/* <motion.div 
          className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {currentTestimonial + 1} of {testimonials.length}
        </motion.div> */}
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-1/6 sm:top-1/4 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-blue-500/5 rounded-full"
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/6 sm:bottom-1/4 right-0 w-12 h-12 sm:w-18 sm:h-18 md:w-24 md:h-24 bg-indigo-500/5 rounded-full"
          animate={{
            x: [0, -20, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-purple-500/5 rounded-full"
          animate={{
            x: [0, 15, 0],
            y: [0, -10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  );
};

export default SuccessStoriesSection;