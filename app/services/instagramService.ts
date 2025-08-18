// https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token=apify_api_7duCuWXWiRN2DJNi5aEVSalzmMhEc12ijzrz
//https://console.apify.com/view/runs/no77tEr71axHecaNX
//https://api.apify.com/v2/actor-runs/no77tEr71axHecaNX?token=apify_api_7duCuWXWiRN2DJNi5aEVSalzmMhEc12ijzrz
import axios from "axios";

const APIFY_TOKEN = process.env.APIFY_TOKEN;



export interface InstagramProfileData {
  id: string;
  username: string;
  url: string;
  fullName: string;
  biography: string;
  externalUrl: string | null;
  followersCount: number;
  followsCount: number;
  hasChannel: boolean;
  highlightReelCount: number;
  isBusinessAccount: boolean;
  joinedRecently: boolean;
  businessCategoryName: string | null;
  private: boolean;
  verified: boolean;
  profilePicUrl: string;
  profilePicUrlHD: string;
  facebookPage: string | null;
  igtvVideoCount: number;
  relatedProfiles: Array<{
    id: string;
    full_name: string;
    is_private: boolean;
    is_verified: boolean;
    profile_pic_url: string;
    username: string;
  }>;
}




export async function runInstagramActor(usernames: string): Promise<InstagramProfileData[]> {
  // Prepare input for the Actor
  const input = {
    usernames, // Array of usernames
  };



  const runResponse = await axios.post(
    "https://api.apify.com/v2/acts/urbACh26VF8yHR72m/runs?token=apify_api_7duCuWXWiRN2DJNi5aEVSalzmMhEc12ijzrz",
    input
  );



  console.log("Run Response from the Api in the instagram service:", runResponse.data);

  const runId = runResponse.data.data.id;

  // Poll for run completion
  let runStatus = "";
  let datasetId = "";

  while (runStatus !== "SUCCEEDED" && runStatus !== "FAILED") {
    await new Promise((r) => setTimeout(r, 3000)); // wait 3 seconds

    const runStatusResponse = await axios.get(
      "https://api.apify.com/v2/actor-runs/no77tEr71axHecaNX?token=apify_api_7duCuWXWiRN2DJNi5aEVSalzmMhEc12ijzrz"
    );

    runStatus = runStatusResponse.data.data.status;
    datasetId = runStatusResponse.data.data.defaultDatasetId;
  }

  if (runStatus === "FAILED") {
    throw new Error("Instagram actor run failed");
  }

  // Fetch results from dataset
  const datasetResponse = await axios.get(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`
  );

  return datasetResponse.data as InstagramProfileData[];
}
