import axios from "axios";

const APIFY_TOKEN = process.env.APIFY_TOKEN;
const ACTOR_ID = process.env.APIFY_ACTOR_ID; // Your TikTok scraping actor ID

export interface TikTokProfileData {
  name: string;
  fans?: number;
  following?: number;
  heart?: number;
  verified?: boolean;
  profilePictureUrl?: string;
}

export async function runTikTokActor(username: string): Promise<TikTokProfileData[]> {
  const input = {
    searchQueries: [username],
    maxProfilesPerQuery: 1,
  };

  const runResponse = await axios.post(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
    input
  );

  const runId = runResponse.data.data.id;

  let runStatus = "";
  let datasetId = "";

  while (runStatus !== "SUCCEEDED" && runStatus !== "FAILED") {
    await new Promise((r) => setTimeout(r, 3000)); // wait 3 seconds

    const runStatusResponse = await axios.get(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/runs/${runId}?token=${APIFY_TOKEN}`
    );

    runStatus = runStatusResponse.data.data.status;
    datasetId = runStatusResponse.data.data.defaultDatasetId;
  }

  if (runStatus === "FAILED") {
    throw new Error("Actor run failed");
  }

  const datasetResponse = await axios.get(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`
  );
  console.log("Dataset Response from the Api:", datasetResponse.data);

  return datasetResponse.data; // Array of profile objects
}
