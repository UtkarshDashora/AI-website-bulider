import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["completed", "pending", "failed"],
        default: "completed"
    }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
