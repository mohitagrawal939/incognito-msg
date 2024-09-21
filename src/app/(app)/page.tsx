import Footer from "@/components/Footer";
export default function Home() {
    return (
        <>
            <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-300 text-black">
                <section className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold">
                        Dive into the world of Incognito Messages
                    </h1>
                    <p className="mt-3 md:mt-4 text-base md:text-lg">
                        Incognito Messages - Where your identity remains a
                        secret. Send messages via public profile link and let
                        them guess. Share feedback, funny messages and many
                        more.
                    </p>
                </section>
            </main>
            <Footer />
        </>
    );
}
