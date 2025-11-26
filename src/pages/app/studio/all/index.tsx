import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { Studio } from "@/api/types";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleInput from "@/components/SimpleInput";
import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import { extract_message } from "@/helpers/auth";
import { useModal } from "@/store/modals";
import { usePagination } from "@/store/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function index() {
  const props = usePagination();
  const query = useQuery<ApiResponse<Studio[]>>({
    queryKey: ["all-studios", props.page],
    queryFn: async () => {
      let resp = await apiClient.get("admins/studios", {
        params: {
          page: props.page,
          limit: 10,
        },
      });
      return resp.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      let resp = await apiClient.post("admins/studios", data);
      return resp.data;
    },
    onSuccess: () => {
      query.refetch();
      closeModal();
    },
  });
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    toast.promise(() => mutation.mutateAsync(data), {
      loading: "Creating Studio...",
      success: extract_message,
      error: extract_message,
    });
  };
  const { ref, showModal, closeModal } = useModal();
  if (query.isLoading) {
    return (
      <>
        <SimpleHeader title={"All Studios"} />
        <SimpleLoader />
      </>
    );
  }

  const items = query.data?.payload;
  return (
    <>
      <SimpleHeader title={"All Studios"}>
        <button className="btn btn-primary" onClick={() => showModal()}>
          Add Studio
        </button>
      </SimpleHeader>
      <div className="">
        <ul className="space-y-4">
          {items?.map((studio) => (
            <StudioCard
              refetch={query.refetch}
              studio={studio}
              key={studio.id}
            />
          ))}
        </ul>
        <div className="mt-6">
          <SimplePaginator {...props} />
        </div>
      </div>
      <Modal ref={ref}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold">Add new Studio</h2>
          <SimpleInput {...register("name")} label="Name" />
          <SimpleInput {...register("location")} label="Location" />
          <SimpleInput
            {...register("hourlyRate")}
            type="number"
            label="Hourly Rate"
          />
          <button className="btn btn-primary btn-block">Submit</button>
        </form>
      </Modal>
    </>
  );
}

export const StudioCard = ({
  studio,
  refetch,
}: {
  studio: Studio;
  refetch: () => void;
}) => {
  const delete_mutation = useMutation({
    mutationFn: async () => {
      let resp = await apiClient.delete(`admins/studios/${studio.id}`);
      return resp.data;
    },
    onSuccess: () => {
      refetch();
    },
  });
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: studio.name,
      location: studio.location,
      hourlyRate: studio.hourlyRate,
    },
  });
  const edit_mutation = useMutation({
    mutationFn: async (data: Partial<Studio>) => {
      let resp = await apiClient.put(`admins/studios/${studio.id}`, data);
      return resp.data;
    },
    onSuccess: () => {
      refetch();
      closeModal();
    },
  });
  const { ref, showModal, closeModal } = useModal();

  const { mutateAsync } = useMutation({
    mutationFn: async (data: Partial<Studio>) => {
      if (!studio.isAvailable) {
        let resp = await apiClient.put(
          `admins/studios/${studio.id}/available`,
          data,
        );
        return resp.data;
      }
      let resp = await apiClient.put(
        `admins/studios/${studio.id}/unavailable`,
        data,
      );
      return resp.data;
    },
    onSuccess: () => {
      refetch();
    },
  });
  const onSubmit = (data: Partial<Studio>) => {
    toast.promise(() => edit_mutation.mutateAsync(data), {
      loading: "Editing..." + studio.name,
      success: extract_message,
      error: extract_message,
    });
  };
  return (
    <li className="card compact bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-xl font-bold">{studio.name}</h2>
          <input
            onClick={() => {
              toast.promise(() => mutateAsync({}), {
                loading: "Updating availability...",
                success: extract_message,
                error: extract_message,
              });
            }}
            type="checkbox"
            className="toggle toggle-primary"
            checked={studio.isAvailable}
            aria-label="Toggle availability"
          />
        </div>
        <p className="text-base-content/80 text-sm">
          Location: {studio.location}
        </p>
        <p className="text-base font-semibold">
          Hourly Rate: ${studio.hourlyRate}
        </p>
        <div className="card-actions justify-end mt-2">
          <Link
            to={"/app/studio/" + studio.id}
            className="btn btn-sm btn-accent"
          >
            View Availability
          </Link>
          <button
            className="btn btn-sm btn-info"
            onClick={() => {
              showModal();
            }}
            disabled={edit_mutation.isPending}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={() => {
              toast.promise(delete_mutation.mutateAsync, {
                loading: "Deleting..." + studio.name,
                success: extract_message,
                error: extract_message,
              });
            }}
            disabled={delete_mutation.isPending}
          >
            Delete
          </button>
        </div>
      </div>
      <Modal ref={ref}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold">Edit Studio</h2>
          <SimpleInput {...register("name")} label="Name" />
          <SimpleInput {...register("location")} label="Location" />
          <SimpleInput
            {...register("hourlyRate")}
            type="number"
            label="Hourly Rate"
          />
          <button className="btn btn-primary btn-block">Submit</button>
        </form>
      </Modal>
    </li>
  );
};
