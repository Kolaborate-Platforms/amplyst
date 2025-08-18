"use client";

import { useState } from "react";
import { motion } from 'framer-motion';
import { Zap, Target, BarChart3, Shield, CheckCircle, MessageSquare, Sparkles, ArrowRight } from "lucide-react";

export default function FeaturesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
  );
}
