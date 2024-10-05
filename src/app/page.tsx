"use client";

import React from "react";
import DraggableCard from "@/components/DraggableCard";
import { CardProvider } from "@/contexts/CardContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { containerVariants, childVariants } from "@/animations";

export default function Home() {
  return (
    <motion.div 
      className="mx-auto w-full flex-1 p-8 relative h-screen bg-gray-100 overflow-hidden"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={childVariants} className="flex flex-row gap-3 items-center">
        <Image
          src="/images/profile.jpg"
          width={150}
          height={150}
          alt="Profile image"
          className="size-14 rounded-full bg-neutral-400"
        />
        <div className="flex flex-col">
          <p className="font-geistMono font-bold text-sm">Seongbeen Lee</p>
          <p className="font-geist font-regular text-sm">
            Design is cool, I guess.
          </p>
        </div>
      </motion.div>
        <CardProvider>
          <DraggableCard
            title="Sample"
            date="241024"
            thumbnailUrl="https://placehold.co/240"
            link="/"
            rotation={-5}
          />
          <DraggableCard
            title="Sample"
            date="241024"
            thumbnailUrl="https://placehold.co/240"
            link="/"
            rotation={5}
          />
          <DraggableCard
            title="Vertical"
            date="240924"
            thumbnailUrl="/images/thumbnails/mouse.jpg"
            link="/"
            rotation={0}
          />
        </CardProvider>
    </motion.div>
  );
}
