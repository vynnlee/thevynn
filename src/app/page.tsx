import { getPostsData } from '@/utils/getPosts';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  try {
    const projects = await getPostsData("projects");
    return <HomeClient projects={projects} error={null} />;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return <HomeClient projects={[]} error="Failed to fetch projects" />;
  }
}
