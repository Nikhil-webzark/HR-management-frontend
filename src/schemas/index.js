import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createEmployeeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  department: z.string().optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
});

export const updateEmployeeSchema = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const eodSchema = z.object({
  message: z.string().min(1, "EOD message cannot be empty"),
});