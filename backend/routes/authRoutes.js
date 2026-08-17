import express from "express"
import { registerUser, loginUser, getProfile, } from "../controllers/authController.js";
import {authenticationToken} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", registerUser); 
router.post("/login", loginUser);

router.get(
    "/profile",
   authenticationToken,
    getProfile
);
   
export default router;

