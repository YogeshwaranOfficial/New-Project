export interface CreateMemberPayload {
  user_id: string;
  membership_plan_id: string;
  start_date: string;
  expiry_date: string;
}

export interface UpdateMemberPayload {
  membership_plan_id?: string;
  start_date?: string;
  expiry_date?: string;
  membership_status?: "ACTIVE" | "EXPIRED";
}