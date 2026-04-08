import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
export const googleAuth = async (req, res) => {
    try {
        const { email, name, avatar } = req.body
        let user = await User.findOne({ email })
        
        if (!user) {
            user = new User({ email, name, avatar })
            // Set 5000 credits for testing
            if (email === "utkarshdashora@gmail.com") {
                user.credits = 5000;
            }
            await user.save()
        } else {
            // Update credits for the test user if they already exist
            if (email === "utkarshdashora@gmail.com" && user.credits < 5000) {
                user.credits = 5000;
                await user.save();
            }
        }

        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        
        res.cookie("token", token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict", 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        })
        
        res.status(200).json({ 
            success: true,
            message: "User authenticated successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                credits: user.credits,
                plan: user.plan
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: `google auth failed ${error.message}` })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: `logout failed ${error.message}` })
    }
}
