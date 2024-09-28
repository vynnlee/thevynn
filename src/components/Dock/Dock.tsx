import { useRef, memo } from "react";
import Image from "next/image"; // next/image에서 Image 컴포넌트를 import

// 이미지 파일을 import
import HomeLogo from "./images/Home.png";
import LabLogo from "./images/Lab.png";

const dockButtons = [
  { title: "Home", logo: HomeLogo },
  { title: "Lab", logo: LabLogo },
];

const Dock = () => {
  const dockButtonsWrapper = useRef<HTMLDivElement>(null);

  const handleItemsMouseEnter = (itemIndex: number) => {
    const expandSize = 8;
    const buttonElements = dockButtonsWrapper.current
      ?.children as HTMLCollectionOf<HTMLDivElement>;

    if (!buttonElements) return;

    buttonElements[itemIndex].style.width = `${expandSize}rem`;

    if (itemIndex > 0) {
      buttonElements[itemIndex - 1].style.width = `${expandSize - 1.5}rem`;
      if (itemIndex > 1) {
        buttonElements[itemIndex - 2].style.width = `${expandSize - 2.5}rem`;
      }
    }

    if (itemIndex < dockButtons.length - 1) {
      buttonElements[itemIndex + 1].style.width = `${expandSize - 1.5}rem`;
      if (itemIndex < dockButtons.length - 2) {
        buttonElements[itemIndex + 2].style.width = `${expandSize - 2.5}rem`;
      }
    }
  };

  const handleItemsMouseLeave = (itemIndex: number) => {
    const unexpandSize = 4;
    const buttonElements = dockButtonsWrapper.current
      ?.children as HTMLCollectionOf<HTMLDivElement>;

    if (!buttonElements) return;

    buttonElements[itemIndex].style.width = `${unexpandSize}em`;

    if (itemIndex > 0) {
      buttonElements[itemIndex - 1].style.width = `${unexpandSize}em`;
      if (itemIndex > 1) {
        buttonElements[itemIndex - 2].style.width = `${unexpandSize}em`;
      }
    }

    if (itemIndex < dockButtons.length - 1) {
      buttonElements[itemIndex + 1].style.width = `${unexpandSize}em`;
      if (itemIndex < dockButtons.length - 2) {
        buttonElements[itemIndex + 2].style.width = `${unexpandSize}em`;
      }
    }
  };

  return (
    <div
      ref={dockButtonsWrapper}
      className="flex h-16 flex-row justify-center items-end bg-neutral-900/5 backdrop-blur-md border border-white/15 fixed bottom-4 left-0 right-0 px-2 bg-opacity-10 w-max m-auto rounded-xl"
    >
      {dockButtons.map((item, i) => (
        <button
          key={item.title}
          className="w-16 align-bottom dock-item"
          style={{ transition: "all ease .2s" }}
          onMouseEnter={() => handleItemsMouseEnter(i)}
          onMouseLeave={() => handleItemsMouseLeave(i)}
        >
          <Image
            alt={`${item.title} icon`}
            className="select-none w-full"
            src={item.logo}
            width={512} // 이미지의 넓이 지정
            height={512} // 이미지의 높이 지정
          />
        </button>
      ))}
    </div>
  );
};

export default memo(Dock);
