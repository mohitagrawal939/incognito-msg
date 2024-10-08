/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Footer from "@/components/Footer";
import MessageCard from "@/components/MessageCard";
import NotLoggedIn from "@/components/NotLoggedIn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const { toast } = useToast();
    const handleDeleteMessage = async (messageId: string) => {
        setMessages(messages.filter((item) => item._id !== messageId));
    };
    const { data: session } = useSession();
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });
    const { register, watch, setValue } = form;
    const acceptMessages = watch("acceptingMessages");

    const fetchIsAcceptingMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const res = await axios.get<ApiResponse>(`/api/accept-messages`);
            setValue("acceptingMessages", res.data.isAcceptingMessages);
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    axiosError.response?.data.message ||
                    "Failed to fetch message settings",
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const fetchMessages = async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
            const res = await axios.get<ApiResponse>(`/api/get-messages`);
            setMessages(res.data.messages || []);
            if (refresh) {
                toast({
                    title: "Refreshed...",
                    description: "Showing latest messages",
                });
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    axiosError.response?.data.message ||
                    "Failed to fetch messages",
            });
        } finally {
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    };

    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchIsAcceptingMessages();
    }, [session, setValue, fetchIsAcceptingMessages]);

    const handleSwitchChange = async () => {
        try {
            const res = await axios.post<ApiResponse>(`/api/accept-messages`, {
                acceptMessages: !acceptMessages,
            });
            setValue("acceptingMessages", !acceptMessages);
            toast({
                title: res.data.message,
            });
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    axiosError.response?.data.message ||
                    "Failed to update message status",
            });
        }
    };

    if (!session || !session.user) {
        return <NotLoggedIn />;
    }

    const { username } = session?.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: "URL Copied",
            description: "Profiel URL has been copied to clipboard",
        });
    };

    return (
        <div className="flex-col items-center justify-center px-4 md:px-24 py-12 rounded w-full bg-gary-300">
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                    Copy Your Unique Link
                </h3>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered bg-white w-full p-2 mr-2 rounded"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? "On" : "Off"}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 mb-8 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id as string}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
