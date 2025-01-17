import { getAllPosts } from '@/utils/getPosts';
import Link from 'next/link';

export default function Library() {
  const posts = getAllPosts("library");

  return (
    <main className="mx-auto w-full max-w-screen-sm flex-1 p-8 pt-16 relative h-screen bg-white overflow-hidden">
      <h1 className="font-geist text-lg font-medium text-neutral-900 mb-2">Library</h1>
      <p className="font-geist text-md font-regular text-neutral-700 mb-4">
        Read the axe for the frozen sea within us.
      </p>
      <ul>
        {posts.map(post => (
          <li key={post.slug} className="font-geist text-lg font-regular text-neutral-800">
            <Link href={`/library/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
