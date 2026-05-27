import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import memberRoutes from "../modules/members/member.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/members", memberRoutes);

export default router;