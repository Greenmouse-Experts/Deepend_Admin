import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { Amenity, Hotel } from "@/api/types";
import Modal from "@/components/dialogs-modals/SimpleModal";
import { extract_message } from "@/helpers/auth";
import { useModal } from "@/store/modals";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function HotelAmenities({
  id,
  amenities,
  refetch: parent_refetch,
}: {
  id: string;
  amenities: Hotel["amenities"];
  refetch: () => void;
}) {
  const { data: allAmenities } = useQuery<ApiResponse<Amenity[]>>({
    queryKey: ["all-amenities"],
    queryFn: async () => {
      const resp = await apiClient.get("admins/hotels/amenities", {
        params: { limit: 100 },
      });
      return resp.data;
    },
  });

  const addAmenityMutation = useMutation({
    mutationFn: (amenityIds: number[]) =>
      apiClient.post(`admins/hotels/${id}/amenities`, { amenityIds }),
    onSuccess: () => {
      parent_refetch();
      addModal.closeModal();
    },
  });

  const removeAmenityMutation = useMutation({
    mutationFn: (amenityId: number) =>
      apiClient.delete(`admins/hotels/${id}/amenities`, {
        data: { amenityIds: [amenityId] },
      }),
    onSuccess: () => {
      parent_refetch();
    },
  });

  const addModal = useModal();
  const addForm = useForm<{ amenityIds: number[] }>({
    defaultValues: {
      amenityIds: [],
    },
  });

  const existingAmenityIds = new Set(amenities.map((amenity) => amenity.id));
  const filteredAvailableAmenities = allAmenities?.payload.filter(
    (amenity) => !existingAmenityIds.has(amenity.id),
  );

  return (
    <>
      <Modal ref={addModal.ref}>
        <h3 className="font-bold text-lg">Add Amenities</h3>
        <form
          onSubmit={addForm.handleSubmit((data) => {
            toast.promise(addAmenityMutation.mutateAsync(data.amenityIds), {
              loading: "Adding amenities...",
              success: "Amenities added successfully!",
              error: extract_message,
            });
          })}
        >
          <div className="flex flex-col gap-2 py-4">
            {filteredAvailableAmenities?.length === 0 ? (
              <p className="text-center text-gray-500">
                No new amenities to add.
              </p>
            ) : (
              filteredAvailableAmenities?.map((amenity) => (
                <label
                  key={amenity.id}
                  className="label cursor-pointer justify-start gap-3"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    value={amenity.id}
                    {...addForm.register("amenityIds", { valueAsNumber: true })}
                  />
                  <span className="label-text text-base">{amenity.name}</span>
                </label>
              ))
            )}
          </div>
          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                filteredAvailableAmenities?.length === 0 ||
                addForm.formState.isSubmitting
              }
            >
              {addForm.formState.isSubmitting ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => addModal.closeModal()}
              disabled={addForm.formState.isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title flex justify-between items-center">
            <div className="flex items-center gap-2">
              Amenities
              <div className="badge badge-neutral">{amenities.length}</div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => addModal.showModal()}
            >
              Add Amenity
            </button>
          </h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {amenities.map((amenity) => (
              <div
                key={amenity.id}
                className="badge badge-accent h-auto py-1 gap-2"
              >
                {amenity.name}
                <button
                  className="btn btn-xs btn-ghost btn-circle"
                  onClick={() =>
                    toast.promise(
                      removeAmenityMutation.mutateAsync(amenity.id),
                      {
                        loading: "Removing amenity...",
                        success: "Amenity removed successfully!",
                        error: extract_message,
                      },
                    )
                  }
                  disabled={removeAmenityMutation.isPending}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
