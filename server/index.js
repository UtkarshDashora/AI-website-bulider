import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import websiteRouter from "./routes/websites.routes.js"
import paymentRouter from "./routes/payment.routes.js"
import Website from "./models/website.model.js" // import model for index cleanup logic

import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
         "https://ai-website-bulider1-0lvn.onrender.com"
        ].filter(Boolean);
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is allowed (with or without trailing slash)
        const isAllowed = allowedOrigins.some(allowed => {
            const normalizedAllowed = allowed.replace(/\/$/, "");
            const normalizedOrigin = origin.replace(/\/$/, "");
            return normalizedAllowed === normalizedOrigin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser())
app.use("/api/payment", paymentRouter); // Webhook needs to be before express.json()
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/website", websiteRouter)

console.log("Starting server...")
app.listen(port, async () => {
    console.log(`server started`)
    await connectDB()
    
    // One-time index cleanup for slug field
    try {
        await Website.collection.dropIndex("slug_1");
        console.log("Successfully dropped old slug index. Mongoose will recreate it as sparse.");
    } catch (err) {
        // If index doesn't exist, it's fine
        if (err.codeName !== "IndexNotFound") {
            console.error("Index cleanup error:", err.message);
        }
    }
})



