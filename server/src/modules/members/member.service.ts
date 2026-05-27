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
} from "./member.types.js";

export const createMemberService = async (
  payload: CreateMemberPayload
) => {
  return await createMemberRepository(payload);
};

export const getAllMembersService = async () => {
  return await getAllMembersRepository();
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