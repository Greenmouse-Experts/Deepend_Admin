import apiClient from "@/api/apiClient";
import type { VrgameBooking } from "@/api/types";
import { extract_message } from "@/helpers/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const status_list = ["pending", "confirmed", "cancelled"] as const;

const allowed_Status_update = (
  currentStatus: (typeof status_list)[number],
): (typeof status_list)[number][] => {
  switch (currentStatus) {
    case "pending":
      return ["confirmed", "cancelled"];
    case "confirmed":
      return ["cancelled"];
    case "cancelled":
      return []; // No further updates allowed for cancelled orders
    default:
      return [];
  }
};

const getStatusColor = (status: (typeof status_list)[number]) => {
  switch (status) {
    case "pending":
      return "badge-info";
    case "confirmed":
      return "badge-success";
    case "cancelled":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default function GameBookingCard({
  booking,
  refetch,
}: {
  booking: VrgameBooking;
  refetch: () => void;
}) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (newStatus: (typeof status_list)[number]) =>
      apiClient.patch(`admins/orders/vrgames/${booking.ticketId}/status`, {
        status: newStatus,
      }),
    onSuccess: () => {
      refetch();
    },
  });

  const handleStatusUpdate = async (
    newStatus: (typeof status_list)[number],
  ) => {
    toast.promise(mutateAsync(newStatus), {
      loading: "Updating status...",
      success: "Status updated!",
      error: extract_message,
    });
  };

  const availableUpdates = allowed_Status_update(booking.status as any);

  return (
    <div
      key={booking.ticketId}
      className="card w-full bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-shadow duration-300"
    >
      <figure className="aspect-video">
        <img
          src={booking.vrgameImageUrl || "https://picsum.photos/400/200"} // Fallback image
          alt={booking.vrgameName}
          className="object-cover w-full h-full rounded-t-xl"
        />
      </figure>
      <div className="card-body p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <h2 className="card-title text-xl flex flex-wrap items-center gap-2">
            {booking.vrgameName}
            <div
              className={`badge ${getStatusColor(
                booking.status as (typeof status_list)[number],
              )} text-xs font-semibold uppercase`}
            >
              {booking.status}
            </div>
          </h2>
        </div>
        <p className="text-sm text-base-content/80 mb-3">
          <strong>Category:</strong> {booking.vrgameCategory}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <p>
            <strong>Scheduled:</strong> {booking.scheduledDate} at{" "}
            {booking.scheduledTime}
          </p>
          <p>
            <strong>Quantity:</strong> {booking.ticketQuantity}
          </p>
          <p>
            <strong>Price per ticket:</strong> {booking.currency}{" "}
            {booking.ticketPrice}
          </p>
          <p>
            <strong>Purchase Date:</strong> {booking.purchaseDate}
          </p>
          <p>
            <strong>Used:</strong>{" "}
            <span
              className={`font-medium ${
                booking.isUsed ? "text-success" : "text-error"
              }`}
            >
              {booking.isUsed ? "Yes" : "No"}
            </span>
          </p>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-base-200">
          <div className="flex flex-col">
            <span className="text-sm text-base-content/80">Total Price:</span>
            <p className="text-xl font-bold text-primary">
              {booking.currency} {booking.totalPrice}
            </p>
          </div>
          {availableUpdates.length > 0 && (
            <div className="card-actions justify-end">
              <div className="dropdown dropdown-top dropdown-end">
                <button
                  disabled={isPending}
                  tabIndex={0}
                  role="button"
                  className={`btn btn-sm btn-primary ${
                    isPending ? "btn-disabled" : ""
                  }`}
                  aria-haspopup="true"
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>{" "}
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
                >
                  {availableUpdates.map((status) => (
                    <li key={status} className="w-full">
                      <button
                        onClick={() => handleStatusUpdate(status)}
                        disabled={isPending}
                        aria-disabled={isPending}
                        className="size-full whitespace-nowrap capitalize text-left hover:bg-base-200 rounded-md p-2"
                      >
                        {status}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
