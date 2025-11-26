import type { ApiResponse } from "@/api/apiClient";
import apiClient from "@/api/apiClient";
import type { Showtime } from "@/api/types";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleInput from "@/components/SimpleInput";
import SimpleTitle from "@/components/SimpleTitle";
import { extract_message } from "@/helpers/auth";
import { useModal } from "@/store/modals";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ShowTimes({ id }: { id: string }) {
  const query = useQuery<ApiResponse<Showtime[]>>({
    queryKey: ["movie-showtime", id],
    queryFn: async () => {
      let resp = await apiClient.get(
        `admins/movies/${id}/showtimes?page=1&limit=10`,
      );
      return resp.data;
    },
  });

  return (
    <>
      <SuspensePageLayout query={query} showTitle={false}>
        {(data: ApiResponse<Showtime[]>) => {
          const showtimes = data.payload;
          //this isnt right, whoever updtes this later,im sorry

          return (
            <div className="space-y-4">
              <div className="text-2xl font-bold fieldset-label">Showtimes</div>
              <ul className="menu w-full bg-base-300 rounded-box space-y-2">
                {showtimes.map((showtime) => {
                  return (
                    <>
                      <ShowtimeCard showtime={showtime} query={query} />
                    </>
                  );
                })}
              </ul>
            </div>
          );
        }}
      </SuspensePageLayout>
    </>
  );
}

const ShowtimeCard = ({
  showtime,
  query,
}: {
  showtime: Showtime;
  query: any;
}) => {
  const mutate = useMutation({
    mutationFn: (fn: Function) => fn(),
    onSuccess: () => {
      modal.closeModal();

      query.refetch();
    },
  });
  const modal = useModal();
  const form = useForm({
    defaultValues: showtime,
  });

  const remove = async (id: string | number) => {
    let resp = await apiClient.delete(`admins/movies/showtimes/${id}`);
    return resp.data;
  };
  const toggleAvailable = async (id: string | number) => {
    let resp = await apiClient.put(`admins/movies/showtimes/${id}/available`);
    return resp.data;
  };
  const toggleUnAvailable = async (id: string | number) => {
    let resp = await apiClient.put(`admins/movies/showtimes/${id}/unavailable`);
    return resp.data;
  };
  const toggleAvailability = async (showtime: Showtime) => {
    if (showtime.isAvailable) {
      return await toggleUnAvailable(showtime.id);
    } else {
      return await toggleAvailable(showtime.id);
    }
  };
  const id = showtime.id;
  const updateShowtime = async (showtime: Showtime) => {
    let resp = await apiClient.put(`admins/movies/showtimes/${id}`, showtime);
    return resp.data;
  };

  return (
    <>
      <Modal ref={modal.ref}>
        <form
          action=""
          onSubmit={form.handleSubmit((data) => {
            toast.promise(
              //@ts-ignore
              mutate.mutateAsync(() =>
                updateShowtime({
                  cinemaHallId: data.cinemaHallId,
                  movieId: data.movieId,
                  showDate: data.showDate,
                  showtime: data.showtime.split(":").slice(0, 2).join(":"),
                }),
              ),
              {
                loading: "Updating...",
                success: "Showtime updated!",
                error: extract_message,
              },
            );
          })}
          className="space-y-4 pt-8"
        >
          <SimpleTitle title="Edit-showtime" />
          <SimpleInput
            label="Ticket Price"
            {...form.register("ticketPrice")}
            type="number"
          />
          <SimpleInput
            label="Showtime"
            {...form.register("showtime")}
            type="time"
          />
          <SimpleInput
            label="Show Date"
            {...form.register("showDate")}
            type="date"
          />
          <button className="btn btn-primary btn-block">Edit</button>
        </form>
      </Modal>
      <li key={showtime.id} className="flex border-b py-2 border-current/20">
        <a className="flex-1">
          <div className="space-y-2 dropdown ">
            <span className="flex items-center">
              Price:
              <DollarSign className="h-5 w-5 mr-2" />
              {showtime.ticketPrice}
            </span>
            <div className="label-text">ShowTime: {showtime.showtime}</div>
            <div className="label-text">Date: {showtime.showDate}</div>
            <div>
              <div
                className={`badge ${
                  showtime.isAvailable ? "badge-success" : "badge-error"
                }`}
              >
                {showtime.isAvailable ? "Available" : "Not Available"}
              </div>
            </div>
          </div>
          {/*<>{JSON.stringify(showtime, null, 2)}</>*/}
        </a>
        <div className=" hover:bg-transparent space-x-1 ml-auto w-fit">
          <button
            disabled={mutate.isPending}
            className="btn btn-error btn-xs"
            onClick={() => {
              toast.promise(
                mutate.mutateAsync(() => remove(showtime.id)),
                {
                  loading: "Removing...",
                  success: "Removed!",
                  error: extract_message,
                },
              );
            }}
          >
            Remove
          </button>
          <button
            disabled={mutate.isPending}
            className={`btn ${!showtime.isAvailable ? "btn-success" : "btn-accent"} btn-xs`}
            onClick={() => {
              toast.promise(
                mutate.mutateAsync(() => toggleAvailability(showtime)),
                {
                  loading: "Toggling...",
                  success: "Toggled!",
                  error: extract_message,
                },
              );
            }}
          >
            Make {showtime.isAvailable ? "Unavailable" : "Available"}
          </button>
          <button
            disabled={mutate.isPending}
            className="btn btn-info btn-xs"
            onClick={() => {
              form.reset(showtime);

              modal.showModal();
              // console.log(showtime);
            }}
          >
            Edit
          </button>
        </div>
      </li>
    </>
  );
};
