export interface Leave {
  id: number;
  user: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  totalDays: string;
  status: "Pending" | "Approved" | "Rejected";
}
