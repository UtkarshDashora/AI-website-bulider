import express from "express";
import { createCheckoutSession, stripeWebhook, verifySession } from "../controllers/payment.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", express.json(), isAuth, createCheckoutSession);
paymentRouter.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
paymentRouter.get("/verify-session/:sessionId", isAuth, verifySession);

export default paymentRouter;
