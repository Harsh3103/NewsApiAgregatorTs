import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/userController";

const router = express.Router();

// ✅ User Routes)
router.get("/getUser", getUser);
router.put("/updateUser", updateUser);
router.delete("/deleteUser", deleteUser);

export default router;
