import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { HotelInfo } from "@/api/types";
import SimpleCarousel from "@/components/SimpleCarousel";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import HotelRooms from "../_components/HotelRooms";
import HotelAmenities from "../_components/HotelAmenities";

export default function index() {
  const { id } = useParams({
    from: "/app/hotel/$id",
  });

  const query = useQuery<ApiResponse<HotelInfo>>({
    queryKey: ["hotel", id],
    queryFn: async () => {
      let resp = await apiClient.get("admins/hotels/" + id);
      return resp.data;
    },
  });

  if (query.isLoading) {
    return (
      <>
        <SimpleHeader title={"Hotel Details"} />
        <SimpleLoader />
      </>
    );
  }
  const item = query.data.payload;
  return (
    <div>
      <SimpleHeader title={"Hotel Details"}>
        <Link to={`/app/hotel/${id}/edit`} className="btn btn-info">
          Edit
        </Link>
      </SimpleHeader>

      <div className="">
        <div className="carousel w-full rounded-box bg-base-300 my-12">
          <SimpleCarousel>
            {item.imageUrls.map((image, index) => (
              <div
                key={index}
                className="carousel-item w-full grid place-items-center"
              >
                <img
                  src={image.url}
                  className=" object-cover h-[420px] aspect-video rounded-md"
                  alt={item.name}
                />
              </div>
            ))}
          </SimpleCarousel>
        </div>
        <h1 className="text-3xl font-bold mb-4">{item.name}</h1>

        <p className="text-lg mb-4 fieldset-label">{item.description}</p>
        <div className="grid  grid-cols-1  gap-4 mb-4">
          <div className="space-y-2">
            <div>
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p className="p-2 bg-base-300 rounded-md">
                {item.address}, {item.city}, {item.state}, {item.country}
              </p>
            </div>
            <div>
              <span className="mb-2 fieldset-label inline">Rating: </span>
              <span className="">{item.rating}/5</span>
            </div>
            <div>
              <h2 className="mb-2">Available: </h2>
              <p className="p">{item.isAvailable ? "Yes" : "No"}</p>
            </div>
          </div>
          <div>
            <HotelAmenities
              refetch={query.refetch}
              id={item.id}
              amenities={item.amenities}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">
          Rooms {item.rooms.length}
        </h2>
        <div className="p-4 bg-base-300 rounded-md">
          <HotelRooms item={item.rooms} refetch={query.refetch} />
        </div>
      </div>
    </div>
  );
}
