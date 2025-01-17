'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { containerVariants, childVariants } from '@/animations';
import { useCursor } from '@/contexts/CursorContext';
import DraggableCard from '@/components/DraggableCard';
import { CardProvider } from '@/contexts/CardContext';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import { Post } from '@/utils/getPosts';

export default function HomeClient({ projects, error }: { projects: Post[], error: string | null }) {
  const { setCursorOption } = useCursor();

  return (
    <motion.div
      className="overflow-y-scroll mx-auto w-full flex flex-col md:flex-row p-6 lg:p-8 relative min-h-screen bg-white"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="w-full max-w-[400px] flex flex-col gap-4">
        <motion.div variants={childVariants} className="flex flex-row gap-3 items-center">
          <Image
            src="/images/profile.jpg"
            width={150}
            height={150}
            alt="Profile image"
            className="size-14 rounded-full bg-neutral-400"
          />
          <div className="flex flex-col">
            <p className="font-geistMono font-bold text-sm">Vynn Lee</p>
            <p className="font-geist font-regular text-sm">Design is cool, I guess.</p>
          </div>
        </motion.div>
        <motion.div variants={childVariants} className="w-full mb-6">
          <p className="font-geist font-regular text-neutral-600 text-md">
            I&apos;m a professional UX/UI and interface designer. Passionate about details, striving for sincere
            communications.
          </p>
          <p className="font-geist font-regular text-neutral-600 text-md mt-2">
            Currently studying at{' '}
            <a
              href="https://id.seoultech.ac.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-color duration-300"
              onMouseEnter={() => setCursorOption('link')}
              onMouseLeave={() => setCursorOption('arrow')}
            >
              SNUST
            </a>
            .
          </p>
        </motion.div>
        <motion.div variants={childVariants} className="w-full flex flex-col mb-6">
          <h3 className="font-geist font-medium text-neutral-600 text-md mb-3">Side Projects</h3>
          <div
            className="relative w-full"
            style={{
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
            }}
          >
            <motion.div
              className="flex flex-row gap-2 overflow-visible"
              drag="x"
              dragConstraints={{ left: -200, right: 0 }}
              dragElastic={0.05}
              whileTap={{ cursor: "grabbing" }}
              style={{ cursor: 'grab' }}
            >
              <ProjectCard
                title="OpenTypo"
                date="241024"
                thumbnailUrl="/images/logo_opentypo.svg"
                link="/"
              />
              <ProjectCard
                title="ZeroShot"
                date="250101"
                thumbnailUrl="/images/logo_zeroshot.svg"
                link="https://www.zeroshot.kr/"
              />
            </motion.div>
          </div>
        </motion.div>
        <motion.div variants={childVariants}>
          <h3 className="font-geist font-medium text-neutral-600 text-md mb-3">Connect</h3>
          <p className="font-geist font-regular text-neutral-600 text-md">
            Follow me on{' '}
            <a
              href="https://x.com/0x7dec"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-color duration-300"
              onMouseEnter={() => setCursorOption('pointer')}
              onMouseLeave={() => setCursorOption('arrow')}
            >
              X
            </a>
            {' '}and{' '}
            <a
              href="https://x.com/0x7dec"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-color duration-300"
              onMouseEnter={() => setCursorOption('pointer')}
              onMouseLeave={() => setCursorOption('arrow')}
            >
              Thread
            </a>
            {' '}or email me directly{' '}
            <a
              href="mailto:thevynn.studio@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-color duration-300"
              onMouseEnter={() => setCursorOption('pointer')}
              onMouseLeave={() => setCursorOption('arrow')}
            >
              thevynn.studio@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
      <div className="w-full min-h-[640px] mt-6 md:mt-0 relative">
        <CardProvider>
          {error ? (
            <div className="flex flex-col justify-center items-center h-full" aria-live="assertive">
              <p className="text-lg font-semibold text-red-500 mb-4">{error}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex justify-center items-center h-full" aria-live="polite">
              <p className="text-lg font-semibold text-gray-600">No projects found.</p>
            </div>
          ) : (
            <div role="list" aria-label="Project list" className='size-full'>
              {projects.map((project, index) => (
                <DraggableCard
                  key={index}
                  title={project.title}
                  date={project.date}
                  thumbnailUrl={`/images/thumbnails/${project.slug}.png`}
                  fallbackThumbnailUrl="/images/thumbnails/default-thumbnail.svg"
                  link={`/projects/${project.slug}`}
                />
              ))}
            </div>
          )}
        </CardProvider>
      </div>
    </motion.div>
  );
}
