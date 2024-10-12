import { getAllPosts } from '@/utils/getPosts';
import Link from 'next/link';
import { BookCover } from '@/components/BookCover';

export default function Lab() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto w-full flex-1 p-6 pt-8 relative h-screen bg-gray-100 overflow-hidden">
      <div className="pt-20 lg:pt-24 w-full h-screen overflow-y-scroll flex justify-center flex-col lg:flex-row gap-24 lg:gap-12 overflow-visible">
        <BookCover
          rotate={20}
          rotateHover={0}
          perspective={1000}
          transitionDuration={1}
          radius={3}
          thickness={25}
          bgColor="white"
          width={264}
          height={446}
          pagesOffset={1}
        >
          <img src="https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937460876.jpg" />
        </BookCover>
        <BookCover
          rotate={20}
          rotateHover={0}
          perspective={1000}
          transitionDuration={1}
          radius={3}
          thickness={40}
          bgColor="white"
          width={264}
          height={446}
          pagesOffset={1}
        >
          <img src="https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937461804.jpg" />
        </BookCover>
        <BookCover
          rotate={20}
          rotateHover={0}
          perspective={1000}
          transitionDuration={1}
          radius={3}
          thickness={40}
          bgColor="white"
          width={264}
          height={446}
          pagesOffset={1}
        >
          <img src="https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463884.jpg" />
        </BookCover>
        <BookCover
          rotate={20}
          rotateHover={0}
          perspective={1000}
          transitionDuration={1}
          radius={3}
          thickness={40}
          bgColor="white"
          width={264}
          height={446}
          pagesOffset={1}
        >
          <img src="https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937461798.jpg" />
        </BookCover>
      </div>
    </main>
  );
}
