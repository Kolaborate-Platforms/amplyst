/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as applications from "../applications.js";
import type * as brands from "../brands.js";
import type * as campaign from "../campaign.js";
import type * as campaignExpiration from "../campaignExpiration.js";
import type * as content from "../content.js";
import type * as influencers from "../influencers.js";
import type * as messages from "../messages.js";
import type * as migrations from "../migrations.js";
import type * as scheduled from "../scheduled.js";
import type * as stats from "../stats.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  applications: typeof applications;
  brands: typeof brands;
  campaign: typeof campaign;
  campaignExpiration: typeof campaignExpiration;
  content: typeof content;
  influencers: typeof influencers;
  messages: typeof messages;
  migrations: typeof migrations;
  scheduled: typeof scheduled;
  stats: typeof stats;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
