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
      title: "No. of Users",
      color: "#d4af37",
      Icon: Users,
      subtitle: "Users",
      main: isLoading
        ? "..."
        : (dashstats?.userTotal?.toLocaleString() ?? "112"),
    },
    {
      title: "Total Subscriptions",
      color: "#b03a2e",
      Icon: Verified,
      subtitle: "Subscribers",
      main: isLoading
        ? "..."
        : (dashstats?.totalSubscriptions?.toLocaleString() ?? "72"),
    },
    {
      title: "Food",
      color: "#4caf50",
      Icon: ForkKnifeCrossedIcon,
      subtitle: "Subscribers",
      main: isLoading
        ? "..."
        : (dashstats?.foodSubscribersTotal?.toLocaleString() ?? "50"),
    },
    {
      title: "Studio Renting",
      color: "#d49937",
      Icon: MonitorPlay,
      subtitle: "Subscribers",
      main: isLoading
        ? "..."
        : (dashstats?.studioSubscribersTotal?.toLocaleString() ?? "17"),
    },
    {
      title: "Hotel Bookings",
      color: "#17a589",
      Icon: Hotel,
      subtitle: "Subscribers",
      main: isLoading
        ? "..."
        : (dashstats?.hotelSubscribersTotal?.toLocaleString() ?? "16"),
    },
    {
      title: "Cinema Tickets",
      color: "#c39bd3",
      Icon: Ticket,
      subtitle: "Subscribers",
      main: isLoading
        ? "..."
        : (dashstats?.movieSubscribersTotal?.toLocaleString() ?? "12"),
    },
    {
      title: "VR Game Tickets",
      color: "#3498db",
      Icon: Gamepad2,
      subtitle: "Subscribers",
      main: isLoading
        ? "..."
        : (dashstats?.vrgameSubscribersTotal?.toLocaleString() ?? "20"),
    },
    {
      title: "Equipment Renting",
      color: "#e74c3c",
      Icon: Wrench,
      subtitle: "Subscribers",
      main: isLoading
        ? "..."
        : (dashstats?.equipmentSubscribersTotal?.toLocaleString() ?? "9"),
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
