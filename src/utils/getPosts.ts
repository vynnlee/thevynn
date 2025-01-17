import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Post = {
  title: string;
  date: string;
  description?: string;
  content: string;
  slug: string;
};

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
      slug: fileName.replace(/\.(md|mdx)$/, ""), // Remove file extension
      title: data.title,
      date: data.date,
      description: data.description,
      content,
    };
  });

  return allPosts;
}

// This function will be used for getStaticProps
export async function getPostsData(category: string): Promise<Post[]> {
  return getAllPosts(category);
}
