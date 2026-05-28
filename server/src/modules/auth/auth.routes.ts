/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - gmail
 *               - password
 *
 *             properties:
 *               gmail:
 *                 type: string
 *
 *                 example: admin@gmail.com
 *
 *               password:
 *                 type: string
 *
 *                 example: Admin@123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       401:
 *         description: Invalid credentials
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - name
 *               - gmail
 *               - password
 *
 *             properties:
 *               name:
 *                 type: string
 *
 *                 example: Yogesh
 *
 *               gmail:
 *                 type: string
 *
 *                 example: yogesh@gmail.com
 *
 *               password:
 *                 type: string
 *
 *                 example: Password@123
 *
 *               phone_number:
 *                 type: string
 *
 *                 example: 9876543210
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 */

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