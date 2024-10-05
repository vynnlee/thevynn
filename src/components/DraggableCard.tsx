// src/components/DraggableCard.tsx
"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
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

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
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
    [activateCard, position.x, position.y]
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
    [isDragging, offset.x, offset.y, parentBounds, cardBounds, clamp]
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

      if (parentRef.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        const touchX = touch.clientX - parentRect.left;
        const touchY = touch.clientY - parentRect.top;

        setOffset({
          x: touchX - position.x,
          y: touchY - position.y,
        });
      }

      e.preventDefault(); // 기본 터치 동작 방지
    },
    [activateCard, position.x, position.y]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging && parentBounds && cardBounds) {
        e.preventDefault(); // 기본 터치 동작 방지

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
    [isDragging, offset.x, offset.y, parentBounds, cardBounds, clamp]
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

      // Define the boundaries for keyboard movement
      if (parentBounds && cardBounds) {
        const minX = 0;
        const minY = 0;
        const maxX = parentBounds.width - cardBounds.width;
        const maxY = parentBounds.height - cardBounds.height;

        newX = clamp(newX, minX, maxX);
        newY = clamp(newY, minY, maxY);
      }

      setPosition({ x: newX, y: newY });
      e.preventDefault();
    },
    [position.x, position.y, parentBounds, cardBounds, clamp]
  );

  // 클릭 및 리플 효과 핸들러
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const ripple = document.createElement("span");
      const size = Math.max(
        e.currentTarget.clientWidth,
        e.currentTarget.clientHeight
      );
      const left =
        e.clientX - e.currentTarget.getBoundingClientRect().left - size / 2;
      const top =
        e.clientY - e.currentTarget.getBoundingClientRect().top - size / 2;

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
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
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
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return (
    <div
      ref={cardRef}
      style={{
        transform: `translate3d(${position.x}px, ${
          position.y
        }px, 0) rotate(${rotation}deg) scale(${
          isDragging ? 1.025 : isHovering ? 1.05 : 1
        })`,
        transition: isDragging
          ? "none" // 드래그 중에는 트랜지션 비활성화
          : `transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)`,
        boxShadow: isDragging
          ? "0 20px 50px rgba(0, 0, 0, 0.1)"
          : isHovering
          ? "0 10px 30px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)"
          : "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)",
        zIndex: currentZIndex,
        cursor: isDragging ? "grabbing" : "grab",
        position: "absolute", // 부모 요소를 기준으로 절대 위치 설정
        touchAction: "none", // 터치 동작 방지
      }}
      className="rounded-xl overflow-hidden focus:outline-none"
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
      <div className="flex flex-col p-1 bg-neutral-900/25 backdrop-blur-xl border border-white/15 cursor-move select-none relative overflow-hidden transition-transform duration-200">
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
          className="w-[240px] h-[240px] rounded-lg bg-white/15"
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
