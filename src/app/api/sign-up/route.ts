import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await req.json();
        const existingUserVerififedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });
        if (existingUserVerififedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken!",
                },
                {
                    status: 400,
                }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exist with this email",
                    },
                    {
                        status: 400,
                    }
                );
            } else {
                const hasedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                );
                await existingUserByEmail.save();
            }
        } else {
            const hasedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                message: [],
            });
            await newUser.save();
        }

        //send verification email
        const emailRespose = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailRespose.success) {
            return Response.json(
                {
                    success: false,
                    message: emailRespose.message,
                },
                {
                    status: 400,
                }
            );
        }
        return Response.json(
            {
                success: true,
                message:
                    "User registered successfully. Please verify your mail.",
            },
            {
                status: 201,
            }
        );
    } catch (err) {
        console.error("Error registering user", err);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            {
                status: 500,
            }
        );
    }
}
