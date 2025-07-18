import React, { useEffect, useState } from 'react';
import BuildCard from '../components/BuildCard';

const API_URL = 'http://localhost:4000/api/builds';
const UPLOAD_URL = 'http://localhost:4000/api/builds';

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

function GunBuilds({ isAdmin, onAdminLogout }) {
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

  useEffect(() => {
    fetchBuilds();
  }, []);

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

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="card-glow p-10 md:p-16 bg-card-bg/80 backdrop-blur-md rounded-2xl shadow-lg">
          {isAdmin && (
            <div className="flex gap-2 justify-end mb-4">
              <button className="cyber-button px-4 py-1 text-xs border-red-500 text-red-500 hover:bg-red-500 hover:text-dark-bg" onClick={onAdminLogout}>Logout</button>
              <button className="cyber-button px-4 py-1 text-xs" onClick={() => setShowUpload(v => !v)}>
                {showUpload ? 'Close Upload' : 'Admin Upload'}
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-gaming font-bold glow-text">Imow's Gun Builds</h1>
          </div>

          {/* Search Bar */}
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, category, description, or tags..."
              className="w-full max-w-xl px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue text-lg"
            />
          </div>

          {showUpload && isAdmin && (
            <form className="card-glow p-8 mb-12 space-y-6" onSubmit={handleUpload}>
              <h2 className="text-2xl font-gaming mb-4">Upload New Build (Admin Only)</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm">Title *</label>
                  <input name="title" value={form.title} onChange={handleInput} required className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue" />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Tags (comma separated)</label>
                  <input name="tags" value={form.tags} onChange={handleInput} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue" />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Category *</label>
                  <select name="category" value={form.category || ''} onChange={handleInput} required className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue">
                    <option value="" disabled>Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm">Description</label>
                  <textarea name="description" value={form.description} onChange={handleInput} rows={2} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue" />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Image *</label>
                  <input name="image" type="file" accept="image/*" onChange={handleInput} required className="w-full" />
                </div>
              </div>
              {error && <div className="text-red-400 font-bold">{error}</div>}
              {success && <div className="text-neon-green font-bold">{success}</div>}
              <button className="cyber-button mt-4" type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Build'}</button>
            </form>
          )}

          <h2 className="text-2xl font-gaming mb-6">Community Gallery</h2>
          {loading ? (
            <div className="text-center py-20 text-neon-blue animate-pulse">Loading builds...</div>
          ) : builds.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No builds yet. Check back soon!</div>
          ) : search ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filterBuildsBySearch(builds, search).length === 0 ? (
                <div className="col-span-full text-gray-400 text-center">No builds match your search.</div>
              ) : (
                filterBuildsBySearch(builds, search).map(build => (
                  <BuildCard
                    key={build.id}
                    build={build}
                    onEdit={isAdmin ? openEditModal : undefined}
                    onDelete={isAdmin ? handleDelete : undefined}
                    onImageClick={b => setModalImage(`http://localhost:4000${b.image}`)}
                    deleteLoading={deleteLoading}
                    isAdmin={isAdmin}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {CATEGORIES.map(category => {
                const buildsInCategory = builds.filter(b => b.category === category);
                return (
                  <div key={category} className="border border-neon-blue rounded-lg overflow-hidden">
                    <button
                      className={`w-full text-left px-6 py-4 font-gaming text-xl flex items-center justify-between focus:outline-none ${openCategory === category ? 'bg-neon-blue/10 text-neon-blue' : 'bg-card-bg text-white'}`}
                      onClick={() => setOpenCategory(openCategory === category ? null : category)}
                    >
                      <span>{category}</span>
                      <span>{openCategory === category ? '▲' : '▼'}</span>
                    </button>
                    {openCategory === category && (
                      <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8 bg-card-bg">
                        {buildsInCategory.length === 0 ? (
                          <div className="col-span-full text-gray-400 text-center">No builds in this category.</div>
                        ) : (
                          buildsInCategory.map(build => (
                            <BuildCard
                              key={build.id}
                              build={build}
                              onEdit={isAdmin ? openEditModal : undefined}
                              onDelete={isAdmin ? handleDelete : undefined}
                              onImageClick={b => setModalImage(`http://localhost:4000${b.image}`)}
                              deleteLoading={deleteLoading}
                              isAdmin={isAdmin}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Image Modal */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setModalImage(null)}>
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <img src={modalImage} alt="Enlarged Build" className="max-h-screen w-auto h-auto rounded-lg shadow-lg object-contain" style={{maxWidth: '95vw'}} />
            <button className="absolute top-4 right-4 bg-neon-blue text-dark-bg rounded-full px-3 py-1 font-bold text-lg" onClick={() => setModalImage(null)}>
              ×
            </button>
            {/* Delete button in modal (admin only) */}
            {isAdmin && (
              <>
                <button className="cyber-button mt-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-dark-bg" onClick={() => {
                  // Find the build by image URL
                  const build = builds.find(b => `http://localhost:4000${b.image}` === modalImage);
                  if (build) handleDelete(build.id);
                  setModalImage(null);
                }} disabled={deleteLoading}>Delete</button>
                {deleteError && <div className="text-red-400 font-bold mt-2">{deleteError}</div>}
              </>
            )}
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
    </div>
  );
}

export default GunBuilds; 