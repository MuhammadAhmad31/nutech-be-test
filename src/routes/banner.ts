import express from "express";
import { get } from "../controllers/banner";

const router = express.Router();

router.get("/banner", get);

export default router;