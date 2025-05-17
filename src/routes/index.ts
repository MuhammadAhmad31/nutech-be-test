import express from "express";
import authRoutes from "./auth";
import profileRoutes from "./profile";

const router = express.Router();

router.use("/", authRoutes);
router.use("/", profileRoutes);

export default router;
