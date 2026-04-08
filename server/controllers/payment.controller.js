import Stripe from "stripe";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { planName, credits, price } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `${planName} Plan - ${credits} Credits`,
                            description: `Upgrade to ${planName} and get ${credits} credits for your AI Website Builder.`,
                        },
                        unit_amount: price * 100, // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/home`,
            metadata: {
                userId: req.user.id,
                credits: credits,
                plan: planName.toLowerCase()
            }
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    const logPath = path.join(process.cwd(), "webhook.log");
    const log = (msg) => {
        const timestamp = new Date().toISOString();
        fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
    };

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        log(`Event Verified: ${event.type}`);
    } catch (err) {
        log(`Verification Failed: ${err.message}`);
        console.error("Webhook Signature Verification Failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { userId, credits, plan } = session.metadata;

        log(`Processing: User=${userId}, Credits=${credits}, Plan=${plan}`);

        if (!userId || !credits) {
            log("Error: Missing metadata");
            console.error("Critical Error: Missing metadata in Stripe session", session.metadata);
            return res.status(400).json({ success: false, message: "Missing metadata" });
        }

        try {
            const parsedCredits = parseInt(credits);
            if (isNaN(parsedCredits)) {
                throw new Error(`Invalid credits value: ${credits}`);
            }

            // Update user credits and plan in DB
            const updatedUser = await User.findByIdAndUpdate(userId, {
                $inc: { credits: parsedCredits },
                plan: plan
            }, { new: true, runValidators: true });

            if (!updatedUser) {
                log(`Error: User ${userId} not found`);
                console.error(`Error: User ${userId} not found in database during webhook processing.`);
            } else {
                log(`Success: Added ${parsedCredits} credits to user ${userId}. New total: ${updatedUser.credits}`);
                console.log(`Success: Added ${parsedCredits} credits to user ${userId}. New total: ${updatedUser.credits}`);
            }
        } catch (dbErr) {
            log(`DB Error: ${dbErr.message}`);
            console.error("Database Update Error after Payment:", dbErr.message);
        }
    }

    res.json({ received: true });
};

export const verifySession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;

        // 1. Check if session already processed
        const existingTransaction = await Transaction.findOne({ sessionId });
        if (existingTransaction) {
            return res.status(200).json({ 
                success: true, 
                message: "Credits already added for this session",
                alreadyProcessed: true
            });
        }

        // 2. Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            const { credits, plan } = session.metadata;
            const amountTotal = session.amount_total / 100;

            // 3. Update User Credits
            const updatedUser = await User.findByIdAndUpdate(userId, {
                $inc: { credits: parseInt(credits) },
                plan: plan
            }, { new: true, runValidators: true });

            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // 4. Create Transaction record
            await Transaction.create({
                sessionId,
                userId,
                amount: amountTotal,
                credits: parseInt(credits),
                status: "completed"
            });

            console.log(`Self-Healing Fix: Successfully added ${credits} credits to user ${userId} via manual verification.`);

            return res.status(200).json({ 
                success: true, 
                message: "Credits added successfully!",
                credits: updatedUser.credits
            });
        } else {
            return res.status(400).json({ success: false, message: "Payment not completed" });
        }

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
