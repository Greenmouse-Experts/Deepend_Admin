import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { Cinema } from "@/api/types";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SimpleInput from "@/components/SimpleInput";
import { extract_message } from "@/helpers/auth";
import { useModal } from "@/store/modals";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Film, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Halls({ cinemaID }) {
  const query = useQuery<ApiResponse<{ name: string; id: string }[]>>({
    queryKey: ["cinema-halls", cinemaID],
    queryFn: async () => {
      const response = await apiClient.get(
        `admins/cinemas/${cinemaID}/halls?page=1&limit=10`,
      );
      return response.data;
    },
    enabled: !!cinemaID,
  });
  const { data: allHalls } = useQuery<
    ApiResponse<{ name: string; id: string }[]>
  >({
    queryKey: ["all-cinemas-halls"],
    queryFn: async () =>
      (
        await apiClient.get("admins/cinemas/halls", {
          params: {
            page: 1,
            limit: 100,
          },
        })
      ).data,
  });

  const addHallModal = useModal();
  const appendHallModal = useModal();
  const form = useForm<Partial<{ name: string; cinemaId: string }>>();

  const appendHallMutation = useMutation({
    mutationFn: async (hallId: any) => {
      const response = await apiClient.post("admins/cinemas/halls", {
        cinemaId: cinemaID,
        name: hallId.name,
      });
      return response.data;
    },
    onSuccess: () => {
      query.refetch();
      appendHallModal.closeModal();
    },
    onError: (error) => {},
  });

  if (query.isLoading)
    return (
      <div className="card bg-base-200 shadow-xl p-4">
        <h2 className="card-title text-lg mb-2">Halls</h2>
        <div className="skeleton h-8 w-full mb-2"></div>
        <div className="skeleton h-8 w-full mb-2"></div>
        <div className="skeleton h-8 w-full"></div>
      </div>
    );
  if (query.isError)
    return (
      <div role="alert" className="alert alert-error">
        <AlertCircle className="stroke-current shrink-0 h-6 w-6" />
        <span>Error loading halls.</span>
      </div>
    );
  let items = query.data?.payload || [];
  let availableHalls =
    allHalls?.payload?.filter(
      (hall) => !items.some((item) => item.id === hall.id),
    ) || [];

  return (
    <>
      <div className="card  shadow-xl space-y-4">
        <div className="overflow-auto items-center flex ">
          <h2 className="text-lg ">Halls ({items.length})</h2>
          <div className="ml-auto space-x-2">
            <button
              onClick={() => appendHallModal.showModal()}
              className="btn btn-secondary"
            >
              Append Hall
            </button>
            <button
              onClick={() => addHallModal.showModal()}
              className="btn btn-primary"
            >
              Add Hall
            </button>
          </div>
        </div>
        {items.length > 0 ? (
          <ul className="space-y-4 bg-base-300 p-4 rounded-md menu w-full">
            {items.map((item) => {
              return <HallCard item={item} key={item.id} cinemaId={cinemaID} />;
            })}
          </ul>
        ) : (
          <p className="text-base-content/70">
            No halls found for this cinema.
          </p>
        )}
      </div>
      <Modal ref={addHallModal.ref}>
        <form
          action=""
          className="space-y-4"
          onSubmit={form.handleSubmit((data) => {
            toast.promise(
              async () => {
                let resp = await apiClient.post("admins/cinemas/halls", {
                  ...data,
                  cinemaId: cinemaID,
                });
                query.refetch();
                addHallModal.showModal();
                return resp.data;
              },
              {
                loading: "loading",
                success: "Hall added successfully",
                error: extract_message,
              },
            );
          })}
        >
          <h2 className="text-2xl font-bold">Add Hall</h2>
          <SimpleInput
            {...form.register("name")}
            label="Name"
            placeholder="Enter hall name"
          />
          <button className="btn btn-block btn-primary">Add Hall</button>
        </form>
      </Modal>

      <Modal ref={appendHallModal.ref}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Append Existing Hall</h2>
          {availableHalls.length > 0 ? (
            <ul className="menu bg-base-200 w-full rounded-box">
              {availableHalls.map((hall) => (
                <li key={hall.id}>
                  <a
                    onClick={() =>
                      toast.promise(appendHallMutation.mutateAsync(hall), {
                        loading: "Appending hall...",
                        success: "Hall appended successfully!",
                        error: extract_message,
                      })
                    }
                    className="flex justify-between items-center"
                  >
                    {hall.name}
                    {appendHallMutation.isPending &&
                      appendHallMutation.variables === hall.id && (
                        <span className="loading loading-spinner loading-sm"></span>
                      )}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base-content/70">
              No other halls available to append.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}

const HallCard = ({
  item,
  cinemaId,
}: {
  item: { id: string; name: string };
  cinemaId?: string;
}) => {
  const edit_mutation = useMutation({
    mutationFn: async (data: any) => {
      let resp = await apiClient.put(`admins/cinemas/halls/${item.id}`, {
        name: data.name,
        cinemaId: cinemaId, // Ensure cinemaId is passed for the update
      });
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Hall updated successfully!");
      window.location.reload(); // Consider using query.refetch() instead of full reload
    },
    onError: (error) => {
      toast.error(extract_message(error));
    },
  });
  const delete_mutation = useMutation({
    mutationFn: async (data: any) => {
      let resp = await apiClient.delete(
        `admins/cinemas/${data.cinemaId}/halls/${data.id}`,
      );
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Hall deleted successfully!");
      window.location.reload(); // Consider using query.refetch() instead of full reload
    },
    onError: (error) => {
      toast.error(extract_message(error));
    },
  });
  const form = useForm({
    defaultValues: {
      ...item,
    },
  });
  const modal = useModal();
  return (
    <>
      <Modal ref={modal.ref}>
        <form
          action=" "
          className="space-y-4"
          onSubmit={form.handleSubmit((data) => {
            toast.promise(edit_mutation.mutateAsync(data), {
              loading: "Updating...",
              success: "Updated!",
              error: extract_message,
            });
          })}
        >
          <h2>Edit Hall: {item.name}</h2>
          <SimpleInput
            {...form.register("name")}
            label="Name"
            placeholder="Enter hall name"
          />
          <button className="btn btn-block btn-primary">Update Hall</button>
        </form>
      </Modal>
      <li key={item.id} className="ring ring-current/10 rounded-md">
        <a>
          <Film className="h-5 w-5 text-primary" />
          {item.name}
          <div className="space-x-2">
            <button
              type="button"
              disabled={delete_mutation.isPending}
              onClick={() => {
                toast.promise(
                  delete_mutation.mutateAsync({
                    id: item.id,
                    cinemaId: cinemaId,
                  }),
                  {
                    loading: "Deleting...",
                    success: "Deleted!",
                    error: extract_message,
                  },
                );
              }}
              className="btn btn-soft btn-sm btn-error"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => modal.showModal()}
              className="btn btn-soft btn-sm btn-info"
            >
              Edit
            </button>
          </div>
        </a>
      </li>
    </>
  );
};
