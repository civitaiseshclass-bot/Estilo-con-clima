import React from 'react';
import { AppStatus } from '../types';

interface InputCardProps {
  activity: string;
  setActivity: (val: string) => void;
  onGenerate: () => void;
  status: AppStatus;
}

export const InputCard: React.FC<InputCardProps> = ({ 
  activity, 
  setActivity, 
  onGenerate, 
  status 
}) => {
  const isLoading = status !== AppStatus.IDLE && status !== AppStatus.COMPLETED && status !== AppStatus.ERROR;

  return (
    <div className="glass-panel rounded-3xl p-8 flex flex-col h-full justify-center shadow-lg transition-all hover:shadow-xl">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold tracking-wide mb-2">
          PASO 1
        </span>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">¿Qué harás hoy?</h2>
        <p className="text-gray-500">
          Describe tu actividad y deja que analicemos el clima por ti.
        </p>
      </div>

      <textarea
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        placeholder="Ej: Voy a salir a correr por el parque, luego iré por un café..."
        className="w-full h-40 p-4 rounded-2xl bg-white/50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none text-lg transition-all"
        disabled={isLoading}
      />

      <div className="mt-8">
        <button
          onClick={onGenerate}
          disabled={!activity.trim() || isLoading}
          className={`
            w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg
            transition-all transform active:scale-95 flex items-center justify-center space-x-2
            ${!activity.trim() || isLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'}
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>
                {status === AppStatus.LOCATING && 'Localizando...'}
                {status === AppStatus.ANALYZING && 'Consultando Clima...'}
                {status === AppStatus.GENERATING_IMAGE && 'Diseñando Outfit...'}
              </span>
            </>
          ) : (
            <span>✨ Generar Outfit</span>
          )}
        </button>
      </div>
    </div>
  );
};