import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

// 정적 경로 생성
export async function generateStaticParams() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.(md|mdx)$/, ""), // 확장자 제거
  }));
}

// 특정 포스트 데이터를 불러오는 함수
async function getPostData(slug: string) {
  const mdPath = path.join(postsDirectory, `${slug}.md`);
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);

  let fullPath = "";
  if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    fullPath = mdPath;
  } else {
    return null; // 파일이 없으면 null 반환
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  // gray-matter를 사용해 frontmatter와 콘텐츠를 분리
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data, // title, date, description과 같은 메타데이터
    content, // MDX 콘텐츠
  };
}

// 페이지 컴포넌트
export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostData(params.slug);

  if (!post) {
    notFound(); // 포스트가 없을 경우 404 처리
  }

  const { frontmatter, content } = post;

  return (
    <div className="container mx-auto p-4">
      {/* frontmatter로부터 title, date 등을 추출 */}
      <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
      <p className="text-gray-600 mb-6">Published on {frontmatter.date}</p>

      {/* MDX 콘텐츠만 렌더링 */}
      <div className="prose max-w-none">
        <MDXRemote source={content} />
      </div>
    </div>
  );
}
