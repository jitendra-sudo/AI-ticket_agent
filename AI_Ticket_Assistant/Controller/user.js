import User from "../Modals/User.js";
import { inngest } from "../Inngest/client.js";
import jwt from "jsonwebtoken";

export const userSignup = async (req, res) => {
    const { email, password, skill = [] } = req.body;
    try {
        const user = await User.create({ email, password, skill });

        await inngest.send({ name: "user/signup", data: { email } });
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        res.status(201).json({ user, refreshToken, accessToken });
    } catch (error) {
        console.error("Error in userSignup:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        res.status(200).json({ user, refreshToken, accessToken });
    } catch (error) {
        console.error("Error in userLogin:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const logout = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });
    try {
        await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid token" });
            }
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const UserUpdate = async (req, res) => {
    const { email, skills = [], role } = req.body;
    try {
        const user = await User.findById({ $or: [req.user.id, email] });
        if (!user) return res.status(404).json({ error: "User not found" });

        await User.findByIdAndUpdate(user._id, { skills: skills.length ? skills : user.skills, role })
        return res.json({ message: 'User Updated Successfully' })
    } catch (error) {
        console.error("Error in UserUpdate:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const getUsers = async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Access Denied" });
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.error("Error in getUsers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


