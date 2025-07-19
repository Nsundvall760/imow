import React from 'react';
import { Play, Zap, ArrowRight } from 'lucide-react';

const Hero = () => {

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects removed */}
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-neon-green rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-neon-purple rounded-full animate-float"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-gaming font-bold">
                <span className="glow-text">IM0W</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 font-display">
                Professional ABI Player & Twitch Streamer
              </p>
              <p className="text-lg text-gray-400 max-w-lg">
                Dominating the competitive scene with precision, strategy, and unmatched skill. 
                Join the community and witness gaming excellence.
              </p>
            </div>



            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="https://www.twitch.tv/imow" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cyber-button group"
              >
                Watch Live
              </a>
              <button className="cyber-button border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg">
                Join Discord
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-gaming text-neon-blue">50K+</div>
                <div className="text-sm text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-gaming text-neon-green">1000+</div>
                <div className="text-sm text-gray-400">Hours Streamed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-gaming text-neon-purple">Top 1%</div>
                <div className="text-sm text-gray-400">ABI Rank</div>
              </div>
            </div>
          </div>

          {/* Right Content - Twitch Embed */}
          <div className="relative">
            <div className="card-glow p-4">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden relative">
                {/* Twitch Embed */}
                <iframe 
                  src="https://player.twitch.tv/?channel=imow&parent=imow-frontend.onrender.com" 
                  frameBorder="0" 
                  allowFullScreen={true} 
                  scrolling="no" 
                  className="w-full h-full rounded-lg"
                  title="Im0w Twitch Stream"
                />
              </div>
              
              {/* Stream Info */}
              <div className="mt-4 space-y-2">
                <h3 className="font-gaming text-lg text-neon-blue">
                  Twitch.tv/imOw
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-neon-blue rounded-full flex justify-center">
          <div className="w-1 h-3 bg-neon-blue rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 