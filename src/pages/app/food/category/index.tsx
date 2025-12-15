import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { FoodCategory } from "@/api/types";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import { useQuery } from "@tanstack/react-query";
import FoodCategoryCard from "../_components/FoodCategoryCard";
import { Link } from "@tanstack/react-router";
import { usePagination } from "@/store/pagination";
import SimplePaginator from "@/components/SimplePaginator";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import SimpleSearch from "@/components/SimpleSearch";

export default function index() {
  const props = usePagination();
  const searchProps = useSearchParams();

  const query = useQuery<ApiResponse<FoodCategory[]>>({
    queryKey: ["food-categories", props.page, searchProps.search],
    queryFn: async () => {
      const params = {
        page: props.page,
        limit: 20,
        search: searchProps.search,
      };
      let resp = await apiClient.get("admins/foods/categories", {
        params: remove_nulls(params),
      });
      return resp.data;
    },
  });

  if (query.isLoading) {
    return (
      <>
        <SimpleHeader title={"Food Category"} />
        <SimpleLoader></SimpleLoader>
      </>
    );
  }
  const items = query.data?.payload;
  return (
    <div>
      <SimpleHeader title={"Food Category"}>
        <div>
          <Link to="/app/food/category/new" className="btn btn-primary">
            Add Food Category
          </Link>
        </div>
      </SimpleHeader>
      <SimpleSearch props={searchProps} />
      <div className="">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items?.map((category) => (
            <FoodCategoryCard
              refetch={query.refetch}
              key={category.id}
              category={category}
            />
          ))}
        </div>
        <div className="mt-4">
          <SimplePaginator {...props}></SimplePaginator>
        </div>
      </div>
    </div>
  );
}
