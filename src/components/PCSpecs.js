import React, { useState, useEffect } from 'react';
import { Cpu, Monitor, HardDrive, MemoryStick, Zap, Gamepad2, Edit, Save, X } from 'lucide-react';
import config from '../config';

const PCSpecs = () => {
  const [gamingPC, setGamingPC] = useState({
    title: "GAMING PC",
    icon: Gamepad2,
    specs: [
      { label: "CPU", value: "AMD RYZEN ™ 7 9800X 3D (8-core/16-thread, 104MB cache)", icon: Cpu },
      { label: "Motherboard", value: "MSI MAG B650 TOMAHAWK", icon: MemoryStick },
      { label: "Memory (RAM)", value: "CORSAIR VENGEANCE RGB DDR5 64GB (2x32GB) DDR5 6000MHz CL30", icon: MemoryStick },
      { label: "Graphics Card (GPU)", value: "MSI GeForce RTX™ 4090 - 24GB GDDR6X", icon: Monitor },
      { label: "PSU", value: "Corsair RM850e 850W 80+ Gold", icon: Zap },
      { label: "Primary Storage", value: "2TB Kingston NV3", icon: HardDrive },
      { label: "Monitor", value: "LG 27GS95QE 27-inch Ultragear OLED Gaming Monitor QHD 240Hz", icon: Monitor }
    ]
  });

  const [streamingPC, setStreamingPC] = useState({
    title: "STREAMING PC",
    icon: Monitor,
    specs: [
      { label: "CPU", value: "Overclocked Intel® Core™ i9-10920X 12 Core", icon: Cpu },
      { label: "Motherboard", value: "ASUS® ROG STRIX X299-E GAMING II", icon: MemoryStick },
      { label: "Graphic Card", value: "RTX 4070 8gb", icon: Monitor },
      { label: "Memory (RAM)", value: "32GB Corsair VENGEANCE RGB PRO DDR4 3600MHz", icon: MemoryStick },
      { label: "PSU", value: "CORSAIR 850W RMx SERIES™ MODULAR 80 PLUS® GOLD", icon: Zap },
      { label: "Primary Storage", value: "1TB CORSAIR MP400", icon: HardDrive }
    ]
  });

  const [editingSpec, setEditingSpec] = useState(null);
  const [editForm, setEditForm] = useState({ label: '', value: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const adminUsername = localStorage.getItem('adminUsername');

  // Load PC specs from backend
  useEffect(() => {
    fetchPCSpecs();
  }, []);

  const fetchPCSpecs = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/pc-specs`);
      if (response.ok) {
        const data = await response.json();
        if (data.gamingPC) setGamingPC(data.gamingPC);
        if (data.streamingPC) setStreamingPC(data.streamingPC);
      }
    } catch (error) {
      console.error('Error fetching PC specs:', error);
    }
  };

  const handleEdit = (pcType, specIndex) => {
    const pc = pcType === 'gaming' ? gamingPC : streamingPC;
    const spec = pc.specs[specIndex];
    setEditingSpec({ pcType, specIndex });
    setEditForm({ label: spec.label, value: spec.value });
    setError('');
  };

  const handleSave = async () => {
    if (!editingSpec) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const { pcType, specIndex } = editingSpec;
      const pc = pcType === 'gaming' ? gamingPC : streamingPC;
      const updatedSpecs = [...pc.specs];
      updatedSpecs[specIndex] = { ...updatedSpecs[specIndex], ...editForm };
      
      const updatedPC = { ...pc, specs: updatedSpecs };
      
      const response = await fetch(`${config.API_BASE_URL}/api/pc-specs/${pcType}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(isAdmin ? { 'x-admin-session': 'imow' } : adminUsername ? { 'x-mod-session': adminUsername } : {})
        },
        body: JSON.stringify(updatedPC)
      });
      
      if (response.ok) {
        if (pcType === 'gaming') {
          setGamingPC(updatedPC);
        } else {
          setStreamingPC(updatedPC);
        }
        setEditingSpec(null);
        setEditForm({ label: '', value: '' });
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
    setEditingSpec(null);
    setEditForm({ label: '', value: '' });
    setError('');
  };

  const renderSpec = (spec, index, pcType, colorClass) => (
    <div key={index} className="flex items-start space-x-4 group hover:scale-105 transition-transform duration-300">
      <div className={`p-3 rounded-lg bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors duration-300`}>
        <spec.icon size={24} className={colorClass} />
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-gaming font-bold text-white mb-1">
          {spec.label}
        </h4>
        <p className="text-gray-300 leading-relaxed">
          {spec.value}
        </p>
      </div>
      {isAdmin && (
        <button
          onClick={() => handleEdit(pcType, index)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 text-gray-400 hover:text-neon-blue"
        >
          <Edit size={16} />
        </button>
      )}
    </div>
  );

  return (
    <section id="pc-specs" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-gaming font-bold mb-6">
            <span className="glow-text">PC SPECS</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional-grade hardware for competitive gaming and high-quality streaming
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Gaming PC */}
          <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mr-4">
                <gamingPC.icon size={32} className="text-neon-blue" />
              </div>
              <h3 className="text-3xl font-gaming text-neon-blue">{gamingPC.title}</h3>
            </div>
            
            <div className="space-y-6">
              {gamingPC.specs.map((spec, index) => 
                renderSpec(spec, index, 'gaming', 'text-neon-blue')
              )}
            </div>
          </div>

          {/* Streaming PC */}
          <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mr-4">
                <streamingPC.icon size={32} className="text-neon-purple" />
              </div>
              <h3 className="text-3xl font-gaming text-neon-purple">{streamingPC.title}</h3>
            </div>
            
            <div className="space-y-6">
              {streamingPC.specs.map((spec, index) => 
                renderSpec(spec, index, 'streaming', 'text-neon-purple')
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSpec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={handleCancel}>
          <div className="relative w-full max-w-md bg-card-bg rounded-lg p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-gaming mb-4">Edit PC Spec</h2>
            {error && <div className="text-red-400 font-bold mb-4">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Label</label>
                <input
                  type="text"
                  value={editForm.label}
                  onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Value</label>
                <textarea
                  value={editForm.value}
                  onChange={e => setEditForm(f => ({ ...f, value: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 cyber-button"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
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

export default PCSpecs; 