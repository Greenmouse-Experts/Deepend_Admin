import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { Dashstats } from "@/api/types";
import type { StatCardProps } from "@/components/StatCard";
import StatCard from "@/components/StatCard";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  ForkKnifeCrossedIcon,
  Verified,
  Hotel,
  Ticket,
  Gamepad2,
  Wrench,
  MonitorPlay,
} from "lucide-react";

export default function Stats() {
  const { data, isLoading } = useQuery<ApiResponse<Dashstats>>({
    queryKey: ["dash-stats"],
    queryFn: async () => {
      let resp = await apiClient.get("admins/dashboard/stats");
      return resp.data;
    },
  });

  const dashstats = data?.payload;

  const stats: StatCardProps[] = [
    {
      title: "Total Users",
      color: "#a16207",
      Icon: Users,
      subtitle: "Total registered users",
      main: isLoading ? "..." : (dashstats?.userTotal.toLocaleString() ?? "0"),
    },
    {
      title: "Food Subscribers",
      color: "green",
      Icon: ForkKnifeCrossedIcon,
      subtitle: "Users subscribed to food service",
      main: isLoading
        ? "..."
        : (dashstats?.foodSubscribersTotal.toLocaleString() ?? "0"),
    },
    {
      title: "Hotel Subscribers",
      color: "#0e7490",
      Icon: Hotel,
      subtitle: "Users subscribed to hotel service",
      main: isLoading
        ? "..."
        : (dashstats?.hotelSubscribersTotal.toLocaleString() ?? "0"),
    },
    {
      title: "Movie Subscribers",
      color: "mediumpurple",
      Icon: MonitorPlay,
      subtitle: "Users subscribed to movie service",
      main: isLoading
        ? "..."
        : (dashstats?.movieSubscribersTotal.toLocaleString() ?? "0"),
    },
    {
      title: "VR Game Subscribers",
      color: "blue",
      Icon: Gamepad2,
      subtitle: "Users subscribed to VR game service",
      main: isLoading
        ? "..."
        : (dashstats?.vrgameSubscribersTotal.toLocaleString() ?? "0"),
    },
    {
      title: "Equipment Subscribers",
      color: "brown",
      Icon: Wrench,
      subtitle: "Users subscribed to equipment rental",
      main: isLoading
        ? "..."
        : (dashstats?.equipmentSubscribersTotal.toLocaleString() ?? "0"),
    },
    {
      title: "Studio Subscribers",
      color: "#c2410c",
      Icon: Ticket,
      subtitle: "Users subscribed to studio booking",
      main: isLoading
        ? "..."
        : (dashstats?.studioSubscribersTotal.toLocaleString() ?? "0"),
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
}
