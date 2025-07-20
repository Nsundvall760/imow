import React from 'react';
import { Trophy, Target, Users, Clock, Star, Award } from 'lucide-react';

const Bio = () => {
  const achievements = [
    {
      icon: Trophy,
      title: "ABI Pro Player",
      description: "Top 1% competitive rank with consistent tournament placements",
      color: "text-yellow-400"
    },
    {
      icon: Target,
      title: "FPS Specialist",
      description: "Master of precision aiming and tactical gameplay across multiple titles",
      color: "text-neon-blue"
    },
    {
      icon: Users,
      title: "Community Leader",
      description: "Building a passionate community of 50K+ followers and growing",
      color: "text-neon-green"
    },
    {
      icon: Clock,
      title: "Dedicated Streamer",
      description: "1000+ hours of live content with daily streams and interactions",
      color: "text-neon-purple"
    }
  ];

  const stats = [
    { label: "Tournament Wins", value: "25+", icon: Star },
    { label: "Average Rank", value: "Top 1%", icon: Award },
    { label: "Stream Hours", value: "1000+", icon: Clock },
    { label: "Community Size", value: "50K+", icon: Users }
  ];

  return (
    <section id="about" className="py-20 relative">
      {/* Removed full-section background to prevent full-width black background */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-gaming font-bold mb-6">
              <span className="glow-text">THE PLAYER</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From casual gamer to competitive powerhouse, Im0w has carved his path 
              through the gaming world with unmatched dedication and skill.
            </p>
            <p className="text-base md:text-lg max-w-3xl mx-auto mt-6 font-semibold text-neon-blue leading-relaxed">
              ImOw here! I'm a former British Army servicemember, Ninja Warrior UK Finalist, and the 2012 British Trampolining Champion. With a deep passion for high-adrenaline pursuits, I thrive in extreme sports such as inline blading, skating, freerunning, and cliff diving. My background reflects a commitment to discipline, peak physical performance, and pushing limits in both competitive and adventurous environments.
            </p>
          </div>

          {/* Left: Bio Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-gaming text-neon-blue">
                  Gaming Excellence
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Im0w isn't just another streamer – he's a competitive force that has 
                  dominated the ABI scene with precision, strategy, and an unrelenting 
                  drive for perfection. His journey from casual player to professional 
                  competitor showcases what dedication and passion can achieve.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  With over 1000 hours of live streaming and a community of 50,000+ 
                  dedicated followers, Im0w has created more than just content – he's 
                  built a movement. Every stream is an opportunity to showcase high-level 
                  gameplay, share strategies, and inspire the next generation of competitive gamers.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Only show the three stats: Average Rank, Stream Hours, Community Size */}
                <div className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300">
                  <Award size={32} className="mx-auto mb-3 text-neon-blue group-hover:animate-pulse" />
                  <div className="text-2xl font-gaming font-bold text-white mb-1">Top 1%</div>
                  <div className="text-sm text-gray-400">Average Rank</div>
                </div>
                <div className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300">
                  <Clock size={32} className="mx-auto mb-3 text-neon-purple group-hover:animate-pulse" />
                  <div className="text-2xl font-gaming font-bold text-white mb-1">1000+</div>
                  <div className="text-sm text-gray-400">Stream Hours</div>
                </div>
                <div className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300">
                  <Users size={32} className="mx-auto mb-3 text-neon-green group-hover:animate-pulse" />
                  <div className="text-2xl font-gaming font-bold text-white mb-1">50K+</div>
                  <div className="text-sm text-gray-400">Community Size</div>
                </div>
              </div>
            </div>

            {/* Right: Achievements */}
            <div className="space-y-6">
              <h3 className="text-3xl font-gaming text-neon-green mb-8">
                Achievements
              </h3>
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className="card-glow p-6 group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors duration-300`}>
                      <achievement.icon size={24} className={achievement.color} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-gaming font-bold text-white mb-2">
                        {achievement.title}
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Major Tournament Achievements */}
          <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg mt-16">
            <h3 className="text-3xl md:text-4xl font-gaming text-neon-green mb-8">Major Tournament Achievements</h3>
            <ul className="text-base md:text-lg text-gray-200 space-y-3 font-gaming">
              <li><span className="text-white">2023 July Worlds China Lan Arena Breakout</span> - <span className="text-neon-blue font-bold">2nd Place</span></li>
              <li><span className="text-white">2024 Jan Worlds China Lan Arena Breakout</span> - <span className="text-neon-blue font-bold">2nd Place</span></li>
              <li><span className="text-white">2024 December Week 1 $10,000 Arena Breakout Infinite Future Legends</span> - <span className="text-neon-purple font-bold">3rd Place</span></li>
              <li><span className="text-white">2024 December Week 2 $10,000 Arena Breakout Infinite Future Legends</span> - <span className="text-neon-blue font-bold">2nd Place</span></li>
              <li><span className="text-white">2024 December Week 3 $10,000 Arena Breakout Infinite Future Legends</span> - <span className="text-neon-green font-bold">1st Place</span></li>
              <li><span className="text-white">2024 December Week 4 $10,000 Arena Breakout Infinite Future Legends</span> - <span className="text-neon-blue font-bold">2nd Place</span></li>
            </ul>
          </div>

          {/* Gaming Philosophy */}
          <div className="card-glow p-8 text-center mb-16">
            <h3 className="text-3xl font-gaming text-neon-purple mb-6">
              Gaming Philosophy
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto">
                  <Target size={32} className="text-neon-blue" />
                </div>
                <h4 className="text-xl font-gaming text-white">Precision</h4>
                <p className="text-gray-300">
                  Every shot counts. Every decision matters. Precision is the difference between good and great.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto">
                  <Users size={32} className="text-neon-green" />
                </div>
                <h4 className="text-xl font-gaming text-white">Community</h4>
                <p className="text-gray-300">
                  Building connections through shared passion. Every viewer is part of the journey.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto">
                  <Trophy size={32} className="text-neon-purple" />
                </div>
                <h4 className="text-xl font-gaming text-white">Excellence</h4>
                <p className="text-gray-300">
                  Constant improvement, relentless practice, and pushing beyond limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bio; 