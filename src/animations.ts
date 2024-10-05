// animations.ts
import { Variants, Transition } from "framer-motion";

// 공통 전환 설정
export const commonTransition: Transition = {
  duration: 0.6,
  ease: [0, 0, 0, 1], // 커스텀 Bezier 곡선
};

// 컨테이너 변이
export const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2, // 자식 요소 간의 딜레이 시간 (초 단위)
    },
  },
  exit: {},
};

// 자식 요소 변이
export const childVariants: Variants = {
  initial: { opacity: 0, y: 50, filter: "blur(10px)" },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: commonTransition, // 공통 전환 적용
  },
  exit: { 
    opacity: 0, 
    y: 50,
    filter: "blur(10px)",
    transition: commonTransition, // 공통 전환 적용
  },
};
