// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Users, TrendingUp } from "lucide-react";

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
//       color: "primary",
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
//       color: "secondary",
//     },
//   ];

//   const handleRoleClick = (roleId: string) => {
//     setSelected(roleId);
//     // Immediately route the user when they click on a role card
//     onRoleSelect(roleId);
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto">
//       <div className="text-center mb-6 sm:mb-8 animate-fade-in">
//         <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-3 sm:mb-4 font-poppins">
//           Choose Your Role
//         </h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6">
//         {roles.map((role, index) => {
//           const Icon = role.icon;
//           const isSelected = selected === role.id;

//           return (
//             <Card
//               key={role.id}
//               className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group ${
//                 isSelected
//                   ? "ring-2 ring-primary border-primary shadow-xl scale-105"
//                   : "hover:border-primary/30 hover:shadow-xl border-primary-100"
//               } animate-scale-in h-full bg-white/80 backdrop-blur-sm`}
//               style={{ animationDelay: `${index * 0.1}s` }}
//               onClick={() => handleRoleClick(role.id)}
//             >
//               <CardHeader className="text-center pb-4 sm:pb-6">
//                 <div
//                   className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-r ${role.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg`}
//                 >
//                   <Icon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
//                 </div>
//                 <CardTitle
//                   className={`text-lg sm:text-xl lg:text-2xl font-poppins font-bold ${
//                     isSelected ? "text-primary" : "text-primary-900 group-hover:text-primary"
//                   } transition-colors duration-300`}
//                 >
//                   {role.title}
//                 </CardTitle>
//                 <CardDescription className="text-xs sm:text-sm lg:text-base leading-relaxed text-primary-700">
//                   {role.description}
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="flex-1 flex flex-col px-4 sm:px-6">
//                 <div className="space-y-2 sm:space-y-3 flex-1">
//                   {role.benefits.map((benefit, benefitIndex) => (
//                     <div key={benefitIndex} className="flex items-start space-x-2 sm:space-x-3">
//                       <div
//                         className={`w-1.5 h-1.5 rounded-full mt-1.5 transition-colors duration-300 flex-shrink-0 ${
//                           isSelected
//                             ? "bg-primary"
//                             : "bg-primary-400 group-hover:bg-primary"
//                         }`}
//                       ></div>
//                       <span className="text-xs sm:text-sm lg:text-base text-primary-700 leading-relaxed">
//                         {benefit}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//                 {/* Removed selection indicator */}
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, BarChart3 } from "lucide-react";

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
  selectedRole?: string;
}

const RoleSelection = ({ onRoleSelect, selectedRole }: RoleSelectionProps) => {
  const [selected, setSelected] = useState(selectedRole || "");

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
    onRoleSelect(roleId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">
          Choose Your Role
        </h2>
        <p className="text-lg text-gray-600">
          Select how you'll be using Amplyst to get the most relevant experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selected === role.id;

          return (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group ${
                isSelected
                  ? "ring-2 ring-primary border-primary shadow-lg scale-105"
                  : "hover:border-primary/30"
              } animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleRoleClick(role.id)}
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${role.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle
                  className={`text-xl font-poppins ${
                    isSelected ? "text-primary" : "group-hover:text-primary"
                  } transition-colors duration-300`}
                >
                  {role.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {role.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 transition-colors duration-300 ${
                          isSelected
                            ? "bg-primary"
                            : "bg-gray-400 group-hover:bg-primary"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
                {isSelected && (
                  <Button
                    className={`w-full mt-6 bg-gradient-to-r ${role.gradient} hover:opacity-90 text-white animate-fade-in font-poppins font-medium`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRoleSelect(role.id);
                    }}
                  >
                    Continue as {role.title}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelection;