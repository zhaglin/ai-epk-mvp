'use client';

import { useState } from 'react';
import { GeneratedBio } from '@/types';

interface BioEditorProps {
  initialBio: GeneratedBio;
  onSave: (editedBio: GeneratedBio) => void;
  onCancel: () => void;
}

export default function BioEditor({ initialBio, onSave, onCancel }: BioEditorProps) {
  const [editedBio, setEditedBio] = useState<GeneratedBio>(initialBio);
  const [editingHighlightIndex, setEditingHighlightIndex] = useState<number | null>(null);
  const [newHighlight, setNewHighlight] = useState('');

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setEditedBio({
        ...editedBio,
        highlights: [...editedBio.highlights, newHighlight.trim()],
      });
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setEditedBio({
      ...editedBio,
      highlights: editedBio.highlights.filter((_, i) => i !== index),
    });
  };

  const handleEditHighlight = (index: number, value: string) => {
    const newHighlights = [...editedBio.highlights];
    newHighlights[index] = value;
    setEditedBio({ ...editedBio, highlights: newHighlights });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900">Редактировать BIO</h3>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          ✕ Закрыть
        </button>
      </div>

      {/* Elevator Pitch */}
      <div>
        <label htmlFor="pitch" className="block text-sm font-semibold text-gray-900 mb-2">
          Elevator Pitch
        </label>
        <textarea
          id="pitch"
          value={editedBio.pitch}
          onChange={(e) => setEditedBio({ ...editedBio, pitch: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">2-3 предложения о ключевых моментах</p>
      </div>

      {/* Full Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-semibold text-gray-900 mb-2">
          Full Bio
        </label>
        <textarea
          id="bio"
          value={editedBio.bio}
          onChange={(e) => setEditedBio({ ...editedBio, bio: e.target.value })}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">Полное описание артиста</p>
      </div>

      {/* Highlights */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Key Highlights</label>
        <div className="space-y-2">
          {editedBio.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2">
              {editingHighlightIndex === index ? (
                <>
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleEditHighlight(index, e.target.value)}
                    onBlur={() => setEditingHighlightIndex(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setEditingHighlightIndex(null);
                      if (e.key === 'Escape') setEditingHighlightIndex(null);
                    }}
                    autoFocus
                    className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </>
              ) : (
                <>
                  <div className="flex-1 px-3 py-2 bg-gray-50 rounded-lg flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700 flex-1">{highlight}</span>
                  </div>
                  <button
                    onClick={() => setEditingHighlightIndex(index)}
                    className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleRemoveHighlight(index)}
                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          ))}

          {/* Add New Highlight */}
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddHighlight();
              }}
              placeholder="Добавить новый highlight..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddHighlight}
              disabled={!newHighlight.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              + Добавить
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition"
        >
          Отмена
        </button>
        <button
          onClick={() => onSave(editedBio)}
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}

