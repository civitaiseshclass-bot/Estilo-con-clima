import React from 'react';
import { OutfitSuggestion, AppStatus } from '../types';

interface ResultCardProps {
  status: AppStatus;
  suggestion: OutfitSuggestion | null;
  imageUrl: string | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({ status, suggestion, imageUrl }) => {
  const isLoading = status !== AppStatus.IDLE && status !== AppStatus.COMPLETED && status !== AppStatus.ERROR;

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'mi-outfit-ideal.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Initial State
  if (status === AppStatus.IDLE) {
    return (
      <div className="glass-panel rounded-3xl flex items-center justify-center h-full p-8 text-center border-dashed border-2 border-gray-300 bg-white/30">
        <div className="text-gray-400">
          <svg className="w-20 h-20 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">Tu outfit aparecerá aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl h-full p-6 flex flex-col relative overflow-hidden transition-all duration-500 shadow-xl">
      {/* Weather Badge (if available) */}
      {suggestion && (
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white flex items-center gap-2">
            <span className="text-2xl">🌤️</span>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Clima Actual</p>
              <p className="text-sm font-semibold text-gray-800">{suggestion.weatherSummary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="flex-grow relative rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center mb-6 group">
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt="Generated Outfit" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <button
              onClick={handleDownload}
              className="absolute bottom-4 right-4 bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-50 focus:outline-none"
              title="Descargar imagen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center animate-pulse">
             <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
             <p className="text-gray-500 font-medium">
               {status === AppStatus.GENERATING_IMAGE ? 'Generando imagen...' : 'Consultando clima...'}
             </p>
          </div>
        )}
      </div>

      {/* Advice Text */}
      <div className="bg-white/60 rounded-2xl p-5 border border-white/50">
        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-bold mb-2">
          RECOMENDACIÓN IA
        </span>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
          {suggestion ? suggestion.advice : "Esperando datos..."}
        </p>
      </div>
    </div>
  );
};