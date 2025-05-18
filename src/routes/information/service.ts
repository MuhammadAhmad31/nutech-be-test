import express from "express";
import { get } from "../../controllers/information/service";
import { verifyToken } from "../../middleware/verifyToken";

const router = express.Router();

router.get("/services", verifyToken, get);

export default router;