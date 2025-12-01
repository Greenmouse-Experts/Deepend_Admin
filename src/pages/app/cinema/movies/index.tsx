import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { MovieCinema } from "@/api/types";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "./_components/MovieCard";
import { Link } from "@tanstack/react-router";

export default function index() {
  const props = usePagination();
  const query = useQuery<ApiResponse<MovieCinema[]>>({
    queryKey: ["movie-cinemas", props.page],
    queryFn: async () =>
      (
        await apiClient.get("admins/movies", {
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
        <SimpleHeader title={"Movie Cinema"} />
        <SimpleLoader />
      </>
    );
  const items = query.data?.payload || [];
  return (
    <>
      <SimpleHeader title={"Movie Cinema"}>
        <>
          <Link to="new" className="btn btn-primary">
            Add Movie
          </Link>
        </>
      </SimpleHeader>
      <ul className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {items.map((item) => (
          <MovieCard refetch={query.refetch} key={item.id} item={item} />
        ))}
      </ul>
    </>
  );
}
