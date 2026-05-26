import { Router } from "express";

import validate from "../../middlewares/validate.js";

import {
  loginSchema,
  registerSchema,
} from "./auth.validation.js";

import {
  loginUserController,
  registerUserController,
} from "./auth.controller.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  registerUserController
);

router.post(
  "/login",
  validate(loginSchema),
  loginUserController
);

export default router;