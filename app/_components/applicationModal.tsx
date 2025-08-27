// 'use client';

// import React, { useState } from 'react';
// import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/components/ui/use-toast';
// import { Campaign } from "../../lib/types/index";

// interface ApplicationModalProps {
//   campaign: Campaign;
//   existingApplication?: {
//     message?: string;
//     status: "pending" | "approved" | "rejected";
//   } | null;
//   onClose: () => void;
//   onSubmit: (pitch: string) => Promise<void>;
//   onWithdraw?: () => Promise<void>;
// }

// const ApplicationModal = ({ 
//   campaign,
//   existingApplication,
//   onClose, 
//   onSubmit,
//   onWithdraw
// }: ApplicationModalProps) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [pitch, setPitch] = useState(existingApplication?.message || "");
  
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!pitch.trim()) return;

//     setLoading(true);
//     setError("");
    
//     try {
//       await onSubmit(pitch);
//       toast({
//         variant: "default",
//         title: existingApplication ? "Application Updated" : "Application Submitted",
//         description: existingApplication 
//           ? "Your application has been updated successfully."
//           : "Your application has been submitted successfully.",
//       });
//       onClose();
//     } catch (e: any) {
//       const errorMessage = e.message || 'An error occurred';
//       setError(errorMessage);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: errorMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleWithdraw = async () => {
//     if (!onWithdraw) return;

//     setLoading(true);
//     setError("");
    
//     try {
//       await onWithdraw();
//       toast({
//         variant: "default",
//         title: "Application Withdrawn",
//         description: "Your application has been withdrawn successfully.",
//       });
//       onClose();
//     } catch (e: any) {
//       const errorMessage = e.message || 'An error occurred';
//       setError(errorMessage);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: errorMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div 
//       className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//       onClick={handleBackdropClick}
//     >
//       <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-900">
//             {existingApplication ? "Update Application" : `Apply to "${campaign.title}"`}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-2xl"
//             aria-label="Close modal"
//           >
//             ×
//           </button>
//         </div>

//         <div className="mb-4 p-3 bg-gray-50 rounded-md">
//           <h3 className="font-medium text-sm text-gray-900 mb-1">{campaign.title}</h3>
//           <p className="text-xs text-gray-600 line-clamp-2">{campaign.description}</p>
//           <div className="flex justify-between mt-2 text-xs text-gray-500">
//             <span>Budget: {campaign.budget ? `$${campaign.budget.toLocaleString()}` : 'N/A'}</span>
//             <span>Deadline: {campaign.endDate || 'N/A'}</span>
//           </div>
//         </div>
        
//         <SignedOut>
//           <div className="text-center py-8">
//             <p className="text-gray-600 mb-4">Please sign in to apply to this campaign.</p>
//             <SignInButton mode="modal">
//               <Button className="bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-white">
//                 Sign In
//               </Button>
//             </SignInButton>
//           </div>
//         </SignedOut>

//         <SignedIn>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-2">
//                 Your Pitch *
//               </label>
//               <textarea
//                 id="pitch"
//                 className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#3A7CA5] focus:border-transparent resize-none"
//                 rows={5}
//                 value={pitch}
//                 onChange={(e) => setPitch(e.target.value)}
//                 placeholder="Tell the brand why you're a great fit for this campaign. Include details about your audience, content style, and relevant experience..."
//                 required
//                 disabled={loading}
//                 maxLength={1000}
//               />
//               <div className="text-xs text-gray-500 mt-1">
//                 {pitch.length}/1000 characters
//               </div>
//             </div>
            
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-md p-3">
//                 <p className="text-red-600 text-sm">{error}</p>
//               </div>
//             )}

//             {existingApplication && (
//               <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
//                 <p className="text-blue-700 text-sm">
//                   <strong>Current Status:</strong> {existingApplication.status}
//                 </p>
//               </div>
//             )}
            
//             <div className="flex justify-end gap-3 pt-4">
//               {existingApplication && onWithdraw && existingApplication.status === "pending" && (
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   onClick={handleWithdraw}
//                   disabled={loading}
//                   size="sm"
//                 >
//                   {loading ? "Processing..." : "Withdraw Application"}
//                 </Button>
//               )}
              
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={onClose}
//                 disabled={loading}
//                 size="sm"
//               >
//                 Cancel
//               </Button>
              
//               <Button 
//                 type="submit" 
//                 disabled={loading || !pitch.trim() || existingApplication?.status === "approved"}
//                 className="bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-white"
//                 size="sm"
//               >
//                 {loading ? "Processing..." : existingApplication ? "Update Application" : "Submit Application"}
//               </Button>
//             </div>
//           </form>
//         </SignedIn>
//       </div>
//     </div>
//   );
// };
// export default ApplicationModal;










'use client';

import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Doc } from "@/convex/_generated/dataModel"; // Import Convex types

interface ApplicationModalProps {
  campaign: Doc<"campaigns">; 
  existingApplication?: {
    message?: string;
    status: "pending" | "approved" | "rejected";
  } | null;
  onClose: () => void;
  onSubmit: (pitch: string) => Promise<void>;
  onWithdraw?: () => Promise<void>;
}

const ApplicationModal = ({ 
  campaign,
  existingApplication,
  onClose, 
  onSubmit,
  onWithdraw
}: ApplicationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pitch, setPitch] = useState(existingApplication?.message || "");
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitch.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      await onSubmit(pitch);
      toast({
        variant: "default",
        title: existingApplication ? "Application Updated" : "Application Submitted",
        description: existingApplication 
          ? "Your application has been updated successfully."
          : "Your application has been submitted successfully.",
      });
      onClose();
    } catch (e: any) {
      const errorMessage = e.message || 'An error occurred';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!onWithdraw) return;

    setLoading(true);
    setError("");
    
    try {
      await onWithdraw();
      toast({
        variant: "default",
        title: "Application Withdrawn",
        description: "Your application has been withdrawn successfully.",
      });
      onClose();
    } catch (e: any) {
      const errorMessage = e.message || 'An error occurred';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {existingApplication ? "Update Application" : `Apply to "${campaign.title}"`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium text-sm text-gray-900 mb-1">{campaign.title}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{campaign.description}</p>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Budget: {campaign.budget ? `$${campaign.budget.toLocaleString()}` : 'N/A'}</span>
            <span>Deadline: {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
        
        <SignedOut>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Please sign in to apply to this campaign.</p>
            <SignInButton mode="modal">
              <Button className="bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-white">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-2">
                Your Pitch *
              </label>
              <textarea
                id="pitch"
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-[#3A7CA5] focus:border-transparent resize-none"
                rows={5}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Tell the brand why you're a great fit for this campaign. Include details about your audience, content style, and relevant experience..."
                required
                disabled={loading}
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1">
                {pitch.length}/1000 characters
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {existingApplication && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-blue-700 text-sm">
                  <strong>Current Status:</strong> {existingApplication.status}
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              {existingApplication && onWithdraw && existingApplication.status === "pending" && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleWithdraw}
                  disabled={loading}
                  size="sm"
                >
                  {loading ? "Processing..." : "Withdraw Application"}
                </Button>
              )}
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={loading}
                size="sm"
              >
                Cancel
              </Button>
              
              <Button 
                type="submit" 
                disabled={loading || !pitch.trim() || existingApplication?.status === "approved"}
                className="bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-white"
                size="sm"
              >
                {loading ? "Processing..." : existingApplication ? "Update Application" : "Submit Application"}
              </Button>
            </div>
          </form>
        </SignedIn>
      </div>
    </div>
  );
};

export default ApplicationModal;