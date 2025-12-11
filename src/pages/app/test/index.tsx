import React, { Suspense } from "react";
import {
  useSuspenseQuery,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

// A simple "fetcher" function that simulates an API call
const fetchData = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data loaded from API!");
    }, 2000); // Simulate a 2-second API call
  });
};

function ApiComponent() {
  const { data } = useQuery<string, Error>({
    queryKey: ["apiData"],
    queryFn: fetchData,
    staleTime: Infinity, // Data never goes stale for this example
  });

  return <div>{data}</div>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

export default function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading API data...</div>}>
        <ApiComponent />
      </Suspense>
    </QueryClientProvider>
  );
}
