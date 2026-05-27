import { Router } from "express";

import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

import {
  createMemberController,
  deleteMemberController,
  getAllMembersController,
  getMemberByIdController,
  updateMemberController,
} from "./member.controller.js";

import {
  createMemberValidation,
  updateMemberValidation,
  getMembersQueryValidation
} from "./member.validation.js";

const router = Router();

router.post(
  "/",
  auth,
  validate(createMemberValidation),
  createMemberController
);

router.get(
  "/",
  auth,
  getAllMembersController
);

router.get(
  "/:id",
  auth,
  getMemberByIdController
);

router.patch(
  "/:id",
  auth,
  validate(updateMemberValidation),
  updateMemberController
);

router.delete(
  "/:id",
  auth,
  deleteMemberController
);

router.get(
  "/",
  auth,
  validate(getMembersQueryValidation),
  getAllMembersController
);

export default router;