import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


// import type { NextConfig } from "next";
// import type { Configuration } from "webpack";

// const nextConfig: NextConfig = {
//   experimental: {
//     esmExternals: false,
//   },
//   webpack: (config: Configuration) => {
//     config.resolve = config.resolve || {};
//     config.resolve.fallback = {
//       ...config.resolve.fallback,
//       fs: false,
//     };
//     return config;
//   },
//   // Skip build-time errors for missing env vars in static pages
//   env: {
//     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder',
//   },
// };

// export default nextConfig;