import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { StudioBooking } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
type status = "confirmed" | "cancelled" | "completed";
export default function index() {
  const [status, setStatus] = useState<status>("confirmed");
  const props = usePagination();
  const query = useQuery<ApiResponse<StudioBooking[]>>({
    queryKey: ["studio-bookings", status],
    queryFn: async () => {
      let resp = await apiClient.get(`admins/studios/bookings`, {
        params: {
          status,
          page: props.page,
          limit: 10,
        },
      });
      return resp.data;
    },
  });
  if (query.isLoading)
    return (
      <>
        <SimpleHeader title={"Studio Bookings"} />

        <SimpleLoader />
      </>
    );
  return (
    <div>
      <SimpleHeader title={"Studio Bookings"} />
      <div className="tabs">
        <a
          className={`tab tab-lg tab-lifted ${
            status === "confirmed" ? "tab-active" : ""
          }`}
          onClick={() => setStatus("confirmed")}
        >
          Confirmed
        </a>

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
      <div className="flex flex-col gap-4 p-4">
        {query.data?.payload.map((booking) => (
          <div key={booking.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl font-bold">
                Booking ID:{" "}
                <span className="text-primary-content">{booking.id}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <p>
                  <strong>User ID:</strong> {booking.userId}
                </p>
                <p>
                  <strong>Booking Date:</strong> {booking.bookingDate}
                </p>
                <p>
                  <strong>Start Time:</strong> {booking.startTime}
                </p>
                <p>
                  <strong>End Time:</strong> {booking.endTime}
                </p>
                <p>
                  <strong>Total Price:</strong> ${booking.totalPrice}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      booking.status === "confirmed"
                        ? "badge-success"
                        : booking.status === "pending"
                          ? "badge-warning"
                          : booking.status === "cancelled"
                            ? "badge-error"
                            : "badge-info"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
        <EmptyList list={query.data?.payload || []} />
        <div className="mt-4">
          <SimplePaginator {...props} />
        </div>
      </div>
    </div>
  );
}
