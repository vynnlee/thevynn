"use client"

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useCursor } from '@/contexts/CursorContext'
import { interpolate } from 'flubber'
import { cursorPaths } from './cursors/paths'
import { motion, AnimatePresence } from 'framer-motion'
import { LucideIcon } from '@/lib/lucide-icon'

interface CursorConfig {
  text: string
  icon: string
  path: string
  showChip: boolean
}

const cursorConfigs: Record<string, CursorConfig> = {
  arrow: { text: '', icon: '', path: cursorPaths.arrow, showChip: false },
  grab: { text: '', icon: '', path: cursorPaths.grab, showChip: false },
  move: { text: '', icon: '', path: cursorPaths.move, showChip: false },
  pointer: { text: '', icon: '', path: cursorPaths.pointer, showChip: false },
  zoomIn: { text: '', icon: '', path: cursorPaths.zoomIn, showChip: false },
  zoomOut: { text: '', icon: '', path: cursorPaths.zoomOut, showChip: false },
  link: { text: 'Open', icon: 'ArrowUpRight', path: cursorPaths.arrow, showChip: true },
  more: { text: 'More', icon: 'Plus', path: cursorPaths.arrow, showChip: true },
}

type CursorOption = keyof typeof cursorConfigs

interface DynamicCursorProps {
  size?: number
  fillColor?: string
  backdropBlur?: string
}

const DynamicCursor: React.FC<DynamicCursorProps> = React.memo(({
  size = 16,
  fillColor = 'currentColor',
  backdropBlur = '0px',
}) => {
  const { cursorOption } = useCursor()
  const cursorWrapperRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [currentPath, setCurrentPath] = useState<string>(cursorConfigs.arrow.path)
  const [nextPath, setNextPath] = useState<string>(cursorConfigs.arrow.path)
  const animationRef = useRef<number>()
  const [showChip, setShowChip] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  const cursorConfig = useMemo(() => cursorConfigs[cursorOption], [cursorOption])

  const updateCursorState = useCallback(() => {
    if (cursorConfig) {
      setNextPath(cursorConfig.path)
      setShowChip(cursorConfig.showChip)
    }
  }, [cursorConfig])

  const easeOutQuad = (t: number) => t * (2 - t)

  const animatePath = useCallback(() => {
    if (currentPath === nextPath) return

    const interpolatePath = interpolate(currentPath, nextPath, { maxSegmentLength: 2 })
    const duration = 100
    const start = performance.now()

    const animate = (time: number) => {
      const elapsed = time - start
      const linearProgress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuad(linearProgress) // Ease Out Quad 적용
      const newPath = interpolatePath(easedProgress)
      setCurrentPath(newPath)

      if (linearProgress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nextPath])


  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX
    const y = e.clientY
    setCursorPosition({ x, y })

    if (cursorWrapperRef.current) {
      cursorWrapperRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }

    // Check if cursor is at the edge of the screen
    const edgeThreshold = 5 // pixels from the edge to trigger hiding
    const isAtEdge =
      x <= edgeThreshold ||
      y <= edgeThreshold ||
      x >= window.innerWidth - edgeThreshold ||
      y >= window.innerHeight - edgeThreshold

    setIsVisible(!isAtEdge)
  }, [])

  useEffect(() => {
    updateCursorState()
  }, [updateCursorState])

  useEffect(() => {
    return animatePath()
  }, [animatePath])

  useEffect(() => {
    if (pathRef.current) {
      pathRef.current.setAttribute('d', currentPath)
    }
  }, [currentPath])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  if (!isVisible) return null

  return (
    <div
      ref={cursorWrapperRef}
      className="pointer-events-none overflow-visible fixed top-0 left-0 z-50 flex items-center justify-center will-change-transform rounded-full backdrop-blur-md transition-[width,height,border-radius,background-color,backdrop-filter] duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{
        border: showChip ? "1px rgba(255, 255, 255, .6)" : "0px rgba(255, 255, 255, 0)",
        '--cursor-width': showChip ? '80px' : '12px',
        '--cursor-height': showChip ? '32px' : '12px',
        width: 'var(--cursor-width)',
        height: 'var(--cursor-height)',
        backgroundColor: showChip ? 'rgba(38, 38, 38, 0.5)' : 'rgba(38, 38, 38, 0)',
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      } as React.CSSProperties}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {!showChip && (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              mixBlendMode: 'difference',
              opacity: 1,
              transform: 'rotate(-15deg)',
            }}
            stroke="rgb(255 255 255 / 0.7)"
            strokeWidth="0.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="8"
          >
            <path
              ref={pathRef}
              d={currentPath}
              fill="rgb(38 38 38 / 0.7)"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <AnimatePresence>
        {showChip && (
          <motion.div
            className="flex items-center justify-center text-white z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.35,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <span className="flex flex-row gap-[3px] items-center justify-center font-geist text-sm font-medium pt-[3px] pb-[4px] pl-[6px] pr-[4px] whitespace-nowrap">
              {cursorConfig.text}
              {cursorConfig.icon && (
                <LucideIcon
                  name={cursorConfig.icon}
                  className="size-[18px] text-white/60 ease-in-out"
                />
              )}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

DynamicCursor.displayName = 'DynamicCursor'

export default DynamicCursor