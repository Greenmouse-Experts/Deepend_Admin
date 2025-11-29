import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { MovieBooking } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleTitle from "@/components/SimpleTitle";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
type selectedType = "completed" | "cancelled";
export default function index() {
  const [status, setStatus] = useState<selectedType>("completed");

  // const [selected, setSelected] = useState<selectedType>("cancelled");
  const query = useSuspenseQuery<ApiResponse<any>>({
    queryKey: ["movie-bookings", status],
    queryFn: async () => {
      let resp = await apiClient.get("admins/movies/purchases", {
        params: {
          status: status,
        },
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
      <SuspensePageLayout query={query as any} showTitle={false}>
        {(data) => {
          const bookings: MovieBooking[] = data.payload;
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.ticketId}
                    className="card card-compact bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  >
                    <figure className="relative">
                      <img
                        src={booking.movieImageUrl}
                        alt={booking.movieName}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="badge badge-secondary absolute top-3 right-3 p-3">
                        {booking.status}
                      </div>
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title text-xl font-bold mb-2">
                        {booking.movieName}
                      </h2>
                      <p className="text-sm opacity-70 mb-4">{booking.genre}</p>

                      <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-4">
                        <div className="stat">
                          <div className="stat-title">Cinema</div>
                          <div className="stat-value text-lg">
                            {booking.cinemaHallName}
                          </div>
                          <div className="stat-desc">
                            <span className="badge badge-outline badge-sm">
                              {booking.location}
                            </span>
                          </div>
                        </div>

                        <div className="stat">
                          <div className="stat-title">Showtime</div>
                          <div className="stat-value text-lg">
                            {booking.showtime}
                          </div>
                          <div className="stat-desc">{booking.showDate}</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm">
                          <p className="font-semibold">Tickets:</p>
                          <p className="text-lg font-bold">
                            {booking.ticketQuantity}
                          </p>
                        </div>
                        <div className="text-sm text-right">
                          <p className="font-semibold">Total Price:</p>
                          <p className="text-lg font-bold text-primary">
                            {booking.currency} {booking.totalPrice}
                          </p>
                        </div>
                      </div>

                      <div className="divider my-2"></div>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <p>
                          Purchased:{" "}
                          {new Date(booking.purchaseDate).toLocaleDateString()}
                        </p>
                        {booking.isUsed && (
                          <p className="text-success font-semibold">Used</p>
                        )}
                        {!booking.isUsed && (
                          <p className="text-warning font-semibold">Unused</p>
                        )}
                      </div>

                      {booking.snackAddOns &&
                        booking.snackAddOns.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-semibold text-md mb-2">
                              Snack Add-ons:
                            </h3>
                            <ul className="list-disc list-inside text-sm">
                              {booking.snackAddOns.map((snack, index) => (
                                <li key={index}>
                                  {snack.snackName} (x{snack.snackQuantity}) -{" "}
                                  {booking.currency}{" "}
                                  {(
                                    parseFloat(snack.snackPrice) *
                                    snack.snackQuantity
                                  ).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
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
