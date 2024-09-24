"use client";

import DraggableCard from "@/components/DraggableCard";

export default function Home() {
  return (
    <main className="mx-auto w-full flex-1 p-8">
      <p className="font-geistMono font-bold text-sm">Seongbeen Lee</p>
      <p className="font-geist font-regular text-sm">
        Design is cool, i guess.
      </p>
      <DraggableCard />
    </main>
  );
}
