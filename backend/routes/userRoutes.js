import express from "express";
import {
    authUser,
    signupUser,
    logoutUser,
    getUserProfiles,
    blockUsers,
    unblockUsers,
    deleteUsers,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.get("/dashboard", protectRoute, getUserProfiles);
router.post("/dashboard/block", protectRoute, blockUsers);
router.post("/dashboard/unblock", protectRoute, unblockUsers);
router.delete("/dashboard/delete", protectRoute, deleteUsers);

export default router;