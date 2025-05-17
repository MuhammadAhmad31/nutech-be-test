
import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { get, update } from "../controllers/profile";

const router = express.Router();

router.get("/profile", verifyToken, get);
router.put("/profile/update", verifyToken, update);

export default router;