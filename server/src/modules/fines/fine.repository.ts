import Fine from "../../database/models/Fine.js";
import { CreationOptional } from "sequelize";


class FineRepository {
  async getAllFines() {
    return Fine.findAll({
      order: [["created_at", "DESC"]],
    });
  }

  async getFineById(fine_id: string) {
    return Fine.findByPk(fine_id);
  }

  async getMemberFines(issue_ids: string[]) {
    return Fine.findAll({
      where: {
        issue_id: issue_ids,
      },
    });
  }

  async payFine(fine_id: string) {
    await Fine.update(
      {
        paid_status: "PAID",
        paid_date: new Date(),
      },
      {
        where: {
          fine_id,
        },
      }
    ) ;

    return this.getFineById(fine_id) ;
  }

  async getPendingFines() {
    return Fine.findAll({
      where: {
        paid_status: false,
      },

      order: [["created_at", "DESC"]],
    });
  }
}

export default new FineRepository();