import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Incognito-msg",
    description:
        "Simple anonymous message application with Mongoose and NextJS in TypeScript.",
};

// export default function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     return (
//         <html lang="en">
//             <body
//                 className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//             >
//                 {children}
//             </body>
//         </html>
//     );
// }

export default function RootLayout() {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            ></body>
        </html>
    );
}
