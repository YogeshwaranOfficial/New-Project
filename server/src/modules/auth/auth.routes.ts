import { Router } from "express";

import validate from "../../middlewares/validate.js";

import { loginSchema } from "./auth.validation.js";

// import { loginUser } from "./auth.controller.js";



const router = Router();



router.post(
  "/login",

  validate(loginSchema),

  // loginUser
);



export default router;