"use client";

import { motion } from 'framer-motion';

export default function InfluencerSection() {
  return (
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
  );
}
