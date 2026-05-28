import request from "supertest";
import app from "../../app.js";

export const getAuthToken = async (): Promise<string> => {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({
      gmail: "test_master_librarian@gmail.com",
      password: "Password@123",
    });

  return response.body.data?.token || "";
};