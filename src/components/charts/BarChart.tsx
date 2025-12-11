import apiClient, { type ApiResponse } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const SimpleBarChart = () => {
  const query = useQuery({
    queryKey: ["total-income-expense"],
    queryFn: async () => {
      // In a real scenario, you would fetch actual data here.
      // For this example, we'll simulate an empty response to trigger dummy data.
      return { data: [] };
    },
  });

  const dummyData = [
    { name: "Total", income: 78700, expense: 38700 }, // Sum of all months from original dummyData
  ];

  // Use dummyData if query.data is empty or not yet loaded
  const data =
    query.data && query.data.data && query.data.data.length > 0
      ? query.data.data
      : dummyData;

  return (
    <div className="h-full   p-4 bg-base-100 shadow ring rounded-md ring-current/20">
      <h2 className="mb-2 text-2xl font-bold">Income Analysis</h2>
      <BarChart
        style={{
          width: "100%",
          maxWidth: "700px",
          height: "100%",
          aspectRatio: 1.618,
        }}
        responsive
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis width="auto" />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="income"
          fill="#8884d8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
        <Bar
          dataKey="expense"
          fill="#82ca9d"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
      </BarChart>
    </div>
  );
};

export default SimpleBarChart;
