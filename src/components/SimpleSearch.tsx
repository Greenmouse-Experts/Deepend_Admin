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
      className="join my-2"
      onSubmit={form.handleSubmit((data) => {
        const search = data.search.trim();
        props.setSearch(search);
      })}
    >
      <input
        type="text"
        {...form.register("search")}
        className="input join-item"
        placeholder="search"
      />
      <button className="btn btn-primary join-item">
        <Search />
      </button>
    </form>
  );
}
