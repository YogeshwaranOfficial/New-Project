import { Router } from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import {
  loginSchema,
  registerSchema,
} from "./auth.validation.js";

import {
  loginUserController,
  registerUserController,
  getProfileController
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

router.get(
  "/profile",
  auth,
  getProfileController
);

export default router;