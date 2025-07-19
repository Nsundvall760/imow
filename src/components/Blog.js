import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, Eye } from 'lucide-react';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: "Pro League Season 3 Announcement",
      excerpt: "Big news! I'm officially joining the Pro League Season 3 roster. This is a dream come true and I can't wait to represent our community at the highest level.",
      category: "announcement",
      author: "Im0w",
      date: "2024-01-15",
      readTime: "3 min read",
      views: "12.5K",
      tags: ["Pro League", "Tournament", "Announcement"],
      featured: true,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'%3E%3Crect width='600' height='300' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' fill='%2300d4ff'%3EPro League Announcement%3C/text%3E%3C/svg%3E"
    },
    {
      id: 2,
      title: "New Training Routine for ABI Players",
      excerpt: "After months of testing and refinement, I'm sharing my complete training routine that helped me reach the top 1% in ABI competitive rankings.",
      category: "guide",
      author: "Im0w",
      date: "2024-01-12",
      readTime: "8 min read",
      views: "8.9K",
      tags: ["Training", "ABI", "Guide"],
      featured: false,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'%3E%3Crect width='600' height='300' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' fill='%2300ff88'%3ETraining Routine%3C/text%3E%3C/svg%3E"
    },
    {
      id: 3,
      title: "Community Tournament Results",
      excerpt: "The first Im0w Community Tournament was a massive success! Here are the results, highlights, and what's coming next for our community events.",
      category: "community",
      author: "Im0w",
      date: "2024-01-10",
      readTime: "5 min read",
      views: "6.2K",
      tags: ["Tournament", "Community", "Results"],
      featured: false,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'%3E%3Crect width='600' height='300' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' fill='%238b5cf6'%3ETournament Results%3C/text%3E%3C/svg%3E"
    },
    {
      id: 4,
      title: "Equipment Setup 2024",
      excerpt: "Updated my gaming setup for 2024! Here's everything I'm using to maintain peak performance in competitive matches.",
      category: "setup",
      author: "Im0w",
      date: "2024-01-08",
      readTime: "6 min read",
      views: "15.3K",
      tags: ["Setup", "Equipment", "2024"],
      featured: false,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'%3E%3Crect width='600' height='300' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' fill='%23ff6b6b'%3EEquipment Setup%3C/text%3E%3C/svg%3E"
    },
    {
      id: 5,
      title: "Stream Schedule Update",
      excerpt: "New year, new schedule! I'm adjusting my streaming hours to better accommodate our global community and improve stream quality.",
      category: "announcement",
      author: "Im0w",
      date: "2024-01-05",
      readTime: "2 min read",
      views: "9.7K",
      tags: ["Schedule", "Streaming", "Update"],
      featured: false,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'%3E%3Crect width='600' height='300' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' fill='%23ffd93d'%3EStream Schedule%3C/text%3E%3C/svg%3E"
    },
    {
      id: 6,
      title: "ABI Meta Analysis: Current Patch",
      excerpt: "Deep dive into the current ABI meta, optimal strategies, and how the latest patch has changed competitive play.",
      category: "analysis",
      author: "Im0w",
      date: "2024-01-03",
      readTime: "10 min read",
      views: "7.8K",
      tags: ["Meta", "Analysis", "ABI"],
      featured: false,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'%3E%3Crect width='600' height='300' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' fill='%236c5ce7'%3EMeta Analysis%3C/text%3E%3C/svg%3E"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    { id: 'announcement', name: 'Announcements', count: 2 },
    { id: 'guide', name: 'Guides', count: 1 },
    { id: 'community', name: 'Community', count: 1 },
    { id: 'setup', name: 'Setup', count: 1 },
    { id: 'analysis', name: 'Analysis', count: 1 }
  ];

  const filteredPosts = blogPosts.filter(post => 
    activeCategory === 'all' || post.category === activeCategory
  );

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <section id="blog" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-gaming font-bold mb-6">
              <span className="glow-text">LATEST NEWS</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay updated with the latest announcements, guides, and insights from the Im0w universe. 
              From tournament results to equipment reviews, everything you need to know is here.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-gaming font-bold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-neon-blue text-dark-bg shadow-[0_0_20px_rgba(0,212,255,0.5)]'
                    : 'bg-card-bg text-gray-300 hover:text-neon-blue hover:bg-gray-800/50'
                }`}
              >
                {category.name}
                <span className="ml-2 text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {featuredPost && activeCategory === 'all' && (
            <div className="mb-16">
              <h3 className="text-2xl font-gaming text-neon-green mb-8 text-center">
                Featured Post
              </h3>
              <div className="card-glow overflow-hidden group hover:scale-105 transition-all duration-500">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative overflow-hidden">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-neon-blue text-dark-bg px-3 py-1 rounded-full text-sm font-gaming font-bold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{featuredPost.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye size={14} />
                        <span>{featuredPost.views}</span>
                      </div>
                    </div>
                    <h4 className="text-3xl font-gaming font-bold text-white mb-4 group-hover:text-neon-blue transition-colors duration-300">
                      {featuredPost.title}
                    </h4>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="cyber-button w-fit">
                      Read More
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="card-glow group hover:scale-105 transition-all duration-300">
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-neon-green text-dark-bg px-3 py-1 rounded-full text-sm font-gaming font-bold capitalize">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h4 className="text-xl font-gaming font-bold text-white mb-3 group-hover:text-neon-blue transition-colors duration-300">
                    {post.title}
                  </h4>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    <button className="text-neon-blue hover:text-neon-green transition-colors duration-300">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="text-center mt-16">
            <div className="card-glow p-8 max-w-2xl mx-auto">
              <h3 className="text-3xl font-gaming text-neon-purple mb-4">
                Never Miss an Update
              </h3>
              <p className="text-gray-300 mb-6">
                Subscribe to get notified about new posts, tournament announcements, and exclusive content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="cyber-button">
                  <ArrowRight size={20} className="mr-2" />
                  View All Posts
                </button>
                <button className="cyber-button border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg">
                  Subscribe to Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog; 