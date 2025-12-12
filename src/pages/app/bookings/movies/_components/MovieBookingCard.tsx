import apiClient from "@/api/apiClient";
import { toast_wrapper } from "@/api/client";
import type { MovieBooking } from "@/api/types";
import { useMutation } from "@tanstack/react-query";

export default function MovieBookingCard({
  booking,
  refetch,
}: {
  booking: MovieBooking;
  refetch: () => void;
}) {
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      return (
        await apiClient.patch(
          `admins/orders/movie-tickets/${booking.ticketId}/mark-as-used`,
        )
      ).data;
    },
    onSuccess: () => {
      refetch();
    },
  });
  return (
    <div className="w-full">
      <div
        key={booking.ticketId}
        className="card card-compact bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full"
      >
        <figure className="relative">
          <img
            src={booking.movieImageUrl}
            alt={booking.movieName}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="badge badge-secondary absolute top-3 right-3 p-3 capitalize">
            {booking.status}
          </div>
        </figure>
        <div className=" card-body">
          <h2 className="card-title text-xl font-bold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {booking.movieName}
          </h2>
          {/*<p className="text-sm opacity-70 overflow-hidden text-ellipsis whitespace-nowrap">
            {booking.genre}
          </p>*/}
          <div className="grid grid-cols-1  gap-4 w-full mb-4">
            <div
              className="bg-base-200 p-4 rounded-lg shadow tooltip tooltip-top"
              data-tip={booking.location}
            >
              <p className="text-sm font-semibold text-gray-500">Cinema</p>
              <p className="text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                {booking.cinemaHallName}
              </p>
              <p className="text-xs text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {booking.location}
              </p>
            </div>

            <div className="bg-base-200 p-4 rounded-lg shadow">
              <p className="text-sm font-semibold text-gray-500">Showtime</p>
              <p className="text-lg font-bold">{booking.showtime}</p>
              <p className="text-xs text-gray-400">{booking.showDate}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm">
              <p className="font-semibold">Tickets:</p>
              <p className="text-lg font-bold">{booking.ticketQuantity}</p>
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
              Purchased: {new Date(booking.purchaseDate).toLocaleDateString()}
            </p>
            {booking.isUsed ? (
              <p className="text-success font-semibold">Used</p>
            ) : (
              <p className="text-warning font-semibold">Unused</p>
            )}
          </div>
          {booking.snackAddOns && booking.snackAddOns.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-md mb-2">Snack Add-ons:</h3>
              <ul className="list-disc list-inside text-sm">
                {booking.snackAddOns.map((snack, index) => (
                  <li
                    key={index}
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {snack.snackName} (x{snack.snackQuantity}) -{" "}
                    {booking.currency}{" "}
                    {(
                      parseFloat(snack.snackPrice) * snack.snackQuantity
                    ).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={() => {
              toast_wrapper(mutateAsync);
            }}
            className="btn btn-primary mt-auto"
          >
            Mark Used
          </button>
        </div>
      </div>
    </div>
  );
}
