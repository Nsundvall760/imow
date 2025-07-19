import React from 'react';
import { Twitch, Twitter, Youtube, MessageCircle, Users, Heart, Eye, ExternalLink, Instagram, Video } from 'lucide-react';

const Social = () => {
  const socialPlatforms = [
    {
      name: 'Twitch',
      handle: '@imow',
      description: 'Live streams, competitive gameplay, and community interaction',
      icon: Twitch,
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/20',
      borderColor: 'border-neon-blue/50',
      hoverColor: 'hover:bg-neon-blue/30',
      url: 'https://www.twitch.tv/imow',
      stats: {
        viewers: '1.2K',
        hours: '1000+',
        followers: '50.2K'
      }
    },
    {
      name: 'Twitter/X',
      handle: '@ImOwFromYT',
      description: 'Updates, announcements, and behind-the-scenes content',
      icon: Twitter,
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/20',
      borderColor: 'border-neon-blue/50',
      hoverColor: 'hover:bg-neon-blue/30',
      url: 'https://x.com/ImOwFromYT',
      stats: {
        tweets: '2.4K',
        following: '890',
        followers: '12.8K'
      }
    },
    {
      name: 'YouTube',
      handle: '@ImOwPC',
      description: 'Highlights, tutorials, and long-form content',
      icon: Youtube,
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/20',
      borderColor: 'border-neon-blue/50',
      hoverColor: 'hover:bg-neon-blue/30',
      url: 'https://www.youtube.com/@ImOwPC',
      stats: {
        videos: '156',
        views: '2.1M',
        subscribers: '8.5K'
      }
    },
    {
      name: 'Discord',
      handle: 'Im0w Community',
      description: 'Join the community for discussions, events, and exclusive content',
      icon: MessageCircle,
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/20',
      borderColor: 'border-neon-blue/50',
      hoverColor: 'hover:bg-neon-blue/30',
      url: 'https://discord.gg/imow',
      stats: {
        members: '3.2K',
        online: '247',
        channels: '12'
      }
    },
    {
      name: 'Instagram',
      handle: '@imowfromyt',
      description: 'Behind-the-scenes content and daily updates',
      icon: Instagram,
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/20',
      borderColor: 'border-neon-blue/50',
      hoverColor: 'hover:bg-neon-blue/30',
      url: 'https://www.instagram.com/imowfromyt/',
      stats: {
        posts: '234',
        followers: '15.3K',
        following: '890'
      }
    },
    {
      name: 'TikTok',
      handle: '@imowfromyt',
      description: 'Short-form gaming content and highlights',
      icon: Video, // Using Video icon as placeholder for TikTok
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/20',
      borderColor: 'border-neon-blue/50',
      hoverColor: 'hover:bg-neon-blue/30',
      url: 'https://www.tiktok.com/@imowfromyt',
      stats: {
        videos: '156',
        followers: '25.7K',
        likes: '1.2M'
      }
    }
  ];

  return (
    <section id="social" className="py-20 relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="card-glow p-10 md:p-16 bg-card-bg backdrop-blur-md rounded-2xl shadow-lg">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-gaming font-bold mb-6">
              <span className="glow-text">CONNECT</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join the community across all platforms. From live streams to exclusive content, 
              there's always something happening in the Im0w universe.
            </p>
          </div>

          {/* Social Platforms Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {socialPlatforms.map((platform, index) => (
              <div 
                key={platform.name}
                className={`card-glow p-8 group hover:scale-105 transition-all duration-500 ${platform.hoverColor}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg ${platform.bgColor} ${platform.borderColor} border mr-4`}>
                    <platform.icon size={32} className={platform.color} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-gaming font-bold text-white">
                      {platform.name}
                    </h3>
                    <p className="text-gray-400">{platform.handle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {platform.description}
                </p>

                {/* CTA Button */}
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-full py-3 px-6 rounded-lg font-gaming font-bold transition-all duration-300 ${
                    platform.name === 'Twitch'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : platform.name === 'Twitter/X'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : platform.name === 'YouTube'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  } group-hover:scale-105`}
                >
                  <ExternalLink size={20} className="mr-2" />
                  {platform.name === 'Discord' ? 'Join us on Discord!' : `Follow on ${platform.name}`}
                </a>
              </div>
            ))}
          </div>

          {/* Community Highlights */}
          <div className="card-glow p-8 text-center">
            <h3 className="text-3xl font-gaming text-neon-green mb-6">
              Community Highlights
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto">
                  <Users size={32} className="text-neon-blue" />
                </div>
                <h4 className="text-xl font-gaming text-white">Active Community</h4>
                <p className="text-gray-300">
                  Join thousands of passionate gamers in daily discussions and events
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto">
                  <Heart size={32} className="text-neon-green" />
                </div>
                <h4 className="text-xl font-gaming text-white">Exclusive Content</h4>
                <p className="text-gray-300">
                  Get access to behind-the-scenes content and early announcements
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto">
                  <Eye size={32} className="text-neon-purple" />
                </div>
                <h4 className="text-xl font-gaming text-white">Live Interaction</h4>
                <p className="text-gray-300">
                  Connect directly during streams and community events
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="text-center mt-16">
            <div className="card-glow p-8 max-w-2xl mx-auto">
              <h3 className="text-3xl font-gaming text-neon-blue mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-300 mb-6">
                Never miss a stream, tournament, or community event. Get notified about everything Im0w.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://discord.gg/imow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="cyber-button"
                >
                  Join Discord
                </a>
                <a 
                  href="https://www.twitch.tv/imow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="cyber-button border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg"
                >
                  Follow on Twitch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Social; 