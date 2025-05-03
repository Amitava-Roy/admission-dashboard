"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { RefreshCcw } from "lucide-react";

import { fetchAdmissionAnalytics } from "./api/analytics";
import { ApplicationsBarChart } from "./charts/applicatons-bar-chart";
import { ApplicationsTrendChart } from "./charts/applications-trend-chart";
import { StatusCard } from "./status-card";

export default function AdmissionDashboard() {
  const [data, setData] = useState<AdmissionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(new Date().getFullYear(), 0, 1), // Jan 1 of current year
    to: new Date(),
  });

  // Format dates for the date inputs
  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAdmissionAnalytics({
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
      });
      setData(result);
    } catch (err) {
      setError("Failed to fetch analytics data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const filteredTrendData = useMemo(() => {
    if (!data) return [];

    return data.applicationTrends.filter((item) => {
      const date = new Date(item.date);
      return date >= dateRange.from && date <= dateRange.to;
    });
  }, [data, dateRange]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const newDate = new Date(e.target.value);
      setDateRange((prev) => ({
        ...prev,
        from: newDate,
      }));
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const newDate = new Date(e.target.value);
      setDateRange((prev) => ({
        ...prev,
        to: newDate,
      }));
    }
  };
  console.log(error);
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-col items-start ">
          <h1 className="text-xl md:text-3xl font-bold text-slate-800">
            Admission Analytics Dashboard
          </h1>
          <p className="text-slate-500">Track application metrics and trends</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex flex-col">
              <label
                htmlFor="start-date"
                className="text-xs text-slate-500 mb-1"
              >
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={formatDateForInput(dateRange.from)}
                onChange={handleStartDateChange}
                className="px-3 py-2 text-sm border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="end-date" className="text-xs text-slate-500 mb-1">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={formatDateForInput(dateRange.to)}
                onChange={handleEndDateChange}
                className="px-3 py-2 text-sm border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Fetch Data
          </button>
        </div>
      </div>

      {/* {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )} */}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <>
            <div className="h-32 w-full bg-slate-200 animate-pulse rounded-lg"></div>
            <div className="h-32 w-full bg-slate-200 animate-pulse rounded-lg"></div>
            <div className="h-32 w-full bg-slate-200 animate-pulse rounded-lg"></div>
          </>
        ) : data ? (
          <>
            <StatusCard
              title="Total Applicants"
              value={data.totalApplicants}
              icon="users"
              trend={data.totalApplicantsTrend}
            />
            <StatusCard
              title="Verified Applicants"
              value={data.verifiedApplicants}
              icon="check-circle"
              trend={data.verifiedApplicantsTrend}
            />
            <StatusCard
              title="Rejected Applicants"
              value={data.rejectedApplicants}
              icon="x-circle"
              trend={data.rejectedApplicantsTrend}
            />
          </>
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-slate-500">
              No data available. Please adjust your filters or try again.
            </p>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {loading ? (
          <>
            <div className="h-80 w-full bg-slate-200 animate-pulse rounded-lg"></div>
            <div className="h-80 w-full bg-slate-200 animate-pulse rounded-lg"></div>
          </>
        ) : data ? (
          <>
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-slate-900">
                  Applications by Program
                </h3>
                <p className="text-sm text-slate-500">
                  Distribution of applications across different programs
                </p>
              </div>
              <div className="h-[350px]">
                <ApplicationsBarChart data={data.applicationsByProgram} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-slate-900">
                  Application Trends
                </h3>
                <p className="text-sm text-slate-500">
                  Daily application submissions over time
                </p>
              </div>
              <div className="h-[350px]">
                {filteredTrendData.length > 0 ? (
                  <ApplicationsTrendChart data={filteredTrendData} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500">
                      No trend data available for the selected date range.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-slate-500">
              No chart data available. Please adjust your filters or try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Types
interface AdmissionAnalytics {
  totalApplicants: number;
  totalApplicantsTrend: number;
  verifiedApplicants: number;
  verifiedApplicantsTrend: number;
  rejectedApplicants: number;
  rejectedApplicantsTrend: number;
  applicationsByProgram: {
    program: string;
    count: number;
  }[];
  applicationTrends: {
    date: string;
    count: number;
  }[];
}
