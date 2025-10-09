'use client';

import { useState } from 'react';
import ArtistForm from '@/components/ArtistForm';
import { ArtistInput, GeneratedBio } from '@/types';

export default function Home() {
  const [generatedBio, setGeneratedBio] = useState<GeneratedBio | null>(null);
  const [artistInput, setArtistInput] = useState<ArtistInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: ArtistInput) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedBio(null);
    setArtistInput(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI-EPK: Создайте профессиональное BIO артиста за минуту
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Введите информацию о себе, и наш AI создаст готовый электронный пресс-кит с
            профессиональным описанием для букингов и промо.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!generatedBio ? (
            <>
              {/* Form */}
              <ArtistForm onSubmit={handleFormSubmit} isLoading={isLoading} />

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Generated Bio Result */}
              <div className="space-y-8">
                {/* Artist Header */}
                <div className="border-b pb-6">
                  <h2 className="text-3xl font-bold text-gray-900">{artistInput?.name}</h2>
                  <p className="text-lg text-gray-600 mt-2">
                    {artistInput?.city} • {artistInput?.genres.join(', ')}
                  </p>
                </div>

                {/* Elevator Pitch */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Elevator Pitch</h3>
                  <p className="text-gray-700 leading-relaxed">{generatedBio.pitch}</p>
                </div>

                {/* Full Bio */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Bio</h3>
                  <p className="text-gray-700 leading-relaxed">{generatedBio.bio}</p>
                </div>

                {/* Key Highlights */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Highlights</h3>
                  <ul className="space-y-2">
                    {generatedBio.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-3 mt-1">•</span>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
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
                <div className="flex gap-4 pt-6 border-t">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition"
                  >
                    Создать новое BIO
                  </button>
                  <button
                    disabled
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Скачать PDF (скоро)
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Powered by AI • Создано для артистов</p>
        </div>
      </div>
    </main>
  );
}

