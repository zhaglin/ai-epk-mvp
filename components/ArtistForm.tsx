'use client';

import { useState } from 'react';
import { ArtistInput } from '@/types';

interface ArtistFormProps {
  onSubmit: (data: ArtistInput) => void;
  isLoading?: boolean;
}

export default function ArtistForm({ onSubmit, isLoading = false }: ArtistFormProps) {
  const [formData, setFormData] = useState<ArtistInput>({
    name: '',
    city: '',
    genres: [],
    venues: '',
    style: '',
    skills: '',
    achievements: '',
    links: {
      instagram: '',
      soundcloud: '',
      mixcloud: '',
      website: '',
    },
  });

  const [genresInput, setGenresInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ArtistInput, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ArtistInput, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя артиста обязательно';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Город обязателен';
    }

    if (formData.genres.length === 0) {
      newErrors.genres = 'Укажите хотя бы один жанр';
    }

    if (!formData.venues.trim()) {
      newErrors.venues = 'Укажите места выступлений';
    }

    if (!formData.style.trim()) {
      newErrors.style = 'Опишите ваш стиль';
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'Укажите ваши навыки';
    }

    if (!formData.achievements.trim()) {
      newErrors.achievements = 'Укажите ваши достижения';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleGenresChange = (value: string) => {
    setGenresInput(value);
    const genresArray = value
      .split(',')
      .map((g) => g.trim())
      .filter((g) => g.length > 0);
    setFormData((prev) => ({ ...prev, genres: genresArray }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Имя артиста */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Имя артиста <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 bg-white ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Например: DJ TechnoNik"
          disabled={isLoading}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Город */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          Город <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="city"
          value={formData.city}
          onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 bg-white ${
            errors.city ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Например: Москва"
          disabled={isLoading}
        />
        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
      </div>

      {/* Жанры */}
      <div>
        <label htmlFor="genres" className="block text-sm font-medium text-gray-700 mb-2">
          Жанры <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="genres"
          value={genresInput}
          onChange={(e) => handleGenresChange(e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 bg-white ${
            errors.genres ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Например: Techno, House, Melodic Techno (через запятую)"
          disabled={isLoading}
        />
        {errors.genres && <p className="mt-1 text-sm text-red-600">{errors.genres}</p>}
        {formData.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.genres.map((genre, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Места выступлений */}
      <div>
        <label htmlFor="venues" className="block text-sm font-medium text-gray-700 mb-2">
          Места выступлений <span className="text-red-500">*</span>
        </label>
        <textarea
          id="venues"
          value={formData.venues}
          onChange={(e) => setFormData((prev) => ({ ...prev, venues: e.target.value }))}
          rows={3}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 bg-white resize-none ${
            errors.venues ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Например: Клубы Москвы и Санкт-Петербурга, фестиваль Signal 2024"
          disabled={isLoading}
        />
        {errors.venues && <p className="mt-1 text-sm text-red-600">{errors.venues}</p>}
      </div>

      {/* Стиль/подход */}
      <div>
        <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
          Стиль и подход <span className="text-red-500">*</span>
        </label>
        <textarea
          id="style"
          value={formData.style}
          onChange={(e) => setFormData((prev) => ({ ...prev, style: e.target.value }))}
          rows={3}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 bg-white resize-none ${
            errors.style ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Например: Энергичные сеты с глубокими басами и гипнотичными мелодиями"
          disabled={isLoading}
        />
        {errors.style && <p className="mt-1 text-sm text-red-600">{errors.style}</p>}
      </div>

      {/* Навыки */}
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
          Навыки <span className="text-red-500">*</span>
        </label>
        <textarea
          id="skills"
          value={formData.skills}
          onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))}
          rows={3}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 bg-white resize-none ${
            errors.skills ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Например: Диджеинг, продакшн в Ableton Live, микширование и мастеринг"
          disabled={isLoading}
        />
        {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
      </div>

      {/* Достижения */}
      <div>
        <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 mb-2">
          Достижения <span className="text-red-500">*</span>
        </label>
        <textarea
          id="achievements"
          value={formData.achievements}
          onChange={(e) => setFormData((prev) => ({ ...prev, achievements: e.target.value }))}
          rows={3}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 bg-white resize-none ${
            errors.achievements ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Например: Релизы на Drumcode, выступления на Awakenings и Time Warp"
          disabled={isLoading}
        />
        {errors.achievements && <p className="mt-1 text-sm text-red-600">{errors.achievements}</p>}
      </div>

      {/* Ссылки на соцсети */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ссылки (необязательно)</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              id="instagram"
              value={formData.links.instagram || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  links: { ...prev.links, instagram: e.target.value },
                }))
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 bg-white"
              placeholder="https://instagram.com/yourname"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="soundcloud" className="block text-sm font-medium text-gray-700 mb-2">
              SoundCloud
            </label>
            <input
              type="url"
              id="soundcloud"
              value={formData.links.soundcloud || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  links: { ...prev.links, soundcloud: e.target.value },
                }))
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 bg-white"
              placeholder="https://soundcloud.com/yourname"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="mixcloud" className="block text-sm font-medium text-gray-700 mb-2">
              Mixcloud
            </label>
            <input
              type="url"
              id="mixcloud"
              value={formData.links.mixcloud || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  links: { ...prev.links, mixcloud: e.target.value },
                }))
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 bg-white"
              placeholder="https://mixcloud.com/yourname"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Сайт
            </label>
            <input
              type="url"
              id="website"
              value={formData.links.website || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  links: { ...prev.links, website: e.target.value },
                }))
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-400 bg-white"
              placeholder="https://yourwebsite.com"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Генерирую BIO...
            </span>
          ) : (
            'Сгенерировать BIO'
          )}
        </button>
      </div>
    </form>
  );
}

