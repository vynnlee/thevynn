'use client';

import Image from 'next/image';
import { LucideIcon } from '@/lib/lucide-icon';

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
  return (
    <div className="size-[10rem] group flex flex-col p-1 bg-white backdrop-blur-xl rounded-xl border border-neutral-200">
      <div className="size-full flex items-center justify-center rounded-md bg-neutral-100 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] relative pointer-events-none overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt={`${title} thumbnail`}
          objectFit="cover"
          quality={75}
          width={520}
          height={520}
          priority={true}
          className="size-[4rem] pointer-events-none"
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
