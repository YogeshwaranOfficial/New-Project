import Member from "../../database/models/Member.js";

import {
  CreateMemberPayload,
  UpdateMemberPayload,
} from "./member.types.js";

export const createMemberRepository = async (
  payload: CreateMemberPayload
) => {
  return await Member.create(payload as any);
};

export const getAllMembersRepository = async () => {
  return await Member.findAll();
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