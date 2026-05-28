import Member from "../../database/models/Member.js";
import { Op , WhereOptions} from "sequelize";
import {
  CreateMemberPayload,
  UpdateMemberPayload,
  MemberQuery
} from "./member.types.js";

export const createMemberRepository = async (
  payload: CreateMemberPayload
) => {
  return await Member.create(payload as any);
};

export const getAllMembersRepository = async (
  query: MemberQuery
) => {
  const {
    page = 1,
    limit = 10,
    search,
    membership_status,
  } = query;

  const offset = (page - 1) * limit;

  const whereClause: WhereOptions<Member> = {};

  if (membership_status) {
    whereClause.membership_status =
      membership_status;
  }

  if (search) {
    whereClause[Op.or as any] = [
      {
        membership_status: {
          [Op.iLike]: `%${search}%`,
        },
      },
    ];
  }

  return await Member.findAndCountAll({
    where: whereClause,

    limit,

    offset,

    order: [["created_at", "DESC"]],
  });
};

export const getMemberByIdRepository = async (
  memberId: string
) => {
  return await Member.findByPk(memberId);
};

export const updateMemberRepository = async (
  memberId: string,
  payload: UpdateMemberPayload
) => {
  const member = await Member.findByPk(memberId);

  if (!member) {
    return null;
  }

  return await member.update(payload as any);
};

export const deleteMemberRepository = async (
  memberId: string
) => {
  const member = await Member.findByPk(memberId);

  if (!member) {
    return null;
  }

  await member.destroy();

  return member;
};