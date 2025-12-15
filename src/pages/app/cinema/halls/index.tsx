import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { Cinema } from "@/api/types";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleSearch from "@/components/SimpleSearch";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";

export default function index() {
  const props = usePagination();
  const searchProps = useSearchParams();

  const query = useQuery<ApiResponse<Cinema[]>>({
    queryKey: ["cinemas-halls", props.page],
    queryFn: async () => {
      const params = {
        page: props.page,
        limit: 10,
        search: searchProps.search,
      };
      let resp = await apiClient.get("admins/cinemas/halls", {
        params: remove_nulls(params),
      });
      return resp.data;
    },
  });
  if (query.isLoading)
    return (
      <>
        <SimpleHeader title={"Cinema Halls"} />
        <SimpleLoader />
      </>
    );
  const items = query.data.payload;
  return (
    <>
      <SimpleHeader title={"Cinema Halls"} />
      <SimpleSearch props={searchProps} />
      <div className="flex flex-col gap-2 ">
        {items.map((item) => (
          <div
            key={item.id}
            className="card card-compact bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title">{item.name}</h2>
            </div>
          </div>
        ))}
      </div>
      <div className=" mt-4">
        <SimplePaginator {...props} />
      </div>
    </>
  );
}
