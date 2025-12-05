import apiClient from "@/api/apiClient";
import type { FoodBookingOrder } from "@/api/types";
import { extract_message } from "@/helpers/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
const status_list = [
  "delivered",
  "cancelled",
  "preparing",
  "confirmed",
  "on-the-way",
] as const;

const allowed_Status_update = (
  currentStatus: (typeof status_list)[number],
): (typeof status_list)[number][] => {
  switch (currentStatus) {
    case "confirmed":
      return ["preparing", "cancelled", "on-the-way"];
    case "preparing":
      return ["on-the-way", "delivered", "cancelled"];
    case "on-the-way":
      return ["delivered", "cancelled"];
    case "delivered":
    case "cancelled":
      return []; // No further updates allowed for delivered or cancelled orders
    default:
      return [];
  }
};

const getStatusColor = (status: (typeof status_list)[number]) => {
  switch (status) {
    case "confirmed":
      return "badge-info";
    case "preparing":
      return "badge-warning";
    case "on-the-way":
      return "badge-primary";
    case "delivered":
      return "badge-success";
    case "cancelled":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default function FoodBookingCard({
  food,
  refetch,
}: {
  food: FoodBookingOrder;
  refetch: () => void;
}) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (newStatus: (typeof status_list)[number]) =>
      apiClient.patch(`admins/orders/foods/${food.id}/status`, {
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

  const availableUpdates = allowed_Status_update(food.status);

  return (
    <div className="card bg-base-100 shadow-lg border border-base-200 overflow-hidden">
      <figure className="relative overflow-hidden">
        <img
          src={food.foodImageUrl}
          alt={food.foodName}
          className="h-48 w-full object-cover"
        />
        <div
          className={`badge absolute top-3 right-3 text-white ${getStatusColor(
            food.status,
          )} rounded-md`}
          aria-live="polite"
        >
          {food.status.toUpperCase()}
        </div>
      </figure>

      <div className="card-body p-4 space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="card-title text-lg font-semibold">{food.foodName}</h2>
          <div className="text-sm text-neutral">
            Qty: <span className="font-semibold">{food.quantity}</span>
          </div>
          <div className="inline-flex items-baseline gap-2">
            <span className="text-lg font-bold">
              {food.totalPrice} {food.currency}
            </span>
            <span className="badge badge-outline">Unit: {food.foodPrice}</span>
          </div>
        </div>

        {food.foodAddons.length > 0 && (
          <div>
            <p className="font-medium mb-2">Add-ons</p>
            <div className="flex flex-wrap gap-2">
              {food.foodAddons.map((addon) => (
                <span
                  key={addon.addonId}
                  className="badge badge-sm badge-outline"
                >
                  {addon.addonName} · {addon.addonPrice} {food.currency}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p>
            <strong>Delivery Type:</strong> {food.deliveryType}
          </p>
          {food.specialInstructions && (
            <p>
              <strong>Instructions:</strong> {food.specialInstructions}
            </p>
          )}
          {food.deliveryAddress && (
            <div className="p-3 bg-primary/10 rounded-box">
              <p className="font-semibold text-info">Delivery Address</p>
              <p className="text-sm text-info break-words">
                {food.deliveryAddress}
              </p>
            </div>
          )}
        </div>

        {availableUpdates.length > 0 && (
          <div className="card-actions ml-auto">
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
