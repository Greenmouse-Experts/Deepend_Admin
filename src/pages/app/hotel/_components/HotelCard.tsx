import apiClient from "@/api/apiClient";
import type { Hotel } from "@/api/types";
import SimpleCarousel from "@/components/SimpleCarousel";
import { extract_message } from "@/helpers/auth";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export default function HotelCard({
  hotel,
  refetch,
}: {
  hotel: Hotel;
  refetch: () => any;
}) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      let resp = await apiClient.delete("admins/hotels/" + hotel.id);
      return resp.data;
    },
    onSuccess: () => {
      refetch();
    },
  });
  const mutate = useMutation({
    mutationFn: async (fn: Function) => fn(),
    onSuccess: () => {
      refetch();
    },
  });

  const toggle_available = async () => {
    const status = hotel.isAvailable ? "unavailable" : "available";
    let resp = await apiClient.put(`admins/hotels/${hotel.id}/${status}`);
    return resp.data;
  };
  const toggle = () => {
    toast.promise(mutate.mutateAsync(toggle_available), {
      loading: "Updating availability...",
      success: "Availability updated successfully!",
      error: extract_message,
    });
  };
  return (
    <div key={hotel.id} className="card  bg-base-100 shadow-xl">
      <div className="h-[400px]">
        {hotel.imageUrls && hotel.imageUrls.length > 0 && (
          <div className=" w-full h-[400px]  bg-base-300 grid place-items-center">
            <img
              src={hotel.imageUrls[0].url}
              alt={`Image of ${hotel.name}`}
              className="w-[500px] h-[400px] object-cover"
            />
          </div>
        )}
      </div>
      <div className=" p-4 space-y-4 flex flex-col">
        <h2 className="card-title">{hotel.name}</h2>
        <p className="text-sm text-base-content/80">{hotel.description}</p>
        <div className="flex flex-col    gap-4 text-sm">
          <div>
            <h2 className="fieldset-label">Address:</h2>
            <p className="px-2  mt-2 bg-base-200 p-2">
              {" "}
              {hotel.address}, {hotel.city}, {hotel.state}, {hotel.country}
            </p>
          </div>
          <div>
            <strong>Rating:</strong> {hotel.rating} / 5
          </div>
          <p>
            <div className="flex items-center gap-2">
              <strong>Available:</strong>{" "}
              <input
                type="checkbox"
                className="toggle toggle-success toggle-sm"
                checked={hotel.isAvailable}
                onChange={toggle}
                disabled={mutate.isPending}
              />
            </div>
          </p>
        </div>
        <div>
          <h2>Rooms: {hotel.rooms.length}</h2>
        </div>
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Amenities:</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((amenity) => (
                <div key={amenity.id} className="badge badge-accent">
                  {amenity.name}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className=" flex gap-2">
          <button
            onClick={() => {
              toast.promise(mutateAsync, {
                loading: "Deleting...",
                success: extract_message,
                error: extract_message,
              });
            }}
            disabled={isPending}
            className="btn btn-error flex-1"
          >
            Delete
          </button>
          <Link
            disabled={isPending}
            to={`/app/hotel/${hotel.id}`}
            className="btn flex-1 btn-info "
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
