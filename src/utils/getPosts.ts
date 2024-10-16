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

// 모든 포스트 데이터를 가져오는 함수 (카테고리별로)
export function getAllPosts(category: string): Post[] {
  const postsDirectory = path.join(
    process.cwd(),
    `src/content/posts/${category}`,
  );
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames.map(fileName => {
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
