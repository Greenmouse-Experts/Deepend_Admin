import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { FoodAddon } from "@/api/types";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleInput from "@/components/SimpleInput";
import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleSearch from "@/components/SimpleSearch";
import SimpleTextArea from "@/components/SimpleTextArea";
import { extract_message } from "@/helpers/auth";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import { useModal } from "@/store/modals";
import { usePagination } from "@/store/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function index() {
  const props = usePagination();
  const searchProps = useSearchParams();

  const query = useQuery<ApiResponse<FoodAddon[]>>({
    queryKey: ["foodAddons", props.page, searchProps.search],
    queryFn: async () => {
      const params = {
        page: props.page,
        limit: 10,
        search: searchProps.search,
      };

      const response = await apiClient.get("/admins/foods/addons/categories", {
        params: remove_nulls(params),
      });
      return response.data;
    },
  });
  if (query.isLoading) {
    return <SimpleLoader />;
  }

  return (
    <div>
      <SimpleHeader title={"Food Addon Categories"}>
        <Link to="/app/food/addons/new" className="btn btn-primary">
          Add New Addon
        </Link>
      </SimpleHeader>
      <div className="flex justify-end ">
        <SimpleSearch props={searchProps} />
      </div>
      <div className="">
        {query.data?.payload.map((addon, index) => (
          <AddonCard
            refetch={query.refetch}
            addon={addon}
            index={index}
            key={addon.id}
          />
        ))}
      </div>
      <div className="mt-2">
        <SimplePaginator {...props} />
      </div>
    </div>
  );
}

const AddonCard = ({
  addon,
  index,
  refetch,
}: {
  addon: FoodAddon;
  index: number;
  refetch: () => void;
}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      let resp = await apiClient.delete(
        "admins/foods/addons/categories/" + addon.id,
      );
      return resp.data;
    },
    onSuccess: () => {
      refetch();
    },
  });
  const edit = useMutation({
    mutationFn: async (data: any) => {
      let resp = await apiClient.put(
        "admins/foods/addons/categories/" + addon.id,
        data,
      );
      return resp.data;
    },
    onSuccess: () => {
      refetch();
      closeModal();
    },
  });
  const { ref, showModal, closeModal } = useModal();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: addon.name,
      description: addon.description,
    },
  });
  const onClick = () =>
    toast.promise(mutateAsync, {
      loading: "Deleting..." + addon.name,
      success: extract_message,
      error: extract_message,
    });

  const onSubmit = (data: { name: string; description: string }) => {
    toast.promise(() => edit.mutateAsync(data), {
      loading: "editing..." + addon.name,
      success: extract_message,
      error: extract_message,
    });
  };
  return (
    <div
      key={addon.id}
      className="card card-compact bg-base-100 shadow-xl mb-4"
    >
      <div className="card-body">
        <h2 className="card-title">
          {index + 1}. {addon.name}
        </h2>
        <p>{addon.description}</p>
        <div className="ml-auto space-x-2">
          <Link
            to={`/app/food/addons/item/$categoryId`}
            //@ts-ignore
            params={{ categoryId: String(addon.id) }}
            className="btn btn-accent"
            onClick={showModal}
            // disabled={isPending}
          >
            View Items
          </Link>
          <button
            className="btn btn-info"
            onClick={showModal}
            // disabled={isPending}
          >
            Edit
          </button>
          <button
            className="btn btn-error"
            onClick={onClick}
            disabled={isPending}
          >
            Delete
          </button>
        </div>
      </div>
      <Modal ref={ref}>
        <form action="" className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold">Edit Addon</h2>
          <SimpleInput {...register("name")} label="Name" />
          <SimpleTextArea {...register("description")} label="Description" />
          <button
            disabled={edit.isPending}
            className="btn btn-block btn-primary"
          >
            Update Addon
          </button>
        </form>
      </Modal>
    </div>
  );
};
