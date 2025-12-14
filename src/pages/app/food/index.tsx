import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { FoodProps } from "@/api/types";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import { useQuery } from "@tanstack/react-query";
import FoodCard from "./_components/FoodCard";
import { Link } from "@tanstack/react-router";
import SimplePaginator from "@/components/SimplePaginator";
import { usePagination } from "@/store/pagination";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import SimpleSearch from "@/components/SimpleSearch";

export default function index() {
  const searchProps = useSearchParams();
  const props = usePagination();
  const query = useQuery<ApiResponse<FoodProps[]>>({
    queryKey: ["food", props.page, searchProps.search],
    queryFn: async () => {
      const _initial = {
        page: props.page,
        limit: 10,
        search: searchProps.search,
      };

      let resp = await apiClient.get("admins/foods", {
        params: remove_nulls(_initial),
      });
      return resp.data;
    },
  });
  if (query.isLoading) {
    return (
      <>
        <SimpleHeader title={"Food List"} />
        <SimpleLoader />
      </>
    );
  }
  const items = query.data?.payload;
  return (
    <>
      <div>
        <SimpleHeader title={"Food List"}>
          <div>
            <Link to="/app/food/new" className="btn btn-primary">
              Add New Food
            </Link>
          </div>
        </SimpleHeader>
      </div>
      <div className="flex justify-end">
        <SimpleSearch props={searchProps} />
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items?.map((item) => {
          return <FoodCard refetch={query.refetch} item={item} key={item.id} />;
        })}
      </div>
      <SimplePaginator {...props} />
    </>
  );
}
