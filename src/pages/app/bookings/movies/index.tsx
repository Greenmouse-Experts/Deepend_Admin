import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { MovieBooking } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleTitle from "@/components/SimpleTitle";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import MovieBookingCard from "./_components/MovieBookingCard";
import { usePagination } from "@/store/pagination";
import SimplePaginator from "@/components/SimplePaginator";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import SimpleSearch from "@/components/SimpleSearch";
type selectedType = "completed" | "cancelled";
export default function index() {
  const [status, setStatus] = useState<selectedType>("completed");
  const props = usePagination();
  const searchProps = useSearchParams();

  // const [selected, setSelected] = useState<selectedType>("cancelled");
  const query = useQuery<ApiResponse<{ movieTickets: MovieBooking[] }>>({
    queryKey: ["movie-bookings", status, searchProps.search, props.page],
    queryFn: async () => {
      const params = {
        status: status,
        page: props.page,
        search: searchProps.search,
      };
      let resp = await apiClient.get("admins/movies/purchases", {
        params: remove_nulls(params),
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
      <SimpleSearch props={searchProps} />
      <SuspensePageLayout query={query as any} showTitle={false}>
        {(data) => {
          //@ts-ignore
          const bookings: MovieBooking[] = data.payload.movieTickets;
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {bookings.map((booking) => (
                  <MovieBookingCard
                    refetch={query.refetch}
                    key={booking.cinemaHallId}
                    booking={booking}
                  />
                ))}
              </div>
              <EmptyList list={bookings} />
            </>
          );
        }}
      </SuspensePageLayout>
      <div className="mt-2">
        <SimplePaginator {...props} />
      </div>
    </>
  );
}
