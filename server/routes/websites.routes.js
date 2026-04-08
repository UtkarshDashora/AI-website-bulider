import express from "express";
import { generateWebsite, getWebsites, getWebsiteById, editWebsite, deployWebsite } from "../controllers/website.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";


const router = express.Router();

router.post("/generate", isAuth, generateWebsite);
router.post("/edit/:id", isAuth, editWebsite);
router.post("/deploy/:id", isAuth, deployWebsite);
router.get("/get", isAuth, getWebsites);
router.get("/get-by-id/:id", isAuth, getWebsiteById);


export default router;