import apiClient from "@/api/apiClient";
import type { MovieCinema } from "@/api/types";
import { extract_message } from "@/helpers/auth";
import UserBook from "@/pages/app/bookings/_components/UserBook";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { toast } from "sonner";

export default function MovieCard({
  item,
  refetch,
}: {
  item: MovieCinema;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (fn: () => Promise<void>) => fn(),
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = async () => {
    toast.promise(
      mutation.mutateAsync(async () => {
        await apiClient.delete("admins/movies/" + item.id);
      }),
      {
        loading: "Deleting movie...",
        success: () => {
          // Optionally, you might want to invalidate queries or refresh the list here
          return "Movie deleted successfully!";
        },
        error: extract_message,
      },
    );
  };

  const handleView = () => {
    navigate({ to: `/app/cinema/movies/${item.id}` });
  };

  return (
    <div className="card bg-base-100 shadow-xl h-full flex flex-col">
      <figure className="relative w-full h-64 overflow-hidden">
        <img
          src={item.posterUrl}
          alt={item.title}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body flex flex-col justify-between flex-grow">
        <h2 className="card-title text-lg font-bold">
          {item.title}
          <div className="badge badge-secondary">{item.ageRating}+</div>
        </h2>
        <p className="text-sm text-base-content flex-grow line-clamp-3">
          {item.description}
        </p>
        <div className="card-actions justify-end mt-4 flex-wrap">
          {item.genres.map((genre) => (
            <div key={genre.id} className="badge badge-outline badge-sm">
              {genre.name}
            </div>
          ))}
        </div>
        {/*<div className=""></div>*/}
        <div className="dropdown dropdown-top  mt-4">
          <div tabIndex={0} role="button" className="btn btn-sm  btn-primary">
            <Menu /> Menu
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1]  ring-current/10 ring menu p-2 shadow bg-base-100 rounded-box w-32"
          >
            <li>
              <button onClick={handleView}>View</button>
            </li>
            <li>
              <button
                onClick={() =>
                  navigate({
                    to: `/app/cinema/movies/${item.id}/edit`,
                  })
                }
              >
                Edit
              </button>
            </li>

            <li>
              <button onClick={handleDelete} className="text-error">
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
