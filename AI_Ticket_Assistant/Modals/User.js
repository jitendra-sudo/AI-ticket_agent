import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true, default: "user", enum: ["user", "moderator", "admin"], },
        skills: [String],
    }, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash("password", 10)
    next()
})

userSchema.methods.comparePasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id, email: this.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id, email: this.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export default mongoose.model("User", userSchema);