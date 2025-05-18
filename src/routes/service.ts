import express from "express";
import { get } from "../controllers/services";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/services", verifyToken, get);

export default router;