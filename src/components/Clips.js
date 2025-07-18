import React, { useState } from 'react';
import { Play, Eye, Heart, Share2, ExternalLink } from 'lucide-react';

const Clips = () => {
  const [activeTab, setActiveTab] = useState('featured');

  const clips = [
    {
      id: 1,
      title: "Insane ABI 1v4 Clutch",
      description: "Perfect positioning and precision shots in a high-pressure situation",
      views: "125K",
      likes: "8.2K",
      duration: "2:34",
      category: "featured",
      thumbnail: "https://via.placeholder.com/400x225/1a1a1a/00d4ff?text=ABI+Clutch"
    },
    {
      id: 2,
      title: "Tournament Finals Highlights",
      description: "Key moments from the championship match that secured victory",
      views: "89K",
      likes: "5.7K",
      duration: "4:12",
      category: "featured",
      thumbnail: "https://via.placeholder.com/400x225/1a1a1a/00ff88?text=Tournament+Finals"
    },
    {
      id: 3,
      title: "Strategy Breakdown: Map Control",
      description: "In-depth analysis of positioning and team coordination",
      views: "67K",
      likes: "3.9K",
      duration: "8:45",
      category: "educational",
      thumbnail: "https://via.placeholder.com/400x225/1a1a1a/8b5cf6?text=Strategy+Guide"
    },
    {
      id: 4,
      title: "Reaction to Pro League Announcement",
      description: "Genuine excitement and plans for the upcoming season",
      views: "45K",
      likes: "2.8K",
      duration: "3:21",
      category: "community",
      thumbnail: "https://via.placeholder.com/400x225/1a1a1a/ff6b6b?text=Pro+League+Reaction"
    },
    {
      id: 5,
      title: "Training Routine Revealed",
      description: "Daily practice methods that keep skills sharp",
      views: "78K",
      likes: "4.5K",
      duration: "6:18",
      category: "educational",
      thumbnail: "https://via.placeholder.com/400x225/1a1a1a/ffd93d?text=Training+Routine"
    },
    {
      id: 6,
      title: "Community Q&A Session",
      description: "Answering questions from viewers and sharing insights",
      views: "34K",
      likes: "2.1K",
      duration: "12:45",
      category: "community",
      thumbnail: "https://via.placeholder.com/400x225/1a1a1a/6c5ce7?text=Community+Q&A"
    }
  ];

  const categories = [
    { id: 'featured', name: 'Featured', count: 2 },
    { id: 'educational', name: 'Educational', count: 2 },
    { id: 'community', name: 'Community', count: 2 }
  ];

  const filteredClips = clips.filter(clip => activeTab === 'all' || clip.category === activeTab);

  return (
    <section id="clips" className="py-20 relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="card-glow p-10 md:p-16 bg-card-bg backdrop-blur-md rounded-2xl shadow-lg">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-gaming font-bold mb-6">
              <span className="glow-text">BEST MOMENTS</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Epic plays, strategic insights, and unforgettable moments from the stream. 
              Every clip tells a story of skill, determination, and pure gaming excellence.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-6 py-3 rounded-full font-gaming font-bold transition-all duration-300 ${
                  activeTab === category.id
                    ? 'bg-neon-blue text-dark-bg shadow-[0_0_20px_rgba(0,212,255,0.5)]'
                    : 'bg-card-bg text-gray-300 hover:text-neon-blue hover:bg-gray-800/50'
                }`}
              >
                {category.name}
                <span className="ml-2 text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>

          {/* Clips Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClips.map((clip) => (
              <div key={clip.id} className="card-glow group hover:scale-105 transition-all duration-300">
                {/* Thumbnail */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={clip.thumbnail} 
                    alt={clip.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="cyber-button">
                      <Play size={24} className="mr-2" />
                      Watch Clip
                    </button>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-mono">
                    {clip.duration}
                  </div>

                  {/* Play Button */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-neon-blue/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play size={24} className="text-dark-bg ml-1" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-gaming font-bold text-white mb-2 group-hover:text-neon-blue transition-colors duration-300">
                    {clip.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {clip.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye size={14} />
                        <span>{clip.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart size={14} />
                        <span>{clip.likes}</span>
                      </div>
                    </div>
                    <button className="text-neon-blue hover:text-neon-green transition-colors duration-300">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="card-glow p-8 max-w-2xl mx-auto">
              <h3 className="text-3xl font-gaming text-neon-green mb-4">
                Want More Content?
              </h3>
              <p className="text-gray-300 mb-6">
                Join the community to get notified about new clips, streams, and exclusive content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="cyber-button">
                  <ExternalLink size={20} className="mr-2" />
                  View All Clips
                </button>
                <button className="cyber-button border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg">
                  Subscribe to Channel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clips; 