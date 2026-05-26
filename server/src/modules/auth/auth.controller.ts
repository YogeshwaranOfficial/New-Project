import { Request, Response } from "express";

import asyncHandler from "../../utils/asyncHandler.js";

import sendResponse from "../../utils/SendResponse.js";

import {
  loginUserService,
  registerUserService,
} from "./auth.service.js";

export const registerUserController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const result =
        await registerUserService(req.body);

      sendResponse(
        res,
        201,
        "User registered successfully",
        result
      );
    }
  );

export const loginUserController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const result =
        await loginUserService(req.body);

      sendResponse(
        res,
        200,
        "User logged in successfully",
        result
      );
    }
  );