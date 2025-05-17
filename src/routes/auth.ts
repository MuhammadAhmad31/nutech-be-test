import { login, register } from "../controllers/auth";
import express from "express";

const router = express.Router();

router.post('/registration', register)
router.post('/login', login)

export default router;