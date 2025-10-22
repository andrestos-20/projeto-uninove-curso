import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/routers";
import { createWSClient, httpBatchLink, wsLink } from "@trpc/client";

const API_BASE_URL = "https://3000-ih1wasqrrhsqtetk2rc61-5d90080e.manusvm.computer";

const wsClient = createWSClient({
  url: API_BASE_URL.replace("http", "ws"),
});

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    wsLink({ client: wsClient }),
    httpBatchLink({
      url: `${API_BASE_URL}/trpc`,
    }),
  ],
});
