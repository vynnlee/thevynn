'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { useCursor } from '@/contexts/CursorContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CardContext } from '@/contexts/CardContext';
import { LucideIcon } from '@/lib/lucide-icon';

// 상수 정의
const ELASTICITY = 0.2;
const MAX_ELASTIC_DISTANCE = 200;
const INITIAL_ROTATION_RANGE = 15; // ±15도

// 드래그 가능한 카드의 Props 인터페이스
interface DraggableCardProps {
  title: string;
  date: string;
  thumbnailUrl: string;
  fallbackThumbnailUrl: string;
  link: string;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  title,
  date,
  thumbnailUrl,
  fallbackThumbnailUrl,
  link,
}) => {
  const [imgSrc, setImgSrc] = useState(thumbnailUrl);
  // 컨텍스트 및 훅 초기화
  const { setCursorOption } = useCursor();
  const { bringToFront } = useContext(CardContext);
  const router = useRouter();

  // 상태 관리
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 레퍼런스 초기화
  const cardRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLElement | null>(null);
  const parentBounds = useRef<DOMRect | null>(null);
  const cardBounds = useRef<DOMRect | null>(null);
  const requestRef = useRef<number | null>(null);

  /**
   * 초기 위치와 회전을 설정하는 함수
   */
  const initializePosition = useCallback(() => {
    if (cardRef.current && cardRef.current.parentElement) {
      parentRef.current = cardRef.current.parentElement;
      parentBounds.current = parentRef.current.getBoundingClientRect();
      cardBounds.current = cardRef.current.getBoundingClientRect();

      const { width: parentWidth, height: parentHeight } = parentBounds.current;
      const { width: cardWidth, height: cardHeight } = cardBounds.current;

      const maxX = parentWidth - cardWidth;
      const maxY = parentHeight - cardHeight;

      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;

      setPosition({ x: randomX, y: randomY });

      // 랜덤 회전 각도 설정 (-15도에서 +15도)
      const randomRotation =
        Math.random() * (2 * INITIAL_ROTATION_RANGE) - INITIAL_ROTATION_RANGE;
      setRotation(randomRotation);
    }
  }, []);

  /**
   * 리사이즈 시 부모 및 카드의 경계를 업데이트하는 함수
   */
  const handleResize = useCallback(() => {
    if (parentRef.current && cardRef.current) {
      parentBounds.current = parentRef.current.getBoundingClientRect();
      cardBounds.current = cardRef.current.getBoundingClientRect();
    }
  }, []);

  // 초기화 및 리사이즈 이벤트 등록
  useEffect(() => {
    initializePosition();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initializePosition, handleResize]);

  /**
   * zIndex를 업데이트하여 카드를 최상위로 가져오는 함수
   */
  const bringCardToFront = useCallback(() => {
    const newZIndex = bringToFront();
    setZIndex(newZIndex);
  }, [bringToFront]);

  /**
   * 위치 값을 탄성적으로 제한하는 함수
   */
  const elasticClamp = useCallback(
    (value: number, min: number, max: number): number => {
      if (value < min) {
        const delta = min - value;
        return min - Math.min(delta * ELASTICITY, MAX_ELASTIC_DISTANCE);
      }
      if (value > max) {
        const delta = value - max;
        return max + Math.min(delta * ELASTICITY, MAX_ELASTIC_DISTANCE);
      }
      return value;
    },
    []
  );

  /**
   * 애니메이션 함수 - 위치를 목표 지점으로 부드럽게 이동
   */
  const animateToPosition = useCallback(
    (
      targetX: number,
      targetY: number,
      duration = 300,
      easingFunction = (t: number) => 1 - Math.pow(1 - t, 3) // easeOutCubic
    ) => {
      const startX = position.x;
      const startY = position.y;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunction(progress);

        const newX = startX + (targetX - startX) * easedProgress;
        const newY = startY + (targetY - startY) * easedProgress;

        setPosition({ x: newX, y: newY });

        if (progress < 1) {
          requestRef.current = requestAnimationFrame(animate);
        }
      };

      requestRef.current = requestAnimationFrame(animate);
    },
    [position.x, position.y]
  );

  /**
   * 드래그 시작 핸들러
   */
  const handleDragStart = useCallback(
    (clientX: number, clientY: number) => {
      bringCardToFront();
      setIsDragging(true);

      if (parentRef.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        setOffset({
          x: clientX - parentRect.left - position.x,
          y: clientY - parentRect.top - position.y,
        });
      }
    },
    [bringCardToFront, position.x, position.y]
  );

  /**
   * 드래그 이동 핸들러
   */
  const handleDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (isDragging && parentBounds.current && cardBounds.current && parentRef.current) {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }

        requestRef.current = requestAnimationFrame(() => {
          const parentRect = parentRef.current!.getBoundingClientRect();
          let newX = clientX - parentRect.left - offset.x;
          let newY = clientY - parentRect.top - offset.y;

          const minX = 0;
          const minY = 0;
          const maxX = parentBounds.current!.width - cardBounds.current!.width;
          const maxY = parentBounds.current!.height - cardBounds.current!.height;

          newX = elasticClamp(newX, minX, maxX);
          newY = elasticClamp(newY, minY, maxY);

          setPosition({ x: newX, y: newY });
        });
      }
    },
    [isDragging, offset.x, offset.y, elasticClamp]
  );

  /**
   * 드래그 종료 핸들러
   */
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    if (parentBounds.current && cardBounds.current) {
      const minX = 0;
      const minY = 0;
      const maxX = parentBounds.current.width - cardBounds.current.width;
      const maxY = parentBounds.current.height - cardBounds.current.height;

      const targetX = Math.max(minX, Math.min(maxX, position.x));
      const targetY = Math.max(minY, Math.min(maxY, position.y));

      if (targetX !== position.x || targetY !== position.y) {
        animateToPosition(targetX, targetY);
      }
    }
  }, [position.x, position.y, animateToPosition]);

  /**
   * 공통 드래그 시작 이벤트 핸들러 (마우스 및 터치)
   */
  const onDragStart = useCallback(
    (clientX: number, clientY: number) => {
      handleDragStart(clientX, clientY);
    },
    [handleDragStart]
  );

  /**
   * 공통 드래그 이동 이벤트 핸들러 (마우스 및 터치)
   */
  const onDragMove = useCallback(
    (clientX: number, clientY: number) => {
      handleDrag(clientX, clientY);
    },
    [handleDrag]
  );

  /**
   * 공통 드래그 종료 이벤트 핸들러 (마우스 및 터치)
   */
  const onDragEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  /**
   * 마우스 이벤트 핸들러
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onDragStart(e.clientX, e.clientY);
    },
    [onDragStart]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      onDragMove(e.clientX, e.clientY);
    },
    [onDragMove]
  );

  const handleMouseUp = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  /**
   * 터치 이벤트 핸들러
   */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      onDragStart(touch.clientX, touch.clientY);
      e.preventDefault();
    },
    [onDragStart]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      onDragMove(touch.clientX, touch.clientY);
    },
    [onDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  /**
   * 이벤트 리스너 등록 및 해제
   */
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
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

  /**
   * 클릭 핸들러 - 리플 효과 및 페이지 이동
   */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) return; // 드래그 중 클릭 방지

      // 리플 효과 생성
      const ripple = document.createElement('span');
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
      ripple.className = 'ripple';

      const card = e.currentTarget;
      card.appendChild(ripple);

      // 리플 효과 제거
      setTimeout(() => {
        ripple.remove();
      }, 600);

      // 페이지 이동
      setTimeout(() => {
        router.push(link);
      }, 300);
    },
    [router, link, isDragging]
  );

  /**
   * 키보드 이벤트 핸들러 (Enter 키로 클릭)
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        handleClick(e as any);
      }
    },
    [handleClick]
  );

  return (
    <div
      ref={cardRef}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg) scale(${isDragging ? 1.025 : isHovering ? 1.035 : 1
          })`,
        transition: isDragging
          ? 'none'
          : `transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)`,
        boxShadow: isDragging
          ? '0 20px 50px rgba(0, 0, 0, 0.1)'
          : isHovering
            ? '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.075)'
            : '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
        zIndex: zIndex,
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'absolute',
        touchAction: 'none',
      }}
      className="rounded-xl overflow-hidden focus:outline-none"
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-pressed={isDragging}
    >
      <div
        className="group flex flex-col p-1 bg-neutral-900/25 backdrop-blur-xl rounded-xl border border-white/15 cursor-move select-none relative overflow-hidden transition-transform duration-200"
        onMouseEnter={() => setCursorOption('grab')}
        onMouseLeave={() => setCursorOption('arrow')}
      >
        <div className="flex flex-row items-center gap-2 px-1 pb-1 justify-between">
          <div className="flex flex-row gap-1 items-center">
            <p className="font-geist font-regular text-xs text-white/90 tracking-wide">
              {title}
            </p>
            <LucideIcon
              name="ArrowRight"
              className="size-3 text-white group-hover:translate-x-1 transition-all duration-200 ease-in-out"
            />
          </div>
          <p className="font-geistMono font-regular text-xs text-white/50 tracking-wide">
            {date}
          </p>
        </div>
        <div className="w-[192px] h-[256px] rounded-md bg-white/15 relative pointer-events-none overflow-hidden">
          <Image
            src={imgSrc}
            alt={`${title} thumbnail`}
            fill
            style={{ objectFit: 'cover' }}
            quality={75}
            priority
            className="pointer-events-none"
            onError={() => setImgSrc(fallbackThumbnailUrl)}
          />
        </div>
      </div>
    </div>
  );
};

export default DraggableCard;
