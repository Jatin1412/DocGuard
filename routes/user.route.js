import express from "express";
const router = express.Router();
import { getHomePage, registerPage } from "../controllers/user.controller.js";

router.route("/home").get(getHomePage);
router.route("/register").get(registerPage);
export default router;
