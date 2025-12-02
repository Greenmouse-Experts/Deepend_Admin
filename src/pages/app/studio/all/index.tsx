import apiClient, { type ApiResponse } from "@/api/apiClient";
import { uploadToCloudinary } from "@/api/cloud";
import type { Studio } from "@/api/types";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SimpleCarousel from "@/components/SimpleCarousel";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleInput from "@/components/SimpleInput";
import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import UpdateImages from "@/components/UpdateImages";
import { extract_message } from "@/helpers/auth";
import { useImages } from "@/helpers/images";
import { useModal } from "@/store/modals";
import { usePagination } from "@/store/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function index() {
  const props = usePagination();
  const img_props = useImages();

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
      if (!img_props.newImages || img_props.newImages.length === 0) {
        throw new Error("No images selected");
      }
      const images = await uploadToCloudinary(img_props.newImages as any);
      data["images"] = images; // Changed imageUrls to images as per Studio interface
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
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <UpdateImages {...img_props} />
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
  const props = useImages(studio.imageUrls); // Initialize with existing images

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: studio.name,
      location: studio.location,
      hourlyRate: studio.hourlyRate,
    },
  });

  const edit_mutation = useMutation({
    mutationFn: async (data: Partial<Studio>) => {
      const imagesToUpload = props.newImages;
      if (imagesToUpload && imagesToUpload.length > 0) {
        const uploadedImages = await uploadToCloudinary(imagesToUpload as any);
        data.imageUrls = uploadedImages;
      }
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
      {
        <figure className="h-48">
          {studio.imageUrls.length > 0 ? (
            <SimpleCarousel>
              {props.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={studio.name}
                  className="w-full h-48 object-cover"
                />
              ))}
            </SimpleCarousel>
          ) : (
            <div className="h-full w-full grid place-items-center bg-base-300">
              No Images
            </div>
          )}
        </figure>
      }
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-lg font-bold">{studio.name}</h2>
          <div className="space-x-2 flex items-center text-xs">
            <span className="">Available</span>
            <input
              onClick={() => {
                toast.promise(() => mutateAsync({}), {
                  loading: "Updating availability...",
                  success: extract_message,
                  error: extract_message,
                });
              }}
              type="checkbox"
              className="toggle toggle-primary toggle-xs"
              checked={studio.isAvailable}
              aria-label="Toggle availability"
            />
          </div>
        </div>
        <p className="text-base-content/80 text-sm">
          Location: {studio.location}
        </p>
        <p className="text-base font-semibold">
          Hourly Rate: ${studio.hourlyRate}
        </p>
        <div className="card-actions justify-end mt-2">
          <div className="dropdown dropdown-end dropdown-top">
            <div tabIndex={0} role="button" className="btn btn-sm  btn-accent">
              Actions
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={"/app/studio/" + studio.id}>View Availability</Link>
              </li>
              <li>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    reset({
                      name: studio.name,
                      location: studio.location,
                      hourlyRate: studio.hourlyRate,
                    });
                    props.setPrev(studio.imageUrls); // Set existing images for the editor
                    showModal();
                  }}
                  disabled={edit_mutation.isPending}
                >
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="btn-ghost text-error"
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
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Modal ref={ref}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold">Edit Studio</h2>
          <UpdateImages {...props} />
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
