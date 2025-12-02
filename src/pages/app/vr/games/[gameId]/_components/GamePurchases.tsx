import apiClient from "@/api/apiClient";
import EmptyList from "@/components/EmptyList";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import SuspenseCompLayout from "@/components/layout/SuspenseComponentLayout";
import { useQuery } from "@tanstack/react-query";

export default function GamePurchases({ gameId }: { gameId: string }) {
  const query = useQuery({
    queryKey: ["game-purhases", gameId],
    queryFn: async () => {
      let resp = await apiClient.get("admins/vrgames/purchases");
      return resp.data;
    },
    enabled: !!gameId,
  });
  return (
    <section className="py-2 my-4">
      <h2>VR Game Purchaes</h2>
      <div>
        <SuspenseCompLayout query={query}>
          {(data) => {
            const payload = data.payload;
            return (
              <>
                <EmptyList list={payload} />
              </>
            );
          }}
        </SuspenseCompLayout>
      </div>
    </section>
  );
}
