import type { ApiResponse } from "@/api/apiClient";
import apiClient from "@/api/apiClient";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import SimplePaginator from "@/components/SimplePaginator";
import { usePagination } from "@/store/pagination";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import VRCategoryCard from "./_component/VRCategoryCard";
import { useModal } from "@/store/modals";
import Modal from "@/components/dialogs-modals/SimpleModal";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SimpleInput from "@/components/SimpleInput";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleSearch from "@/components/SimpleSearch";
import { remove_nulls, useSearchParams } from "@/helpers/client";

export default function index() {
  const props = usePagination();
  const searchProps = useSearchParams();

  const query = useQuery<ApiResponse>({
    queryKey: ["vr-categories", props.page, searchProps.search],
    queryFn: async () => {
      let resp = await apiClient.get("admins/vrgames/categories", {
        params: remove_nulls({
          page: props.page,
          limit: 20,
          search: searchProps.search,
        }),
      });
      return resp.data;
    },
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: any) => {
      let resp = await apiClient.post("admins/vrgames/categories", data);
      return resp.data;
    },
    onSuccess: () => {
      modal.closeModal();
      query.refetch();
    },
  });

  const { register, handleSubmit } = useForm();
  const modal = useModal();
  return (
    <>
      <SuspensePageLayout
        query={query}
        title={"VR Categories"}
        headerActions={
          <>
            <button
              className="btn btn-primary"
              onClick={() => modal.showModal()}
            >
              Add New Category
            </button>
          </>
        }
      >
        <SimpleSearch props={searchProps} />

        <ul className="space-y-4">
          {query.data.payload.map((item, index) => {
            return (
              <VRCategoryCard item={item} key={index} refetch={query.refetch} />
            );
          })}
        </ul>
        <div className="mt-4">
          <SimplePaginator {...props} />
        </div>
      </SuspensePageLayout>
      <Modal ref={modal.ref}>
        <form
          action=""
          className="space-y-4 py-4"
          onSubmit={handleSubmit((data) => {
            toast.promise(mutateAsync(data), {
              success: "Category updated successfully",
              error: "Failed to update category",
              loading: "Adding Category...",
            });
          })}
        >
          <h2>Edit Vr Category</h2>
          <SimpleInput label="Name" {...register("name")} />
          <SimpleInput label="Description" {...register("description")} />
          <button
            disabled={isPending}
            type="submit"
            className="btn btn-primary btn-block"
          >
            Save
          </button>
        </form>
      </Modal>
    </>
  );
}
