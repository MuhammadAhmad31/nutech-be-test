
import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { get, update, updateImage } from "../controllers/profile";
import { upload } from "../middleware/multer";
import { multerErrorHandler } from "../middleware/multerErrorHandler";

const router = express.Router();

router.get("/profile", verifyToken, get);
router.put("/profile/update", verifyToken, update);
router.put(
  "/profile/image",
  verifyToken,
  upload.single("profile_image"),
  multerErrorHandler,
  updateImage
);

export default router;