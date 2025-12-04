import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { DeliverySettings } from "@/api/types";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleInput from "@/components/SimpleInput";
import { extract_message } from "@/helpers/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Autocomplete from "react-google-autocomplete";
import { GOOGLE_MAPS_KEY, type PlacesService } from "@/api/client";

export default function Delivery() {
  const query = useQuery<ApiResponse<DeliverySettings>>({
    queryKey: ["delivery-settings"],
    queryFn: async () => {
      const response = await apiClient.get("admins/delivery-settings");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: Partial<DeliverySettings>) => {
      const response = await apiClient.put("admins/delivery-settings", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Delivery settings updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update delivery settings.");
    },
  });

  const handleFormSubmit = (data: Partial<DeliverySettings>) => {
    mutation.mutate(data);
  };

  return (
    <>
      <SuspensePageLayout
        showTitle={false}
        query={query}
        title={"Delivery Settings"}
      >
        {(data) => {
          return (
            <div className="bg-base-100 rounded-md p-6">
              <div className="">
                {/*return {JSON.stringify(data.payload)}*/}
                <DeliveryForm item={data.payload} />
              </div>
            </div>
          );
        }}
      </SuspensePageLayout>
    </>
  );
}

const DeliveryForm = ({ item }: { item: Partial<DeliverySettings> }) => {
  const queryClient = useQueryClient();
  const form = useForm<Partial<DeliverySettings>>({
    defaultValues: item,
  });

  const save_new = async (data: Partial<DeliverySettings>) => {
    const new_data: typeof data = {
      originLat: data.originLat,
      originLng: data.originLng,
      pricePerKm: data.pricePerKm,
    };
    const resp = await apiClient.patch("admins/delivery-settings/" + data.id, {
      ...new_data,
    });
    queryClient.invalidateQueries({ queryKey: ["delivery-settings"] });
    return resp.data;
  };
  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        toast.promise(save_new(data), {
          loading: "Saving...",
          success: extract_message,
          error: extract_message,
        });
      })}
      className="overflow-auto"
    >
      <div className="mb-4">
        <label className="fieldset-label mb-2">Origin Address</label>
        <Autocomplete
          className="input w-full"
          apiKey={GOOGLE_MAPS_KEY}
          onPlaceSelected={(place: PlacesService) => {
            form.setValue("originLat", place.geometry.location.lat());
            form.setValue("originLng", place.geometry.location.lng());
          }}
          options={{
            types: ["address"], // Restrict to street addresses
          }}
          defaultValue={
            item.originLat && item.originLng
              ? `${item.originLat}, ${item.originLng}`
              : ""
          } // You might want to reverse geocode this for a proper address string
        />
      </div>
      <div className="mb-4">
        <SimpleInput
          label="Origin Latitude (auto completed)"
          {...form.register("originLat", {
            required: true,
            valueAsNumber: true,
          })}
          readOnly
        />
      </div>
      <div className="mb-4">
        <SimpleInput
          label="Origin Longitude (auto completed)"
          {...form.register("originLng", {
            required: true,
            valueAsNumber: true,
          })}
          readOnly
        />
      </div>
      <div className="mb-4">
        <SimpleInput
          label="Price Per Km "
          {...form.register("pricePerKm", {
            required: true,
            valueAsNumber: true,
          })}
          type="number"
          step="0.01"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary float-right"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
};
