import { z } from "zod";

export const createMemberValidation = z.object({
  body: z.object({
    user_id: z
      .string()
      .uuid("Invalid user ID"),

    membership_plan_id: z
      .string()
      .uuid("Invalid membership plan ID"),

    start_date: z.string(),

    expiry_date: z.string(),
  }),
});

export const updateMemberValidation = z.object({
  body: z.object({
    membership_plan_id: z
      .string()
      .uuid()
      .optional(),

    start_date: z.string().optional(),

    expiry_date: z.string().optional(),

    membership_status: z
      .enum(["ACTIVE", "EXPIRED"])
      .optional(),
  }),
});

export const getMembersQueryValidation = z.object({
  query: z.object({
    page: z.string().optional(),

    limit: z.string().optional(),

    search: z.string().optional(),

    membership_status: z
      .enum(["ACTIVE", "EXPIRED"])
      .optional(),
  }),
});