"use client"

import { useEffect, useRef, useState } from 'react'
import { useCursor } from '@/contexts/CursorContext'
import { interpolate } from 'flubber'
import { cursorPaths } from './cursors/paths'
import { motion, AnimatePresence } from 'framer-motion'
import { LucideIcon } from '@/lib/lucide-icon';

type CursorOption = 'arrow' | 'grab' | 'move' | 'pointer' | 'zoomIn' | 'zoomOut' | 'link'

const cursorOptions: CursorOption[] = ['arrow', 'grab', 'move', 'pointer', 'zoomIn', 'zoomOut', 'link']

interface DynamicCursorProps {
  size?: number
  fillColor?: string
  backdropBlur?: string
}

const DynamicCursor: React.FC<DynamicCursorProps> = ({
  size = 16,
  fillColor = 'currentColor',
  backdropBlur = '0px',
}) => {
  const { cursorOption } = useCursor()
  const cursorWrapperRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [currentPath, setCurrentPath] = useState<string>(cursorPaths['arrow'])
  const [nextPath, setNextPath] = useState<string>(cursorPaths['arrow'])
  const animationRef = useRef<number>()
  const [showChip, setShowChip] = useState(false)

  useEffect(() => {
    cursorOptions.forEach((option) => {
      const img = new window.Image()
      img.src = `/components/DynamicCursor/cursors/${option}.svg`
    })
  }, [])

  useEffect(() => {
    if (cursorPaths[cursorOption]) {
      setNextPath(cursorPaths[cursorOption])
    }
    setShowChip(cursorOption === 'link')
  }, [cursorOption])

  useEffect(() => {
    if (currentPath === nextPath) return

    const interpolatePath = interpolate(currentPath, nextPath, { maxSegmentLength: 2 })
    const duration = 10
    const start = performance.now()

    const animate = (time: number) => {
      const elapsed = time - start
      const progress = Math.min(elapsed / duration, 1)
      const newPath = interpolatePath(progress)
      setCurrentPath(newPath)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nextPath, currentPath])

  useEffect(() => {
    if (pathRef.current) {
      pathRef.current.setAttribute('d', currentPath)
    }
  }, [currentPath])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorWrapperRef.current) {
        const x = e.clientX
        const y = e.clientY
        cursorWrapperRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={cursorWrapperRef}
      className="pointer-events-none overflow-visible fixed top-0 left-0 z-50 flex items-center justify-center will-change-transform"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          mixBlendMode: 'difference',
          opacity: 1,
          transform: 'translate(-50%, -50%)',
        }}
        stroke="white"
        strokeWidth="0.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke-Miterlimit="8"
      >
        <path
          ref={pathRef}
          d={currentPath}
          fill="rgb(38 38 38 / 0.9)"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
      <AnimatePresence>
        {showChip && (
          <motion.div
            className="overflow-visible absolute flex items-center justify-center rounded-full bg-neutral-800/90 text-white backdrop-blur-md"
            style={{
              transform: 'translate(-25%, -50%)',
            }}
            initial={{
              width: size,
              height: size,
              opacity: 0.7,
              mixBlendMode: 'difference' as 'difference',
            }}
            animate={{
              width: 'auto',
              height: 'auto',
              opacity: 1,
              mixBlendMode: 'normal' as 'normal',
              transition: {
                duration: 0.3,
                ease: [0.32, 0.72, 0, 1],
              },
            }}
            exit={{
              width: size,
              height: size,
              opacity: 0,
              mixBlendMode: 'difference' as 'difference',
              transition: {
                duration: 0.2,
                ease: [0.32, 0.72, 0, 1],
              },
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.1,
                  duration: 0.2,
                  ease: [0.32, 0.72, 0, 1]
                }
              }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.1 } }}
              className="flex flex-row gap-1 items-center justify-center font-geist text-sm font-medium ml-[8px] mr-[4px] my-[3px] whitespace-nowrap"
            >
              Open
              <LucideIcon
                name="Plus"
                className="size-4 text-white/90 ease-in-out"
              />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DynamicCursor