import type { HotelBooking } from "@/api/types";

export default function HotelBookingCard({
  booking,
}: {
  booking: HotelBooking;
}) {
  return (
    <>
      <div
        key={booking.id}
        className="bg-base-100 shadow-xl rounded-lg overflow-hidden"
      >
        <figure>
          <img
            src={booking.hotelImageUrl}
            alt={booking.hotelName}
            className="w-full h-48 object-cover"
          />
        </figure>
        <div className="p-4">
          <h2 className="card-title text-lg font-semibold mb-2">
            {booking.hotelName}
          </h2>
          <p className="text-sm text-gray-500 mb-1">
            Room: {booking.hotelRoomName}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Price per night: {booking.currency} {booking.hotelRoomPricePerNight}
          </p>
          <p className="text-md font-bold mt-2">
            Total: {booking.currency} {booking.totalPrice}
          </p>
          <div className="badge badge-primary badge-outline mt-2">
            {booking.status}
          </div>
        </div>
      </div>
    </>
  );
}
