import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { Dashstats } from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const stats = [
  {
    title: "Food",
    color: "green",
    dataKey: "foodSubscriptions",
  },
  {
    title: "Studio Booking",
    color: "#c2410c",
    dataKey: "studioSubscriptions",
  },
  {
    title: "Hotel Booking",
    color: "#0e7490",
    dataKey: "hotelSubscriptions",
  },
  {
    title: "Cinema Ticket",
    color: "mediumpurple",
    dataKey: "movieSubscriptions",
  },
  {
    title: "VR Game ticket",
    color: "blue",
    dataKey: "vrgameSubscriptions",
  },
  {
    title: "Equipment Booking",
    color: "brown",
    dataKey: "equipmentSubscriptions",
  },
];

interface SubscriptionData {
  month: number;
  totalSubscriptions: number;
}

interface MonthlyStats {
  vrgameSubscriptions: SubscriptionData[];
  movieSubscriptions: SubscriptionData[];
  equipmentSubscriptions: SubscriptionData[];
  hotelSubscriptions: SubscriptionData[];
  studioSubscriptions: SubscriptionData[];
  foodSubscriptions: SubscriptionData[];
}

interface TransformedData {
  name: string;
  Food: number;
  "Studio Booking": number;
  "Hotel Booking": number;
  "Cinema Ticket": number;
  "VR Game ticket": number;
  "Equipment Booking": number;
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Example() {
  const [year, setYear] = useState("2025");
  const {
    data: queryData,
    isLoading,
    isError,
  } = useQuery<ApiResponse<MonthlyStats>>({
    queryKey: ["bar-chart-data", year],
    queryFn: async () => {
      let resp = await apiClient.get(
        `admins/services-subscriptions/monthly-stats?year=${year}`,
      );
      return resp.data;
    },
  });

  const transformedData: TransformedData[] = Array.from(
    { length: 12 },
    (_, i) => ({
      name: monthNames[i],
      Food: 0,
      "Studio Booking": 0,
      "Hotel Booking": 0,
      "Cinema Ticket": 0,
      "VR Game ticket": 0,
      "Equipment Booking": 0,
    }),
  );

  if (queryData?.payload) {
    const payload = queryData.payload;

    Object.keys(payload).forEach((key) => {
      const statKey = stats.find((s) => s.dataKey === key);
      if (statKey) {
        payload[key as keyof MonthlyStats].forEach((item) => {
          if (item.month >= 1 && item.month <= 12) {
            //@ts-expect-error

            transformedData[item.month - 1][
              statKey.title as keyof TransformedData
            ] = item.totalSubscriptions;
          }
        });
      }
    });
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2025 + 1 }, (_, i) =>
    (2025 + i).toString(),
  );

  if (isLoading) {
    return (
      <div className="card h-full bg-base-100 shadow-xl p-4 space-y-2 ring rounded-md ring-current/20 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card h-full bg-base-100 shadow-xl p-4 space-y-2 ring rounded-md ring-current/20 flex items-center justify-center text-error">
        Error loading data.
      </div>
    );
  }

  return (
    <div className="card h-full bg-base-100 shadow-xl p-4 space-y-2 ring rounded-md ring-current/20">
      <div className="flex justify-between items-center">
        <h2 className="card-title text-2xl font-bold">Subscription Analysis</h2>
        <select
          className="select select-bordered w-fit"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <ul className="join flex-wrap gap-2">
        {stats.map((item) => {
          return (
            <li
              className="float-left  badge badge-sm text-xs"
              key={item.title}
              style={{ background: item.color }}
            >
              <span className=""></span>
              {item.title}
            </li>
          );
        })}
      </ul>
      <ResponsiveContainer width="100%" height="70%" className={"p-0"}>
        <LineChart
          data={transformedData}
          margin={{
            top: 5,
            right: 0,
            left: -38,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis hide={true} />
          <YAxis width={80} />
          <Tooltip />
          {/*<Legend />*/}
          {stats.map((item) => {
            return (
              <Line
                type={"monotone"}
                key={item.title}
                dataKey={item.title}
                stroke={item.color}
                activeDot={{ r: 8 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
