import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { MovieObject } from "@/api/types";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import ShowTimes from "../_components/Showtimes";
import Snacks from "../_components/Snacks";
import { useModal } from "@/store/modals";
import useSelect from "@/helpers/selectors";
import Modal from "@/components/dialogs-modals/SimpleModal";
import ModalSelector from "@/components/dialogs-modals/ModalSelector";
import { toast } from "sonner";
import { extract_message } from "@/helpers/auth";
import SimpleTitle from "@/components/SimpleTitle";
import { XIcon } from "lucide-react";

export default function index() {
  const { id } = useParams({
    strict: false,
  });
  const query = useQuery<ApiResponse<MovieObject>>({
    queryKey: ["movie", id],
    queryFn: async () => {
      let resp = await apiClient.get("admins/movies/" + id);
      return resp.data;
    },
  });
  const mutate = useMutation({
    mutationFn: (fn: Function) => fn(),
    onSuccess: () => {
      query.refetch();
      modal.closeModal();
      props.setSelected({});
    },
  });
  const props = useSelect();
  const modal = useModal();
  const add_genre = async () => {
    let resp = await apiClient.post("admins/movies/" + id + "/genres", {
      genreIds: props.mapped,
    });
    return resp.data;
  };
  const remove_genre = async ({ genreId }: { genreId: number | string }) => {
    let resp = await apiClient.delete("admins/movies/" + id + "/genres", {
      data: {
        genreIds: [genreId],
      },
    });
    return resp.data;
  };
  return (
    <>
      <Modal ref={modal.ref}>
        <SimpleTitle title="Add Genres" />
        <ModalSelector
          route="admins/movies/genres"
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
        ></ModalSelector>
        <button
          onClick={() => {
            toast.promise(mutate.mutateAsync(add_genre), {
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
      <SuspensePageLayout
        query={query}
        title={query?.data?.payload?.title}
        headerActions={
          <>
            <button
              className="btn btn-primary"
              onClick={() => modal.showModal()}
            >
              Add Genre
            </button>
          </>
        }
      >
        {(data: ApiResponse<MovieObject>) => {
          const movie = data?.payload;
          return (
            <div className="isolate">
              <div className="h-[100px] flex -z-10">
                <img
                  src={movie.posterUrl}
                  className="flex-1 object-cover blur-xl -z-10"
                  alt=""
                />
              </div>
              <div className="-mt-4 z-20 flex flex-col md:flex-row gap-2">
                <div className="flex-1 max-w-2xs mx-auto md:mx-0">
                  <img
                    src={movie.posterUrl}
                    className="max-w-2xs aspect-[9/12]"
                    alt=""
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-2xl font-bold">{movie.title}</h2>
                  <p>{movie.description}</p>
                  <p>
                    <span>Duration: </span>
                    {movie.durationMinutes} minutes
                  </p>
                  <section className="space-y-2">
                    <h2>Genres:</h2>
                    <div className="flex flex-wrap gap-2">
                      {movie?.genres?.map((item) => {
                        return (
                          <div
                            key={item.id}
                            className="badge badge-accent badge-sm gap-2 pr-0"
                          >
                            {item.name}
                            <button
                              onClick={() => {
                                toast.promise(
                                  mutate.mutateAsync(() =>
                                    remove_genre({ genreId: item.id }),
                                  ),
                                  {
                                    loading: "Removing genre...",
                                    success: extract_message,
                                    error: extract_message,
                                  },
                                );
                              }}
                              className="btn btn-ghost btn-xs btn-circle text-white hover:bg-accent-focus"
                            >
                              <XIcon className="size-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                  <section className="space-y-2 mt-2">
                    <h2>Cast:</h2>
                    <p>{movie.cast}</p>
                  </section>
                </div>
              </div>
              <div>
                <Snacks refetch={query.refetch} id={id} />
                <ShowTimes id={id} cinemaId={movie.cinemaId}></ShowTimes>
              </div>
            </div>
          );
        }}
      </SuspensePageLayout>
    </>
  );
}
