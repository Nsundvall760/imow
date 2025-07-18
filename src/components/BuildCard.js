import React from 'react';

const BuildCard = ({ build, onEdit, onDelete, onImageClick, deleteLoading, isAdmin }) => (
  <div className="card-glow p-4 flex flex-col hover:scale-105 transition-transform duration-300">
    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 cursor-pointer" onClick={() => onImageClick && onImageClick(build)}>
      <img src={`http://localhost:4000${build.image}`} alt={build.title} className="w-full h-full object-cover" />
    </div>
    <h3 className="font-gaming text-lg text-neon-blue mb-1">{build.title}</h3>
    <div className="text-gray-400 text-xs mb-2">{new Date(build.createdAt).toLocaleString()}</div>
    <div className="text-gray-300 text-sm mb-2 line-clamp-2">{build.description}</div>
    <div className="flex flex-wrap gap-2 mt-auto">
      {build.tags && build.tags.map((tag, i) => (
        <span key={i} className="bg-gray-800 text-neon-blue px-2 py-1 rounded text-xs">{tag}</span>
      ))}
    </div>
    {isAdmin && (
      <div className="flex gap-2 mt-2">
        <button className="cyber-button px-4 py-1 text-xs" onClick={() => onEdit && onEdit(build)}>Edit</button>
        <button className="cyber-button px-4 py-1 text-xs border-red-500 text-red-500 hover:bg-red-500 hover:text-dark-bg" onClick={() => onDelete && onDelete(build.id)} disabled={deleteLoading}>Delete</button>
      </div>
    )}
  </div>
);

export default BuildCard; 