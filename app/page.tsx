'use client';

import { useState } from 'react';
import ArtistForm from '@/components/ArtistForm';
import BioEditor from '@/components/BioEditor';
import { ArtistInput, GeneratedBio } from '@/types';
import dynamic from 'next/dynamic';

export default function Home() {
  const [generatedBio, setGeneratedBio] = useState<GeneratedBio | null>(null);
  const [artistInput, setArtistInput] = useState<ArtistInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFormSubmit = async (data: ArtistInput & { photoUrl?: string; originalPhotoUrl?: string }) => {
    setIsLoading(true);
    setError(null);
    setArtistInput(data);

    try {
      const response = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Ошибка при генерации BIO. Попробуйте ещё раз.');
      }

      const bio: GeneratedBio = await response.json();
      setGeneratedBio(bio);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!artistInput) return;
    await handleFormSubmit(artistInput);
  };

  const handleSaveEdit = (editedBio: GeneratedBio) => {
    setGeneratedBio(editedBio);
    setIsEditing(false);
  };

  const handleReset = () => {
    setGeneratedBio(null);
    setArtistInput(null);
    setError(null);
    setIsEditing(false);
  };

  const handleDownloadPDF = async () => {
    if (!artistInput || !generatedBio) {
      setError('Нет данных для генерации PDF.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting PDF generation...');
      
      // Отправляем запрос на серверный API для генерации PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...artistInput,
          photoUrl: (artistInput as any)?.photoUrl,
          originalPhotoUrl: (artistInput as any)?.originalPhotoUrl,
          generated: generatedBio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Получаем PDF как blob
      const blob = await response.blob();
      
      // Создаем URL и скачиваем
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EPK_${artistInput.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('PDF generated successfully!');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      setError('Ошибка при генерации PDF. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient Blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-3xl"></div>
        
        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-700 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold text-xl">A1</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ArtistOne
                </span>
              </div>
              
              {/* Nav Links */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                  Главная
                </a>
                <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                  Возможности
                </a>
                <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                  Как это работает
                </a>
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium">
                  Начать
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Профессиональное EPK<br />за минуту
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              AI создаст готовый электронный пресс-кит с профессиональным описанием,<br className="hidden md:block" />
              стильным фото и PDF для букингов
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 mb-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">5000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Артистов</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">1 мин</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Создание</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 dark:text-pink-400">AI</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Технология</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Main Content Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 md:p-12 transform hover:shadow-3xl transition-all duration-300">
          {!generatedBio ? (
            <div className="space-y-6">
              {/* Card Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Создайте свой EPK
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Заполните форму и получите профессиональное описание
                </p>
              </div>

              {/* Form */}
              <ArtistForm onSubmit={handleFormSubmit} isLoading={isLoading} />

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-shake">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>
          ) : isEditing ? (
            <BioEditor
              initialBio={generatedBio}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              {/* Generated Bio Result */}
              <div className="space-y-8 animate-fade-in">
                {/* Artist Photo Hero Section */}
                {(artistInput as any)?.photoUrl && (
                  <div className="text-center mb-12">
                    <div className="relative inline-block w-full max-w-md mx-auto group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <img
                        src={(artistInput as any).photoUrl}
                        alt={artistInput?.name}
                        className="relative w-full aspect-square object-cover rounded-3xl shadow-2xl ring-4 ring-white dark:ring-slate-800 transform group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-xl backdrop-blur-sm flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>AI Enhanced</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Оригинальное фото если нет улучшенного */}
                {!(artistInput as any)?.photoUrl && (artistInput as any)?.originalPhotoUrl && (
                  <div className="text-center mb-12">
                    <div className="relative inline-block w-full max-w-md mx-auto group">
                      <img
                        src={(artistInput as any).originalPhotoUrl}
                        alt={artistInput?.name}
                        className="w-full aspect-square object-cover rounded-3xl shadow-2xl ring-4 ring-white dark:ring-slate-800"
                      />
                    </div>
                  </div>
                )}
                
                {/* Artist Header */}
                <div className="border-b border-gray-200 dark:border-slate-700 pb-8 mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-3">
                    {artistInput?.name}
                  </h2>
                  <div className="flex items-center flex-wrap gap-3 text-lg text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{artistInput?.city}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center flex-wrap gap-2">
                      {artistInput?.genres.map((genre, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Elevator Pitch */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Elevator Pitch</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{generatedBio.pitch}</p>
                </div>

                {/* Full Bio */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-3">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>Biography</span>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">{generatedBio.bio}</p>
                </div>

                {/* Key Highlights */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-3">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>Key Highlights</span>
                  </h3>
                  <div className="grid gap-4">
                    {generatedBio.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-shadow duration-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {artistInput?.links && Object.values(artistInput.links).some((link) => link) && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Links</h3>
                    <div className="space-y-2">
                      {artistInput.links.instagram && (
                        <a
                          href={artistInput.links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:underline"
                        >
                          Instagram: {artistInput.links.instagram}
                        </a>
                      )}
                      {artistInput.links.soundcloud && (
                        <a
                          href={artistInput.links.soundcloud}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:underline"
                        >
                          SoundCloud: {artistInput.links.soundcloud}
                        </a>
                      )}
                      {artistInput.links.mixcloud && (
                        <a
                          href={artistInput.links.mixcloud}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:underline"
                        >
                          Mixcloud: {artistInput.links.mixcloud}
                        </a>
                      )}
                      {artistInput.links.website && (
                        <a
                          href={artistInput.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:underline"
                        >
                          Website: {artistInput.links.website}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4 pt-8 border-t border-gray-200 dark:border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="group relative px-6 py-4 bg-white dark:bg-slate-800 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center justify-center space-x-3 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Редактировать</span>
                    </button>
                    
                    <button
                      onClick={handleRegenerate}
                      disabled={isLoading}
                      className="group relative px-6 py-4 bg-white dark:bg-slate-800 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 font-semibold rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 flex items-center justify-center space-x-3 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Генерирую...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Регенерировать</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleReset}
                      className="group relative px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 text-gray-800 dark:text-gray-100 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-200 flex items-center justify-center space-x-3 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Создать новое BIO</span>
                    </button>
                    
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isLoading}
                      className="group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-3 hover:shadow-xl hover:scale-[1.02] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 animate-pulse-glow"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Создаю PDF...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                          </svg>
                          <span>Скачать PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* How It Works Section */}
        <section id="how-it-works" className="mt-24 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Как это работает
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Три простых шага до профессионального EPK
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-sm mb-2">ШАГ 1</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Загрузите фото</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Загрузите портрет или промо-фото. AI улучшит качество, сохранив вашу внешность на 100%
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-purple-600 dark:text-purple-400 font-bold text-sm mb-2">ШАГ 2</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Заполните форму</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Укажите базовую информацию: имя, город, жанры, стиль, достижения и социальные сети
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-pink-600 dark:text-pink-400 font-bold text-sm mb-2">ШАГ 3</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Получите EPK</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    AI создаст профессиональное BIO за минуту. Скачайте PDF и отправляйте букерам
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mt-24 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Возможности
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Всё что нужно для профессионального пресс-кита
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI-генерация BIO</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Профессиональное описание артиста с elevator pitch и ключевыми достижениями
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Улучшение фото</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI повышает качество изображения в 2 раза, сохраняя вашу внешность на 100%
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">PDF экспорт</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Готовый PDF с кириллицей для отправки букерам и использования в промо
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Редактирование</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Полностью редактируемый результат — измените любую часть BIO перед скачиванием
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Качество</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Профессиональный результат уровня букинг-агентства за долю стоимости
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">За минуту</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                От ввода данных до готового PDF — всего 60 секунд. Быстрее любого копирайтера
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-gray-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">A1</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ArtistOne
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Профессиональные EPK для артистов за минуту. Создано с ❤️ для музыкального сообщества.
                </p>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Быстрые ссылки</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      О проекте
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Возможности
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Примеры
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Контакты
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Info */}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Технологии</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                    Next.js
                  </span>
                  <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                    OpenAI
                  </span>
                  <span className="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">
                    Replicate AI
                  </span>
                  <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                    TypeScript
                  </span>
                </div>
              </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="py-6 border-t border-gray-200 dark:border-slate-700">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  © 2025 ArtistOne. Powered by AI • Создано для артистов
                </p>
                <div className="flex items-center space-x-6">
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                    Политика конфиденциальности
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                    Условия использования
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

