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
        body: JSON.stringify({ fileId: uploadData.fileId }),
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Загрузка фото */}
      <div className="border-b pb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Фото артиста <span className="text-gray-500">(необязательно)</span>
        </label>
             <p className="text-sm text-gray-500 mb-4">
               Загрузите портрет или промо-фото — AI добавит драматичное освещение и стильную цветокоррекцию
             </p>
        
        {!photoState.file ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
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
              className={`cursor-pointer ${(isLoading || photoState.isUploading || photoState.isEnhancing) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Нажмите для загрузки
                  </span>
                  {' '}или перетащите файл сюда
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, WebP до 5MB
                </p>
              </div>
            </label>
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

