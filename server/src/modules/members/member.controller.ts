import { Request, Response } from "express";

import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/SendResponse.js";

import {
  createMemberService,
  deleteMemberService,
  getAllMembersService,
  getMemberByIdService,
  updateMemberService,
} from "./member.service.js";

export const createMemberController =
  asyncHandler(async (req: Request, res: Response) => {
    const result =
      await createMemberService(req.body);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Member created successfully",
      data: result,
    });
  });

export const getAllMembersController =
  asyncHandler(async (_req: Request, res: Response) => {
    const result =
      await getAllMembersService();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Members fetched successfully",
      data: result,
    });
  });

export const getMemberByIdController =
  asyncHandler(async (req: Request, res: Response) => {
    const result =
      await getMemberByIdService(
        req.params.id as any
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Member fetched successfully",
      data: result,
    });
  });

export const updateMemberController =
  asyncHandler(async (req: Request, res: Response) => {
    const result =
      await updateMemberService(
        req.params.id as any,
        req.body
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Member updated successfully",
      data: result,
    });
  });

export const deleteMemberController =
  asyncHandler(async (req: Request, res: Response) => {
    const result =
      await deleteMemberService(
        req.params.id as any
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Member deleted successfully",
      data: result,
    });
  });