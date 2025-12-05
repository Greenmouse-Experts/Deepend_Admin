import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { StudioBooking } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleTitle from "@/components/SimpleTitle";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
type status = "cancelled" | "completed" | "scheduled";
export default function index() {
  const [status, setStatus] = useState<status>("scheduled");
  const props = usePagination();
  const query = useQuery<
    ApiResponse<{
      studioBookings: StudioBooking[];
    }>
  >({
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

  return (
    <div>
      <SimpleTitle title={"Studio Bookings"} />
      <div className="tabs">
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
        <a
          className={`tab tab-lg tab-lifted ${
            status === "scheduled" ? "tab-active" : ""
          }`}
          onClick={() => setStatus("scheduled")}
        >
          Scheduled
        </a>
      </div>
      <SuspensePageLayout query={query} showTitle={false}>
        {(data) => {
          let list = data.payload.studioBookings;
          return (
            <section className="space-y-4">
              <div className="grid  gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                {list.map((booking) => (
                  <div key={booking.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title text-2xl font-extrabold text-primary mb-2">
                        {booking.studioName}
                      </h2>
                      <p className="text-base-content text-sm mb-4">
                        Order ID:{" "}
                        <span className="font-semibold">{booking.orderId}</span>
                      </p>
                      <div className="flex flex-col gap-y-3 text-base-content">
                        <p className="flex flex-col">
                          <strong className="text-xs text-base-content/70">
                            Session Date:
                          </strong>{" "}
                          <span className="font-medium text-sm">
                            {booking.sessionDate}
                          </span>
                        </p>
                        <div className="flex flex-col">
                          <strong className="text-xs text-base-content/70">
                            Session Time:
                          </strong>{" "}
                          <span className="font-bold text-lg text-accent">
                            {new Date(
                              `2000-01-01T${booking.sessionStartTime}`,
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}{" "}
                            -{" "}
                            {new Date(
                              `2000-01-01T${booking.sessionEndTime}`,
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                        <p className="flex flex-col">
                          <strong className="text-xs text-base-content/70">
                            Price Per Hour:
                          </strong>{" "}
                          <span className="font-medium text-sm">
                            {booking.currency}
                            {booking.sessionPricePerHour}
                          </span>
                        </p>
                        <p className="flex flex-col">
                          <strong className="text-xs text-base-content/70">
                            Total Price:
                          </strong>{" "}
                          <span className="font-semibold text-lg text-success">
                            {booking.currency}
                            {booking.totalPrice}
                          </span>
                        </p>
                        <p className="flex flex-col">
                          <strong className="text-xs text-base-content/70">
                            User ID:
                          </strong>{" "}
                          <span className="font-medium text-sm">
                            {booking.userId}
                          </span>
                        </p>
                        <div className="flex flex-col">
                          <strong className="text-xs text-base-content/70">
                            Status:
                          </strong>{" "}
                          <span
                            className={`badge badge-lg mt-1 ${
                              booking.status === "verified"
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
                        </div>
                      </div>
                      {booking.verifiedAt && (
                        <div className="mt-6 pt-4 border-t border-base-200 text-sm text-base-content space-y-1">
                          <p className="flex flex-col">
                            <strong className="text-xs text-base-content/70">
                              Verified At:
                            </strong>{" "}
                            <span className="font-medium">
                              {new Date(booking.verifiedAt).toLocaleString()}
                            </span>
                          </p>
                          <p className="flex flex-col">
                            <strong className="text-xs text-base-content/70">
                              Verified By:
                            </strong>{" "}
                            <span className="font-medium">
                              {booking.verifiedBy}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mt-4"></div>
              </div>
              <EmptyList list={list} />

              <SimplePaginator {...props} />
            </section>
          );
        }}
      </SuspensePageLayout>
    </div>
  );
}
