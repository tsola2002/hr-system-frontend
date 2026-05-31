import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters"),

  email: z
    .email("Please enter a valid email address"),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters"),

  date_of_birth: z
    .string()
    .min(1, "Date of birth is required"),
});

export type CustomerFormData =
  z.infer<typeof customerSchema>;