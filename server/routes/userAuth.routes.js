import express from "express";
import { csrfController, login, logout, myProfile, refreshToken, register, verifyOtp, verifyUser } from "../controllers/userAuth.controllers.js";
import isAuth from "../middleware/isAuth.js";
import { isRole } from "../middleware/isRole.js";
import { doubleCsrfProtection } from "../config/csrf.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/verify/:token", verifyUser);    //req.params
authRouter.post("/login", login);
authRouter.post("/verify", verifyOtp);
authRouter.get("/user",isAuth, doubleCsrfProtection, myProfile);
authRouter.post("/refresh", doubleCsrfProtection, refreshToken);
authRouter.get("/logout",isAuth, doubleCsrfProtection, logout);
authRouter.get("/myProfile",isAuth, doubleCsrfProtection, myProfile);
authRouter.get("/csrfToken", csrfController );

// Protected Routes showcasing Role Based Access Control

authRouter.get("/admin", isAuth, isRole("Admin"), doubleCsrfProtection, (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}` })
})

authRouter.get("/editor", isAuth, isRole("Admin", "Editor"), doubleCsrfProtection, (req, res) => {
  res.json({ message: `Welcome ${req.user.role} ${req.user.name}` })
})

export default authRouter;