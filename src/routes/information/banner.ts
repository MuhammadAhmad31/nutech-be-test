import express from "express";
import { get } from "../../controllers/information/banner";

const router = express.Router();

router.get("/banner", get);

export default router;