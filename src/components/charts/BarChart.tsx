import type { ApiResponse } from "@/api/apiClient";
import apiClient from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
} from "recharts";
import SuspenseCompLayout from "../layout/SuspenseComponentLayout";
import { useState } from "react";

// #region Sample data
const data = [
  {
    name: "Page A",
    uv: 4000,
  },
  {
    name: "Page B",
    uv: 3000,
  },
  {
    name: "Page C",
    uv: 2000,
  },
  {
    name: "Page D",
    uv: 2780,
  },
  {
    name: "Page E",
    uv: 1890,
  },
  {
    name: "Page F",
    uv: 2390,
  },
  {
    name: "Page G",
    uv: 3490,
  },
];
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

// #endregion
const SimpleBarChart = ({ isAnimationActive = true }) => {
  const [year, setYear] = useState("2025");
  const query = useQuery<
    ApiResponse<{ month: number; totalRevenue: string }[]>
  >({
    queryKey: ["total-income"],
    queryFn: async () => {
      const resp = await apiClient.get(
        "admins/revenue/monthly-stats?year=2025",
      );
      return resp.data;
    },
  });
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2025 + 1 }, (_, i) =>
    (2025 + i).toString(),
  );
  const new_data = query.data?.payload || data;
  return (
    <>
      <div className="h-full flex flex-col   p-4 bg-base-100 shadow ring rounded-md ring-current/20">
        <div className="flex justify-between items-center">
          {" "}
          <h2 className="mb-2 text-2xl font-bold">Income Analysis</h2>
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
        <SuspenseCompLayout query={query} fillHeight>
          {(data) => {
            let payload =
              data?.payload.map((item) => ({
                ...item,
                month: monthNames[item.month - 1],
              })) || data;
            console.log(payload, data.payload);
            return (
              <>
                <BarChart
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "700px",
                    // maxHeight: "70vh",
                    aspectRatio: 1.618,
                  }}
                  responsive
                  data={payload}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" xlinkTitle="" />
                  {/*<YAxis width="auto" />*/}
                  <Tooltip />
                  {/*<Legend />*/}
                  <Bar
                    dataKey="totalRevenue"
                    className=" fill-primary rounded-box"
                    isAnimationActive={isAnimationActive}
                  />
                </BarChart>
              </>
            );
          }}
        </SuspenseCompLayout>
      </div>
    </>
  );
};

export default SimpleBarChart;
