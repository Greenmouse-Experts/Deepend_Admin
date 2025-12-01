import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { MovieObject } from "@/api/types";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import ShowTimes from "../_components/Showtimes";
import Snacks from "../_components/Snacks";

export default function index() {
  const { id } = useParams({
    strict: false,
  });
  const query = useQuery<ApiResponse<MovieObject>>({
    queryKey: ["movie", id],
    queryFn: async () => {
      let resp = await apiClient.get("admins/movies/" + id);
      return resp.data;
    },
  });
  return (
    <SuspensePageLayout query={query} title={query?.data?.payload?.title}>
      {(data: ApiResponse<MovieObject>) => {
        const movie = data?.payload;
        return (
          <div className="isolate">
            <div className="h-[100px] flex -z-10">
              <img
                src={movie.posterUrl}
                className="flex-1 object-cover blur-xl -z-10"
                alt=""
              />
            </div>
            <div className="-mt-4 z-20 flex flex-col md:flex-row gap-2">
              <div className="flex-1 max-w-2xs mx-auto md:mx-0">
                <img
                  src={movie.posterUrl}
                  className="max-w-2xs aspect-[9/12]"
                  alt=""
                />
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold">{movie.title}</h2>
                <p>{movie.description}</p>
                <p>
                  <span>Duration: </span>
                  {movie.durationMinutes} minutes
                </p>
                <section className="space-y-2">
                  <h2>Genres:</h2>
                  <div className="gap-2 flex">
                    {movie?.genres?.map((item) => {
                      return (
                        <span className="badge badge-accent badge-sm">
                          {item.name}
                        </span>
                      );
                    })}
                  </div>
                </section>
                <section className="space-y-2 mt-2">
                  <h2>Cast:</h2>
                  <p>{movie.cast}</p>
                </section>
              </div>
            </div>
            <div>
              <Snacks refetch={query.refetch} id={id} />
              <ShowTimes id={id} cinemaId={movie.cinemaId}></ShowTimes>
            </div>
          </div>
        );
      }}
    </SuspensePageLayout>
  );
}
