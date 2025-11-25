# Amplyst – Technical Documentation
**Version:** 1.0.0
**Date:** 2025-11-25

## 1. Overview
This document provides a comprehensive technical overview of **Amplyst**, a modern influencer marketing platform developed to connect brands and agencies with content creators. It is a Next.js 14 application featuring role-based dashboards, real-time messaging, and campaign management. The tech stack includes **Clerk** for authentication, **Convex** for the backend database and serverless functions, and **Tailwind CSS** for styling. This guide is intended for developers maintaining and extending the platform.

## 2. Developer Quick Start
1.  **Prerequisites**: Node.js, npm.
2.  **Clone Repository**: Get the source code from the project repository.
3.  **Install Dependencies**: Run `npm install`.
4.  **Environment Variables**: Create a `.env.local` file and populate it with the necessary keys from your Clerk and Convex accounts. See Section 8 for a full list.
5.  **Run Development Server**: Execute `npm run dev`. The application will be available at `http://localhost:3000`.
6.  **Convex Backend**: Run `npx convex dev` in a separate terminal. This syncs your backend functions and schema with the Convex cloud.

## 3. Technical Architecture

### 3.1 Stack and Libraries
*   **Framework**: Next.js 14 (App Router)
*   **Authentication**: Clerk (`@clerk/nextjs`)
*   **Backend (DB & Functions)**: Convex
*   **Styling**: Tailwind CSS, Shadcn UI (components)
*   **Language**: TypeScript

### 3.2 Directory Layout
*   `app/`: Contains all routes, layouts, and API endpoints.
    *   `(auth)/`: Routes for authentication (login, signup).
    *   `(dashboard)/`: Protected routes for role-specific dashboards (influencer, brand).
    *   `(onboarding)/`: User onboarding flows.
    *   `api/`: Server-side API routes (e.g., webhooks).
*   `components/`: Shared React components used across the application.
*   `contexts/`: React context providers (e.g., `auth-context.tsx`).
*   `convex/`: The heart of the backend, containing the data schema, mutations, and queries.
*   `middleware.ts`: Clerk middleware for route protection.

### 3.3 Application Bootstrap and Providers
The root layout wraps the application with `ConvexClientProvider`. This provider initializes the Convex client and integrates it with Clerk for authenticated backend requests.

### 3.4 Middleware
The `middleware.ts` file uses Clerk's middleware to protect routes. It enforces authentication for `/dashboard`, `/onboarding`, and `/profile` routes. It also handles OAuth callbacks to preserve user role information during sign-up.

## 4. Data Model (Convex)
The database schema is defined in `convex/schema.ts`. Key tables include:

*   **users**: Stores core user identity, linked to Clerk via `tokenIdentifier`. Includes the `role` (influencer, brand, agency, pending).
*   **profiles**: Detailed profile data.
    *   *Influencers*: Niche, location, social accounts, portfolio.
    *   *Brands*: Company name, industry, budget range.
*   **campaigns**: Marketing campaigns created by brands. Includes budget, requirements, and status.
*   **applications**: Links influencers to campaigns with status (pending, approved, rejected).
*   **messages & conversations**: Real-time chat data between users.
*   **analytics**: Campaign performance metrics.
*   **payments**: Payment records and status.

## 5. Backend Functions (Convex)
Located in the `convex/` directory, these serverless functions handle business logic.

*   **users.ts**: Manages user creation (`createOrGetUser`), profile updates (`insertProfile`), and role checks.
*   **schema.ts**: Defines the database schema.
*   **auth.config.ts**: Configures the Clerk issuer domain for token validation.
*   *(Note: Other feature-specific logic would reside in files like `campaigns.ts`, `messages.ts` as the app grows).*

## 6. API Endpoints
*   **Webhooks**: `/api/webhook` (configured in middleware matcher) handles external events, primarily from Clerk for user synchronization if needed.

## 7. Authentication & Authorization
*   **Authentication**: Handled by Clerk. `middleware.ts` protects pages.
*   **Authorization**: Role-based access control is implemented in Convex functions. Functions like `createOrGetUser` and `insertProfile` enforce role validity. The `auth-context.tsx` on the frontend also manages redirects based on the user's role and onboarding status.

## 8. Configuration & Environment Variables
The following variables must be set in your `.env.local` file:

*   `CONVEX_DEPLOYMENT`: The deployment name for Convex.
*   `NEXT_PUBLIC_CONVEX_URL`: The URL for your Convex backend.
*   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk frontend key.
*   `CLERK_SECRET_KEY`: Clerk backend key.

## 9. Deployment & Operations
*   **Hosting**: The frontend is optimized for Vercel.
*   **Backend**: Managed by Convex.
*   **Deploying**:
    1.  Push code to GitHub.
    2.  Connect repository to Vercel.
    3.  Configure environment variables in Vercel.
    4.  Convex automatically deploys backend functions when linked.

## 10. Glossary
*   **Clerk**: Authentication provider.
*   **Convex**: Backend-as-a-Service (Database + Functions).
*   **Influencer**: A content creator who applies to campaigns.
*   **Brand**: A company that creates campaigns to hire influencers.
