import { CheckCircle, Users, XCircle } from "lucide-react";

type StatusCardProps = {
  title: string;
  value: number;
  icon: "users" | "check-circle" | "x-circle";
  trend: number;
};

export function StatusCard({ title, value, icon, trend }: StatusCardProps) {
  // Determine color based on value
  const getValueColor = (value: number) => {
    if (value > 1000) return "text-red-600";
    if (value > 500) return "text-orange-500";
    return "text-slate-900";
  };

  // Render appropriate icon
  const renderIcon = () => {
    switch (icon) {
      case "users":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "check-circle":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "x-circle":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {renderIcon()}
      </div>
      <div className="p-4">
        <div className={`text-3xl font-bold ${getValueColor(value)}`}>
          {value.toLocaleString()}
        </div>
        <div className="mt-2 flex items-center text-xs">
          <span
            className={`flex items-center ${
              trend > 0
                ? "text-green-600"
                : trend < 0
                ? "text-red-600"
                : "text-slate-500"
            }`}
          >
            {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend)}%
          </span>
          <span className="ml-1 text-slate-500">from previous period</span>
        </div>
      </div>
    </div>
  );
}
