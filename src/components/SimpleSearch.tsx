import type { useSearchParams } from "@/helpers/client";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";

export default function SimpleSearch({
  props,
}: {
  props: ReturnType<typeof useSearchParams>;
}) {
  const form = useForm<{ search: string }>({
    defaultValues: {
      search: props.search,
    },
  });
  return (
    <form
      className="join  w-full p-4 bg-base-100 drop-shadow-md my-2 rounded-box"
      onSubmit={form.handleSubmit((data) => {
        const search = data.search.trim();
        props.setSearch(search || null);
      })}
    >
      <input
        type="text"
        {...form.register("search")}
        className="input join-item w-full"
        placeholder="Search here..."
      />
      <button className="btn btn-primary join-item">
        <Search />
      </button>
    </form>
  );
}
