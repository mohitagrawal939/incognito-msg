import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated",
            },
            {
                status: 401,
            }
        );
    }
    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const userCheck = await UserModel.findOne({
            $or: [{ email: _user.email }],
        });

        if (!userCheck) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        //this is for learning althought above user validation brings the user detaisl but this is to learn abour aggregate methods.
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } },
        ]).exec();

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "No messages found",
                },
                {
                    status: 404,
                }
            );
        }
        return Response.json(
            {
                success: true,
                messages: user[0].messages,
            },
            {
                status: 200,
            }
        );
    } catch (err) {
        return Response.json(
            {
                success: false,
                message: "Failed to get messages",
            },
            {
                status: 500,
            }
        );
    }
}
