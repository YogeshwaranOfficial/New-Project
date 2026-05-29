import request from "supertest";
import app from "../../app.js";
import { getAuthToken } from "../helpers/testAuth.helper.js";
import Member from "../../database/models/Member.js";
import Book from "../../database/models/Book.js";
import Issue from "../../database/models/Issue.js";
import MembershipPlan from "../../database/models/MembershipPlan.js";

describe("⚙️ Issues Module - Integration Tests", () => {
  let authToken: string;
  let testMember: any;
  let testBook: any;
  let testIssue: any;
  let testPlan: any;

  beforeAll(async () => {
    authToken = await getAuthToken();

   
    // 1. Create a dummy plan first to satisfy Foreign Key constraints
testPlan = await MembershipPlan.create({
  plan_name: "Test Plan",
  price: 1000.00,          
  duration_days: 30,
  max_books_allowed: 5,     
} as any);

    // 2. Create a unique member with all mandatory fields
    const suffix = Date.now();
    testMember = await Member.create({
      name: `Test Member ${suffix}`,
      email: `test${suffix}@example.com`,
      membership_status: "ACTIVE",
      user_id: "00000000-0000-0000-0000-000000000000", // Replace with valid UUID if needed
      membership_plan_id: testPlan.membership_plan_id,
      start_date: new Date(),
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    } as any);

    testBook = await Book.create({
      title: `Test Book ${suffix}`,
      available_copies: 5,
      lending_count: 0
    } as any);

    // 3. Create an initial issue
    testIssue = await Issue.create({
      member_id: testMember.member_id,
      book_id: testBook.book_id,
      due_date: new Date()
    } as any);
  });

  afterAll(async () => {
    // 4. Safe Cleanup: Only destroy if the records were created successfully
    if (testIssue) await Issue.destroy({ where: { issue_id: testIssue.issue_id } });
    if (testMember) await Member.destroy({ where: { member_id: testMember.member_id } });
    if (testBook) await Book.destroy({ where: { book_id: testBook.book_id } });
    if (testPlan) await MembershipPlan.destroy({ where: { membership_plan_id: testPlan.membership_plan_id } });
  });

  describe("POST /api/v1/issues/borrow", () => {
    it("✅ Should successfully borrow a book and return 201", async () => {
      const response = await request(app)
        .post("/api/v1/issues/borrow")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          member_id: testMember.member_id,
          book_id: testBook.book_id
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("issue_id");
    });

    it("❌ Should return 400 if validation fails", async () => {
      const response = await request(app)
        .post("/api/v1/issues/borrow")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ member_id: "not-a-uuid" });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/v1/issues/return", () => {
    it("✅ Should successfully return a book and return 200", async () => {
      const response = await request(app)
        .post("/api/v1/issues/return")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ issue_id: testIssue.issue_id });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/issues/member/:memberId", () => {
    it("✅ Should fetch all issues for a specific member", async () => {
      const response = await request(app)
        .get(`/api/v1/issues/member/${testMember.member_id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});