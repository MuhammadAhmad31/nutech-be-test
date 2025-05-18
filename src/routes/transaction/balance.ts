import express from "express";
import { get, topup } from "../../controllers/transaction/balance";
import { verifyToken } from "../../middleware/verifyToken";

const router = express.Router();

router.get("/balance", verifyToken, get);
router.post("/topup", verifyToken, topup);
export default router;