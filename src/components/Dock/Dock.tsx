import { useRef, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import HomeLogo from "./images/Home.png";
import LabLogo from "./images/Lab.png";

const dockButtons = [
  { title: "Home", logo: HomeLogo, href: "/" },
  { title: "Lab", logo: LabLogo, href: "/lab" },
];

const Dock = () => {
  const dockButtonsWrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleItemsMouseEnter = (itemIndex: number) => {
    const expandSize = 6;
    const buttonElements = dockButtonsWrapper.current
      ?.children as HTMLCollectionOf<HTMLButtonElement>;

    if (!buttonElements) return;

    // Expand the hovered button
    buttonElements[itemIndex].style.width = `${expandSize}rem`;

    // Expand neighboring buttons
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
      ?.children as HTMLCollectionOf<HTMLButtonElement>;

    if (!buttonElements) return;

    // Reset the hovered button
    buttonElements[itemIndex].style.width = `${unexpandSize}em`;

    // Reset neighboring buttons
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

  const handleButtonClick = (href: string, index: number) => {
    const button = dockButtonsWrapper.current?.children[
      index
    ] as HTMLButtonElement;

    if (button) {
      button.classList.add("bounce-animation");
      setTimeout(() => {
        button.classList.remove("bounce-animation");
      }, 500); // 애니메이션 지속 시간 후 제거
    }

    router.push(href);
  };

  return (
    <div
      ref={dockButtonsWrapper}
      className="z-50 flex h-16 flex-row justify-center items-end bg-neutral-900/5 backdrop-blur-md border border-white/15 fixed bottom-4 left-0 right-0 px-2 bg-opacity-10 w-max m-auto rounded-xl"
    >
      {dockButtons.map((item, i) => (
        <button
          key={item.title}
          className="w-16 align-bottom dock-item relative flex flex-col items-center group transition-[width] duration-200 ease"
          onMouseEnter={() => handleItemsMouseEnter(i)}
          onMouseLeave={() => handleItemsMouseLeave(i)}
          onClick={() => handleButtonClick(item.href, i)}
          aria-label={item.title} // Accessibility improvement
        >
          <Image
            alt={`${item.title} icon`}
            className="select-none w-full"
            src={item.logo}
            width={512}
            height={512}
          />
          {/* Tooltip */}
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-[-10px] bg-black bg-opacity-40 backdrop-blur-lg text-white text-sm px-3 py-1 rounded-full opacity-0 invisible transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-[-15px] font-geistMono pointer-events-none">
            {item.title}
          </span>
        </button>
      ))}
    </div>
  );
};

export default memo(Dock);
