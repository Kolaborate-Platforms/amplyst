"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, TrendingUp, MessageSquare, CreditCard, Zap, Target, BarChart3, Shield, CheckCircle, ChevronLeft, ChevronRight, Quote, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const features = [
    {
      id: 1,
      icon: Zap,
      title: "Smart Matching",
      description: "AI-powered matching ensures you find the perfect collaborations.",
      color: "#3A7CA5",
      gradient: "from-blue-400 to-blue-600",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      id: 2,
      icon: Target,
      title: "Targeted Campaigns",
      description: "Reach your ideal audience with precision targeting.",
      color: "#E19629",
      gradient: "from-orange-400 to-yellow-500",
      bgGradient: "from-orange-50 to-yellow-50"
    },
    {
      id: 3,
      icon: BarChart3,
      title: "Performance Tracking",
      description: "Monitor your campaign's success with detailed analytics.",
      color: "#88B04B",
      gradient: "from-green-400 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      id: 4,
      icon: Shield,
      title: "Secure Payments",
      description: "Hassle-free and secure payment processing for all transactions.",
      color: "#3A7CA5",
      gradient: "from-indigo-400 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50"
    },
    {
      id: 5,
      icon: CheckCircle,
      title: "Verified Influencers",
      description: "Collaborate with trusted and verified creators.",
      color: "#E19629",
      gradient: "from-amber-400 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50"
    },
    {
      id: 6,
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Seamlessly communicate with brands and influencers.",
      color: "#88B04B",
      gradient: "from-teal-400 to-green-500",
      bgGradient: "from-teal-50 to-green-50"
    }
  ];

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

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance content blocks every 9 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % contentBlocks.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

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

  // Animation variants for floating effect
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity
      }
    }
  };

  // Animation variants for rotation
  const rotateVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 8,
        repeat: Infinity
      }
    }
  };

  // Animation variants for pulse effect
  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity
      }
    }
  };

  // Animation variants for bounce effect
  const bounceVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity
      }
    }
  };

  // Stagger animation for icons appearing
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  const iconVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -180
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8
      }
    },
    idle: {
      scale: 1,
      rotate: 0
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        duration: 0.3
      }
    }
  };

  const onHoverStart = (id: number) => setHoveredCard(id);
  const onHoverEnd = () => setHoveredCard(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3A7CA5]/5 to-[#88B04B]/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-[#3A7CA5]">
              Amplyst
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">How It Works</a>
            <a href="#success-stories" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Success Stories</a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90 text-white px-6 py-2 rounded-full font-medium transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full bg-white relative overflow-hidden">
        <div className="container mx-auto py-20 px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto relative">

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >

              {/* Facebook Icon */}
              <motion.div
                variants={iconVariants}
                className="absolute top-1/2 left-4 transform -translate-y-1/2"
              >
                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-white font-bold text-lg">f</span>
                </motion.div>
              </motion.div>

              {/* Instagram Icon */}
              <motion.div
                variants={iconVariants}
                className="absolute bottom-4 left-8"
              >
                <motion.div
                  variants={rotateVariants}
                  animate="animate"
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* YouTube Icon */}
              <motion.div
                variants={iconVariants}
                className="absolute top-1/2 right-4 transform -translate-y-1/2"
              >
                <motion.div
                  variants={pulseVariants}
                  animate="animate"
                  className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* TikTok Icon */}
              <motion.div
                variants={iconVariants}
                className="absolute bottom-4 right-8"
              >
                <motion.div
                  variants={bounceVariants}
                  animate="animate"
                  className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </motion.div>
              </motion.div>

            </motion.div>

            {/* Main Content */}
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight relative z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              Hire Creators & Influencers
              <br />
              <span className="relative">
                To Promote Your Brand
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              Social media networks are open to all. Social media is typically used for social interaction and access to news and information, and decision making.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <button
                className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              >
                Join as Creator
              </button>
              <button
                className="border-2 border-gray-300 hover:border-[#3A7CA5] text-gray-700 hover:text-[#3A7CA5] px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              >
                Find Influencers
              </button>
            </motion.div>
          </div>
        </div>

        {/* Background Gradient Circle */}
        <motion.div
          className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-[#3A7CA5] to-[#88B04B] rounded-full opacity-20"
          initial={{ scale: 0, x: 100, y: 100 }}
          animate={{ scale: 1, x: 128, y: 128 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        />
      </section>

      {/* Influencer Section */}
      <section className="w-full bg-gradient-to-br from-pink-50 to-orange-50 relative overflow-hidden">
        <div className="container mx-auto py-20 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Section - Text Content */}
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2
              }}
            >
              <motion.p
                className="text-xl lg:text-2xl text-gray-800 font-medium"
                style={{ lineHeight: '1.6em' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.4
                }}
              >
                Sure, we do discovery, campaign management, influencer collaboration and reporting. But we also provide the largest global influencer data set, one-of-a-kind market benchmarking, and a team of experts — to help you make smarter investments.
              </motion.p>
            </motion.div>

            {/* Right Section - Animated Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: 0.3
              }}
              whileHover={{
                scale: 1.05,
                rotateY: -5,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
            >
              <motion.div
                className="w-full h-64 bg-gradient-to-br from-pink-200 to-orange-200 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.5
                }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              />

              {/* Animated glow effect behind image */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-200 to-orange-200 rounded-lg blur-xl opacity-0"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 0.3, scale: 1.1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                  delay: 0.8
                }}
                style={{ zIndex: -1 }}
              />
            </motion.div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute bottom-0 right-0 w-32 h-32 bg-pink-200 rounded-full opacity-30"
            initial={{ opacity: 0, scale: 0, x: 50, y: 50 }}
            whileInView={{ opacity: 0.3, scale: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              ease: "easeOut",
              delay: 0.6
            }}
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.1, 1],
              transition: {
                duration: 4,
                repeat: Infinity
              }
            }}
          />

          <motion.div
            className="absolute top-1/4 right-1/3 w-16 h-16 bg-blue-200 rounded-full opacity-40"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            whileInView={{ opacity: 0.4, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.9
            }}
            animate={{
              x: [0, 15, 0],
              rotate: [0, 10, 0],
              transition: {
                duration: 5,
                repeat: Infinity
              }
            }}
          />

          <motion.div
            className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-yellow-200 rounded-full opacity-30"
            initial={{ opacity: 0, scale: 0, x: -30, y: 30 }}
            whileInView={{ opacity: 0.3, scale: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              delay: 1.1
            }}
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
              transition: {
                duration: 6,
                repeat: Infinity
              }
            }}
          />
        </div>
      </section>

      {/* How It Works Section */}
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

      {/* Features Section */}
      <section id="features" className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-10"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              transition: {
                duration: 6,
                repeat: Infinity
              }
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-24 h-24 bg-orange-200 rounded-full opacity-10"
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
              transition: {
                duration: 4,
                repeat: Infinity
              }
            }}
          />
        </div>

        <div className="container mx-auto text-center relative z-10 max-w-7xl">
          {/* Header */}
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="relative inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                Key Features
              </h2>
              <motion.div
                className="absolute -top-2 -right-2"
                variants={sparkleVariants}
                initial="hidden"
                animate="visible"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              Discover the powerful tools and capabilities that make Amplyst the ultimate platform for influencer marketing success
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;

              return (
                <motion.div
                  key={feature.id}
                  variants={cardVariants}
                  className="group relative"
                  onHoverStart={() => onHoverStart(feature.id)}
                  onHoverEnd={onHoverEnd}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Card */}
                  <div className={`relative p-6 md:p-8 rounded-2xl bg-gradient-to-br ${feature.bgGradient} border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm h-full`}>

                    {/* Animated background glow */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon with animated background */}
                      <motion.div
                        className="relative mb-6"
                        variants={iconVariants}
                        initial="idle"
                        whileHover="hover"
                      >
                        <motion.div
                          className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}
                          whileHover={{
                            boxShadow: `0 20px 40px ${feature.color}40`,
                            transition: { duration: 0.3 }
                          }}
                        >
                          <IconComponent
                            className="h-8 w-8 md:h-10 md:w-10 text-white"
                          />
                        </motion.div>

                        {/* Floating sparkles around icon */}
                        {hoveredCard === feature.id && (
                          <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                                style={{
                                  top: `${20 + i * 20}%`,
                                  left: `${80 + i * 10}%`,
                                }}
                                animate={{
                                  y: [0, -20, 0],
                                  opacity: [0, 1, 0],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Title */}
                      <motion.h3
                        className="text-xl md:text-2xl font-semibold text-gray-900 mb-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {feature.title}
                      </motion.h3>

                      {/* Description */}
                      <motion.p
                        className="text-gray-600 text-sm md:text-base leading-relaxed mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {feature.description}
                      </motion.p>

                      {/* Learn More Link */}
                      <motion.div
                        className="flex items-center justify-center text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <span>Learn more</span>
                        <motion.div
                          animate={{ x: hoveredCard === feature.id ? 5 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Animated border */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100`}
                      style={{
                        background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, ${feature.color}40, ${feature.color}80) border-box`,
                      }}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Floating background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.5, 0.2],
                transition: {
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* Success Stories Section */}
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

      {/* Footer */}
      <footer className="bg-white py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Brand Title */}
            <h2 className="text-3xl font-bold text-black mb-4">
              Amplyst
            </h2>

            {/* Description */}
            <p className="text-gray-700 mb-8 leading-relaxed max-w-2xl">
              Amplyst connects nano and micro-influencers with small brands<br />
              for authentic partnerships that drive results.
            </p>

            {/* Social Media Icons */}
            <div className="flex justify-center space-x-4">
              {/* Facebook */}
              <div className="w-10 h-10 border border-black rounded-lg bg-white flex items-center justify-center shadow-[6px_6px_0_#A2FDE9] hover:bg-black hover:text-white transition-all duration-200">
                <span className="text-teal-600 font-bold text-lg hover:text-white">f</span>
              </div>

              {/* Twitter */}
              <div className="w-10 h-10 border border-black rounded-lg bg-white flex items-center justify-center shadow-[6px_6px_0_#A2FDE9] hover:bg-black hover:text-white transition-all duration-200">
                <svg className="w-5 h-5 text-teal-600 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </div>

              {/* Instagram */}
              <div className="w-10 h-10 border border-black rounded-lg bg-white flex items-center justify-center shadow-[6px_6px_0_#A2FDE9] hover:bg-black hover:text-white transition-all duration-200">
                <svg className="w-5 h-5 text-teal-600 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>

              {/* LinkedIn */}
              <div className="w-10 h-10 border border-black rounded-lg bg-white flex items-center justify-center shadow-[6px_6px_0_#A2FDE9] hover:bg-black hover:text-white transition-all duration-200">
                <svg className="w-5 h-5 text-teal-600 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="bg-gray-100 py-4 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 Amplyst. Revolutionizing influencer marketing with AI.
        </p>
      </div>
    </div>
  );
}
