// src/components/DraggableCard.tsx
"use client";

import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CardContext } from "@/contexts/CardContext";

interface DraggableCardProps {
  title: string;
  date: string;
  thumbnailUrl: string;
  link: string;
  rotation?: number; // 2D 회전 각도 (deg)
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  title,
  date,
  thumbnailUrl,
  link,
  rotation = 0,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 }); // 초기 위치
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentZIndex, setCurrentZIndex] = useState(1);
  const requestRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { bringToFront } = useContext(CardContext);

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
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [activateCard, position.x, position.y]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }

        requestRef.current = requestAnimationFrame(() => {
          setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
          });
        });
      }
    },
    [isDragging, offset.x, offset.y]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      activateCard();
      const touch = e.touches[0];
      setIsDragging(true);
      setOffset({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    },
    [activateCard, position.x, position.y]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging) {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }

        requestRef.current = requestAnimationFrame(() => {
          const touch = e.touches[0];
          setPosition({
            x: touch.clientX - offset.x,
            y: touch.clientY - offset.y,
          });
        });
      }
    },
    [isDragging, offset.x, offset.y]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  // 호버 이벤트 핸들러
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // 키보드 이벤트 핸들러 (접근성)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const step = 10; // 이동할 픽셀 수
      let newX = position.x;
      let newY = position.y;

      switch (e.key) {
        case "ArrowUp":
          newY -= step;
          break;
        case "ArrowDown":
          newY += step;
          break;
        case "ArrowLeft":
          newX -= step;
          break;
        case "ArrowRight":
          newX += step;
          break;
        default:
          return; // 나머지 키는 무시
      }

      setPosition({ x: newX, y: newY });
      e.preventDefault();
    },
    [position.x, position.y]
  );

  // 클릭 및 리플 효과 핸들러
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const ripple = document.createElement("span");
      const size = Math.max(e.currentTarget.clientWidth, e.currentTarget.clientHeight);
      const left = e.clientX - e.currentTarget.getBoundingClientRect().left - size / 2;
      const top = e.clientY - e.currentTarget.getBoundingClientRect().top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${left}px`;
      ripple.style.top = `${top}px`;
      ripple.className = "ripple";

      const card = e.currentTarget;
      card.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);

      // Ripple 효과 후 링크로 이동
      setTimeout(() => {
        router.push(link);
      }, 300);
    },
    [router, link]
  );

  // 드래그 시 이벤트 리스너 추가
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    }

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={cardRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${
          isDragging ? 1.025 : isHovering ? 1.05 : 1
        }) rotate(${rotation}deg)`,
        transition: isDragging
          ? "transform 0.1s cubic-bezier(0.25, 0.1, 0.25, 1)"
          : "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
        boxShadow: isDragging
          ? "0 20px 50px rgba(0, 0, 0, 0.1)"
          : isHovering
          ? "0 10px 30px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)"
          : "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)",
        zIndex: currentZIndex,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      className="absolute rounded-xl overflow-hidden focus:outline-none"
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      tabIndex={0} // 키보드 포커스 가능하게 설정
      role="button" // 접근성 향상을 위한 역할 정의
      aria-pressed={isDragging} // ARIA 속성으로 드래그 상태 표시
    >
      <div className="flex flex-col p-1 bg-neutral-900/25 backdrop-blur-md cursor-move select-none relative overflow-hidden">
        <div className="flex flex-row gap-2 justify-between">
          <p className="px-2 pt-1 pb-2 font-geistMono font-regular text-sm text-white/90 tracking-wide">
            {title}
          </p>
          <p className="px-2 pt-1 pb-2 font-geistMono font-light text-sm text-white/50 tracking-wide">
            {date}
          </p>
        </div>
        {/* Thumbnail 설정 */}
        <div
          className="w-[240px] h-[240px] rounded-lg bg-white/15 w-full"
          style={{
            backgroundImage: `url(${thumbnailUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        {/* Ripple Effect */}
        <style jsx>{`
          .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
          }

          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DraggableCard;
