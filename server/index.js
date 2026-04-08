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
app.use(cors(
    {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true
    }
))
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



