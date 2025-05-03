import { format, parseISO } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ApplicationsTrendChartProps = {
  data: {
    date: string;
    count: number;
  }[];
};

export function ApplicationsTrendChart({ data }: ApplicationsTrendChartProps) {
  // Transform data for the chart
  const chartData = data.map((item) => ({
    date: item.date,
    value: item.count,
    formattedDate: format(parseISO(item.date), "MMM dd"),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e2e8f0"
        />
        <XAxis
          dataKey="formattedDate"
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
          tick={{ fontSize: 12, fill: "#64748b" }}
        />
        <YAxis
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
          tick={{ fontSize: 12, fill: "#64748b" }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white rounded-lg border border-slate-200 p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-slate-500">
                        Date
                      </span>
                      <span className="font-bold text-slate-700">
                        {format(
                          parseISO(payload[0].payload.date),
                          "MMM dd, yyyy"
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-slate-500">
                        Applications
                      </span>
                      <span className="font-bold">
                        {payload[0].value?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#0ea5e9"
          fill="#0ea5e9"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
