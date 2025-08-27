"use client";

import { useState, useRef } from "react";
import { motion } from 'framer-motion';
import { Zap, Target, BarChart3, Shield, CheckCircle, MessageSquare, Sparkles, ArrowRight } from "lucide-react";

export default function FeaturesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Predefined positions for floating elements to avoid hydration mismatches
  const floatingPositions = useRef([
    { top: "25%", left: "15%" },
    { top: "91%", left: "50%" },
    { top: "1%", left: "23%" },
    { top: "41%", left: "54%" },
    { top: "76%", left: "40%" },
    { top: "4%", left: "81%" },
    { top: "8%", left: "84%" },
    { top: "60%", left: "26%" }
  ]);

  const features = [
    {
      id: 1,
      icon: Zap,
      title: "Smart Matching",
      description: "AI-powered matching ensures you find the perfect collaborations.",
      color: "#3A7CA5",
      gradient: "from-primary to-primary-600",
      bgGradient: "from-primary-50 to-secondary-50"
    },
    {
      id: 2,
      icon: Target,
      title: "Targeted Campaigns",
      description: "Reach your ideal audience with precision targeting.",
      color: "#E19629",
      gradient: "from-accent to-accent-600",
      bgGradient: "from-accent-50 to-accent-100"
    },
    {
      id: 3,
      icon: BarChart3,
      title: "Performance Tracking",
      description: "Monitor your campaign's success with detailed analytics.",
      color: "#88B04B",
      gradient: "from-secondary to-secondary-600",
      bgGradient: "from-secondary-50 to-secondary-100"
    },
    {
      id: 4,
      icon: Shield,
      title: "Secure Payments",
      description: "Hassle-free and secure payment processing for all transactions.",
      color: "#3A7CA5",
      gradient: "from-primary to-primary-600",
      bgGradient: "from-primary-50 to-primary-100"
    },
    {
      id: 5,
      icon: CheckCircle,
      title: "Verified Influencers",
      description: "Collaborate with trusted and verified creators.",
      color: "#E19629",
      gradient: "from-accent to-accent-600",
      bgGradient: "from-accent-50 to-accent-100"
    },
    {
      id: 6,
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Seamlessly communicate with brands and influencers.",
      color: "#88B04B",
      gradient: "from-secondary to-secondary-600",
      bgGradient: "from-secondary-50 to-secondary-100"
    }
  ];

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
    <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full opacity-10"
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
          className="absolute bottom-20 right-10 w-24 h-24 bg-accent-200 rounded-full opacity-10"
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
          className="mb-12 sm:mb-16 lg:mb-20"
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-900 mb-4 sm:mb-6 font-poppins">
              Key Features
            </h2>
            <motion.div
              className="absolute -top-2 -right-2"
              variants={sparkleVariants}
              initial="hidden"
              animate="visible"
            >
              <Sparkles className="w-6 h-6 text-accent" />
            </motion.div>
          </motion.div>

          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-primary-700 max-w-4xl mx-auto leading-relaxed"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
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
                <div className={`relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${feature.bgGradient} border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm h-full`}>

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
                      className="relative mb-6 sm:mb-8"
                      variants={iconVariants}
                      initial="idle"
                      whileHover="hover"
                    >
                      <motion.div
                        className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}
                        whileHover={{
                          boxShadow: `0 20px 40px ${feature.color}40`,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <IconComponent
                          className="h-8 w-8 sm:h-10 sm:w-10 text-white"
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
                              className="absolute w-2 h-2 bg-accent rounded-full"
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
                      className="text-xl sm:text-2xl font-semibold text-primary-900 mb-4 font-poppins"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {feature.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      className="text-primary-700 text-sm sm:text-base leading-relaxed mb-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {feature.description}
                    </motion.p>

                    {/* Learn More Link */}
                    <motion.div
                      className="flex items-center justify-center text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors duration-300"
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
        {floatingPositions.current.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-300 rounded-full opacity-20"
            style={{
              top: position.top,
              left: position.left,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.5, 0.2],
              transition: {
                duration: 3 + (i * 0.3),
                repeat: Infinity,
                delay: i * 0.2
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}
