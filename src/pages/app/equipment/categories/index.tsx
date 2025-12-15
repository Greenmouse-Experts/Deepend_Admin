import apiClient, { type ApiResponse } from "@/api/apiClient";
import { uploadSingleToCloudinary, uploadToCloudinary } from "@/api/cloud";
import type { EquipmentCategory } from "@/api/types";
import Modal from "@/components/dialogs-modals/SimpleModal";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SelectImage from "@/components/SelectImage";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleInput from "@/components/SimpleInput";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleSearch from "@/components/SimpleSearch";
import SimpleTextArea from "@/components/SimpleTextArea";
import ImageUpload from "@/components/uploaders/ImageUpload";
import { extract_message } from "@/helpers/auth";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import { useModal } from "@/store/modals";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function index() {
  const page = usePagination();
  const searchProps = useSearchParams();
  const query = useQuery<ApiResponse<EquipmentCategory[]>>({
    queryKey: ["equipment-category", page.page, searchProps.search],
    queryFn: async () => {
      let resp = await apiClient.get("admins/equipments/categories", {
        params: remove_nulls({
          page: page.page,
          search: searchProps.search,
        }),
      });
      return resp.data;
    },
  });
  const { register, handleSubmit, reset } =
    useForm<Partial<EquipmentCategory>>();
  const form = useForm<Partial<EquipmentCategory>>();
  const modal = useModal();
  const new_modal = useModal();
  const [image, setImage] = useState<File | null>();
  return (
    <>
      <SimpleHeader title={"Equipment Categories"}>
        <>
          <button
            className="btn btn-primary"
            onClick={() => new_modal.showModal()}
          >
            Add New Category
          </button>
        </>
      </SimpleHeader>
      <SimpleSearch props={searchProps} />

      <SuspensePageLayout
        showTitle={false}
        query={query}
        title={"Equipment Categories"}
        headerActions={
          <>
            <button
              className="btn btn-primary"
              onClick={() => new_modal.showModal()}
            >
              Add New Category
            </button>
          </>
        }
      >
        <Modal ref={new_modal.ref}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((data) => {
              toast.promise(
                async () => {
                  if (image) {
                    let image_obj = await uploadSingleToCloudinary(image);
                    data["icon"] = image_obj.url;
                    data["iconPath"] = image_obj.path;
                  }
                  let resp = await apiClient.post(
                    "admins/equipments/categories/",
                    {
                      categories: [
                        {
                          name: data.name,
                          icon: data.icon,
                          iconPath: data.iconPath,
                          description: data.description,
                        },
                      ],
                    },
                  );
                  query.refetch();
                  new_modal.closeModal();
                  setImage(null);
                  return resp.data;
                },
                {
                  loading: "adding...",
                  success: extract_message,
                  error: extract_message,
                },
              );
            })}
          >
            <h2>Edit Category</h2>
            <SelectImage image={image} setImage={setImage} />
            <SimpleInput {...form.register("name")} label="Name" />
            <SimpleTextArea
              {...form.register("description")}
              label="Description"
            />
            <button className="btn btn-primary btn-block">
              Update Category
            </button>
          </form>
        </Modal>
        <Modal ref={modal.ref}>
          <form
            className="space-y-4"
            onSubmit={handleSubmit((data) => {
              toast.promise(
                async () => {
                  if (image) {
                    let image_obj = await uploadSingleToCloudinary(image);
                    data["icon"] = image_obj.url;
                    data["iconPath"] = image_obj.path;
                  }
                  let resp = await apiClient.put(
                    "admins/equipments/categories/" + data.id,
                    {
                      name: data.name,
                      icon: data.icon,
                      iconPath: data.iconPath,
                      description: data.description,
                    },
                  );
                  query.refetch();
                  modal.closeModal();
                  return resp.data;
                },
                {
                  loading: "Updating category...",
                  success: "Category updated successfully!",
                  error: extract_message,
                },
              );
            })}
          >
            <h2>Edit Category</h2>
            <SelectImage image={image} setImage={setImage} />
            <SimpleInput {...register("name")} label="Name" />
            <SimpleTextArea {...register("description")} label="Description" />
            <button className="btn btn-primary btn-block">
              Update Category
            </button>
          </form>
        </Modal>
        <ul className="list-disc pl-5 space-y-4">
          {query.data?.payload?.map((category) => (
            <li key={category.id} className="mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {category.iconPath && (
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  <div>
                    <div className="font-bold text-lg">{category.name}</div>
                    <div className="text-sm text-base-content/80">
                      {category.description}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => {
                      reset(category);
                      modal.showModal();
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => {
                      toast.promise(
                        apiClient
                          .delete("admins/equipments/categories/" + category.id)
                          .then((err) => {
                            query.refetch();
                            return err;
                          }),
                        {
                          loading: "Deleting...",
                          success: "Deleted!",
                          error: extract_message,
                        },
                      );
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <SimplePaginator {...page} />
        </div>
      </SuspensePageLayout>
    </>
  );
}
