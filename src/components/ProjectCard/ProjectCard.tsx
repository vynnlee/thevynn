'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useCursor } from '@/contexts/CursorContext';

interface ProjectCardProps {
  title: string;
  date: string;
  thumbnailUrl: string;
  link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  date,
  thumbnailUrl,
  link,
}) => {
  const { setCursorOption } = useCursor();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Mouse move event handler
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setMousePos({ x, y });
    }
  };

  const handleMouseEnter = () => {
    setCursorOption('more')
  }

  const handleMouseLeave = (event: React.MouseEvent) => {
    setCursorOption('arrow')
  }

  return (
    <div
      className="group flex flex-col p-1 bg-white backdrop-blur-xl rounded-xl border border-neutral-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        className="size-[8rem] flex items-center justify-center rounded-md bg-neutral-100/80 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] relative pointer-events-none overflow-hidden"
        ref={imageRef}
      >
        <Image
          src={thumbnailUrl}
          alt={`${title} thumbnail`}
          objectFit="cover"
          quality={75}
          width={520}
          height={520}
          priority={true}
          className="size-[4rem] pointer-events-none drop-shadow-sm"
          style={{
            transform: `translate(${mousePos.x * 0.075}px, ${mousePos.y * 0.075}px)`, // Image moves based on mouse position
            transition: 'transform 200ms ease-out', // Smooth transition
          }}
        />
      </div>
      <div className="flex flex-row items-center gap-2 px-1 pt-1 pb-0.5 justify-between">
        <div className="flex flex-row gap-1 items-center">
          <p className="font-geist font-regular text-xs text-neutral-600 tracking-wide">{title}</p>
        </div>
        <p className="font-geistMono font-regular text-xs text-neutral-400 tracking-wide">{date}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
