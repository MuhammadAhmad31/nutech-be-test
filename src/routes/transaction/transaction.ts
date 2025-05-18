import express from "express";
import { verifyToken } from "../../middleware/verifyToken";
import { create, getHistory } from "../../controllers/transaction/transaction";

const router = express.Router();

router.post("/transaction", verifyToken, create);
router.get("/transaction/history", verifyToken, getHistory);
export default router;