"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Plus, X } from "lucide-react";
import { leaveSchema, type LeaveFormData } from "@/schemas/leaveSchema";
import type { Leave } from "@/types/leave";

const SAMPLE_LEAVES: Leave[] = [
  {
    id: 1,
    user: "Admin",
    leaveType: "Unpaid",
    startDate: "21-05-2026",
    endDate: "21-05-2026",
    isHalfDay: false,
    totalDays: "1 Day(s)",
    status: "Approved",
  },
  {
    id: 2,
    user: "Admin",
    leaveType: "Unpaid",
    startDate: "18-05-2026",
    endDate: "18-05-2026",
    isHalfDay: false,
    totalDays: "1 Day(s)",
    status: "Rejected",
  },
  {
    id: 3,
    user: "Admin",
    leaveType: "Sick",
    startDate: "10-04-2026",
    endDate: "10-04-2026",
    isHalfDay: false,
    totalDays: "1 Day(s)",
    status: "Approved",
  },
  {
    id: 4,
    user: "Admin",
    leaveType: "Sick",
    startDate: "17-02-2026",
    endDate: "17-02-2026",
    isHalfDay: false,
    totalDays: "1 Day(s)",
    status: "Rejected",
  },
  {
    id: 5,
    user: "Admin",
    leaveType: "Annual",
    startDate: "15-06-2026",
    endDate: "15-06-2026",
    isHalfDay: true,
    totalDays: "0.5 Day(s)",
    status: "Pending",
  },
];

type StatusFilter = "All" | "Pending" | "Approved" | "Rejected";

export default function LeavesPage() {
      const [activeTab, setActiveTab] = useState<StatusFilter>("All");
      const [selectedYear, setSelectedYear] = useState("2026");
      const [selectedMonth, setSelectedMonth] = useState("");
      const [selectedLeaveType, setSelectedLeaveType] = useState("");
      const [isModalOpen, setIsModalOpen] = useState(false);

      const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm<LeaveFormData>({
        resolver: zodResolver(leaveSchema),
        defaultValues: {
          leaveType: "",
          startDate: "",
          endDate: "",
          isHalfDay: false,
          reason: "",
        },
      });
  
      const onSubmit = (data: LeaveFormData) => {
        console.log("Form data:", data);
        setIsModalOpen(false);
        reset();
      };

      const filteredLeaves = SAMPLE_LEAVES.filter((leave) => {
        // Filter by status tab
        if (activeTab !== "All" && leave.status !== activeTab) {
          return false;
        }

        // Filter by leave type
        if (
          selectedLeaveType &&
          leave.leaveType !== selectedLeaveType
        ) {
          return false;
        }

        // Filter by month
        if (selectedMonth) {
          const leaveMonth = leave.startDate.split("-")[1];

          if (leaveMonth !== selectedMonth) {
            return false;
          }
        }

        // Filter by year
        if (selectedYear) {
          const leaveYear = leave.startDate.split("-")[2];

          if (leaveYear !== selectedYear) {
            return false;
          }
        }

        return true;
      });

      
      const getStatusBadgeColor = (status: string) => {
      if (status === "Approved") return "bg-green-100 text-green-800";
      if (status === "Rejected") return "bg-red-100 text-red-800";
      return "bg-yellow-100 text-yellow-800";
    };

    return (
      <div className="space-y-6 p-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
          <span className="mx-2">-</span>
          <span className="hover:text-gray-900 cursor-pointer">Leaves</span>
          <span className="mx-2">-</span>
          <span className="text-gray-900">Leaves</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">Leaves</h1>

        {/* Add Button and Filters */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Leave
          </Button>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
            >
              <option value="">Select Month...</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <select
              value={selectedLeaveType}
              onChange={(e) => setSelectedLeaveType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
            >
              <option value="">Select Leave Type...</option>
              <option value="Sick">Sick</option>
              <option value="Annual">Annual</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Casual">Casual</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200">
          {(["All", "Pending", "Approved", "Rejected"] as StatusFilter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead className="text-gray-700">User</TableHead>
                <TableHead className="text-gray-700">Leave Type</TableHead>
                <TableHead className="text-gray-700">Start Date</TableHead>
                <TableHead className="text-gray-700">End Date</TableHead>
                <TableHead className="text-gray-700">Is Half Day</TableHead>
                <TableHead className="text-gray-700">Total Days</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.map((leave) => (
                <TableRow key={leave.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell className="text-gray-900">{leave.user}</TableCell>
                  <TableCell className="text-gray-900">{leave.leaveType}</TableCell>
                  <TableCell className="text-gray-900">{leave.startDate}</TableCell>
                  <TableCell className="text-gray-900">{leave.endDate}</TableCell>
                  <TableCell className="text-gray-900">{leave.isHalfDay ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-gray-900">{leave.totalDays}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add New Leave Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle>Add New Leave</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Leave Type and Date Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Leave Type */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-2">
                    <span className="text-red-500">*</span> Leave Type
                  </label>
                  <select
                    {...register("leaveType")}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Leave Type...</option>
                    <option value="Sick">Sick</option>
                    <option value="Annual">Annual</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Casual">Casual</option>
                  </select>
                  {errors.leaveType && (
                    <p className="text-red-500 text-sm mt-1">{errors.leaveType.message}</p>
                  )}
                </div>

                {/* Date Range */}
                <div className="flex flex-col">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-900 mb-2">
                        <span className="text-red-500">*</span> Start Date
                      </label>
                      <input
                        type="date"
                        {...register("startDate")}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-900 mb-2">
                        <span className="text-red-500">*</span> End Date
                      </label>
                      <input
                        type="date"
                        {...register("endDate")}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {(errors.startDate || errors.endDate) && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.startDate?.message || errors.endDate?.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-900 mb-2">
                  <span className="text-red-500">*</span> Reason
                </label>
                <textarea
                  {...register("reason")}
                  placeholder="Please Enter Reason"
                  rows={4}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.reason && (
                  <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Create
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

 

