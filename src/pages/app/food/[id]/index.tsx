import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { SingleFoodProps } from "@/api/types";
import SimpleCarousel from "@/components/SimpleCarousel";
import SimpleLoader from "@/components/SimpleLoader";
import { extract_message } from "@/helpers/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  DollarSign,
  CheckCircle,
  Package,
  CalendarPlus,
  CalendarClock,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import FoodAddons from "./_components/FoodAddons";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";

export default function index() {
  const { id } = useParams({
    from: "/app/food/$id",
    select: (params) => ({ id: params.id }),
  });
  const nav = useNavigate();
  const query = useQuery<ApiResponse<SingleFoodProps>>({
    queryKey: ["food-item", id],
    queryFn: async () => {
      let resp = await apiClient.get("admins/foods/" + id);
      return resp.data;
    },
  });

  const toggle_status_mutation = useMutation({
    mutationFn: async (isAvailable: boolean) => {
      const status = isAvailable ? "available" : "unavailable";
      let resp = await apiClient.put(`admins/foods/${id}/${status}`);
      return resp.data;
    },
    onSuccess: () => {
      query.refetch();
      toast.success("Status updated successfully");
    },
    onError: (error) => {
      toast.error(extract_message(error as any));
    },
  });

  const delete_mutation = useMutation({
    mutationFn: async () => {
      let resp = await apiClient.delete("admins/foods/" + id);
      return resp.data;
    },
    onSuccess: () => {
      nav({
        to: "/app/food",
      });
      toast.success("Food item deleted successfully!");
    },
    onError: (error) => {
      toast.error(extract_message(error as any));
    },
  });

  return (
    <SuspensePageLayout query={query} showTitle={false}>
      {(data) => {
        let food = data.payload;
        return (
          <>
            <div className="container mx-auto p-4">
              <div className="space-y-6">
                <div className="relative h-[420px] rounded-lg overflow-hidden shadow-lg">
                  {food.imageUrls.length > 0 ? (
                    <SimpleCarousel>
                      {food.imageUrls.map((item, index) => (
                        <div key={index} className="h-[420px] w-full">
                          <img
                            src={item.url}
                            className="size-full object-cover"
                            alt={`Food image ${index + 1}`}
                          />
                        </div>
                      ))}
                    </SimpleCarousel>
                  ) : (
                    <div className="h-[420px] bg-base-300 grid place-items-center">
                      <h2 className="text-4xl text-base-content-secondary">
                        No Images
                      </h2>
                    </div>
                  )}
                </div>

                <div className="bg-base-100 p-6 rounded-lg shadow-lg">
                  <h2 className="text-5xl font-extrabold mb-4 text-secondary leading-tight">
                    {food.name}
                  </h2>
                  <p className="text-lg text-base-content mb-6 leading-relaxed">
                    {food.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg shadow-sm">
                      <DollarSign className="text-primary" size={32} />
                      <div>
                        <span className="text-xl font-semibold text-primary block">
                          Price:
                        </span>
                        <span className="text-3xl font-bold text-accent">
                          NGN {parseFloat(food.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg shadow-sm">
                      <CheckCircle className="text-primary" size={32} />
                      <div>
                        <span className="text-xl font-semibold text-primary block">
                          Available:
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="checkbox"
                            className="toggle toggle-primary toggle-lg"
                            checked={food.isAvailable}
                            onChange={() =>
                              toast.promise(
                                toggle_status_mutation.mutateAsync(
                                  !food.isAvailable,
                                ),
                                {
                                  loading: "Updating status...",
                                  success: "Status updated successfully!",
                                  error: extract_message,
                                },
                              )
                            }
                          />
                          <span className="text-lg font-medium text-base-content">
                            {food.isAvailable ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg shadow-sm">
                      <Package className="text-primary" size={32} />
                      <div>
                        <span className="text-xl font-semibold text-primary block">
                          Quantity:
                        </span>
                        <span className="text-2xl text-base-content font-bold mt-1">
                          {food.quantity} units
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-base-300 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="text-base text-base-content-secondary flex items-center gap-3">
                      <CalendarPlus size={24} className="text-info" />
                      <span className="font-semibold">Created At:</span>{" "}
                      {new Date(food.createdAt).toLocaleString()}
                    </p>
                    <p className="text-base text-base-content-secondary flex items-center gap-3">
                      <CalendarClock size={24} className="text-info" />
                      <span className="font-semibold">Last Updated:</span>{" "}
                      {new Date(food.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-end mt-10 gap-4">
                    <Link
                      viewTransition
                      to="/app/food/$id/edit"
                      params={{
                        id: id,
                      }}
                      className="btn btn-secondary btn-lg shadow-md hover:shadow-lg transition-all duration-200 gap-2 px-6"
                    >
                      <Edit size={22} />
                      Edit Food
                    </Link>
                    <button
                      disabled={delete_mutation.isPending}
                      onClick={() => {
                        toast.promise(delete_mutation.mutateAsync(), {
                          loading: "Deleting food item...",
                          success: "Food item deleted successfully!",
                          error: (err) => extract_message(err),
                        });
                      }}
                      className="btn btn-error btn-lg shadow-md hover:shadow-lg transition-all duration-200 gap-2 px-6"
                    >
                      {delete_mutation.isPending ? (
                        <span className="loading loading-spinner" />
                      ) : (
                        <Trash2 size={22} />
                      )}
                      Delete Food
                    </button>
                  </div>
                </div>
                <FoodAddons id={id} />
              </div>
            </div>
          </>
        );
      }}
    </SuspensePageLayout>
  );
}
