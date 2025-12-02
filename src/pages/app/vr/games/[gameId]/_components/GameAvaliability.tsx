import apiClient from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export default function GameAvail({ gameId }: { gameId: string }) {
  const query = useQuery({
    queryKey: ["vr-game-avail", gameId],
    queryFn: async () => {
      const response = await apiClient(`admin/vr/games/${gameId}/availability`);
      const data = await response.json();
      return data;
    },
  });
  return <div></div>;
}
