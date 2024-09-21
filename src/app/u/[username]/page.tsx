"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SendMessage() {
    const params = useParams<{ username: string }>();
    const username = params.username;

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const messageContent = form.watch("content");

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>(
                "/api/send-message",
                {
                    ...data,
                    username,
                }
            );
            toast({
                title: response.data.message,
            });
            form.reset({ ...form.getValues(), content: "" });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ??
                    "Failed to sent message",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <NavBar />
            <main className="flex-grow  flex flex-col  items-center justify-center px-4 md:px-24 py-12 bg-gray-300 text-black">
                <section className="text-center mb-8 md:mb-12">
                    <div className="container mx-auto my-8 p-6 bg-white rounded shadow-md">
                        <h1 className="text-4xl font-bold mb-6 text-center">
                            Public Profile Link
                        </h1>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Send Incognito Message to @
                                                {username}
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Write your anonymous message here"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-center">
                                    {isLoading ? (
                                        <Button disabled>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Please wait
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            disabled={
                                                isLoading || !messageContent
                                            }
                                        >
                                            Send It
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </Form>
                        <Separator className="my-6" />
                        <div className="text-center">
                            <div className="mb-4">Get Your Message Board</div>
                            <Link href={"/sign-up"}>
                                <Button>Create Your Account</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
