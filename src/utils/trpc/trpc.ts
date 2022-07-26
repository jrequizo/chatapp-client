import { createReactQueryHooks } from "@trpc/react";

import { AppRouter } from "chatapp-api"
import { AppRouter as AppRouterDev } from "chatapp-api-dev"

// import { AppRouter as ChatWebsocketRouter } from "chat-websocket";

export const API = process.env.NODE_ENV === 'development' ? createReactQueryHooks<AppRouterDev>() : createReactQueryHooks<AppRouter>()

// export const chatSocketApi = createReactQueryHooks<ChatWebsocketRouter>();