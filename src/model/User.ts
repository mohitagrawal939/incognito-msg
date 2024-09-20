import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    message: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        match: [/.+\@.+\..+/, "Please enter valid email address!"],
    },
    password: {
        type: String,
        requied: [true, "Password is required!"],
    },
    verifyCode: {
        type: String,
        requied: [true, "Verify code is required!"],
    },
    verifyCodeExpiry: {
        type: Date,
        requied: [true, "Verify code expiry is required!"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    message: [MessageSchema],
});

const UserModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>("User", UserSchema);

export default UserModel;
