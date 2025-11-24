import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { Cinema } from "@/api/types";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

export default function index() {
  const props = usePagination();
  const nav = useNavigate();
  const query = useQuery<ApiResponse<Cinema[]>>({
    queryKey: ["cinemas", props.page],
    queryFn: async () =>
      (
        await apiClient.get("admins/cinemas", {
          params: {
            page: props.page,
            limit: 10,
          },
        })
      ).data,
  });
  if (query.isLoading)
    return (
      <>
        <SimpleHeader title={"Cinemas"} />
        <SimpleLoader />
      </>
    );
  const items = query.data.payload;
  return (
    <>
      <SimpleHeader title={"Cinemas"}>
        <>
          <Link to="/app/cinema/new" className="btn btn-primary">
            Create
          </Link>
        </>
      </SimpleHeader>
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
      <div className=" mt-4">
        <SimplePaginator {...props} />
      </div>
    </>
  );
}
