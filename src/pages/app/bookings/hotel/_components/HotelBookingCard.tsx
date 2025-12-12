import apiClient from "@/api/apiClient";
import type { HotelBooking } from "@/api/types";
import { extract_message } from "@/helpers/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const status_list = [
  "confirmed",
  "cancelled",
  "checked-in",
  "completed",
] as const;

const allowed_Status_update = (
  currentStatus: (typeof status_list)[number],
): (typeof status_list)[number][] => {
  switch (currentStatus) {
    case "confirmed":
      return ["checked-in", "cancelled"];
    case "checked-in":
      return ["completed"];
    case "completed":
    case "cancelled":
      return []; // No further updates allowed for checked-out or cancelled bookings
    default:
      return [];
  }
};

const getStatusColor = (status: (typeof status_list)[number]) => {
  switch (status) {
    case "confirmed":
      return "badge-info";
    case "cancelled":
      return "badge-error";
    case "checked-in":
      return "badge-warning";
    case "completed":
      return "badge-success";
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
      apiClient.patch(`admins/orders/hotel-bookings/${booking.id}/status`, {
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
    <div className="card w-full bg-base-100 shadow-xl border border-base-200">
      <figure className="aspect-video">
        <div className="relative w-full h-full overflow-hidden rounded-t-xl">
          <img
            src={booking.hotelImageUrl || "https://picsum.photos/400/200"} // Fallback image
            alt={booking.hotelName}
            className="object-cover w-full h-full transition-transform duration-500 transform-gpu hover:scale-110"
          />
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
      </figure>
      <div className="card-body p-4 flex flex-col">
        <div
          className={`badge ${getStatusColor(
            booking.status as (typeof status_list)[number],
          )} text-sm font-semibold uppercase shrink-0`}
        >
          {booking.status}
        </div>
        <div className="flex justify-between items-start mb-2">
          <h2 className="card-title text-lg flex-grow pr-2">
            {booking.hotelName}
          </h2>
        </div>

        <div className="text-sm text-base-content/80 mb-3 flex flex-col gap-1">
          <p>
            <strong>Order ID:</strong> {booking.orderId}
          </p>
          <p>
            <strong>Room:</strong> {booking.hotelRoomName}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-2 border border-base-300 rounded-lg p-3 mb-4">
          <div>
            <p className="text-xs font-semibold text-base-content/70 uppercase mb-1">
              Check-in
            </p>
            <p className="font-medium text-base">
              {new Date(booking.checkInDate).toLocaleDateString()}
            </p>
          </div>
          <div className="border-l border-base-300 pl-3">
            <p className="text-xs font-semibold text-base-content/70 uppercase mb-1">
              Check-out
            </p>
            <p className="font-medium text-base">
              {/*{booking.checkOutDate}*/}
              {new Date(booking.checkOutDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm mb-4">
          <p className="flex justify-between items-center">
            <span className="text-base-content/80">Price per night:</span>
            <span className="font-semibold">
              {booking.currency} {booking.hotelRoomPricePerNight}
            </span>
          </p>
          <p className="flex justify-between items-center border-t border-base-200 pt-2 mt-2">
            <span className="text-lg font-bold">Price:</span>
            <span className="text-lg font-bold text-primary">
              {booking.currency} {booking.totalPrice}
            </span>
          </p>
        </div>

        {availableUpdates.length > 0 && (
          <div className="card-actions justify-end mt-auto">
            <div className="dropdown dropdown-top w-full dropdown-end">
              <button
                className="btn btn-sm btn-primary btn-block"
                tabIndex={0}
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update Status"}
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content ring drop-shadow-lg ring-current/10 z-[1] menu shadow bg-base-100 rounded-box w-52"
              >
                {availableUpdates.map((status) => (
                  <li key={status}>
                    <a
                      className="capitalize"
                      onClick={() => handleStatusUpdate(status)}
                    >
                      {status}
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
