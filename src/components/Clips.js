import React, { useState, useEffect } from 'react';
import { Play, Eye, Heart, Share2, ExternalLink, Plus, Edit, Trash2 } from 'lucide-react';

const Clips = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingClip, setEditingClip] = useState(null);

  // Check if user is admin/mod
  useEffect(() => {
    const isAdminUser = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUser);
  }, []);

  // Fetch clips from backend
  useEffect(() => {
    fetchClips();
  }, []);

  const fetchClips = async () => {
    try {
      const response = await fetch('https://imow.onrender.com/api/clips');
      if (response.ok) {
        const data = await response.json();
        setClips(data);
      }
    } catch (error) {
      console.error('Error fetching clips:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'featured', name: 'Featured', count: clips.filter(c => c.category === 'featured').length },
    { id: 'educational', name: 'Educational', count: clips.filter(c => c.category === 'educational').length },
    { id: 'community', name: 'Community', count: clips.filter(c => c.category === 'community').length }
  ];

  const filteredClips = clips.filter(clip => activeTab === 'all' || clip.category === activeTab);

  // Admin functions
  const handleUploadClip = async (formData) => {
    try {
      const isAdminUser = localStorage.getItem('isAdmin') === 'true';
      const adminUsername = localStorage.getItem('adminUsername');
      
      console.log('Uploading clip...', { isAdminUser, adminUsername });
      
      const response = await fetch('https://imow.onrender.com/api/clips', {
        method: 'POST',
        headers: {
          'x-admin-session': isAdminUser && adminUsername === 'imow' ? 'imow' : '',
          'x-mod-session': isAdminUser && adminUsername !== 'imow' ? adminUsername : ''
        },
        body: formData
      });
      
      console.log('Upload response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        await fetchClips();
        setShowUploadForm(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload failed:', errorData);
        alert(`Upload failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading clip:', error);
      alert(`Upload error: ${error.message}`);
    }
  };

  const handleDeleteClip = async (clipId) => {
    if (!window.confirm('Are you sure you want to delete this clip?')) return;
    
    try {
      const isAdminUser = localStorage.getItem('isAdmin') === 'true';
      const adminUsername = localStorage.getItem('adminUsername');
      
      const response = await fetch(`https://imow.onrender.com/api/clips/${clipId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-session': isAdminUser && adminUsername === 'imow' ? 'imow' : '',
          'x-mod-session': isAdminUser && adminUsername !== 'imow' ? adminUsername : ''
        }
      });
      
      if (response.ok) {
        await fetchClips();
      }
    } catch (error) {
      console.error('Error deleting clip:', error);
    }
  };

  const handleEditClip = async (clipId, formData) => {
    try {
      const isAdminUser = localStorage.getItem('isAdmin') === 'true';
      const adminUsername = localStorage.getItem('adminUsername');
      
      const response = await fetch(`https://imow.onrender.com/api/clips/${clipId}`, {
        method: 'PATCH',
        headers: {
          'x-admin-session': isAdminUser && adminUsername === 'imow' ? 'imow' : '',
          'x-mod-session': isAdminUser && adminUsername !== 'imow' ? adminUsername : ''
        },
        body: formData
      });
      
      if (response.ok) {
        await fetchClips();
        setEditingClip(null);
      }
    } catch (error) {
      console.error('Error updating clip:', error);
    }
  };

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
            
            {/* Upload Button for Admin/Mod */}
            {isAdmin && (
              <button
                onClick={() => setShowUploadForm(true)}
                className="px-6 py-3 rounded-full font-gaming font-bold bg-neon-green text-dark-bg hover:bg-neon-green/80 transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={20} />
                Upload Clip
              </button>
            )}
          </div>

          {/* Upload Form Modal */}
          {showUploadForm && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-card-bg rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-gaming text-neon-blue mb-4">Upload New Clip</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleUploadClip(formData);
                }}>
                  <div className="space-y-4">
                    <input
                      name="title"
                      placeholder="Clip Title"
                      required
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                    <textarea
                      name="description"
                      placeholder="Description"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white h-20"
                    />
                    <select
                      name="category"
                      required
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    >
                      <option value="">Select Category</option>
                      <option value="featured">Featured</option>
                      <option value="educational">Educational</option>
                      <option value="community">Community</option>
                    </select>
                    <input
                      name="duration"
                      placeholder="Duration (e.g., 2:34)"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                    <input
                      name="views"
                      placeholder="Views (e.g., 125K)"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                    <input
                      name="likes"
                      placeholder="Likes (e.g., 8.2K)"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                    <input
                      name="twitchUrl"
                      placeholder="Twitch URL (optional)"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-neon-blue text-dark-bg py-2 rounded font-gaming"
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUploadForm(false)}
                        className="flex-1 bg-gray-600 text-white py-2 rounded font-gaming"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Clips Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClips.map((clip) => (
              <div key={clip.id} className="card-glow group hover:scale-105 transition-all duration-300">
                {/* Thumbnail */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={clip.thumbnail || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='%2300d4ff'%3E${encodeURIComponent(clip.title)}%3C/text%3E%3C/svg%3E`}
                    alt={clip.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingClip(clip);
                        }}
                        className="w-8 h-8 bg-neon-blue/90 rounded flex items-center justify-center hover:bg-neon-blue"
                      >
                        <Edit size={14} className="text-dark-bg" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClip(clip.id);
                        }}
                        className="w-8 h-8 bg-red-500/90 rounded flex items-center justify-center hover:bg-red-500"
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    </div>
                  )}

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