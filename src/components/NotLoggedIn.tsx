import Image from "next/image";
import Link from "next/link";
import React from "react";

function NotLoggedIn() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className="text-6xl">
                    Please login from{" "}
                    <Link
                        href="/sign-in"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        here
                    </Link>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://github.com/mohitagrawal939/incognito-msg"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="https://nextjs.org/icons/github.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                    />
                    Github
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://mohitagrawal.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="https://nextjs.org/icons/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    www.mohitagrawal.xyz →
                </a>
            </footer>
        </div>
    );
}

export default NotLoggedIn;
