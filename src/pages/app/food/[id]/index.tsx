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

  if (query.isLoading) {
    return <SimpleLoader />;
  }
  if (query.isError) {
    return (
      <div className="alert alert-error text-xl shadow-lg m-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error loading food item.</span>
        </div>
      </div>
    );
  }
  const food = query.data?.payload;

  if (!food) {
    return (
      <div className="alert alert-warning text-xl shadow-lg m-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Food item not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-primary-content">
        Food Item Details
      </h1>
      <div className="card bg-base-100 shadow-xl rounded-lg p-6 space-y-6 md:p-8">
        <div className="relative h-[420px] rounded-lg overflow-hidden">
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
        <div className="card-body p-0">
          <h2 className="card-title text-4xl font-bold mb-2 text-secondary">
            {food.name}
          </h2>
          <p className="text-lg text-base-content mb-4 leading-relaxed">
            {food.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3">
              {/*<DollarSign className="text-primary" size={28} />*/}
              <span className="text-xl font-semibold text-primary">Price:</span>
              <span className="text-3xl font-bold text-accent">
                ${parseFloat(food.price).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="text-primary" size={28} />
              <span className="text-xl font-semibold text-primary">
                Available:
              </span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-lg"
                checked={food.isAvailable}
                readOnly
              />
              <span className="text-lg">
                {food.isAvailable ? "Yes, in stock" : "No, out of stock"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Package className="text-primary" size={28} />
              <span className="text-xl font-semibold text-primary">
                Quantity:
              </span>
              <span className="text-xl text-base-content font-medium">
                {food.quantity} units
              </span>
            </div>
          </div>

          <div className="border-t border-base-200 pt-6 mt-6">
            <p className="text-sm text-base-content-secondary mb-2 flex items-center gap-2">
              <CalendarPlus size={20} className="text-info" />
              <span className="font-medium">Created At:</span>{" "}
              {new Date(food.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-base-content-secondary flex items-center gap-2">
              <CalendarClock size={20} className="text-info" />
              <span className="font-medium">Last Updated:</span>{" "}
              {new Date(food.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="card-actions justify-end mt-8 gap-4">
            <Link
              viewTransition
              to="/app/food/$id/edit"
              params={{
                id: id,
              }}
              className="btn btn-secondary btn-lg shadow-md hover:shadow-lg transition-all duration-200 gap-2"
            >
              <Edit size={20} />
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
              className="btn btn-error btn-lg shadow-md hover:shadow-lg transition-all duration-200 gap-2"
            >
              {delete_mutation.isPending ? (
                <span className="loading loading-spinner" />
              ) : (
                <Trash2 size={20} />
              )}
              Delete Food
            </button>
          </div>
        </div>
        <FoodAddons id={id} />
      </div>
    </div>
  );
}
