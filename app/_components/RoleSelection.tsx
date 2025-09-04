// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Users, TrendingUp, BarChart3 } from "lucide-react";

// interface RoleSelectionProps {
//   onRoleSelect: (role: string) => void;
//   selectedRole?: string;
// }

// const RoleSelection = ({ onRoleSelect, selectedRole }: RoleSelectionProps) => {
//   const [selected, setSelected] = useState(selectedRole || "");

//   const roles = [
//     {
//       id: "influencer",
//       title: "Creator/Influencer",
//       icon: Users,
//       description:
//         "Nano & micro-influencers (1K-100K followers) looking to monetize content and build brand partnerships",
//       benefits: [
//         "Find relevant brand collaborations",
//         "Professional portfolio builder",
//         "Secure payment processing",
//         "Campaign performance tracking",
//       ],
//       gradient: "from-primary to-primary-600",
//     },
//     {
//       id: "brand",
//       title: "Brand/SME",
//       icon: TrendingUp,
//       description:
//         "Small to medium businesses and startups seeking authentic influencer partnerships",
//       benefits: [
//         "Discover nano & micro-influencers",
//         "Cost-effective campaign management",
//         "Real-time ROI tracking",
//         "Streamlined collaboration tools",
//       ],
//       gradient: "from-secondary to-secondary-600",
//     }
//   ];

//   const handleRoleClick = (roleId: string) => {
//     setSelected(roleId);
//     onRoleSelect(roleId);
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto">
//       <div className="text-center mb-8 animate-fade-in">
//         <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">
//           Choose Your Role
//         </h2>
//         <p className="text-lg text-gray-600">
//           Select how you'll be using Amplyst to get the most relevant experience
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {roles.map((role, index) => {
//           const Icon = role.icon;
//           const isSelected = selected === role.id;

//           return (
//             <Card
//               key={role.id}
//               className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group ${
//                 isSelected
//                   ? "ring-2 ring-primary border-primary shadow-lg scale-105"
//                   : "hover:border-primary/30"
//               } animate-scale-in`}
//               style={{ animationDelay: `${index * 0.1}s` }}
//               onClick={() => handleRoleClick(role.id)}
//             >
//               <CardHeader className="text-center pb-4">
//                 <div
//                   className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${role.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
//                 >
//                   <Icon className="h-8 w-8 text-white" />
//                 </div>
//                 <CardTitle
//                   className={`text-xl font-poppins ${
//                     isSelected ? "text-primary" : "group-hover:text-primary"
//                   } transition-colors duration-300`}
//                 >
//                   {role.title}
//                 </CardTitle>
//                 <CardDescription className="text-sm">
//                   {role.description}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   {role.benefits.map((benefit, index) => (
//                     <div key={index} className="flex items-start space-x-3">
//                       <div
//                         className={`w-2 h-2 rounded-full mt-2 transition-colors duration-300 ${
//                           isSelected
//                             ? "bg-primary"
//                             : "bg-gray-400 group-hover:bg-primary"
//                         }`}
//                       ></div>
//                       <span className="text-sm text-gray-600">{benefit}</span>
//                     </div>
//                   ))}
//                 </div>
//                 {isSelected && (
//                   <Button
//                     className={`w-full mt-6 bg-gradient-to-r ${role.gradient} hover:opacity-90 text-white animate-fade-in font-poppins font-medium`}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onRoleSelect(role.id);
//                     }}
//                   >
//                     Continue as {role.title}
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default RoleSelection;


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, BarChart3 } from "lucide-react";

interface RoleSelectionProps {
  onRoleSelect?: (role: string) => void;
  selectedRole?: string;
}

const RoleSelection = ({ onRoleSelect, selectedRole }: RoleSelectionProps) => {
  const [selected, setSelected] = useState(selectedRole || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const roles = [
    {
      id: "influencer",
      title: "Creator/Influencer",
      icon: Users,
      description:
        "Nano & micro-influencers (1K-100K followers) looking to monetize content and build brand partnerships",
      benefits: [
        "Find relevant brand collaborations",
        "Professional portfolio builder",
        "Secure payment processing",
        "Campaign performance tracking",
      ],
      gradient: "from-primary to-primary-600",
    },
    {
      id: "brand",
      title: "Brand/SME",
      icon: TrendingUp,
      description:
        "Small to medium businesses and startups seeking authentic influencer partnerships",
      benefits: [
        "Discover nano & micro-influencers",
        "Cost-effective campaign management",
        "Real-time ROI tracking",
        "Streamlined collaboration tools",
      ],
      gradient: "from-secondary to-secondary-600",
    }
  ];

  const handleRoleClick = (roleId: string) => {
    setSelected(roleId);
    // Call the optional onRoleSelect callback if provided
    if (onRoleSelect) {
      onRoleSelect(roleId);
    }
  };

  const handleContinue = async (roleId: string) => {
    setIsLoading(true);
    
    try {
      // Call the optional onRoleSelect callback if provided
      if (onRoleSelect) {
        onRoleSelect(roleId);
      }
      
      // Redirect to role-specific onboarding
      router.push(`/onboarding/${roleId}?role=${roleId}`);
    } catch (error) {
      console.error("Error during role selection:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-poppins leading-tight">
            Choose Your Role
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Select how you'll be using Amplyst to get the most relevant experience
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isSelected = selected === role.id;

            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group relative overflow-hidden backdrop-blur-sm ${
                  isSelected
                    ? "ring-4 ring-primary/50 border-primary shadow-2xl scale-105 bg-white/90"
                    : "hover:border-primary/40 bg-white/70 hover:bg-white/90"
                } animate-scale-in border-2 rounded-2xl sm:rounded-3xl`}
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  minHeight: 'fit-content'
                }}
                onClick={() => handleRoleClick(role.id)}
              >
                {/* Gradient overlay for selected state */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl sm:rounded-3xl pointer-events-none" />
                )}
                
                <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 relative z-10">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r ${role.gradient} flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg group-hover:shadow-xl ${
                      isSelected ? 'scale-110 shadow-xl' : ''
                    }`}
                  >
                    <Icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                  </div>
                  <CardTitle
                    className={`text-xl sm:text-2xl lg:text-3xl font-poppins font-bold transition-colors duration-300 mb-3 sm:mb-4 ${
                      isSelected ? "text-primary" : "group-hover:text-primary text-gray-900"
                    }`}
                  >
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed px-2">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 relative z-10">
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {role.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start space-x-3 sm:space-x-4 group/benefit">
                        <div
                          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mt-2 sm:mt-2.5 transition-all duration-300 flex-shrink-0 ${
                            isSelected
                              ? "bg-primary shadow-sm"
                              : "bg-gray-400 group-hover:bg-primary group/benefit-hover:scale-125"
                          }`}
                        />
                        <span className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Continue Button */}
                  <div className={`transition-all duration-500 ${isSelected ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 pointer-events-none'}`}>
                    <Button
                      className={`w-full py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r ${role.gradient} hover:opacity-95 text-white animate-fade-in font-poppins font-semibold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95`}
                      disabled={isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContinue(role.id);
                      }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Redirecting...</span>
                        </div>
                      ) : (
                        `Continue as ${role.title}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer instruction for mobile */}
        <div className="text-center mt-8 sm:mt-12 md:hidden animate-fade-in">
          <p className="text-sm text-gray-500 px-4">
            Tap a card to select your role, then tap Continue to proceed
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
          opacity: 0;
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Focus styles for accessibility */
        .focus-visible:focus {
          outline: 2px solid ;
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .bg-white\\/70 {
            background-color: white;
          }
          
          .text-gray-600 {
            color: #374151;
          }
          

        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-scale-in,
          .transition-all,
          .transition-colors,
          .transition-transform {
            animation: none;
            transition: none;
          }
          
          .hover\\:-translate-y-2:hover,
          .hover\\:-translate-y-3:hover,
          .group-hover\\:scale-110,
          .hover\\:scale-105:hover {
            transform: none;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .hover\\:shadow-xl:hover,
          .hover\\:shadow-2xl:hover {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          
          .cursor-pointer {
            cursor: default;
          }
        }
      `}</style>
    </div>
  );
};

export default RoleSelection;