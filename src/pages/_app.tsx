import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Quicksand } from "next/font/google";
import { api } from "~/utils/api";

import "~/styles/globals.css";

export const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${quicksand.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <div
          className={`${quicksand.variable} bg-gray-900 font-sans text-white`}
        >
          <Component {...pageProps} />
        </div>
      </SessionProvider>{" "}
    </>
  );
};

export default api.withTRPC(MyApp);
