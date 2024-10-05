import { getAllPosts } from "@/utils/getPosts";
import Link from "next/link";

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/lab/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
