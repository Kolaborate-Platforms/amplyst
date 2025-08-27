"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "../../../../hooks/use-toast";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface Application {
  _id: Id<"applications">;
  status: 'pending' | 'approved' | 'rejected';
  influencerName: string;
  influencerEmail: string;
  campaignTitle: string;
  message?: string;
  proposedContent?: string;
  _creationTime: number;
  [key: string]: any;
}

export default function Applications() {
  const { toast } = useToast();
  
  // Fetch applications from Convex
  const applications = useQuery(api.applications.listApplications) as Application[] | undefined;
  
  // Mutation for updating application status
  const updateApplication = useMutation(api.applications.updateApplication);
  
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const handleApproveApplication = async (applicationId: Id<"applications">) => {
    setLoadingStates(prev => ({ ...prev, [applicationId]: true }));
    
    try {
      await updateApplication({
        applicationId,
        status: 'approved'
      });
      
      toast({
        title: "Application Approved",
        description: "The application has been approved successfully",
        variant: "default", // Next.js 15 typically uses "default" instead of "success"
      });
    } catch (error) {
      console.error("Error approving application:", error);
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleRejectApplication = async (applicationId: Id<"applications">) => {
    setLoadingStates(prev => ({ ...prev, [applicationId]: true }));
    
    try {
      await updateApplication({
        applicationId,
        status: 'rejected'
      });
      
      toast({
        title: "Application Rejected",
        description: "The application has been rejected",
        variant: "default",
      });
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const renderApplications = () => (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Applications</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage influencer applications for your campaigns
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {applications && applications.length > 0 ? (
            applications.map((application) => (
              <div
                key={application._id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  {/* Left section: Influencer info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {application.influencerName?.charAt(0) || "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        <span className="font-medium text-gray-700">Influencer Name: </span>
                        {application.influencerName || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        <span className="font-medium text-gray-700">Campaign: </span>
                        {application.campaignTitle || "N/A"}
                      </p>
                      {application.message && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-3 break-words">
                          <span className="font-medium text-gray-700">Message: </span>
                          {application.message}
                        </p>
                      )}
                      {application.proposedContent && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-3 break-words">
                          <span className="font-medium text-gray-700">Proposed Content: </span>
                          {application.proposedContent}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right section: Status and actions */}
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <Badge
                      variant={
                        application.status === "pending"
                          ? "secondary"
                          : application.status === "approved"
                          ? "default"
                          : "destructive"
                      }
                      className={
                        application.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>

                    {application.status === "pending" && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectApplication(application._id)}
                          disabled={loadingStates[application._id]}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          {loadingStates[application._id] ? "Rejecting..." : "Reject"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveApplication(application._id)}
                          disabled={loadingStates[application._id]}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {loadingStates[application._id] ? "Approving..." : "Approve"}
                        </Button>
                      </div>
                    )}
                    {application.status !== "pending" && (
                      <p className="text-xs text-gray-500 mt-1">
                        {application.status === "approved" ? "Approved" : "Rejected"} application
                      </p>
                    )}  
                  </div>
                </div>
              </div>
            ))
          ) : applications === undefined ? (
            // Loading state
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Applications...</h3>
              <p className="text-gray-600">
                Please wait while we fetch your applications
              </p>
            </div>
          ) : (
            // No applications state
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600">
                Campaign applications will appear here when influencers apply
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return renderApplications();
}