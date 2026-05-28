import request from "supertest";
import { describe, it, expect } from '@jest/globals';
import app from "../../app.js";
import sequelize from '../../database/connection/database.js';

afterAll(async () => {
  await sequelize.close();
});

describe("Auth APIs", () => {
  // Configuration for clean dynamic test credentials
  const uniqueId = Date.now();
  const testEmail = `test_${uniqueId}@gmail.com`;
  const testPassword = "Password@123";

  // =======================================================
  // 🟢 HAPPY PATHS
  // =======================================================
  describe("Registration & Login (Success Cases)", () => {
    it("✔ HAPPY PATH: should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test User",
          gmail: testEmail, 
          password: testPassword,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it("✔ HAPPY PATH: should login user successfully and return a token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          gmail: testEmail,
          password: testPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token"); 
    });
  });

  // =======================================================
  // 🔴 SAD PATHS & VALIDATION FAILURES
  // =======================================================
  describe("Registration Failures (Sad Paths)", () => {
    it("❌ SAD PATH: should block registration if email already exists", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Original User",
          gmail: testEmail,
          password: testPassword,
        });

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Imposter User",
          gmail: testEmail,
          password: testPassword,
        });

      expect(response.status).toBe(409); 
      expect(response.body.success).toBe(false);
    });

    it("❌ SAD PATH: should reject registration if mandatory body elements are missing", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          gmail: "incomplete@gmail.com",
          password: testPassword,
        });

      expect(response.status).toBe(400); 
      expect(response.body.success).toBe(false);
    });

    it("❌ SAD PATH: should reject registration if input data breaks schema rules", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Y", 
          gmail: "broken-email-format", 
          password: "123", 
        });

      expect(response.status).toBe(400); 
      expect(response.body.success).toBe(false);
    });
  });

  describe("Login Failures (Sad Paths)", () => {
    it("❌ SAD PATH: should block login if user doesn't exist in the system", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          gmail: "ghost_user_9999@gmail.com", 
          password: testPassword,
        });

      expect(response.status).toBe(401); 
      expect(response.body.success).toBe(false);
    });

    it("❌ SAD PATH: should reject login if password does not match", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          gmail: testEmail,
          password: "WrongPassword⚠️",
        });

      expect(response.status).toBe(401); 
      expect(response.body.success).toBe(false);
    });
  });
});