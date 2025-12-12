import apiClient from "@/api/apiClient";
import type { HotelBooking } from "@/api/types";
import { extract_message } from "@/helpers/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const status_list = [
  "pending",
  "confirmed",
  "cancelled",
  "checked-in",
  "checked-out",
] as const;

const allowed_Status_update = (
  currentStatus: (typeof status_list)[number],
): (typeof status_list)[number][] => {
  switch (currentStatus) {
    case "pending":
      return ["confirmed", "cancelled"];
    case "confirmed":
      return ["checked-in", "cancelled"];
    case "checked-in":
      return ["checked-out"];
    case "checked-out":
    case "cancelled":
      return []; // No further updates allowed for checked-out or cancelled bookings
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
    case "checked-in":
      return "badge-warning";
    case "checked-out":
      return "badge-neutral";
    default:
      return "badge-neutral";
  }
};

export default function HotelBookingCard({
  booking,
  refetch,
}: {
  booking: HotelBooking;
  refetch: () => void;
}) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (newStatus: (typeof status_list)[number]) =>
      apiClient.patch(`admins/orders/hotels/${booking.id}/status`, {
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
      key={booking.id}
      className="card w-full bg-base-100 shadow-xl border border-base-200"
    >
      <figure className="aspect-video">
        <img
          src={booking.hotelImageUrl || "https://picsum.photos/400/200"} // Fallback image
          alt={booking.hotelName}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg mb-2 flex flex-wrap items-center gap-2">
          {booking.hotelName}
          <div
            className={`badge ${getStatusColor(
              booking.status as (typeof status_list)[number],
            )} text-xs font-semibold uppercase`}
          >
            {booking.status}
          </div>
        </h2>
        <p className="text-sm text-base-content/80 mb-2">
          <strong>Room:</strong> {booking.hotelRoomName}
        </p>
        <div className="flex flex-col gap-1 text-sm">
          <p>
            <strong>Check-in:</strong>{" "}
            {new Date(booking.checkInDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {new Date(booking.checkOutDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Price per night:</strong> {booking.currency}{" "}
            {booking.hotelRoomPricePerNight}
          </p>
          <p>
            <strong>Total Price:</strong> {booking.currency}{" "}
            {booking.totalPrice}
          </p>
        </div>
        {availableUpdates.length > 0 && (
          <div className="card-actions ml-auto mt-auto">
            <div className="dropdown dropdown-top dropdown-end">
              <button
                disabled={isPending}
                tabIndex={0}
                role="button"
                className={`btn btn-sm btn-primary`}
                aria-haspopup="true"
              >
                {isPending ? "Updating..." : "Update Status"}
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-auto"
              >
                {availableUpdates.map((status) => (
                  <li key={status} className="w-full">
                    <a>
                      <button
                        onClick={() => handleStatusUpdate(status)}
                        disabled={isPending}
                        aria-disabled={isPending}
                        className="size-full whitespace-nowrap capitalize"
                      >
                        {status}
                      </button>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
