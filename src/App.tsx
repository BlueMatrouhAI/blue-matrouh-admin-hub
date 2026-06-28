import UserProvider from "./providers/user-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import AppRoutes from "./app-routes.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const client = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

function App() {
  return (
    <QueryClientProvider client={client}>
      <UserProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <AppRoutes />
          <Toaster />
        </GoogleOAuthProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
