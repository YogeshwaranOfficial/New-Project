import httpStatus from "http-status-codes";

import AppError from "../../utils/AppError.js";

import {
  createMemberRepository,
  deleteMemberRepository,
  getAllMembersRepository,
  getMemberByIdRepository,
  updateMemberRepository,
} from "./member.repository.js";

import {
  CreateMemberPayload,
  UpdateMemberPayload,
  MemberQuery
} from "./member.types.js";

export const createMemberService = async (
  payload: CreateMemberPayload
) => {
  return await createMemberRepository(payload);
};

export const getAllMembersService = async (
  query: MemberQuery
) => {
  const currentDate = new Date();

  const members =
    await getAllMembersRepository(query);

  for (const member of members.rows) {
    if (
      member.expiry_date < currentDate &&
      member.membership_status !== "EXPIRED"
    ) {
      await member.update({
        membership_status: "EXPIRED",
      });
    }
  }

  return {
    meta: {
      total: members.count,
      page: query.page || 1,
      limit: query.limit || 10,
    },

    data: members.rows,
  };
};

export const getMemberByIdService = async (
  memberId: string
) => {
  const member =
    await getMemberByIdRepository(memberId);

  if (!member) {
    throw new AppError(
      "Member not found",httpStatus.NOT_FOUND
    );
  }

  return member;
};

export const updateMemberService = async (
  memberId: string,
  payload: UpdateMemberPayload
) => {
  const updatedMember =
    await updateMemberRepository(
      memberId,
      payload
    );

  if (!updatedMember) {
    throw new AppError(
   
      "Member not found",   httpStatus.NOT_FOUND
    );
  }

  return updatedMember;
};

export const deleteMemberService = async (
  memberId: string
) => {
  const deletedMember =
    await deleteMemberRepository(memberId);

  if (!deletedMember) {
    throw new AppError(
      "Member not found",httpStatus.NOT_FOUND,
    );
  }

  return deletedMember;
};