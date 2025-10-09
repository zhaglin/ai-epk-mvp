'use client';

import { useState } from 'react';
import { ArtistInput } from '@/types';

interface ArtistFormProps {
  onSubmit: (data: ArtistInput & { photoUrl?: string; originalPhotoUrl?: string }) => void;
  isLoading?: boolean;
}

interface PhotoUploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  isEnhancing: boolean;
  enhancedUrl: string | null;
  error: string | null;
}

export default function ArtistForm({ onSubmit, isLoading = false }: ArtistFormProps) {
  const [formData, setFormData] = useState<ArtistInput>({
    name: 'DJ TechnoNik',
    city: 'Москва',
    genres: ['Techno', 'Melodic Techno', 'Progressive House'],
    venues: 'Клубы Москвы (Arma17, Mutabor), фестиваль Signal 2024, резидент Powerhouse',
    style: 'Гипнотичные арпеджио на модульных синтезаторах, deep и энергичные сеты с акцентом на groove',
    skills: 'Диджеинг на 4 деках, продакшн в Ableton Live, модульные синтезаторы, live-act',
    achievements: 'Релизы на Afterlife и Drumcode, 200+ выступлений, резидент клуба Powerhouse, саппорт от Tale Of Us',
    links: {
      instagram: 'https://instagram.com/djtechnonik',
      soundcloud: 'https://soundcloud.com/djtechnonik',
      mixcloud: '',
      website: '',
    },
  });

  const [genresInput, setGenresInput] = useState('Techno, Melodic Techno, Progressive House');
  const [errors, setErrors] = useState<Partial<Record<keyof ArtistInput, string>>>({});
  
  const [photoState, setPhotoState] = useState<PhotoUploadState>({
    file: null,
    preview: null,
    isUploading: false,
    isEnhancing: false,
    enhancedUrl: null,
    error: null,
  });

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
      onSubmit({
        ...formData,
        photoUrl: photoState.enhancedUrl || undefined,
        originalPhotoUrl: photoState.preview || undefined,
      });
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

  const handlePhotoUpload = async (file: File) => {
    // Валидация файла
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setPhotoState(prev => ({ ...prev, error: 'Файл слишком большой. Максимум 5MB.' }));
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setPhotoState(prev => ({ ...prev, error: 'Неподдерживаемый формат. Используйте JPEG, PNG или WebP.' }));
      return;
    }

    // Создаем превью
    const preview = URL.createObjectURL(file);
    
    setPhotoState(prev => ({
      ...prev,
      file,
      preview,
      error: null,
      isUploading: true,
    }));

    try {
      // Загружаем файл
      const formData = new FormData();
      formData.append('image', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Ошибка загрузки файла');
      }

      const uploadData = await uploadResponse.json();
      console.log('File uploaded:', uploadData);

      setPhotoState(prev => ({
        ...prev,
        isUploading: false,
        isEnhancing: true,
      }));

      // Улучшаем фото с помощью AI
      const enhanceResponse = await fetch('/api/enhance-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileId: uploadData.fileId,
          fileName: uploadData.fileName 
        }),
      });

      const enhanceData = await enhanceResponse.json();

      if (enhanceData.success) {
        setPhotoState(prev => ({
          ...prev,
          isEnhancing: false,
          enhancedUrl: enhanceData.enhancedUrl,
        }));
        console.log('Photo enhanced successfully:', enhanceData);
      } else {
        // Fallback на оригинальное фото
        setPhotoState(prev => ({
          ...prev,
          isEnhancing: false,
          enhancedUrl: null,
        }));
        console.log('AI enhancement failed, using original photo');
      }

    } catch (error) {
      console.error('Photo upload/enhancement failed:', error);
      setPhotoState(prev => ({
        ...prev,
        isUploading: false,
        isEnhancing: false,
        error: error instanceof Error ? error.message : 'Ошибка обработки фото',
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const removePhoto = () => {
    if (photoState.preview) {
      URL.revokeObjectURL(photoState.preview);
    }
    setPhotoState({
      file: null,
      preview: null,
      isUploading: false,
      isEnhancing: false,
      enhancedUrl: null,
      error: null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Загрузка фото */}
      <div className="pb-8 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <label className="text-lg font-bold text-gray-900 dark:text-white">
            Фото артиста <span className="text-gray-500 dark:text-gray-400 font-normal text-base">(необязательно)</span>
          </label>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 ml-11 leading-relaxed">
          Загрузите портрет или промо-фото — AI улучшит качество (свет, контраст, четкость), сохранив ваш облик на 100%
        </p>
        
        {!photoState.file ? (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
                disabled={isLoading || photoState.isUploading || photoState.isEnhancing}
              />
              <label
                htmlFor="photo-upload"
                className={`cursor-pointer block ${(isLoading || photoState.isUploading || photoState.isEnhancing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-base text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <span className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      Нажмите для загрузки
                    </span>
                    {' '}или перетащите файл сюда
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPEG, PNG, WebP • Максимум 5MB
                  </p>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full max-w-sm mx-auto">
              <img
                src={photoState.enhancedUrl || photoState.preview || ''}
                alt="Artist photo preview"
                className="w-full aspect-square object-cover rounded-xl shadow-lg"
              />
              
              {/* Индикаторы состояния */}
              {(photoState.isUploading || photoState.isEnhancing) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm">
                      {photoState.isUploading ? 'Загрузка...' : 'AI обрабатывает изображение...'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Статус улучшения */}
              {photoState.enhancedUrl && !photoState.isEnhancing && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ✨ Улучшено
                </div>
              )}
            </div>
            
            {/* Кнопка удаления */}
            <button
              type="button"
              onClick={removePhoto}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
              disabled={photoState.isUploading || photoState.isEnhancing}
            >
              Удалить фото
            </button>
          </div>
        )}
        
        {/* Ошибки */}
        {photoState.error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{photoState.error}</p>
          </div>
        )}
      </div>

      {/* Имя артиста */}
      <div className="group">
        <label htmlFor="name" className="block text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span>Имя артиста <span className="text-red-500">*</span></span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-800 text-lg ${
            errors.name ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-slate-600 group-hover:border-gray-400 dark:group-hover:border-slate-500'
          }`}
          placeholder="Например: DJ TechnoNik"
          disabled={isLoading}
        />
        {errors.name && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 animate-shake">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors.name}</span>
          </div>
        )}
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
      <div className="pt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed overflow-hidden transform hover:scale-[1.02] hover:shadow-2xl disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          <span className="relative flex items-center justify-center space-x-3 text-lg">
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-6 w-6 text-white"
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
                <span>Генерирую BIO...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span>Сгенерировать EPK с помощью AI</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}

