'use client';

import { motion } from 'framer-motion';
import { containerVariants, childVariants } from '@/animations';
import { useCursor } from '@/contexts/CursorContext';

export default function Library() {
  const { setCursorOption } = useCursor();

  return (
    <motion.div variants={containerVariants} className="mx-auto w-full max-w-screen-sm h-screen flex flex-col justify-center items-center p-8 pb-20 bg-white overflow-hidden">
      <motion.h1 variants={childVariants} className="text-center font-geist text-lg font-medium text-neutral-900 mb-1">Dynamic Cursor</motion.h1 >
      <motion.p variants={childVariants} className="text-center font-geist text-md font-regular text-neutral-700 mb-4">
        Introducing a new era of cursor.
      </motion.p>
      <motion.div variants={childVariants} className="grid grid-rows-2 grid-flow-col w-full gap-6">
        <button
          className="h-[120px] px-8 py-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 border-dotted border-neutral-200 font-geist font-regular text-md text-neutral-500 transition-all duration-200 ease-in-out"
          onMouseEnter={() => setCursorOption('pointer')}
          onMouseLeave={() => setCursorOption('arrow')}
        >
          Pointer
        </button>
        <button
          className="h-[120px] px-8 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border-dotted border-neutral-200 font-geist font-regular text-md text-neutral-500 transition-all duration-200 ease-in-out"
          onMouseEnter={() => setCursorOption('more')}
          onMouseLeave={() => setCursorOption('arrow')}
        >
          More
        </button>
        <button
          className="h-[120px] px-8 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border-dotted border-neutral-200 font-geist font-regular text-md text-neutral-500 transition-all duration-200 ease-in-out"
          onMouseEnter={() => setCursorOption('link')}
          onMouseLeave={() => setCursorOption('arrow')}
        >
          Link
        </button>
        <button
          className="h-[120px] px-8 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border-dotted border-neutral-200 font-geist font-regular text-md text-neutral-500 transition-all duration-200 ease-in-out"
          onMouseEnter={() => setCursorOption('grab')}
          onMouseLeave={() => setCursorOption('arrow')}
        >
          Grab
        </button>
      </motion.div>
      
    </motion.div>
  );
}
