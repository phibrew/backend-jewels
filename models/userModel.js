import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    googleId: { type: String, sparse: true, unique: true },
    name: { type: String},
    email: { type: String, unique: true, lowercase: true, required: true },
    image: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" }
}, { timestamps: true });

// userSchema.pre("save", async function (next) {
//     if(!this.isModified("password")) {
//         return next();
//     }
//     this.password = bcrypt.hash(this.password, 10);
//     next();
// })

// userSchema.methods.comparePassword = async function (password) {
//     return await bcrypt.compare(password, this.password);
// }

userSchema.methods.findByCredentials = async function (email){
    const user = await this.findOne({ email });
    if(!user){
        return null;
    }
    
    return user;
}

//method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id.toString() }
        , process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return token;
}

export const User = mongoose.model("User", userSchema);