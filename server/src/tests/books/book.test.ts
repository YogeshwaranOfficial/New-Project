import request from "supertest";
import app from "../../app.js";
import { getAuthToken } from "../helpers/testAuth.helper.js";
import sequelize from '../../database/connection/database.js';

describe("📚 Books Module Integration Tests (All Scenarios)", () => {
  let librarianToken: string;
  
  // ⚡ Hardcoded Category ID directly from seed.sql ('Science')
  const scienceCategoryId = "075705f3-c7be-4585-85d1-b57616870f68"; 
  let createdBookId: string;
  
  const testBookName = `Clean Architecture v${Math.floor(Math.random() * 1000)}`;
  const searchKeyword = `SearchableBook-${Math.floor(Math.random() * 1000)}`;
  const nonExistentUuid = "a0000000-0000-0000-0000-000000000000";

  beforeAll(async () => {
    // 1. Grab our authorization token via our self-healing global helper
    const token = await getAuthToken();
    librarianToken = `Bearer ${token}`;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // ==========================================
  // 🟢 1. POST /api/v1/books (CREATE)
  // ==========================================
  describe("POST /api/v1/books", () => {
    it("✅ Happy Path: Should let an authenticated Librarian create a book", async () => {
      const res = await request(app)
        .post("/api/v1/books")
        .set("Authorization", librarianToken)
        .send({
          book_name: testBookName,
          book_author: "Robert C. Martin",
          category_id: scienceCategoryId, // 🔬 Matches seed.sql Category
          total_copies: 5,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("book_id");
      expect(res.body.data.book_name).toBe(testBookName);
      
      createdBookId = res.body.data.book_id;
    });

    it("❌ Sad Path: Should fail validation when body criteria are invalid (Zod)", async () => {
      const res = await request(app)
        .post("/api/v1/books")
        .set("Authorization", librarianToken)
        .send({
          book_name: "X", 
          book_author: "Valid Author",
          category_id: "invalid-uuid-format", 
          total_copies: 0, 
        });

      expect(res.status).toBe(400); 
      expect(res.body.success).toBe(false);
    });

    it("❌ Sad Path: Should throw 404 error if category UUID does not exist in DB", async () => {
      const res = await request(app)
        .post("/api/v1/books")
        .set("Authorization", librarianToken)
        .send({
          book_name: "Valid Book Title",
          book_author: "Valid Author",
          category_id: nonExistentUuid, 
          total_copies: 5,
        });

      expect([400, 404]).toContain(res.status);
    });

    it("❌ Sad Path: Should reject execution if authorization token is absent", async () => {
      const res = await request(app)
        .post("/api/v1/books")
        .send({
          book_name: "Unauthorized Book",
          book_author: "No Token",
          category_id: scienceCategoryId, 
          total_copies: 1,
        });

      expect(res.status).toBe(401);
    });
  });

  // ==========================================
  // 🟢 2. GET /api/v1/books (GET ALL & FILTERS)
  // ==========================================
  describe("GET /api/v1/books", () => {
    beforeAll(async () => {
      await request(app)
        .post("/api/v1/books")
        .set("Authorization", librarianToken)
        .send({
          book_name: searchKeyword,
          book_author: "Unique Search Author",
          category_id: scienceCategoryId, 
          total_copies: 2,
        });
    });

    it("✅ Happy Path: Should fetch all books complete with default pagination maps", async () => {
      const res = await request(app)
        .get("/api/v1/books")
        .set("Authorization", librarianToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("rows");
      expect(res.body.data).toHaveProperty("count");
      // Check that it's retrieving the pre-seeded dataset rows too
      expect(res.body.data.rows.length).toBeGreaterThanOrEqual(1);
    });

    it("✅ Happy Path: Should successfully return records filtered by search query", async () => {
      const res = await request(app)
        .get(`/api/v1/books?search=${searchKeyword}`)
        .set("Authorization", librarianToken);

      expect(res.status).toBe(200);
      expect(res.body.data.rows[0].book_name).toBe(searchKeyword);
    });

    it("✅ Happy Path: Should successfully filter results explicitly by category_id", async () => {
      const res = await request(app)
        .get(`/api/v1/books?category_id=${scienceCategoryId}`) 
        .set("Authorization", librarianToken);

      expect(res.status).toBe(200);
      expect(res.body.data.rows.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ==========================================
  // 🟢 3. GET /api/v1/books/:bookId (GET SINGLE)
  // ==========================================
  describe("GET /api/v1/books/:bookId", () => {
    it("✅ Happy Path: Should return details of a single book by ID", async () => {
      const res = await request(app)
        .get(`/api/v1/books/${createdBookId}`)
        .set("Authorization", librarianToken);

      expect(res.status).toBe(200);
      expect(res.body.data.book_id).toBe(createdBookId);
    });

    // Bonus check: Testing with a pre-seeded book ID from your seed file ('The Pragmatic Programmer')
    it("✅ Happy Path: Should successfully fetch a pre-seeded book from seed.sql", async () => {
      const seededBookId = "b0000001-3333-3333-3333-333333333333";
      const res = await request(app)
        .get(`/api/v1/books/${seededBookId}`)
        .set("Authorization", librarianToken);

      expect(res.status).toBe(200);
      expect(res.body.data.book_name).toBe("The Pragmatic Programmer");
    });

    it("❌ Sad Path: Should throw 404 error if book ID cannot be found", async () => {
      const res = await request(app)
        .get(`/api/v1/books/${nonExistentUuid}`)
        .set("Authorization", librarianToken);

      expect(res.status).toBe(404);
    });
  });
});