// src/pages/Home.tsx
"use client";

import React from "react";
import DraggableCard from "@/components/DraggableCard";
import { CardProvider } from "@/contexts/CardContext";

export default function Home() {
  return (
    <CardProvider>
      <main className="mx-auto w-full flex-1 p-8 relative h-screen bg-gray-100">
        <p className="font-geistMono font-bold text-sm">Seongbeen Lee</p>
        <p className="font-geist font-regular text-sm">
          Design is cool, I guess.
        </p>
        <DraggableCard
          title="OpenTypo"
          date="240924"
          thumbnailUrl="https://placehold.co/240" // 실제 이미지 URL로 교체하세요
          link="/"
          rotation={5}
        />
        <DraggableCard
          title="SampleFont"
          date="241024"
          thumbnailUrl="https://placehold.co/240" // 실제 이미지 URL로 교체하세요
          link="/"
          rotation={-5}
        />
        <DraggableCard
          title="AnotherFont"
          date="241124"
          thumbnailUrl="https://placehold.co/240" // 실제 이미지 URL로 교체하세요
          link="/"
          rotation={0}
        />
        {/* 필요에 따라 더 많은 DraggableCard 컴포넌트를 추가하세요 */}
      </main>
    </CardProvider>
  );
}
