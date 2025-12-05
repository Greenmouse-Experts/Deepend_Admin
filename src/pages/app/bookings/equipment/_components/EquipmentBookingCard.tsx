import apiClient from "@/api/apiClient";
import type { EquipmentBooking } from "@/api/types";
import { extract_message } from "@/helpers/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const status_list = ["ongoing", "completed", "cancelled"] as const;

const allowed_Status_update = (
  currentStatus: (typeof status_list)[number],
): (typeof status_list)[number][] => {
  switch (currentStatus) {
    case "ongoing":
      return ["completed", "cancelled"];
    case "completed":
    case "cancelled":
      return []; // No further updates allowed for completed or cancelled orders
    default:
      return [];
  }
};

const getStatusColor = (status: (typeof status_list)[number]) => {
  switch (status) {
    case "ongoing":
      return "badge-info";
    case "completed":
      return "badge-success";
    case "cancelled":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default function EquipmentBookingCard({
  item,
  refetch,
}: {
  item: EquipmentBooking;
  refetch: () => void;
}) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (newStatus: (typeof status_list)[number]) =>
      apiClient.patch(`admins/orders/equipments/${item.id}/status`, {
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

  const availableUpdates = allowed_Status_update(item.status);

  return (
    <div
      key={item.id}
      className="card w-full bg-base-100 shadow-xl border border-base-200"
    >
      <figure className="aspect-video">
        <img
          src={item.equipmentImageUrl || "https://picsum.photos/400/200"} // Fallback image
          alt={item.equipmentName}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg mb-2 flex flex-wrap items-center gap-2">
          {item.equipmentName}
          <div
            className={`badge ${getStatusColor(
              item.status as (typeof status_list)[number],
            )} text-xs font-semibold uppercase`}
          >
            {item.status}
          </div>
        </h2>
        <p className="text-sm text-base-content/80 mb-2">
          <strong>Address:</strong> {item.address}
        </p>
        <div className="flex flex-col gap-1 text-sm">
          <p>
            <strong>Rental Period:</strong> {item.rentalStartDate} to{" "}
            {item.rentalEndDate}
          </p>
          <p>
            <strong>Quantity:</strong> {item.quantity}
          </p>
          <p>
            <strong>Price per day:</strong> {item.currency}{" "}
            {item.rentalPricePerDay}
          </p>
          <p>
            <strong>Total Price:</strong> {item.currency} {item.totalPrice}
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
