import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Post = {
  title: string;
  date: string;
  description?: string;
  content: string;
  slug: string;
};

const postsDirectory = path.join(process.cwd(), "src/content/posts");

// 모든 포스트 데이터를 가져오는 함수
export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);
    return {
      slug: fileName.replace(/\.(md|mdx)$/, ""), // 확장자 제거
      title: data.title,
      date: data.date,
      description: data.description,
      content,
    };
  });

  return allPosts;
}
