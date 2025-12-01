import apiClient, { type ApiResponse } from "@/api/apiClient";
import ModalSelector from "@/components/dialogs-modals/ModalSelector";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SuspenseCompLayout from "@/components/layout/SuspenseComponentLayout";
import { extract_message } from "@/helpers/auth";
import useSelect from "@/helpers/selectors";
import { useModal } from "@/store/modals";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Snacks({
  id,
  refetch,
}: {
  id: string;
  refetch?: () => void;
}) {
  const query = useQuery<ApiResponse<any[]>>({
    queryKey: ["snacks", id],
    queryFn: async () => {
      const response = await apiClient(`admins/movies/${id}/snacks`);
      return response.data;
    },
  });
  const modal = useModal();
  const props = useSelect();
  const mutate = useMutation({
    mutationFn: async () => {
      let resp = await apiClient.post(`admins/movies/${id}/snacks`, {
        snackIds: props.mapped,
      });
      return resp.data;
    },
    onSuccess: () => {
      modal.closeModal();
      // refetch();
      query.refetch();
    },
  });
  return (
    <SuspenseCompLayout query={query}>
      {(data) => {
        return (
          <>
            <Modal ref={modal.ref}>
              <ModalSelector
                render={(item) => {
                  const isSelected = props.selected && props.selected[item.id];

                  return (
                    <>
                      <span
                        onClick={() => {
                          if (isSelected) {
                            props.remove(item.id);
                          } else {
                            props.add_to(item);
                          }
                        }}
                        className={`p-2 text-sm btn btn-sm btn-block btn-ghost text-left flex justify-start ${
                          isSelected ? "btn-accent" : ""
                        }`}
                      >
                        {item.name}
                        {isSelected && (
                          <span className="badge badge-primary badge-sm ml-2">
                            Selected
                          </span>
                        )}
                      </span>
                    </>
                  );
                }}
                route="admins/movies/snacks"
              />
              <button
                onClick={() => {
                  toast.promise(mutate.mutateAsync, {
                    loading: "loading",
                    success: extract_message,
                    error: extract_message,
                  });
                }}
                disabled={mutate.isPending}
                className="btn btn-primary btn-sm float-right"
              >
                Add to Cinema
              </button>
            </Modal>
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold fieldset-label ">Snacks</h2>
                <div
                  className="btn btn-primary"
                  onClick={() => modal.showModal()}
                >
                  Add Snack
                </div>
              </div>
              <ul className="space-y-3 p-4 bg-base-300 w-full">
                {data?.payload?.map((snack) => {
                  return (
                    <>
                      <li>
                        <a>
                          <SnackCard
                            {...(snack as any)}
                            movieId={id}
                            refetch={query.refetch}
                          />
                        </a>
                      </li>
                    </>
                  );
                })}
              </ul>
            </section>
          </>
        );
      }}
    </SuspenseCompLayout>
  );
}

const SnackCard = (snack: {
  id: string;
  name: string;
  price: number;
  movieId: string;
  refetch?: () => any;
}) => {
  const mutation = useMutation({
    mutationFn: async () => {
      let resp = await apiClient.delete(
        `admins/movies/${snack.movieId}/snacks`,
        {
          data: { snackIds: [snack.id] },
        },
      );
      return resp.data;
    },
    onSuccess: () => {
      console.log;
      toast.success("Snack removed successfully!");
      snack.refetch?.();
    },
  });

  return (
    <div className="flex items-center justify-between w-full ">
      <div>
        <div className="font-semibold">{snack.name}</div>
        <div className="text-sm text-gray-500">Price: ${snack.price}</div>
      </div>
      <button
        onClick={() => {
          toast.promise(mutation.mutateAsync(), {
            loading: "Removing snack...",
            success: "Snack removed!",
            error: "Failed to remove snack",
          });
        }}
        disabled={mutation.isPending}
        className="btn btn-error btn-sm"
      >
        Delete
      </button>
    </div>
  );
};
