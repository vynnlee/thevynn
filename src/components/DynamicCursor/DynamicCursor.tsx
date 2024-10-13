"use client"

import { useEffect, useRef, useState } from 'react'
import { useCursor } from '@/contexts/CursorContext'
import { interpolate } from 'flubber'
import { cursorPaths } from './cursors/paths'
import { motion, AnimatePresence } from 'framer-motion'

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
  const cursorRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const chipRef = useRef<HTMLDivElement>(null)
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
    const duration = 25
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
      if (cursorRef.current) {
        const x = e.clientX
        const y = e.clientY

        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`

        if (chipRef.current) {
          chipRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [size])

  return (
    <>
      <svg
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-50 will-change-transform"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          mixBlendMode: 'difference',
          opacity: 0.7,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <path
          ref={pathRef}
          d={currentPath}
          fill={fillColor}
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
      <AnimatePresence>
        {showChip && (
          <motion.div
            ref={chipRef}
            className="pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center rounded-full bg-gray-700/50 text-white backdrop-blur-md will-change-transform"
            initial={{
              width: "8px",
              height: "8px",
              opacity: 0.7,
              mixBlendMode: 'difference' as 'difference',
            }}
            animate={{
              width: 'auto',
              height: 'auto',
              opacity: 1,
              mixBlendMode: 'normal' as 'normal',
              transition: {
                duration: 30,
                ease: [0.32, 0.72, 0, 1], // Custom easing for Apple-like feel
              },
            }}
            exit={{
              width: "8px",
              height: "8px",
              opacity: 0,
              mixBlendMode: 'difference' as 'difference',
              transition: {
                duration: 2,
                ease: [0.32, 0.72, 0, 1],
              },
            }}
            style={{
              transform: 'translate(6px, -6px)',
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
              className="font-geist text-sm font-medium mx-3 my-1"
            >
              Link
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default DynamicCursor