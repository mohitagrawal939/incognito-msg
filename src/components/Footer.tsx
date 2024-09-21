import Image from "next/image";
import React from "react";

const Footer = () => {
    return (
        <footer className="text-center p-4 md:p-6 bg-black text-white">
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
    );
};

export default Footer;
