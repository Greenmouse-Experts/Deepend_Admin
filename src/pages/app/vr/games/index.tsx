import apiClient, { type ApiResponse } from "@/api/apiClient";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { Vrgame } from "@/api/types";
import { Link } from "@tanstack/react-router";
import { usePagination } from "@/store/pagination";
import SimplePaginator from "@/components/SimplePaginator";
import VRGameCard from "../_components/VRGameCard";
import { Suspense } from "react";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";

export default function index() {
  const props = usePagination();
  const query = useSuspenseQuery<ApiResponse<Vrgame[]>>({
    queryKey: ["vrs", props.page],
    queryFn: async () => {
      let resp = await apiClient.get("admins/vrgames", {
        params: { page: props.page },
      });
      return resp.data;
    },
  });

  return (
    <SuspensePageLayout
      query={query as any}
      title={"VR Games"}
      headerActions={
        <>
          <Link to="new" className="btn btn-primary">
            Add New Game
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
        {query.data.payload.map((game) => (
          <VRGameCard game={game} key={game.id} refetch={query.refetch} />
        ))}
      </div>
      <div className="mt-4">
        <SimplePaginator {...props} />
      </div>
    </SuspensePageLayout>
  );
}
