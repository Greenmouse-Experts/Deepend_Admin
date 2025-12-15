import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { Cinema } from "@/api/types";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleSearch from "@/components/SimpleSearch";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

export default function index() {
  const props = usePagination();
  const searchProps = useSearchParams();
  const nav = useNavigate();
  const query = useQuery<ApiResponse<Cinema[]>>({
    queryKey: ["cinemas", props.page, searchProps.search],
    queryFn: async () => {
      const params = {
        page: props.page,
        limit: 10,
        search: searchProps.search,
      };
      const resp = await apiClient.get("admins/cinemas", {
        params: remove_nulls(params),
      });
      return resp.data;
    },
  });

  return (
    <>
      <SimpleHeader title={"Cinemas"}>
        <>
          <Link to="/app/cinema/new" className="btn btn-primary">
            Create
          </Link>
        </>
      </SimpleHeader>
      <SimpleSearch props={searchProps} />

      <SuspensePageLayout showTitle={false} query={query}>
        {(data) => {
          const items = data.payload;
          return (
            <>
              <div className="flex flex-col gap-2 ">
                {items.map((item) => (
                  <Link
                    to={`/app/cinema/${item.id}`}
                    key={item.id}
                    className="card card-compact bg-base-100 shadow-xl"
                  >
                    <div className="card-body">
                      <h2 className="card-title">{item.name}</h2>
                      <p>
                        {item.address}, {item.city}, {item.state}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          );
        }}
      </SuspensePageLayout>
      <div className=" mt-4">
        <SimplePaginator {...props} />
      </div>
    </>
  );
}
