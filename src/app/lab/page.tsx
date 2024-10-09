import { getAllPosts } from '@/utils/getPosts';
import Link from 'next/link';

export default function Lab() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto w-full max-w-screen-sm flex-1 p-8 pt-16 relative h-screen bg-white overflow-hidden">
      <h1 className="font-geist text-lg font-medium text-neutral-900 mb-2">Laboratory</h1>
      <p className="font-geist text-md font-regular text-neutral-700 mb-4">
        Analyze and explore UI design and interaction design in detail.
      </p>
      <ul>
        {posts.map(post => (
          <li key={post.slug} className="font-geist text-lg font-regular text-neutral-800">
            <Link href={`/lab/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
