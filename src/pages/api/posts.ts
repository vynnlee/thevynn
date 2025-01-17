import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category } = req.query;

  if (typeof category !== 'string') {
    return res.status(400).json({ error: 'Category must be a string' });
  }

  try {
    const postsDirectory = path.join(process.cwd(), `src/content/posts/${category}`);
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames.map(fileName => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug: fileName.replace(/\.(md|mdx)$/, ''),
        title: data.title,
        date: data.date,
        description: data.description,
        content,
      };
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}
