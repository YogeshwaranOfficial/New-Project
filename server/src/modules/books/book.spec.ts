import { jest } from "@jest/globals";
import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError.js";

// 1. Mock modules using the ESM-compliant mock module system
jest.unstable_mockModule("./book.repository.js", () => ({
  default: {
    createBook: jest.fn(),
    getBookById: jest.fn(),
  }
}));

jest.unstable_mockModule("../../database/models/Category.js", () => ({
  default: {
    findByPk: jest.fn(),
  }
}));

// 2. Dynamically import your service AFTER the modules are mocked
const { default: bookService } = await import("./book.service.js");
const { default: bookRepository } = await import("./book.repository.js");
const { default: Category } = await import("../../database/models/Category.js");

// 3. Cast them safely using the single generic function signature
const mockedFindByPk = Category.findByPk as unknown as jest.Mock<(...args: any[]) => any>;
const mockedCreateBook = bookRepository.createBook as unknown as jest.Mock<(...args: any[]) => any>;
const mockedGetBookById = bookRepository.getBookById as unknown as jest.Mock<(...args: any[]) => any>;

describe("🧪 Books Service Unit Tests (Isolated System Logic)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBook Context", () => {
    const mockPayload = {
      book_name: "Test Execution Suite",
      book_author: "Jest Expert",
      category_id: "a3fa8d20-fa21-11ee-8391-4321abcdef12",
      total_copies: 3,
    };

    it("✔ Should call repository layer once valid entity configuration checks pass", async () => {
      mockedFindByPk.mockResolvedValue({
        category_id: mockPayload.category_id,
        category_name: "Tech",
      });

      mockedCreateBook.mockResolvedValue({
        book_id: "newly-created-id",
        ...mockPayload,
        available_copies: mockPayload.total_copies,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await bookService.createBook(mockPayload);

      expect(Category.findByPk).toHaveBeenCalledWith(mockPayload.category_id);
      expect(bookRepository.createBook).toHaveBeenCalledWith(mockPayload);
      expect(result).toHaveProperty("book_id", "newly-created-id");
    });

    it("❌ Should short-circuit and throw an AppError if the foreign category is absent", async () => {
      mockedFindByPk.mockResolvedValue(null);

      await expect(bookService.createBook(mockPayload)).rejects.toThrow(
        new AppError("Category not found", httpStatus.NOT_FOUND)
      );

      expect(bookRepository.createBook).not.toHaveBeenCalled();
    });
  });

  describe("getBookById Context", () => {
    it("❌ Should throw a 404 AppError if the database lookup comes back empty", async () => {
      mockedGetBookById.mockResolvedValue(null);

      await expect(bookService.getBookById("invalid-id")).rejects.toThrow(
        new AppError("Book not found", httpStatus.NOT_FOUND)
      );
    });
  });
});