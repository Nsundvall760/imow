import React, { useState, useEffect } from 'react';
import { Trophy, Target, Users, Clock, Star, Award, Edit, Save, X } from 'lucide-react';
import config from '../config';

const Bio = () => {
  const [bioData, setBioData] = useState({
    title: "THE PLAYER",
    subtitle: "From casual gamer to competitive powerhouse, Im0w has carved his path through the gaming world with unmatched dedication and skill.",
    personalBio: "ImOw here! I'm a former British Army servicemember, Ninja Warrior UK Finalist, and the 2012 British Trampolining Champion. With a deep passion for high-adrenaline pursuits, I thrive in extreme sports such as inline blading, skating, freerunning, and cliff diving. My background reflects a commitment to discipline, peak physical performance, and pushing limits in both competitive and adventurous environments.",
    gamingExcellenceTitle: "Gaming Excellence",
    gamingExcellenceText1: "Im0w isn't just another streamer – he's a competitive force that has dominated the ABI scene with precision, strategy, and an unrelenting drive for perfection. His journey from casual player to professional competitor showcases what dedication and passion can achieve.",
    gamingExcellenceText2: "With over 1000 hours of live streaming and a community of 50,000+ dedicated followers, Im0w has created more than just content – he's built a movement. Every stream is an opportunity to showcase high-level gameplay, share strategies, and inspire the next generation of competitive gamers.",
    achievementsTitle: "Achievements",
    achievements: [
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
    ],
    stats: [
      { label: "Average Rank", value: "Top 1%", icon: Award },
      { label: "Stream Hours", value: "1000+", icon: Clock },
      { label: "Community Size", value: "50K+", icon: Users }
    ],
    tournamentTitle: "Major Tournament Achievements",
    tournamentAchievements: [
      { tournament: "2023 July Worlds China Lan Arena Breakout", placement: "2nd Place", color: "text-neon-blue" },
      { tournament: "2024 Jan Worlds China Lan Arena Breakout", placement: "2nd Place", color: "text-neon-blue" },
      { tournament: "2024 December Week 1 $10,000 Arena Breakout Infinite Future Legends", placement: "3rd Place", color: "text-neon-purple" },
      { tournament: "2024 December Week 2 $10,000 Arena Breakout Infinite Future Legends", placement: "2nd Place", color: "text-neon-blue" },
      { tournament: "2024 December Week 3 $10,000 Arena Breakout Infinite Future Legends", placement: "1st Place", color: "text-neon-green" },
      { tournament: "2024 December Week 4 $10,000 Arena Breakout Infinite Future Legends", placement: "2nd Place", color: "text-neon-blue" }
    ],
    philosophyTitle: "Gaming Philosophy",
    philosophy: [
      {
        icon: Target,
        title: "Precision",
        description: "Every shot counts. Every decision matters. Precision is the difference between good and great.",
        color: "text-neon-blue"
      },
      {
        icon: Users,
        title: "Community",
        description: "Building connections through shared passion. Every viewer is part of the journey.",
        color: "text-neon-green"
      },
      {
        icon: Trophy,
        title: "Excellence",
        description: "Constant improvement, relentless practice, and pushing beyond limits.",
        color: "text-neon-purple"
      }
    ]
  });

  const [editingField, setEditingField] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const adminUsername = localStorage.getItem('adminUsername');

  // Load bio data from backend
  useEffect(() => {
    fetchBioData();
  }, []);

  const fetchBioData = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/bio`);
      if (response.ok) {
        const data = await response.json();
        setBioData(data);
      }
    } catch (error) {
      console.error('Error fetching bio data:', error);
    }
  };

  const handleEdit = (field, data = null) => {
    setEditingField(field);
    if (data) {
      setEditForm(data);
    } else {
      setEditForm({ value: bioData[field] || '' });
    }
    setError('');
  };

  const handleSave = async () => {
    if (!editingField) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const updatedData = { ...bioData };
      
      if (editingField.includes('.')) {
        // Handle nested fields like achievements[0].title
        const [parent, index, child] = editingField.split('.');
        if (!updatedData[parent]) updatedData[parent] = [];
        if (!updatedData[parent][index]) updatedData[parent][index] = {};
        updatedData[parent][index][child] = editForm.value;
      } else {
        updatedData[editingField] = editForm.value;
      }
      
      const response = await fetch(`${config.API_BASE_URL}/api/bio`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(isAdmin ? { 'x-admin-session': 'imow' } : adminUsername ? { 'x-mod-session': adminUsername } : {})
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        setBioData(updatedData);
        setEditingField(null);
        setEditForm({});
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save changes');
      }
    } catch (error) {
      setError('Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditForm({});
    setError('');
  };

  const renderEditableText = (field, text, className = "") => (
    <div className="relative group">
      {editingField === field ? (
        <div className="flex items-center gap-2">
          <textarea
            value={editForm.value}
            onChange={e => setEditForm(f => ({ ...f, value: e.target.value }))}
            className={`${className} w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded`}
            rows={text.length > 100 ? 3 : 1}
          />
          <button onClick={handleSave} disabled={isLoading} className="p-1 text-neon-blue hover:text-neon-green">
            <Save size={16} />
          </button>
          <button onClick={handleCancel} className="p-1 text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className={className}>{text}</span>
          {isAdmin && (
            <button
              onClick={() => handleEdit(field)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 text-gray-400 hover:text-neon-blue"
            >
              <Edit size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg">
          <div className="text-center mb-16">
            {renderEditableText('title', bioData.title, "text-4xl md:text-6xl font-gaming font-bold mb-6 glow-text")}
            {renderEditableText('subtitle', bioData.subtitle, "text-xl text-gray-300 max-w-3xl mx-auto")}
            {renderEditableText('personalBio', bioData.personalBio, "text-base md:text-lg max-w-3xl mx-auto mt-6 font-semibold text-neon-blue leading-relaxed")}
          </div>

          {/* Left: Bio Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="space-y-6">
                {renderEditableText('gamingExcellenceTitle', bioData.gamingExcellenceTitle, "text-3xl font-gaming text-neon-blue")}
                {renderEditableText('gamingExcellenceText1', bioData.gamingExcellenceText1, "text-lg text-gray-300 leading-relaxed")}
                {renderEditableText('gamingExcellenceText2', bioData.gamingExcellenceText2, "text-lg text-gray-300 leading-relaxed")}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {bioData.stats.map((stat, index) => (
                  <div key={index} className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300">
                    <stat.icon size={32} className="mx-auto mb-3 text-neon-blue group-hover:animate-pulse" />
                    {renderEditableText(`stats[${index}].value`, stat.value, "text-2xl font-gaming font-bold text-white mb-1")}
                    {renderEditableText(`stats[${index}].label`, stat.label, "text-sm text-gray-400")}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Achievements */}
            <div className="space-y-6">
              {renderEditableText('achievementsTitle', bioData.achievementsTitle, "text-3xl font-gaming text-neon-green mb-8")}
              {bioData.achievements.map((achievement, index) => (
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
                      {renderEditableText(`achievements[${index}].title`, achievement.title, "text-xl font-gaming font-bold text-white mb-2")}
                      {renderEditableText(`achievements[${index}].description`, achievement.description, "text-gray-300 leading-relaxed")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Major Tournament Achievements */}
          <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg mt-16">
            {renderEditableText('tournamentTitle', bioData.tournamentTitle, "text-3xl md:text-4xl font-gaming text-neon-green mb-8")}
            <ul className="text-base md:text-lg text-gray-200 space-y-3 font-gaming">
              {bioData.tournamentAchievements.map((achievement, index) => (
                <li key={index} className="flex items-center gap-2">
                  {renderEditableText(`tournamentAchievements[${index}].tournament`, achievement.tournament, "text-white")}
                  <span>-</span>
                  {renderEditableText(`tournamentAchievements[${index}].placement`, achievement.placement, `${achievement.color} font-bold`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Gaming Philosophy */}
          <div className="card-glow p-8 text-center mb-16">
            {renderEditableText('philosophyTitle', bioData.philosophyTitle, "text-3xl font-gaming text-neon-purple mb-6")}
            <div className="grid md:grid-cols-3 gap-8">
              {bioData.philosophy.map((item, index) => (
                <div key={index} className="space-y-4">
                  <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto">
                    <item.icon size={32} className={item.color} />
                  </div>
                  {renderEditableText(`philosophy[${index}].title`, item.title, "text-xl font-gaming text-white")}
                  {renderEditableText(`philosophy[${index}].description`, item.description, "text-gray-300")}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded z-50">
          {error}
        </div>
      )}
    </section>
  );
};

export default Bio; 