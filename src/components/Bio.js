import React, { useState, useEffect } from 'react';
import { Trophy, Target, Users, Clock, Star, Award, Edit } from 'lucide-react';
import config from '../config';

const Bio = () => {
  const [bioData, setBioData] = useState({
    intro: "From casual gamer to competitive powerhouse, Im0w has carved his path through the gaming world with unmatched dedication and skill.",
    personalBio: "ImOw here! I'm a former British Army servicemember, Ninja Warrior UK Finalist, and the 2012 British Trampolining Champion. With a deep passion for high-adrenaline pursuits, I thrive in extreme sports such as inline blading, skating, freerunning, and cliff diving. My background reflects a commitment to discipline, peak physical performance, and pushing limits in both competitive and adventurous environments.",
    gamingExcellence1: "Im0w isn't just another streamer – he's a competitive force that has dominated the ABI scene with precision, strategy, and an unrelenting drive for perfection. His journey from casual player to professional competitor showcases what dedication and passion can achieve.",
    gamingExcellence2: "With over 1000 hours of live streaming and a community of 50,000+ dedicated followers, Im0w has created more than just content – he's built a movement. Every stream is an opportunity to showcase high-level gameplay, share strategies, and inspire the next generation of competitive gamers.",
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
    gamingPhilosophy: {
      precision: "Every shot counts. Every decision matters. Precision is the difference between good and great.",
      community: "Building connections through shared passion. Every viewer is part of the journey.",
      excellence: "Constant improvement, relentless practice, and pushing beyond limits."
    },
    stats: {
      averageRank: { value: "Top 1%", label: "Average Rank" },
      streamHours: { value: "1000+", label: "Stream Hours" },
      communitySize: { value: "50K+", label: "Community Size" }
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [editForm, setEditForm] = useState({ content: '', label: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const adminUsername = localStorage.getItem('adminUsername');

  // Load bio data from backend
  useEffect(() => {
    fetchBioData();
  }, []);

  const fetchBioData = async () => {
    try {
      console.log('Fetching bio data from:', `${config.API_BASE_URL}/api/bio`);
      const response = await fetch(`${config.API_BASE_URL}/api/bio`);
      console.log('Bio response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Bio data received:', data);
        // Merge with default data to ensure all fields exist
        setBioData(prevData => ({
          ...prevData,
          ...data
        }));
      } else {
        console.error('Bio API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching bio data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (field, content, label = '') => {
    setEditingField(field);
    setEditForm({ content, label });
    setError('');
  };

  const handleSave = async () => {
    if (!editingField) return;
    
    setIsSaving(true);
    setError('');
    
    try {
      const updatedData = { ...bioData };
      
      if (editingField.startsWith('achievement.')) {
        const index = parseInt(editingField.split('.')[1]);
        updatedData.achievements[index].description = editForm.content;
      } else if (editingField.startsWith('philosophy.')) {
        const key = editingField.split('.')[1];
        updatedData.gamingPhilosophy[key] = editForm.content;
      } else if (editingField.startsWith('stats.')) {
        const key = editingField.split('.')[1];
        const subKey = editingField.split('.')[2];
        if (subKey === 'value') {
          updatedData.stats[key].value = editForm.content;
        } else if (subKey === 'label') {
          updatedData.stats[key].label = editForm.label;
        }
      } else {
        updatedData[editingField] = editForm.content;
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
        setEditForm({ content: '', label: '' });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save changes');
      }
    } catch (error) {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditForm({ content: '', label: '' });
    setError('');
  };

  const renderEditableText = (content, field, className = "text-gray-300") => (
    <div className="group relative">
      <p className={className}>
        {content}
      </p>
      {isAdmin && (
        <button
          onClick={() => handleEdit(field, content)}
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 text-gray-400 hover:text-neon-blue bg-gray-800 rounded"
        >
          <Edit size={12} />
        </button>
      )}
    </div>
  );

  const renderEditableStat = (statKey, statData, icon, iconColor) => (
    <div className="card-glow p-6 text-center group hover:scale-105 transition-transform duration-300 relative">
      <icon size={32} className={`mx-auto mb-3 ${iconColor} group-hover:animate-pulse`} />
      <div className="text-2xl font-gaming font-bold text-white mb-1 relative">
        {statData.value}
        {isAdmin && (
          <button
            onClick={() => handleEdit(`stats.${statKey}.value`, statData.value)}
            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 text-gray-400 hover:text-neon-blue bg-gray-800 rounded"
          >
            <Edit size={12} />
          </button>
        )}
      </div>
      <div className="text-sm text-gray-400 relative">
        {statData.label}
        {isAdmin && (
          <button
            onClick={() => handleEdit(`stats.${statKey}.label`, statData.label, statData.label)}
            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 text-gray-400 hover:text-neon-blue bg-gray-800 rounded"
          >
            <Edit size={12} />
          </button>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <section id="about" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-gaming text-neon-blue animate-pulse mb-4">Loading...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-gaming font-bold mb-6">
              <span className="glow-text">THE PLAYER</span>
            </h2>
            {renderEditableText(bioData.intro, 'intro', "text-xl text-gray-300 max-w-3xl mx-auto")}
            {renderEditableText(bioData.personalBio, 'personalBio', "text-base md:text-lg max-w-3xl mx-auto mt-6 font-semibold text-neon-blue leading-relaxed")}
          </div>

          {/* Left: Bio Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-gaming text-neon-blue">
                  Gaming Excellence
                </h3>
                {renderEditableText(bioData.gamingExcellence1, 'gamingExcellence1', "text-lg text-gray-300 leading-relaxed")}
                {renderEditableText(bioData.gamingExcellence2, 'gamingExcellence2', "text-lg text-gray-300 leading-relaxed")}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {renderEditableStat('averageRank', bioData.stats.averageRank, Award, 'text-neon-blue')}
                {renderEditableStat('streamHours', bioData.stats.streamHours, Clock, 'text-neon-purple')}
                {renderEditableStat('communitySize', bioData.stats.communitySize, Users, 'text-neon-green')}
              </div>
            </div>

            {/* Right: Achievements */}
            <div className="space-y-6">
              <h3 className="text-3xl font-gaming text-neon-green mb-8">
                Achievements
              </h3>
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
                      <h4 className="text-xl font-gaming font-bold text-white mb-2">
                        {achievement.title}
                      </h4>
                      {renderEditableText(achievement.description, `achievement.${index}`, "text-gray-300 leading-relaxed")}
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
                {renderEditableText(bioData.gamingPhilosophy.precision, 'philosophy.precision', "text-gray-300")}
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto">
                  <Users size={32} className="text-neon-green" />
                </div>
                <h4 className="text-xl font-gaming text-white">Community</h4>
                {renderEditableText(bioData.gamingPhilosophy.community, 'philosophy.community', "text-gray-300")}
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto">
                  <Trophy size={32} className="text-neon-purple" />
                </div>
                <h4 className="text-xl font-gaming text-white">Excellence</h4>
                {renderEditableText(bioData.gamingPhilosophy.excellence, 'philosophy.excellence', "text-gray-300")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={handleCancel}>
          <div className="relative w-full max-w-2xl bg-card-bg rounded-lg p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-gaming mb-4">Edit Bio Content</h2>
            {error && <div className="text-red-400 font-bold mb-4">{error}</div>}
            <div className="space-y-4">
              {editingField.includes('stats.') && editingField.includes('.label') ? (
                <div>
                  <label className="block mb-1 text-sm">Label</label>
                  <input
                    type="text"
                    value={editForm.label}
                    onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  />
                </div>
              ) : (
                <div>
                  <label className="block mb-1 text-sm">Content</label>
                  <textarea
                    value={editForm.content}
                    onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 cyber-button"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 cyber-button border-red-500 text-red-500 hover:bg-red-500 hover:text-dark-bg"
              >
                Cancel
              </button>
            </div>
            <button className="absolute top-2 right-2 text-lg font-bold" onClick={handleCancel}>×</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Bio; 