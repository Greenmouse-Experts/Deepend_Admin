import apiClient from "@/api/apiClient";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleInput from "@/components/SimpleInput";
import { extract_message } from "@/helpers/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function index() {
  const nav = useNavigate();
  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      countryId: 1,
    },
  });
  const { register } = form;
  const mutate = useMutation({
    mutationFn: async (data: any) => {
      const resp = await apiClient.post("/admins/cinemas", data);
      return resp.data;
    },
    onSuccess: () => {
      nav({ to: "/app/cinema" });
    },
  });
  return (
    <>
      <SimpleHeader title={"New Cinema"}></SimpleHeader>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((data) => {
          toast.promise(mutate.mutateAsync(data), {
            loading: "Creating cinema...",
            success: "Cinema created successfully!",
            error: extract_message,
          });
        })}
      >
        <SimpleInput label="Name" {...register("name", { required: true })} />
        <SimpleInput
          label="Address"
          {...register("address", { required: true })}
        />
        <SimpleInput label="City" {...register("city", { required: true })} />
        <SimpleInput label="State" {...register("state", { required: true })} />
        <SimpleInput
          label="Country"
          type="number"
          {...register("countryId", { required: true })}
        />
        <div className="card-actions">
          <button
            disabled={mutate.isPending}
            className="btn btn-primary ml-auto"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
