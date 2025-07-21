import React, { useEffect, useState, useRef } from 'react';
import BuildCard from '../components/BuildCard';
import config from '../config';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import 'react-medium-image-zoom/dist/styles.css';

const API_URL = `${config.API_BASE_URL}${config.API_ENDPOINTS.builds}`;
const UPLOAD_URL = `${config.API_BASE_URL}${config.API_ENDPOINTS.builds}`;

const CATEGORIES = [
  'Assault Rifles',
  'Submachine Guns',
  'Carbine',
  'Marksman Rifle',
  'Bolt-Action Rifle',
  'Shotgun',
  'Light Machine Gun',
  'Pistol'
];

function GunBuilds({ isAdmin, adminUsername, onAdminLogout }) {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', tags: '', image: null, password: '' });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Modal state for image enlargement
  const [modalImage, setModalImage] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [editBuild, setEditBuild] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', tags: '', category: '', image: null, password: '' });
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [activeMapGuide, setActiveMapGuide] = useState(null);
  const MAP_GUIDES = ['Farm', 'Valley', 'Northridge', 'Armory', 'Tv Station'];
  const dropdownRef = useRef(null);
  const [showGunDropdown, setShowGunDropdown] = useState(false);
  const [showMapDropdown, setShowMapDropdown] = useState(false);
  const [activeGunCategory, setActiveGunCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mapGuideData, setMapGuideData] = useState(null);
  const [mapGuideLoading, setMapGuideLoading] = useState(false);
  const [mapGuideError, setMapGuideError] = useState("");
  const [editMapGuideData, setEditMapGuideData] = useState(null);
  const [editMapGuideSaving, setEditMapGuideSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null); // 'images', 'kits', 'tips', 'lootRoutes'
  const [tempEditData, setTempEditData] = useState({ kits: '', tips: '', lootRoutes: '' });
  const [showKitsModal, setShowKitsModal] = useState(false);
  const [kitsFields, setKitsFields] = useState([
    { label: 'Primary Weapon', value: '' },
    { label: 'Headgear', value: '' },
    { label: 'Headset', value: '' },
    { label: 'Body Armor', value: '' },
    { label: 'Backpack', value: '' },
    { label: 'Keys to bring', value: '' }
  ]);
  // Add state for tips modal
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [tipsFields, setTipsFields] = useState([]);
  // Add state for loot routes modal
  const [showLootRoutesModal, setShowLootRoutesModal] = useState(false);
  const [lootRouteTitle, setLootRouteTitle] = useState('');
  const [lootRouteImage, setLootRouteImage] = useState(null);
  const [lootRouteUploading, setLootRouteUploading] = useState(false);
  const [lootRouteError, setLootRouteError] = useState('');

  // Add refs for dropdowns
  const gunDropdownRef = useRef(null);
  const mapDropdownRef = useRef(null);

  useEffect(() => {
    fetchBuilds();
  }, []);

  // Click outside to close Gun Builds dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (showGunDropdown && gunDropdownRef.current && !gunDropdownRef.current.contains(event.target)) {
        setShowGunDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showGunDropdown]);

  // Click outside to close Map Guides dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (showMapDropdown && mapDropdownRef.current && !mapDropdownRef.current.contains(event.target)) {
        setShowMapDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMapDropdown]);

  async function fetchBuilds() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBuilds(data);
    } catch (e) {
      setBuilds([]);
    }
    setLoading(false);
  }

  function handleInput(e) {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  }

  async function handleUpload(e) {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess('');
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('tags', form.tags);
    fd.append('category', form.category);
    if (form.image) fd.append('image', form.image);
    try {
      const res = await fetch(UPLOAD_URL, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setSuccess('Build uploaded!');
      setForm({ title: '', description: '', tags: '', image: null, password: '' });
      fetchBuilds();
    } catch (e) {
      setError(e.message);
    }
    setUploading(false);
  }

  function openEditModal(build) {
    setEditBuild(build);
    setEditForm({
      title: build.title,
      description: build.description,
      tags: build.tags ? build.tags.join(', ') : '',
      category: build.category || '',
      image: null,
      password: ''
    });
    setEditError('');
  }

  function handleEditInput(e) {
    const { name, value, files } = e.target;
    setEditForm(f => ({ ...f, [name]: files ? files[0] : value }));
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    const fd = new FormData();
    fd.append('title', editForm.title);
    fd.append('description', editForm.description);
    fd.append('tags', editForm.tags);
    fd.append('category', editForm.category);
    if (editForm.image) fd.append('image', editForm.image);
    try {
      const res = await fetch(`${API_URL}/${editBuild.id}`, { method: 'PATCH', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Edit failed');
      setEditBuild(null);
      fetchBuilds();
    } catch (e) {
      setEditError(e.message);
    }
    setEditLoading(false);
  }

  async function handleDelete(buildId) {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await fetch(`${API_URL}/${buildId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      fetchBuilds();
    } catch (e) {
      setDeleteError(e.message);
    }
    setDeleteLoading(false);
  }

  // Helper: filter builds by search
  function filterBuildsBySearch(builds, term) {
    if (!term) return builds;
    const lower = term.toLowerCase();
    return builds.filter(b =>
      (b.title && b.title.toLowerCase().includes(lower)) ||
      (b.description && b.description.toLowerCase().includes(lower)) ||
      (b.category && b.category.toLowerCase().includes(lower)) ||
      (b.tags && b.tags.some(tag => tag.toLowerCase().includes(lower)))
    );
  }

  // Remove the search button and make search auto-populate as user types
  function handleSearchInput(e) {
    const value = e.target.value;
    setSearchTerm(value);
    const term = value.trim().toLowerCase();
    if (!term) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    // Search gun builds
    const gunResults = builds.filter(b =>
      (b.title && b.title.toLowerCase().includes(term)) ||
      (b.tags && b.tags.some(tag => tag.toLowerCase().includes(term)))
    ).map(b => ({ type: 'gun', ...b }));
    // Search map guides (by title only, since no tags yet)
    const mapResults = MAP_GUIDES.filter(map =>
      map.toLowerCase().includes(term)
    ).map(map => ({ type: 'map', title: map }));
    setSearchResults([...gunResults, ...mapResults]);
    setShowSearchResults(true);
  }

  // Fetch map guide data when a map is selected
  useEffect(() => {
    if (!activeMapGuide) {
      setMapGuideData(null);
      setEditMapGuideData(null);
      return;
    }
    setMapGuideLoading(true);
    setMapGuideError("");
    fetch(`${config.API_BASE_URL}/api/map-guides/${encodeURIComponent(activeMapGuide)}`)
      .then(res => res.ok ? res.json() : Promise.reject("Not found"))
      .then(data => {
        setMapGuideData(data);
        setEditMapGuideData({
          kits: data.kits.join("\n"),
          tips: data.tips.join("\n"),
          lootRoutes: data.lootRoutes.join("\n")
        });
      })
      .catch(e => setMapGuideError("Failed to load map guide."))
      .finally(() => setMapGuideLoading(false));
  }, [activeMapGuide]);

  // Handle image upload for map guide
  async function handleMapGuideImageUpload(e) {
    const file = e.target.files[0];
    if (!file || !activeMapGuide) return;
    const fd = new FormData();
    fd.append('image', file);
    setMapGuideLoading(true);
    setMapGuideError("");
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/map-guides/${encodeURIComponent(activeMapGuide)}/image`, {
        method: 'POST',
        body: fd,
        headers: isAdmin ? { 'x-admin-session': 'imow' } : adminUsername ? { 'x-mod-session': adminUsername } : {}
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setMapGuideData(g => ({ ...g, images: [...g.images, data.image] }));
    } catch (e) {
      setMapGuideError(e.message);
    }
    setMapGuideLoading(false);
  }

  // Handle save for kits, tips, loot routes
  async function handleMapGuideSave() {
    if (!activeMapGuide || !editMapGuideData) return;
    setEditMapGuideSaving(true);
    setMapGuideError("");
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/map-guides/${encodeURIComponent(activeMapGuide)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(isAdmin ? { 'x-admin-session': 'imow' } : adminUsername ? { 'x-mod-session': adminUsername } : {})
        },
        body: JSON.stringify({
          kits: editMapGuideData.kits.split("\n").map(s => s.trim()).filter(Boolean),
          tips: editMapGuideData.tips.split("\n").map(s => s.trim()).filter(Boolean),
          lootRoutes: editMapGuideData.lootRoutes.split("\n").map(s => s.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setMapGuideData(data);
    } catch (e) {
      setMapGuideError(e.message);
    }
    setEditMapGuideSaving(false);
  }

  // Helper to open kits modal with current values
  function openKitsModal() {
    const kitsArr = mapGuideData.kits || [];
    // If kitsArr is an array of strings, map to default labels; if array of objects, use as is
    let fields;
    if (kitsArr.length && typeof kitsArr[0] === 'object') {
      fields = kitsArr.map(f => ({ label: f.label, value: f.value }));
    } else {
      // fallback for old data: map to default labels
      const defaultLabels = [
        'Primary Weapon', 'Headgear', 'Headset', 'Body Armor', 'Backpack', 'Keys to bring'
      ];
      fields = (kitsArr.length ? kitsArr : Array(defaultLabels.length).fill('')).map((v, i) => ({
        label: defaultLabels[i] || `Field ${i+1}`,
        value: v || ''
      }));
    }
    setKitsFields(fields);
    setShowKitsModal(true);
  }

  // Helper to save kits modal
  async function saveKitsModal() {
    // Clean up fields: trim, remove empty labels
    const cleaned = kitsFields
      .map(f => ({ label: f.label.trim() || 'Field', value: f.value.trim() || 'No suggestions' }))
      .filter(f => f.label);
    setEditMapGuideData(d => ({ ...d, kits: cleaned }));
    setMapGuideData(g => ({ ...g, kits: cleaned }));
    setShowKitsModal(false);
    // Save to backend
    await fetch(`${config.API_BASE_URL}/api/map-guides/${encodeURIComponent(activeMapGuide)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(isAdmin ? { 'x-admin-session': 'imow' } : adminUsername ? { 'x-mod-session': adminUsername } : {})
      },
      body: JSON.stringify({ kits: cleaned })
    });
  }

  // Open tips modal with current tips
  function openTipsModal() {
    setTipsFields(mapGuideData.tips && Array.isArray(mapGuideData.tips) ? [...mapGuideData.tips] : []);
    setShowTipsModal(true);
  }

  // Save tips modal
  async function saveTipsModal() {
    const tipsArr = tipsFields.map(t => t.trim()).filter(Boolean);
    setEditMapGuideData(d => ({ ...d, tips: tipsArr.join('\n') }));
    setMapGuideData(g => ({ ...g, tips: tipsArr })); // Update UI immediately
    setShowTipsModal(false);
    setEditingSection(null);
    // Save to backend right away
    await fetch(`${config.API_BASE_URL}/api/map-guides/${encodeURIComponent(activeMapGuide)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(isAdmin ? { 'x-admin-session': 'imow' } : adminUsername ? { 'x-mod-session': adminUsername } : {})
      },
      body: JSON.stringify({ tips: tipsArr })
    });
  }

  // Open loot routes modal
  function openLootRoutesModal() {
    setLootRouteTitle('');
    setLootRouteImage(null);
    setLootRouteError('');
    setShowLootRoutesModal(true);
  }

  // Handle loot route upload
  async function handleLootRouteUpload(e) {
    e.preventDefault();
    console.log('handleLootRouteUpload called');
    console.log('Title:', lootRouteTitle, 'Image:', lootRouteImage);
    if (!lootRouteTitle || !lootRouteImage) {
      setLootRouteError('Title and image required');
      return;
    }
    setLootRouteUploading(true);
    setLootRouteError('');
    const fd = new FormData();
    fd.append('title', lootRouteTitle);
    fd.append('image', lootRouteImage);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/map-guides/${encodeURIComponent(activeMapGuide)}/loot-route`, {
        method: 'POST',
        body: fd,
        headers: isAdmin ? { 'x-admin-session': 'imow' } : adminUsername ? { 'x-mod-session': adminUsername } : {}
      });
      let data;
      try {
        data = await res.json();
        console.log('Backend response:', data);
      } catch {
        setLootRouteError('Server error: Invalid response. Check map name and backend logs.');
        setLootRouteUploading(false);
        return;
      }
      if (!res.ok) {
        setLootRouteError(data.error || 'Upload failed');
        setLootRouteUploading(false);
        return;
      }
      console.log('Updated lootRoutes:', data.lootRoutes);
      setMapGuideData(g => ({ ...g, lootRoutes: data.lootRoutes || [] }));
      setShowLootRoutesModal(false);
      setLootRouteTitle('');
      setLootRouteImage(null);
    } catch (err) {
      setLootRouteError('Upload failed: ' + err.message);
    }
    setLootRouteUploading(false);
  }

  // Add this helper function near saveKitsModal
  async function saveKitsFields(fields) {
    const cleaned = fields
      .map(f => ({ label: f.label.trim() || 'Field', value: f.value.trim() || 'No suggestions' }))
      .filter(f => f.label);
    setEditMapGuideData(d => ({ ...d, kits: cleaned }));
    setMapGuideData(g => ({ ...g, kits: cleaned }));
    await fetch(`${config.API_BASE_URL}/api/map-guides/${encodeURIComponent(activeMapGuide)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(isAdmin ? { 'x-admin-session': 'imow' } : adminUsername ? { 'x-mod-session': adminUsername } : {})
      },
      body: JSON.stringify({ kits: cleaned })
    });
  }

  // Add this helper function near saveTipsModal
  async function saveTipsFields(fields) {
    const tipsArr = fields.map(t => t.trim()).filter(Boolean);
    setEditMapGuideData(d => ({ ...d, tips: tipsArr.join('\n') }));
    setMapGuideData(g => ({ ...g, tips: tipsArr }));
    await fetch(`${config.API_BASE_URL}/api/map-guides/${encodeURIComponent(activeMapGuide)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(isAdmin ? { 'x-admin-session': 'imow' } : adminUsername ? { 'x-mod-session': adminUsername } : {})
      },
      body: JSON.stringify({ tips: tipsArr })
    });
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg">
          {/* Remove the global Admin Upload button */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-gaming font-bold glow-text">Imow's Guides</h1>
          </div>
          {/* Section Switcher */}
          <div className="flex gap-4 mb-8 items-center justify-between">
            <div className="flex gap-4">
              <div className="relative" ref={gunDropdownRef}>
                <button
                  className={`px-6 py-2 rounded font-gaming text-lg transition-colors duration-200 ${activeGunCategory ? 'bg-neon-blue text-dark-bg' : 'bg-gray-800 text-neon-blue hover:bg-neon-blue/20'}`}
                  onClick={() => {
                    setShowGunDropdown(v => !v);
                    setShowMapDropdown(false);
                    // Do NOT setActiveMapGuide(null) here; only do it when actually switching to Gun Builds
                  }}
                >
                  Guides
                </button>
                {showGunDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-card-bg border border-neon-blue rounded-lg shadow-lg z-20">
                    {CATEGORIES.map(cat => (
                      <div
                        key={cat}
                        className="block w-full text-left px-4 py-2 font-gaming text-base text-white hover:bg-neon-blue/10 cursor-pointer"
                        onClick={() => {
                          setActiveGunCategory(cat);
                          setActiveMapGuide(null); // Only unhighlight Map Guides when actually switching to Gun Builds
                          setShowGunDropdown(false);
                          setShowMapDropdown(false);
                        }}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={mapDropdownRef}>
                <button
                  className={`px-6 py-2 rounded font-gaming text-lg transition-colors duration-200 ${activeMapGuide ? 'bg-neon-blue text-dark-bg' : 'bg-gray-800 text-neon-blue hover:bg-neon-blue/20'}`}
                  onClick={() => {
                    setShowMapDropdown(v => !v);
                    setShowGunDropdown(false);
                  }}
                >
                  Map Guides
                </button>
                {showMapDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-card-bg border border-neon-blue rounded-lg shadow-lg z-20">
                    {MAP_GUIDES.map(map => (
                      <div
                        key={map}
                        className="block w-full text-left px-4 py-2 font-gaming text-base text-white hover:bg-neon-blue/10 cursor-pointer"
                        onClick={() => {
                          setActiveMapGuide(map);
                          setActiveGunCategory(null); // Ensure Gun Builds section is hidden
                          setShowMapDropdown(false);
                          setShowGunDropdown(false);
                        }}
                      >
                        {map}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchInput}
                placeholder="Search maps or guns..."
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue text-base text-white min-w-[220px]"
              />
            </div>
          </div>
          {/* Search Results Dropdown/Section */}
          {showSearchResults && (
            <div className="absolute right-8 mt-2 w-96 bg-card-bg border border-neon-blue rounded-lg shadow-lg z-30">
              {searchResults.length === 0 ? (
                <div className="p-4 text-gray-400">No results found.</div>
              ) : (
                <ul>
                  {searchResults.map((result, idx) => (
                    <li key={idx} className="p-4 border-b border-gray-700 last:border-b-0 hover:bg-neon-blue/10 cursor-pointer"
                      onClick={() => {
                        setShowSearchResults(false);
                        if (result.type === 'gun') {
                          setActiveGunCategory(result.category);
                          setActiveMapGuide(null);
                        } else if (result.type === 'map') {
                          setActiveMapGuide(result.title);
                          setActiveGunCategory(null);
                        }
                      }}
                    >
                      {result.type === 'gun' ? (
                        <>
                          <span className="font-gaming text-neon-blue">Gun Build:</span> {result.title}
                          {result.tags && result.tags.length > 0 && (
                            <span className="ml-2 text-xs text-gray-400">[{result.tags.join(', ')}]</span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="font-gaming text-neon-green">Map Guide:</span> {result.title}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {/* Main Content: Show Gun Builds or Map Guide */}
          {activeGunCategory ? (
            // Gun Builds Section
            <>
              <div className="flex items-center mb-4">
                <h2 className="text-3xl font-gaming font-bold glow-text mr-2">{activeGunCategory}</h2>
                {isAdmin && (
                  <button
                    className="border-2 border-neon-blue text-neon-blue bg-transparent px-2 py-1 rounded font-gaming text-xs font-bold ml-2"
                    onClick={() => {
                      setForm({ title: '', description: '', tags: '', image: null, password: '', category: activeGunCategory });
                      setShowUpload(true);
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
              {/* Show builds for the selected category */}
              {loading ? (
                <div className="text-center py-20 text-neon-blue animate-pulse">Loading builds...</div>
              ) : builds.filter(b => b.category === activeGunCategory).length === 0 ? (
                <div className="text-center py-20 text-gray-400">No builds in this category yet.</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {builds.filter(b => b.category === activeGunCategory).map(build => (
                    <BuildCard
                      key={build.id}
                      build={build}
                      onEdit={isAdmin ? openEditModal : undefined}
                      onDelete={isAdmin ? handleDelete : undefined}
                      onImageClick={b => setModalImage(`${config.API_BASE_URL}${b.image}`)}
                      deleteLoading={deleteLoading}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              )}
            </>
          ) : activeMapGuide ? (
            // Map Guide Section
            <div className="mb-8">
              <div className="mb-4">
                <h2 className="text-3xl font-gaming font-bold glow-text mb-4">{activeMapGuide}</h2>
                {mapGuideLoading ? (
                  <div className="text-center py-10 text-neon-blue animate-pulse">Loading map guide...</div>
                ) : mapGuideError ? (
                  <div className="text-center py-10 text-red-400">{mapGuideError}</div>
                ) : mapGuideData && (
                  <>
                    {/* Images Section */}
                    <div className="mb-6">
                      <div className="font-gaming text-lg mb-2 flex items-center gap-2">
                        Images
                        {isAdmin && adminUsername && adminUsername !== '' && (
                          editingSection !== 'images' ? (
                            <button className="ml-2 px-2 py-1 bg-neon-blue text-dark-bg rounded text-xs" onClick={() => setEditingSection('images')}>Edit</button>
                          ) : (
                            <>
                              <button className="ml-2 px-2 py-1 bg-neon-blue text-dark-bg rounded text-xs" onClick={() => setEditingSection(null)}>Cancel</button>
                            </>
                          )
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 mb-2">
                        {mapGuideData.images.map((img, i) => (
                          <img key={i} src={`${config.API_BASE_URL}${img}`} alt="Map Guide" className="w-40 h-32 object-cover rounded border border-neon-blue" />
                        ))}
                      </div>
                      {isAdmin && adminUsername && adminUsername !== '' && editingSection === 'images' && (
                        <div className="mt-2">
                          <input type="file" accept="image/*" onChange={handleMapGuideImageUpload} />
                        </div>
                      )}
                    </div>
                    {/* Kits Section */}
                    <div className="mb-6">
                      <div className="font-gaming text-lg mb-2 flex items-center gap-2">
                        Kits
                        {isAdmin && adminUsername && adminUsername !== '' && (
                          <button className="ml-2 px-2 py-1 bg-neon-blue text-dark-bg rounded text-xs" onClick={openKitsModal}>Edit</button>
                        )}
                      </div>
                      <ul className="ml-6 text-white">
                        <li><span className="font-bold">Primary Weapon:</span> {mapGuideData.kits[0] || 'No suggestions'}</li>
                        <li><span className="font-bold">Headgear:</span> {mapGuideData.kits[1] || 'No suggestions'}</li>
                        <li><span className="font-bold">Headset:</span> {mapGuideData.kits[2] || 'No suggestions'}</li>
                        <li><span className="font-bold">Body Armor:</span> {mapGuideData.kits[3] || 'No suggestions'}</li>
                        <li><span className="font-bold">Backpack:</span> {mapGuideData.kits[4] || 'No suggestions'}</li>
                        <li><span className="font-bold">Keys to bring:</span> {mapGuideData.kits[5] || 'No suggestions'}</li>
                      </ul>
                    </div>
                    {/* Tips Section */}
                    <div className="mb-6">
                      <div className="font-gaming text-lg mb-2 flex items-center gap-2">
                        Tips
                        {isAdmin && adminUsername && adminUsername !== '' && editingSection !== 'tips' && (
                          <button className="ml-2 px-2 py-1 bg-neon-blue text-dark-bg rounded text-xs" onClick={() => {
                            setEditingSection('tips');
                            openTipsModal();
                          }}>Edit</button>
                        )}
                      </div>
                      {isAdmin && adminUsername && adminUsername !== '' && editingSection === 'tips' ? (
                        <></>
                      ) : (
                        <ul className="list-disc ml-6 text-white">
                          {(mapGuideData.tips || []).map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                      )}
                    </div>
                    {/* Loot Routes Section */}
                    <div className="mb-6">
                      <div className="font-gaming text-lg mb-2 flex items-center gap-2">
                        Loot Routes
                        {isAdmin && adminUsername && adminUsername !== '' && (
                          <button className="ml-2 px-2 py-1 bg-neon-blue text-dark-bg rounded text-xs" onClick={openLootRoutesModal}>Add</button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(mapGuideData.lootRoutes || []).filter(route => route && route.title && route.image).map((route) => (
                          <button
                            key={route.title}
                            className="border-2 border-neon-blue text-neon-blue bg-transparent px-2 py-1 rounded font-gaming tracking-widest font-bold text-sm mr-2 mb-2"
                            onClick={() => setModalImage(`${config.API_BASE_URL}${route.image}`)}
                          >
                            {route.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {/* Image Modal */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setModalImage(null)}>
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4" style={{ pointerEvents: 'none' }}>
            <div
              style={{ width: '80vw', height: '80vh', background: '#111', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', pointerEvents: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={5}
                wheel={{ step: 0.2 }}
                doubleClick={{ disabled: true }}
              >
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <>
                    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <div>
                        <button onClick={zoomIn} className="mx-1 px-2 py-1 bg-neon-blue text-dark-bg rounded">+</button>
                        <button onClick={zoomOut} className="mx-1 px-2 py-1 bg-neon-blue text-dark-bg rounded">-</button>
                        <button onClick={resetTransform} className="mx-1 px-2 py-1 bg-neon-blue text-dark-bg rounded">Reset</button>
                      </div>
                      <button className="mt-4 px-3 py-1 bg-neon-blue text-dark-bg rounded-full font-bold text-lg" onClick={() => setModalImage(null)}>
                        ×
                      </button>
                    </div>
                    <TransformComponent>
                      <img
                        src={modalImage}
                        alt="Enlarged Build"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none', pointerEvents: 'all' }}
                        draggable={false}
                      />
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editBuild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setEditBuild(null)}>
          <div className="relative w-full max-w-lg bg-card-bg rounded-lg p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-gaming mb-4">Edit Build</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Title</label>
                <input name="title" value={editForm.title} onChange={handleEditInput} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Tags (comma separated)</label>
                <input name="tags" value={editForm.tags} onChange={handleEditInput} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Category</label>
                <select name="category" value={editForm.category} onChange={handleEditInput} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm">Description</label>
                <textarea name="description" value={editForm.description} onChange={handleEditInput} rows={2} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Change Image</label>
                <input name="image" type="file" accept="image/*" onChange={handleEditInput} className="w-full" />
              </div>
              {editError && <div className="text-red-400 font-bold">{editError}</div>}
              <div className="flex gap-4 mt-4">
                <button className="cyber-button" type="submit" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save Changes'}</button>
                <button className="cyber-button border-red-500 text-red-500 hover:bg-red-500 hover:text-dark-bg" type="button" onClick={() => setEditBuild(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Kits Modal */}
      {showKitsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowKitsModal(false)}>
          <div className="relative w-full max-w-md bg-card-bg rounded-lg p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-gaming mb-4">Edit Kits</h2>
            <div className="space-y-3">
              {kitsFields.map((field, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {(isAdmin || adminUsername) ? (
                    <input
                      className="w-1/3 px-2 py-2 bg-gray-800 border border-neon-blue rounded-lg text-white text-sm"
                      value={field.label}
                      onChange={e => setKitsFields(f => f.map((fld, i) => i === idx ? { ...fld, label: e.target.value } : fld))}
                      onBlur={e => saveKitsFields(kitsFields.map((fld, i) => i === idx ? { ...fld, label: e.target.value } : fld))}
                      placeholder="Label"
                      title="Field label"
                    />
                  ) : (
                    <label className="block mb-1 text-sm w-1/3">{field.label}</label>
                  )}
                  <input
                    className="w-2/3 px-3 py-2 bg-gray-800 border border-neon-blue rounded-lg text-white"
                    value={field.value}
                    onChange={e => setKitsFields(f => f.map((fld, i) => i === idx ? { ...fld, value: e.target.value } : fld))}
                    onBlur={e => saveKitsFields(kitsFields.map((fld, i) => i === idx ? { ...fld, value: e.target.value } : fld))}
                    placeholder={field.label}
                  />
                  {(isAdmin || adminUsername) && kitsFields.length > 1 && (
                    <button
                      className="w-7 h-7 flex items-center justify-center bg-red-600 text-white rounded text-base p-0"
                      onClick={() => setKitsFields(f => f.filter((_, i) => i !== idx))}
                      title="Remove field"
                      type="button"
                    >🗑️</button>
                  )}
                </div>
              ))}
              {(isAdmin || adminUsername) && (
                <button
                  className="px-4 py-2 bg-neon-blue text-dark-bg rounded mt-2"
                  onClick={() => setKitsFields(f => [...f, { label: `Field ${f.length+1}`, value: '' }])}
                  type="button"
                >Add Field</button>
              )}
            </div>
            <div className="flex gap-4 mt-6 justify-end">
              <button className="px-4 py-2 bg-gray-700 text-white rounded" onClick={() => setShowKitsModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-neon-blue text-dark-bg rounded" onClick={saveKitsModal}>Save</button>
            </div>
          </div>
        </div>
      )}
      {/* Tips Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => { setShowTipsModal(false); setEditingSection(null); }}>
          <div className="relative w-full max-w-md bg-card-bg rounded-lg p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-gaming mb-4">Edit Tips</h2>
            <div className="space-y-3">
              {tipsFields.map((tip, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className="w-full px-3 py-2 bg-gray-800 border border-neon-blue rounded-lg text-white"
                    value={tip}
                    onChange={e => setTipsFields(f => f.map((t, i) => i === idx ? e.target.value : t))}
                    onBlur={e => (isAdmin || adminUsername) && saveTipsFields(tipsFields.map((t, i) => i === idx ? e.target.value : t))}
                  />
                  <button
                    className="w-7 h-7 flex items-center justify-center bg-red-600 text-white rounded text-base p-0"
                    onClick={() => setTipsFields(f => f.filter((_, i) => i !== idx))}
                    title="Remove"
                  >🗑️</button>
                </div>
              ))}
              <button
                className="px-4 py-2 bg-neon-blue text-dark-bg rounded mt-2"
                onClick={() => setTipsFields(f => [...f, ''])}
              >Add Tip</button>
            </div>
            <div className="flex gap-4 mt-6 justify-end">
              <button className="px-4 py-2 bg-gray-700 text-white rounded" onClick={() => { setShowTipsModal(false); setEditingSection(null); }}>Cancel</button>
              <button className="px-4 py-2 bg-neon-blue text-dark-bg rounded" onClick={saveTipsModal}>Save</button>
            </div>
          </div>
        </div>
      )}
      {/* Loot Routes Modal */}
      {showLootRoutesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowLootRoutesModal(false)}>
          <div className="relative w-full max-w-md bg-card-bg rounded-lg p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-gaming mb-4">Add Loot Route</h2>
            <form onSubmit={handleLootRouteUpload} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Title</label>
                <input className="w-full px-3 py-2 bg-gray-800 border border-neon-blue rounded-lg text-white" value={lootRouteTitle} onChange={e => setLootRouteTitle(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm">Image</label>
                <input type="file" accept="image/*" onChange={e => setLootRouteImage(e.target.files[0])} className="w-full" />
              </div>
              {lootRouteError && <div className="text-red-400 font-bold">{lootRouteError}</div>}
              <div className="flex gap-4 mt-4 justify-end">
                <button className="px-4 py-2 bg-gray-700 text-white rounded" type="button" onClick={() => setShowLootRoutesModal(false)}>Cancel</button>
                <button className="px-4 py-2 bg-neon-blue text-dark-bg rounded" type="submit" disabled={lootRouteUploading}>{lootRouteUploading ? 'Uploading...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowUpload(false)}>
          <div className="relative w-full max-w-lg bg-card-bg rounded-lg p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-gaming mb-4">Add New Build</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Title</label>
                <input name="title" value={form.title} onChange={handleInput} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Description</label>
                <textarea name="description" value={form.description} onChange={handleInput} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Tags (comma separated)</label>
                <input name="tags" value={form.tags} onChange={handleInput} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Image</label>
                <input type="file" name="image" accept="image/*" onChange={handleInput} className="w-full" />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" className="px-4 py-2 bg-gray-700 text-white rounded" onClick={() => setShowUpload(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-neon-blue text-dark-bg rounded font-bold">Upload</button>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GunBuilds; 