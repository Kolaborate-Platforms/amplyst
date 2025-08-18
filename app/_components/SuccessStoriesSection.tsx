"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from "lucide-react";

export default function SuccessStoriesSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);

  // Testimonials array
  const testimonials = [
    {
      id: 1,
      quote: "Amplyst connected us with the perfect micro-influencers for our sustainable fashion line. The results exceeded our expectations with a 300% increase in sales within just 3 months.",
      name: "Claudia Vine",
      role: "Senior Manager, Social and Influencer Strategy",
      imageSrc: "/person.jpg"
    },
    {
      id: 2,
      quote: "As a nano-influencer with 5K followers, I finally found brands that value authentic engagement over follower count. I've earned $2,000 in my first month on the platform!",
      name: "Sarah Johnson",
      role: "Nano-Influencer",
      imageSrc: "/person.jpg"
    },
    {
      id: 3,
      quote: "The platform's AI-powered matching system helped us find creators who truly align with our brand values. Our campaign ROI increased by 250% compared to traditional marketing.",
      name: "Michael Chen",
      role: "Marketing Director",
      imageSrc: "/person.jpg"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 9000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const imageVariants = {
    enter: { scale: 1.2, opacity: 0 },
    center: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  };

  const textVariants = {
    enter: { y: 50, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: { x: number }, velocity: { x: number }) => {
    return Math.abs(offset.x) * velocity.x;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentTestimonial((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % testimonials.length;
      } else {
        return prev === 0 ? testimonials.length - 1 : prev - 1;
      }
    });
  };

  return (
    <section id="success-stories" className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center md:text-left mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            Success Stories
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-gray-600 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            Real stories from brands and creators who found success with Amplyst
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
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
                onDragEnd={(e: any, { offset, velocity }: { offset: { x: number }, velocity: { x: number } }) => {
                  const swipe = swipePower(offset, velocity);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="relative"
              >
                {/* Split Background */}
                <div className="absolute inset-0">
                  <div className="w-full lg:w-1/3 h-full bg-gradient-to-br from-gray-50 to-gray-100"></div>
                  <div className="absolute right-0 top-0 w-full lg:w-2/3 h-full bg-gradient-to-br from-blue-50 to-indigo-100"></div>
                </div>

                {/* Content */}
                <div className="relative grid grid-cols-1 lg:grid-cols-3 min-h-[400px] md:min-h-[350px] lg:min-h-[300px]">
                  {/* Left Side - Image */}
                  <motion.div
                    className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-0 order-2 lg:order-1"
                    variants={imageVariants}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      <motion.div
                        className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden"></div>
                    </div>
                  </motion.div>

                  {/* Right Side - Testimonial Text */}
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-8 lg:p-10 flex flex-col justify-center lg:col-span-2 order-1 lg:order-2"
                    variants={textVariants}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="text-left">
                      {/* Quote Icon */}
                      <motion.div
                        className="mb-4"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                        <Quote className="w-8 h-8 md:w-10 md:h-10 text-blue-600 opacity-60" />
                      </motion.div>

                      {/* Quote */}
                      <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <p className="text-lg md:text-xl lg:text-2xl text-blue-900 leading-relaxed font-medium">
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
                        <div className="font-semibold text-blue-900 text-lg md:text-xl">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-blue-700 text-sm md:text-base">
                          {testimonials[currentTestimonial].role}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
