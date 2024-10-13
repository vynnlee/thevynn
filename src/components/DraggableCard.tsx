// src/components/DraggableCard.tsx
'use client';

import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { useCursor } from '@/contexts/CursorContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CardContext } from '@/contexts/CardContext';
import { LucideIcon } from '@/lib/lucide-icon';

interface DraggableCardProps {
  title: string;
  date: string;
  thumbnailUrl: string;
  link: string;
  rotation?: number; // 2D 회전 각도 (deg)
  initialPosition?: { x: number; y: number }; // 초기 위치
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  title,
  date,
  thumbnailUrl,
  link,
  rotation = 0,
  initialPosition = { x: 100, y: 100 }, // 기본값 설정
}) => {
  const { setCursorOption } = useCursor();

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition); // 초기 위치를 prop에서 설정
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentZIndex, setCurrentZIndex] = useState(1);
  const requestRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { bringToFront } = useContext(CardContext);

  // Refs and state for boundaries
  const parentRef = useRef<HTMLElement | null>(null);
  const [parentBounds, setParentBounds] = useState<DOMRect | null>(null);
  const [cardBounds, setCardBounds] = useState<DOMRect | null>(null);

  // Helper function to clamp values
  const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  };

  // Set the parentRef and bounds after mount
  useEffect(() => {
    if (cardRef.current && cardRef.current.parentElement) {
      parentRef.current = cardRef.current.parentElement;
      setParentBounds(parentRef.current.getBoundingClientRect());
      setCardBounds(cardRef.current.getBoundingClientRect());
    }

    // Update bounds on window resize
    const handleResize = () => {
      if (parentRef.current) {
        setParentBounds(parentRef.current.getBoundingClientRect());
      }
      if (cardRef.current) {
        setCardBounds(cardRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 카드 활성화: 맨 앞으로 이동
  const activateCard = useCallback(() => {
    const newZIndex = bringToFront();
    setCurrentZIndex(newZIndex);
  }, [bringToFront]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      activateCard();
      setIsDragging(true);

      if (parentRef.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        const mouseX = e.clientX - parentRect.left;
        const mouseY = e.clientY - parentRect.top;

        setOffset({
          x: mouseX - position.x,
          y: mouseY - position.y,
        });
      }
    },
    [activateCard, position.x, position.y],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && parentBounds && cardBounds) {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }

        requestRef.current = requestAnimationFrame(() => {
          const parentRect = parentRef.current!.getBoundingClientRect();
          let newX = e.clientX - parentRect.left - offset.x;
          let newY = e.clientY - parentRect.top - offset.y;

          // Define the boundaries
          const minX = 0;
          const minY = 0;
          const maxX = parentBounds.width - cardBounds.width;
          const maxY = parentBounds.height - cardBounds.height;

          // Clamp the positions
          newX = clamp(newX, minX, maxX);
          newY = clamp(newY, minY, maxY);

          setPosition({
            x: newX,
            y: newY,
          });
        });
      }
    },
    [isDragging, offset.x, offset.y, parentBounds, cardBounds, clamp],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      activateCard();
      const touch = e.touches[0];
      setIsDragging(true);

      if (parentRef.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        const touchX = touch.clientX - parentRect.left;
        const touchY = touch.clientY - parentRect.top;

        setOffset({
          x: touchX - position.x,
          y: touchY - position.y,
        });
      }

      e.preventDefault();
    },
    [activateCard, position.x, position.y],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging && parentBounds && cardBounds) {
        e.preventDefault();

        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }

        requestRef.current = requestAnimationFrame(() => {
          const touch = e.touches[0];
          const parentRect = parentRef.current!.getBoundingClientRect();
          let newX = touch.clientX - parentRect.left - offset.x;
          let newY = touch.clientY - parentRect.top - offset.y;

          // Define the boundaries
          const minX = 0;
          const minY = 0;
          const maxX = parentBounds.width - cardBounds.width;
          const maxY = parentBounds.height - cardBounds.height;

          // Clamp the positions
          newX = clamp(newX, minX, maxX);
          newY = clamp(newY, minY, maxY);

          setPosition({
            x: newX,
            y: newY,
          });
        });
      }
    },
    [isDragging, offset.x, offset.y, parentBounds, cardBounds, clamp],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const ripple = document.createElement('span');
      const size = Math.max(e.currentTarget.clientWidth, e.currentTarget.clientHeight);
      const left = e.clientX - e.currentTarget.getBoundingClientRect().left - size / 2;
      const top = e.clientY - e.currentTarget.getBoundingClientRect().top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${left}px`;
      ripple.style.top = `${top}px`;
      ripple.className = 'ripple';

      const card = e.currentTarget;
      card.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);

      setTimeout(() => {
        router.push(link);
      }, 300);
    },
    [router, link],
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={cardRef}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg) scale(${
          isDragging ? 1.025 : isHovering ? 1.035 : 1
        })`,
        transition: isDragging
          ? 'none'
          : `transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)`,
        boxShadow: isDragging
          ? '0 20px 50px rgba(0, 0, 0, 0.1)'
          : isHovering
            ? '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.075)'
            : '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
        zIndex: currentZIndex,
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'absolute',
        touchAction: 'none',
      }}
      className="rounded-xl overflow-hidden focus:outline-none"
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onKeyDown={e => {
        if (e.key === 'Enter') handleClick(e as any);
      }}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-pressed={isDragging}
    >
      <div className="group flex flex-col p-1 bg-neutral-900/25 backdrop-blur-xl rounded-xl border border-white/15 cursor-move select-none relative overflow-hidden transition-transform duration-200" onMouseEnter={() => setCursorOption('grab')}
      onMouseLeave={() => setCursorOption('arrow')}>
        <div className="flex flex-row items-center gap-2 px-1 pb-1 justify-between">
          <div className="flex flex-row gap-1 items-center">
            <p className="font-geist font-regular text-xs text-white/90 tracking-wide">{title}</p>
            <LucideIcon
              name="ArrowRight"
              className="size-3 text-white group-hover:translate-x-1 transition-all duration-200 ease-in-out"
            />
          </div>
          <p className="font-geistMono font-regular text-xs text-white/50 tracking-wide">{date}</p>
        </div>
        {/* Thumbnail 설정 - Next.js Image 컴포넌트 사용 */}
        <div className="w-[192px] h-[256px] rounded-md bg-white/15 relative pointer-events-none overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt={`${title} thumbnail`}
            layout="fill"
            objectFit="cover"
            quality={75}
            priority={true}
            className="pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default DraggableCard;
