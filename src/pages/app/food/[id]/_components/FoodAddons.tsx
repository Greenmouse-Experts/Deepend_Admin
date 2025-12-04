import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { FoodAddon } from "@/api/types";
import ModalSelector from "@/components/dialogs-modals/ModalSelector";
import Modal from "@/components/dialogs-modals/SimpleModal";
import EmptyList from "@/components/EmptyList";
import SuspenseCompLayout from "@/components/layout/SuspenseComponentLayout";
import SimpleTitle from "@/components/SimpleTitle";
import CustomTable from "@/components/tables/CustomTable";
import { extract_message } from "@/helpers/auth";
import useSelect from "@/helpers/selectors";
import { useModal } from "@/store/modals";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FoodAddons({ id }: { id: string }) {
  let query = useQuery({
    queryKey: ["food-addon-association", id],
    queryFn: async () => {
      let resp = await apiClient.get(`admins/foods/${id}/addons`);
      return resp.data;
    },
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
  ];

  const remove_addon = async (addonId) => {
    let resp = await apiClient.delete(`admins/foods/${id}/addons/items`, {
      data: {
        addonItemIds: [addonId],
      },
    });
    query.refetch();
    return resp.data;
  };

  // const add_addon = async()=>
  //   {
  //     le
  //   }
  const actions = [
    {
      key: "remove",
      label: "Remove",
      action: (item: FoodAddon) => {
        toast.promise(remove_addon(item.id), {
          loading: "Removing addon...",
          success: "Addon removed successfully",
          error: extract_message,
        });
        console.log("Remove addon:", item);
      },
    },
  ];
  const modal = useModal();
  return (
    <section>
      <Modal ref={modal.ref} title="Add Addon">
        <SelectAddon refetch={query.refetch} modalProps={modal}></SelectAddon>
      </Modal>
      <div className="flex gap-2 ">
        <SimpleTitle title="Food Addons" />
        <button
          className="btn btn-primary ml-auto"
          onClick={() => {
            modal.showModal();
          }}
        >
          Add Addon
        </button>
      </div>
      <SuspenseCompLayout query={query}>
        {(data: ApiResponse<FoodAddon[]>) => {
          const payload = data.payload;
          return (
            <div>
              <CustomTable data={payload} columns={columns} actions={actions} />
              <EmptyList list={payload} />
            </div>
          );
        }}
      </SuspenseCompLayout>
    </section>
  );
}

const SelectAddon = ({
  modalProps,
  refetch,
  selectProps,
}: {
  modalProps: ReturnType<typeof useModal>;
  selectProps?: ReturnType<typeof useSelect>;
  refetch: () => void;
}) => {
  const [id, setid] = useState<string | null>(null);
  const query = useQuery<ApiResponse<FoodAddon[]>>({
    queryKey: ["foodAddons"],
    queryFn: async () => {
      const response = await apiClient.get("/admins/foods/addons/categories", {
        params: {
          limit: 100,
        },
      });
      return response.data;
    },
  });

  return (
    <SuspenseCompLayout query={query}>
      {(data: ApiResponse<FoodAddon[]>) => {
        let resp = data.payload;
        return (
          <section>
            <div className="flex flex-col">
              <label htmlFor="" className="fieldset-label mb-2">
                Category
              </label>
              <select
                onChange={(e) => setid(e.target.value)}
                name=""
                id=" "
                className="select w-full"
                defaultValue={0}
              >
                {resp.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
                <option value={0}>None</option>
              </select>
            </div>
            <SubCategory id={id} modalProps={modalProps} refetch={refetch} />
          </section>
        );
      }}
    </SuspenseCompLayout>
  );
};

const SubCategory = ({
  id,
  modalProps,
  refetch,
}: {
  id: string | null;
  modalProps: ReturnType<typeof useModal>;
  refetch: () => void;
}) => {
  const categoryId = id;
  const query = useQuery<
    ApiResponse<
      { name: string; id: string; description: string; price: number }[]
    >
  >({
    queryKey: ["addon-items", categoryId],
    queryFn: async () => {
      let resp = await apiClient.get(
        `admins/foods/addons/categories/${categoryId}/items`,
        {
          params: {
            page: 1,
            limit: 100,
          },
        },
      );
      return resp.data;
    },
    enabled: !!categoryId,
  });
  const { id: foodID } = useParams({
    strict: false,
  });
  const select = useSelect();

  const mutate = useMutation({
    mutationFn: (fn: any) => fn(),
    onSuccess: () => {
      modalProps.closeModal();
      refetch();
    },
  });
  // useEffect(() => {
  //   select.clear();
  // }, [id]);
  const add_to = async () => {
    let resp = await apiClient.post(`admins/foods/${foodID}/addons`, {
      addons: [
        ...selected_items.map((item: any) => ({
          addonCategoryId: id, // Assuming 'id' from SubCategory scope is the categoryId
          addonItemId: item.id,
        })),
        // ...select.mapped.map((item) => ({
        //   addonCategoryId: id,
        //   addonItemId: item,
        // })),
      ],
    });
    return resp;
  };
  const selected_items = Object.values(select.selected);
  return (
    <SuspenseCompLayout query={query}>
      {(data) => {
        let resp = data.payload;
        return (
          <section className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              {selected_items.map((item) => (
                <div key={item.id} className="badge badge-sm badge-primary">
                  {item.name}
                </div>
              ))}
            </div>
            {/*{foodID}*/}
            <ul className="menu w-full space-y-2">
              <label htmlFor="" className="fieldset-label mb-2">
                Sub Category
              </label>
              {resp.map((item) => {
                return (
                  <li
                    key={item.id}
                    className=" w-full"
                    onClick={() => {
                      if (select.selected && select.selected[item.id]) {
                        select.remove(item.id);
                      } else {
                        select.add_to(item);
                      }
                    }}
                  >
                    <a>
                      {item.name}{" "}
                      {select.selected && select.selected[item.id] && (
                        <span className="badge badge-sm badge-primary">
                          selected
                        </span>
                      )}
                    </a>{" "}
                  </li>
                );
              })}
            </ul>
            <button
              onClick={() => {
                if (select.mapped.length < 0) {
                  return toast.error("Please select an addon");
                }
                toast.promise(mutate.mutateAsync(add_to), {
                  loading: "loading",
                  error: extract_message,
                  success: "Addon added successfully",
                });
              }}
              className="btn btn-primary btn-sm ml-auto"
            >
              Add Addon
            </button>
          </section>
        );
      }}
    </SuspenseCompLayout>
  );
};
