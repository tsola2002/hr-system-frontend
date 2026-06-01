import { z } from "zod";

export const leaveSchema = z.object({
  leaveType: z.string().min(1, "Leave type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isHalfDay: z.boolean().default(false),
  reason: z.string().min(1, "Reason is required"),
});

export type LeaveFormData = z.infer<typeof leaveSchema>;
