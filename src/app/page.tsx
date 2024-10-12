'use client';

import React from 'react';
import Image from 'next/image';

import { motion } from 'framer-motion';
import { containerVariants, childVariants } from '@/animations';

import DraggableCard from '@/components/DraggableCard';
import ChatBubble from '@/components/ChatBubble/ChatBubble';
import { CardProvider } from '@/contexts/CardContext';
import ProjectCard from '@/components/ProjectCard/ProjectCard';

export default function Home() {
  return (
    <motion.div
      className="mx-auto w-full flex flex-col lg:flex-row p-6 lg:p-8 relative h-screen bg-gray-100 overflow-hidden"
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
            <p className="font-geistMono font-bold text-sm">Seongbeen Lee</p>
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
              <ProjectCard
                title="ZeroShot"
                date="250101"
                thumbnailUrl="/images/logo_zeroshot.svg"
                link="/"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* <motion.div variants={childVariants} className="w-full">
          <ChatBubble label="Frantz" message="Hey there! What's up" isSender={true} />
        </motion.div> */}
      </div>
      <div className="flex-1">
        <CardProvider>
          <DraggableCard
            title="MDR Golf"
            date="230107"
            thumbnailUrl="/images/thumbnails/portfolio-mdr.png"
            link="/"
            initialPosition={{ x: 90, y: 20 }}
            rotation={-10}
          />
          <DraggableCard
            title="Metaverse"
            date="240216"
            thumbnailUrl="/images/thumbnails/portfolio-meta.png"
            link="/"
            initialPosition={{ x: 90, y: 20 }}
            rotation={-5}
          />
          <DraggableCard
            title="LCD Display"
            date="230523"
            thumbnailUrl="/images/thumbnails/portfolio-purespace.png"
            link="/"
            initialPosition={{ x: 90, y: 20 }}
            rotation={5}
          />
          <DraggableCard
            title="BetaProduct"
            date="240801"
            thumbnailUrl="/images/thumbnails/portfolio-beta.png"
            link="/"
            initialPosition={{ x: 90, y: 20 }}
            rotation={0}
          />
        </CardProvider>
      </div>
    </motion.div>
  );
}
