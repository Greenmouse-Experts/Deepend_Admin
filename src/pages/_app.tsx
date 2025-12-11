import { Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});
export default function index() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster theme="dark" position="top-right" richColors />
      <Outlet />
    </QueryClientProvider>
  );
}
