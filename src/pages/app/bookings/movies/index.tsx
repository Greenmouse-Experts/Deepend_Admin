import apiClient, { type ApiResponse } from "@/api/apiClient";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleTitle from "@/components/SimpleTitle";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
type selectedType = "completed" | "cancelled";
export default function index() {
  const [status, setStatus] = useState<selectedType>("completed");

  // const [selected, setSelected] = useState<selectedType>("cancelled");
  const query = useSuspenseQuery<ApiResponse<any>>({
    queryKey: ["movie-bookings", status],
    queryFn: async () => {
      let resp = await apiClient.get("admins/movies/purchases", {
        params: {
          status: status,
        },
      });
      return resp.data;
    },
  });
  return (
    <>
      <SimpleTitle title="Movie Bookings" />
      <div className="tabs bg-base-100">
        <a
          className={`tab tab-lg tab-lifted ${
            status === "cancelled" ? "tab-active" : ""
          }`}
          onClick={() => setStatus("cancelled")}
        >
          Cancelled
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            status === "completed" ? "tab-active" : ""
          }`}
          onClick={() => setStatus("completed")}
        >
          Completed
        </a>
      </div>
      <SuspensePageLayout query={query as any} showTitle={false}>
        {(data) => {
          return <>{JSON.stringify(data)}</>;
        }}
      </SuspensePageLayout>
    </>
  );
}
