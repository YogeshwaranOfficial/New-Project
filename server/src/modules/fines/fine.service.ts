import httpStatus from "http-status-codes";

import AppError from "../../utils/AppError.js";

import Issue from "../../database/models/Issue.js";

import fineRepository from "./fine.repository.js";

class FineService {
  async getAllFines() {
    return fineRepository.getAllFines();
  }

  async payFine(fine_id: string) {
    const fine =
      await fineRepository.getFineById(
        fine_id
      );

    if (!fine) {
      throw new AppError(
       
        "Fine not found", httpStatus.NOT_FOUND
      );
    }

    if (fine.paid_status) {
      throw new AppError(
        
        "Fine already paid",httpStatus.BAD_REQUEST
      );
    }

    return fineRepository.payFine(
      fine_id
    );
  }

  async getPendingFines() {
    return fineRepository.getPendingFines();
  }

  async getMemberFines(member_id: string) {
    const issues = await Issue.findAll({
      where: {
        member_id,
      },
    });

    const issue_ids = issues.map(
      (issue) => issue.issue_id
    );

    return fineRepository.getMemberFines(
      issue_ids
    );
  }
}

export default new FineService();