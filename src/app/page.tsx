'use client';

import React from 'react';
import Image from 'next/image';
import { useCursor } from '@/contexts/CursorContext';

import { motion } from 'framer-motion';
import { containerVariants, childVariants } from '@/animations';

import DraggableCard from '@/components/DraggableCard';
import ChatBubble from '@/components/ChatBubble/ChatBubble';
import { CardProvider } from '@/contexts/CardContext';
import ProjectCard from '@/components/ProjectCard/ProjectCard';

import InteractiveElements from '../components/InteractiveElements';

export default function Home() {
  const { setCursorOption } = useCursor();

  return (
    <motion.div
      className="overflow-y-scroll mx-auto w-full flex flex-col md:flex-row p-6 lg:p-8 relative min-h-screen bg-white"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div
        className="w-full max-w-[400px] flex flex-col gap-4"
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

          {/* Carousel container with fixed mask effect */}
          <div
            className="relative w-full"
            style={{
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
            }}
          >
            {/* Draggable and scrollable content without visible scrollbar */}
            <motion.div
              className="flex flex-row gap-2 overflow-visible"
              drag="x"
              dragConstraints={{ left: -200, right: 0 }} // Adjust based on content size
              dragElastic={0.05} // Slightly elastic drag effect
              whileTap={{ cursor: "grabbing" }}
              style={{ cursor: 'grab' }} // Ensures the cursor changes on hover
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
                link="/"
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

        {/* <motion.div variants={childVariants} className="w-full">
          <ChatBubble label="Frantz" message="Hey there! What's up" isSender={true} />
        </motion.div> */}
      </div>

      <div className="w-full min-h-[640px] mt-6 md:mt-0 relative">
        <CardProvider>
          <DraggableCard
            title="MDR Golf"
            date="230107"
            thumbnailUrl="/images/thumbnails/portfolio-mdr.png"
            link="/"

          />
          <DraggableCard
            title="Metaverse"
            date="240216"
            thumbnailUrl="/images/thumbnails/portfolio-meta.png"
            link="/"

          />
          <DraggableCard
            title="LCD Display"
            date="230523"
            thumbnailUrl="/images/thumbnails/portfolio-purespace.png"
            link="/"

          />
          <DraggableCard
            title="BetaProduct"
            date="240801"
            thumbnailUrl="/images/thumbnails/portfolio-beta.png"
            link="/"

          />
        </CardProvider>
      </div>
    </motion.div>
  );
}
