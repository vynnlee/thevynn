"use client";

import localFont from "next/font/local";
import "./globals.css";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Dock from "@/components/Dock/Dock";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 페이지가 로드되면 트랜지션이 시작되도록 설정
    setIsReady(true);
  }, [pathname]);

  // 페이지 트랜지션 설정
  const transitionVariants = {
    initial: { opacity: 0, y: 50, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: 50, filter: "blur(10px)" },
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-hidden antialiased bg-neutral-100 dark:bg-neutral-900`}
      >
        <div className="pointer-events-none fixed left-0 top-0 z-50 h-16 w-full bg-neutral-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-neutral-900"></div>
        <motion.div
          key={pathname} // 페이지 변경 시 트랜지션
          initial="initial"
          animate="animate"
          exit="exit"
          variants={transitionVariants}
          transition={{ duration: 0.6, ease: [0, 0, 0, 1] }} // 유려한 애니메이션 곡선
          style={{ overflow: "hidden" }}
        >
          {isReady && children}
        </motion.div>
        <Dock />
      </body>
    </html>
  );
}
