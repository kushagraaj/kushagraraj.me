// src/components/BlogContent.jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import fm from 'front-matter';

const BlogContent = ({ setView }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const modules = import.meta.glob('/public/posts/*.md', { as: 'raw' });

      const postsData = await Promise.all(
        Object.entries(modules).map(async ([path, resolver]) => {
          const rawContent = await resolver();
          const { attributes, body } = fm(rawContent);
          return {
            slug: path.split('/').pop().replace('.md', ''),
            frontmatter: attributes,
            content: body,
          };
        })
      );
      
      postsData.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  if (selectedPost) {
    return (
      <div>
        <button onClick={() => setSelectedPost(null)} className="text-blue-600 hover:underline mb-8">
          &larr; Back to All Posts
        </button>
        <div className="prose max-w-none">
          <h1>{selectedPost.frontmatter.title}</h1>
          <p className="text-gray-500 text-sm">
            {new Date(selectedPost.frontmatter.date).toLocaleDateString()}
          </p>
          <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setView('home')} className="text-blue-600 hover:underline mb-8">
        &larr; Back to Home
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Blog</h1>
      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.slug}>
              <h2 className="text-xl font-semibold text-gray-900">
                <button onClick={() => handlePostClick(post)} className="text-left hover:text-blue-600 transition-colors">
                  {post.frontmatter.title}
                </button>
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(post.frontmatter.date).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.frontmatter.tags && post.frontmatter.tags.map((tag) => (
                  <span key={tag} className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Loading posts...</p>
        )}
      </div>
    </div>
  );
};

export default BlogContent;