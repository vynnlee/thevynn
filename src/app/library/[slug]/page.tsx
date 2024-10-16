import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import Link from 'next/link';
import { LucideIcon } from '@/lib/lucide-icon';

// 하드코딩된 카테고리별로 포스트 디렉토리 경로 설정
const category = 'library'; // 'lab' 카테고리를 하드코딩

function getPostsDirectory() {
  return path.join(process.cwd(), `src/content/posts/${category}`);
}

// 정적 경로 생성 (하드코딩된 'lab' 카테고리 사용)
export async function generateStaticParams() {
  const postsDirectory = getPostsDirectory();
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map(fileName => ({
    slug: fileName.replace(/\.(md|mdx)$/, ''), // 확장자 제거
  }));
}

// 특정 하드코딩된 카테고리와 슬러그의 포스트 데이터를 불러오는 함수
async function getPostData(slug: string) {
  const postsDirectory = getPostsDirectory();
  const mdPath = path.join(postsDirectory, `${slug}.md`);
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);

  let fullPath = '';
  if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    fullPath = mdPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { frontmatter: data, content };
}

// 페이지 컴포넌트
export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  return (
    <main className="mx-auto w-full max-w-screen-sm flex-1 p-8 pt-16 relative h-screen bg-white overflow-hidden">
      <div className="w-full flex flex-row justify-between mb-6">
        <Link href="/lab" passHref>
          <button
            type="button"
            className="group flex flex-row items-center gap-1 p-1 rounded-md text-sm font-geistMono text-neutral-500 hover:bg-gray-100 transition-all duration-200 ease-in-out"
          >
            <LucideIcon
              name="ArrowLeft"
              className="size-4 group-hover:-translate-x-0.5 transition-all duration-200 ease-in-out"
            />
            Back
          </button>
        </Link>

        <div className="flex flex-row gap-1">
          <button
            type="button"
            className="group flex flex-row items-center gap-1 p-1 rounded-md text-sm font-geistMono text-neutral-500 hover:bg-gray-100 transition-all duration-200 ease-in-out"
          >
            <LucideIcon
              name="Share"
              className="size-4 group-hover:-translate-y-0.5 transition-all duration-200 ease-in-out"
            />
            Share
          </button>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <h1 className="font-geist text-lg text-neutral-900 font-medium">{frontmatter.title}</h1>
        <p className="font-geistMono text-sm text-neutral-600 font-regular">{frontmatter.date}</p>
      </div>

      <div className="font-geist text-neutral-800 prose max-w-none">
        <MDXRemote source={content} />
      </div>
    </main>
  );
}
