import express from "express";
import authRoutes from "./auth";
import profileRoutes from "./profile";
import bannerRoutes from "./banner";
import serviceRoutes from "./service";

const router = express.Router();

router.use("/", authRoutes);
router.use("/", profileRoutes);
router.use("/", bannerRoutes);
router.use("/", serviceRoutes);

export default router;
