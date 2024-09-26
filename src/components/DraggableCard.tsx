import React, { useState, useRef, useEffect } from "react";

const DraggableCard: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
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
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  return (
    <div
      style={{
        transform: `scale(${isDragging ? 1.05 : 1})`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease", // Transition for both scale and shadow
        boxShadow: isDragging
          ? "0 8px 24px rgba(0, 0, 0, 0.25)"
          : "0 4px 12px rgba(0, 0, 0, 0.2)", // Smooth shadow transition
      }}
      className="absolute rounded-xl overflow-hidden"
      onMouseDown={handleMouseDown}
    >
      <div className="flex flex-col p-1  w-[24rem] bg-neutral-900/50 backdrop-blur-md cursor-move select-none">
        <div className="flex flex-row gap-2 justify-between">
          <p className="px-2 pt-1 pb-2 font-geistMono font-regular text-sm text-white/90 tracking-wide">
            OpenTypo
          </p>
          <p className="px-2 pt-1 pb-2 font-geistMono font-light text-sm text-white/50 tracking-wide">
            240924
          </p>
        </div>
        <div className="h-[180px] rounded-lg bg-white/15 w-full"></div>
      </div>
    </div>
  );
};

export default DraggableCard;
