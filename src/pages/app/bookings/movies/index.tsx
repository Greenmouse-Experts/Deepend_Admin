import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { MovieBooking } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleTitle from "@/components/SimpleTitle";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import MovieBookingCard from "./_components/MovieBookingCard";
type selectedType = "completed" | "cancelled";
export default function index() {
  const [status, setStatus] = useState<selectedType>("completed");

  // const [selected, setSelected] = useState<selectedType>("cancelled");
  const query = useSuspenseQuery<ApiResponse<{ movieTickets: MovieBooking[] }>>(
    {
      queryKey: ["movie-bookings", status],
      queryFn: async () => {
        let resp = await apiClient.get("admins/movies/purchases", {
          params: {
            status: status,
          },
        });
        return resp.data;
      },
    },
  );
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
      <SuspensePageLayout query={query as any} showTitle={false}>
        {(data) => {
          const bookings: MovieBooking[] = data.payload.movieTickets;
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {bookings.map((booking) => (
                  <MovieBookingCard
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
    </>
  );
}
