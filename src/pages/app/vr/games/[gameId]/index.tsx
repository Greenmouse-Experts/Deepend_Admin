import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { Vrgame } from "@/api/types";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import GamePurchases from "./_components/GamePurchases";
import GameAvail from "./_components/GameAvaliability";

export default function index() {
  const { gameId } = useParams({ strict: false });

  const query = useQuery<ApiResponse<Vrgame>>({
    queryKey: ["game", gameId],
    queryFn: async () => {
      const response = await apiClient.get(`admins/vrgames/${gameId}`);
      return response.data;
    },
  });
  const item = query.data?.payload;

  return (
    <QueryPageLayout
      query={query}
      title={item ? `Game: ${item.name}` : "Game Details"}
    >
      {item && (
        <>
          <div className="">
            <div className="card lg:card-side bg-base-100 shadow-xl">
              {item.imageUrls && item.imageUrls.length > 0 ? (
                <figure className="lg:w-2/5 xl:w-1/3">
                  <div className="carousel w-full rounded-box">
                    {item.imageUrls.map((image, index) => (
                      <div
                        key={image.path}
                        id={`slide${index}`}
                        className="carousel-item relative w-full aspect-square lg:aspect-auto"
                      >
                        <img
                          src={image.url}
                          className="w-full h-full object-cover"
                          alt={`Image of ${item.name} ${index + 1}`}
                        />
                        {item.imageUrls.length > 1 && (
                          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a
                              href={`#slide${
                                index === 0
                                  ? item.imageUrls.length - 1
                                  : index - 1
                              }`}
                              className="btn btn-circle"
                            >
                              ❮
                            </a>
                            <a
                              href={`#slide${
                                index === item.imageUrls.length - 1
                                  ? 0
                                  : index + 1
                              }`}
                              className="btn btn-circle"
                            >
                              ❯
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </figure>
              ) : (
                <figure className="lg:w-2/5 xl:w-1/3 bg-base-200 flex items-center justify-center">
                  <img
                    src="https://picsum.photos/800/600"
                    alt="Game placeholder"
                    className="w-full h-full object-cover"
                  />
                </figure>
              )}

              <div className="card-body">
                <h1 className="card-title text-3xl mb-2">{item.name}</h1>
                <p className="text-base-content/80">{item.description}</p>
                <div className="divider my-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-base-content/60">
                      Ticket Price
                    </span>
                    <span className="text-lg font-semibold">
                      ${item.ticketPrice}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-base-content/60">
                      Quantity
                    </span>
                    <span className="text-lg font-semibold">
                      {item.ticketQuantity}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-base-content/60">
                      Age Rating
                    </span>
                    <span className="text-lg font-semibold">
                      {item.ageRating}+
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-base-content/60">
                      Category ID
                    </span>
                    <span className="text-lg font-semibold">
                      {item.categoryId}
                    </span>
                  </div>
                  <div className="flex flex-col col-span-1 sm:col-span-2">
                    <span className="font-medium text-base-content/60">
                      Availability
                    </span>
                    {item.isAvailable ? (
                      <div className="badge badge-success gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-4 h-4 stroke-current"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        Available
                      </div>
                    ) : (
                      <div className="badge badge-error gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-4 h-4 stroke-current"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        Not Available
                      </div>
                    )}
                  </div>
                </div>
                <div className="divider my-4" />
                <div className="text-xs text-base-content/50 space-y-1">
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(item.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="card-actions justify-end mt-6">
                  <button
                    onClick={() => window.history.back()}
                    className="btn btn-outline"
                  >
                    Go Back
                  </button>
                  <Link to="edit" className="btn btn-primary">
                    Edit Details
                  </Link>
                </div>
              </div>
            </div>
            <section className="space-y-4 mt-8">
              <GameAvail gameId={gameId} />
              <GamePurchases gameId={gameId} />
            </section>
          </div>
        </>
      )}
    </QueryPageLayout>
  );
}
