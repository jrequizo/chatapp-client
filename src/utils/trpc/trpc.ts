import { createReactQueryHooks } from "@trpc/react";

/**
 * If you're pushing to staging, then uncomment the first import which imports from GitHub.
 * If you're testing locally, use the second import to view live changes from your /packages/api directory.
 */
import { AppRouter } from "chatapp-api";
// import { AppRouter } from "chatapp-api-dev";

export const API = createReactQueryHooks<AppRouter>();