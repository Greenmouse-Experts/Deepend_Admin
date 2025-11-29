import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { HotelInfo } from "@/api/types";
import SimpleCarousel from "@/components/SimpleCarousel";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import HotelRooms from "../_components/HotelRooms";
import HotelAmenities from "../_components/HotelAmenities";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";

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
  const item = query.data?.payload;
  return (
    <SuspensePageLayout query={query} showTitle={false}>
      {(data) => {
        let item = data.payload;
        return (
          <div className="container mx-auto px-4 ">
            <SimpleHeader title={"Hotel Details"}>
              <Link to={`/app/hotel/${id}/edit`} className="btn btn-info">
                Edit
              </Link>
            </SimpleHeader>
            <div className="card bg-base-100 shadow-xl my-8">
              <div className="card-body p-0">
                <div className="carousel w-full rounded-t-box bg-base-300">
                  <SimpleCarousel>
                    {item.imageUrls.map(
                      (image: { url: string }, index: number) => (
                        <div
                          key={index}
                          className="carousel-item w-full grid place-items-center"
                        >
                          <img
                            src={image.url}
                            className="object-cover h-[420px] aspect-video rounded-t-md"
                            alt={item.name}
                          />
                        </div>
                      ),
                    )}
                  </SimpleCarousel>
                </div>
                <div className="p-6">
                  <h1 className="text-4xl font-bold mb-4 text-primary">
                    {item.name}
                  </h1>

                  <p className="text-lg mb-6 text-base-content">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <div className="card bg-base-200 shadow-md">
                        <div className="card-body p-4">
                          <h2 className="text-2xl font-semibold mb-2 text-secondary">
                            Location
                          </h2>
                          <p className="text-base-content">
                            {item.address}, {item.city}, {item.state},{" "}
                            {item.country}
                          </p>
                        </div>
                      </div>
                      <div className="card bg-base-200 shadow-md">
                        <div className="card-body p-4">
                          <h2 className="text-2xl font-semibold mb-2 text-secondary">
                            Details
                          </h2>
                          <div className="flex items-center mb-2">
                            <span className="font-semibold mr-2">Rating:</span>
                            <div className="rating rating-sm">
                              {[...Array(5)].map((_, i) => (
                                <input
                                  key={i}
                                  type="radio"
                                  name="rating-2"
                                  className="mask mask-star-2 bg-warning"
                                  checked={i < item.rating}
                                  readOnly
                                />
                              ))}
                            </div>
                            <span className="ml-2">{item.rating}/5</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">
                              Available:
                            </span>
                            <span
                              className={`badge ${
                                item.isAvailable
                                  ? "badge-success"
                                  : "badge-error"
                              } text-white`}
                            >
                              {item.isAvailable ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
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

                  <div className="divider"></div>

                  <h2 className="text-3xl font-bold mb-4 text-primary">
                    Rooms ({item.rooms.length})
                  </h2>
                  <div className="card bg-base-200 shadow-md p-6">
                    <HotelRooms item={item.rooms} refetch={query.refetch} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </SuspensePageLayout>
  );
}
