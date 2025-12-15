import type { ApiResponse } from "@/api/apiClient";
import apiClient from "@/api/apiClient";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleInput from "@/components/SimpleInput";
import SimpleSearch from "@/components/SimpleSearch";
import SimpleTitle from "@/components/SimpleTitle";
import { extract_message } from "@/helpers/auth";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import { useModal } from "@/store/modals";
import { usePagination } from "@/store/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Utensils, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function index() {
  const props = usePagination();
  const searchProps = useSearchParams();
  const query = useQuery<ApiResponse<any[]>>({
    queryKey: ["movie-snacks", props.page, searchProps.search],
    queryFn: async () => {
      let resp = await apiClient.get("admins/movies/snacks", {
        params: remove_nulls({
          page: props.page,
          limit: 20,
          search: searchProps.search,
        }),
      });
      return resp.data;
    },
  });
  const { register, handleSubmit } = useForm();
  const add_new_snack = async (snack) => {
    let response = await apiClient.post("admins/movies/snacks", snack);
    return response.data;
  };
  const modal = useModal();
  const mutate = useMutation({
    mutationFn: async (fn: Function) => await fn(),
    onSuccess: (data) => {
      query.refetch();
      modal.closeModal();
    },
  });
  return (
    <>
      <SimpleHeader title="Snacks">
        <button
          className="btn btn-primary"
          onClick={() => {
            modal.showModal();
          }}
        >
          Add Snack
        </button>
      </SimpleHeader>

      <SimpleSearch props={searchProps} />
      <SuspensePageLayout
        query={query}
        title={"Snacks"}
        showTitle={false}
        headerActions={
          <>
            <button
              className="btn btn-primary"
              onClick={() => {
                modal.showModal();
              }}
            >
              Add Snack
            </button>
          </>
        }
      >
        {(data) => {
          return (
            <>
              <Modal ref={modal.ref}>
                <form
                  className="space-y-4"
                  onSubmit={handleSubmit((data) => {
                    toast.promise(
                      mutate.mutateAsync(() => add_new_snack(data)),
                      {
                        loading: "Adding...",
                        success: "Added!",
                        error: extract_message,
                      },
                    );
                  })}
                >
                  <h2 className="text-2xl">Add New Snack</h2>
                  <SimpleInput {...register("name")} label="Name" />
                  <SimpleInput {...register("price")} label="Price" />
                  <button className="btn btn-primary float-right">
                    Submit
                  </button>
                </form>
              </Modal>
              <ul className="menu w-full  rounded-box p-0">
                {data.payload.map((snack: any) => (
                  <li key={snack.id} className="mb-2">
                    <a
                      href="#"
                      className="flex items-center justify-between bg-base-100 p-2 ring ring-current/10"
                    >
                      <SnackCard snack={snack} refetch={query.refetch} />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          );
        }}
      </SuspensePageLayout>
    </>
  );
}

const SnackCard = ({
  snack,
  refetch,
}: {
  snack: { name: string; id: number; price: number };
  refetch?: () => void;
}) => {
  const mutate = useMutation({
    mutationFn: async (fn: Function) => await fn(),
    onSuccess: (data) => {
      console.log(refetch);
      refetch();
      modal.closeModal();
    },
  });
  const delete_combo = async () => {
    const resp = await apiClient.delete(`admins/movies/snacks/${snack.id}`);
    return resp.data;
  };
  const edit_combo = async (data: any) => {
    const resp = await apiClient.put(`admins/movies/snacks/${snack.id}`, {
      ...data,
    });
    return resp.data;
  };
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: snack.name,
      price: snack.price,
    },
  });
  const modal = useModal();
  return (
    <>
      <Modal ref={modal.ref}>
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            toast.promise(
              mutate.mutateAsync(() => edit_combo(data)),
              {
                loading: "Editing...",
                success: "Edited!",
                error: "Failed to edit",
              },
            );
          })}
        >
          <SimpleInput {...register("name")} label="Name" />
          <SimpleInput {...register("price")} label="Price" />
          <button className="btn btn-primary float-right">Submit</button>
        </form>
      </Modal>
      <div className="flex w-full flex-1 ">
        <div>
          {" "}
          <div className="flex items-center gap-2">
            <Utensils size={20} />
            <div className="font-medium">{snack.name}</div>
          </div>
          <div className="flex items-center gap-1">
            {/*<DollarSign size={16} />*/}
            <div>{snack.price}</div>
          </div>
        </div>

        <div className="ml-auto space-x-2">
          <button
            disabled={mutate.isPending}
            className="btn btn-error btn-xs"
            onClick={() => {
              toast.promise(mutate.mutateAsync(delete_combo), {
                loading: "Deleting...",
                success: "Deleted!",
                error: extract_message,
              });
            }}
          >
            Delete
          </button>
          <button
            disabled={mutate.isPending}
            className="btn btn-accent btn-xs"
            onClick={() => {
              modal.showModal();
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
};
