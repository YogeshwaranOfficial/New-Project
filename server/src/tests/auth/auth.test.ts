import request from "supertest";

import app from "../../app.js";

describe("Auth APIs", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Test User",
        gmail: "test@gmail.com",
        password: "Password@123",
      });

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);
  });

  it("should login user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        gmail: "test@gmail.com",
        password: "Password@123",
      });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });
});