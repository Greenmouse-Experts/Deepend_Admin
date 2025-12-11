import apiClient, { type ApiResponse } from "@/api/apiClient";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { Vrgame } from "@/api/types";
import { Link } from "@tanstack/react-router";
import { usePagination } from "@/store/pagination";
import SimplePaginator from "@/components/SimplePaginator";
import VRGameCard from "../_components/VRGameCard";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import SimpleSearch from "@/components/SimpleSearch";
import SimpleTitle from "@/components/SimpleTitle";

export default function index() {
  const props = usePagination();
  const searchProps = useSearchParams();
  const query = useQuery<ApiResponse<Vrgame[]>>({
    queryKey: ["vrs", props.page, searchProps.search],
    queryFn: async () => {
      const initial = {
        page: props.page,
        search: searchProps.search,
      };

      const params = remove_nulls(initial);
      let resp = await apiClient.get("admins/vrgames", {
        params,
      });
      return resp.data;
    },
  });
  return (
    <>
      <div className="flex items-center gap-2">
        <SimpleTitle title="VR Games" />{" "}
        <Link to="new" className="btn btn-primary">
          Add New Game
        </Link>
      </div>
      <SuspensePageLayout
        query={query}
        // title={"VR Games"}
        showTitle={false}
        headerActions={
          <>
            <Link to="new" className="btn btn-primary">
              Add New Game
            </Link>
          </>
        }
      >
        {(data) => {
          const payload = data.payload;
          return (
            <>
              <div className="flex justify-end">
                <SimpleSearch props={searchProps} />
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2 mt-4">
                {payload.map((game: Vrgame) => (
                  <VRGameCard
                    game={game}
                    key={game.id}
                    refetch={query.refetch}
                  />
                ))}
              </div>
              <div className="mt-4">
                <SimplePaginator {...props} />
              </div>
            </>
          );
        }}
      </SuspensePageLayout>
    </>
  );
}
