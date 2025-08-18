"use client";

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
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

  return (
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
            <Button
              className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              onClick={() => router.push("/register?role=influencer")}
            >
              Join as Creator
            </Button>
            <Button
              className="border-2 border-gray-300 hover:border-[#3A7CA5] text-gray-700 hover:text-[#3A7CA5] px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              onClick={() => router.push("/register?role=brand")}
            >
              Find Influencers
            </Button>
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
  );
}
