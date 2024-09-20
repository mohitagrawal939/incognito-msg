import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
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

        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages",
                },
                {
                    status: 403,
                }
            );
        }

        const newMessage = { content, createdAt: new Date() };

        user.message.push(newMessage as Message);

        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            {
                status: 200,
            }
        );
    } catch (err) {
        return Response.json(
            {
                success: false,
                message: "Failed to sent messages",
            },
            {
                status: 500,
            }
        );
    }
}
