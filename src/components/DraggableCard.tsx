import Draggable from "react-draggable";
import React from "react";

const DraggableCard: React.FC = () => {
  return (
    <Draggable scale={1}>
      <div className="flex flex-col p-1 rounded-xl max-w-[24rem] bg-neutral-900/50 backdrop-blur-md cursor-move transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-lg active:scale-125 active:shadow-2xl">
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
    </Draggable>
  );
};

export default DraggableCard;
