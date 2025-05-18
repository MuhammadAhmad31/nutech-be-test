import express from "express";
import authRoutes from "./auth";
import profileRoutes from "./profile";
import bannerRoutes from "./information/banner";
import serviceRoutes from "./information/service";
import balanceRoutes from "./transaction/balance";
import transactionRoutes from "./transaction/transaction";

const router = express.Router();

router.use("/", authRoutes);
router.use("/", profileRoutes);
router.use("/", bannerRoutes);
router.use("/", serviceRoutes);
router.use("/", balanceRoutes);
router.use("/", transactionRoutes)

export default router;
