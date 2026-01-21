import React, { useState } from 'react';
import { InputCard } from './components/InputCard';
import { ResultCard } from './components/ResultCard';
import { AppStatus, OutfitSuggestion } from './types';
import { getWeatherAndOutfitPlan, generateOutfitImage } from './services/geminiService';

const App: React.FC = () => {
  const [activity, setActivity] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [suggestion, setSuggestion] = useState<OutfitSuggestion | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    setStatus(AppStatus.LOCATING);
    setErrorMsg(null);
    setSuggestion(null);
    setGeneratedImage(null);

    // 1. Get Location
    if (!navigator.geolocation) {
      setErrorMsg("Geolocalización no soportada por este navegador.");
      setStatus(AppStatus.ERROR);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // 2. Get Weather & Advice (Text)
          setStatus(AppStatus.ANALYZING);
          const plan = await getWeatherAndOutfitPlan(activity, coords);
          setSuggestion(plan);

          // 3. Generate Image
          setStatus(AppStatus.GENERATING_IMAGE);
          const imageBase64 = await generateOutfitImage(plan.visualPrompt);
          setGeneratedImage(imageBase64);

          setStatus(AppStatus.COMPLETED);
        } catch (error) {
          console.error(error);
          setErrorMsg("Hubo un error al conectar con la IA. Por favor intenta de nuevo.");
          setStatus(AppStatus.ERROR);
        }
      },
      (error) => {
        console.error(error);
        setErrorMsg("Necesitamos tu ubicación para saber el clima.");
        setStatus(AppStatus.ERROR);
      }
    );
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#f5f5f7]">
      {/* Abstract Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/50 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-200/40 rounded-full blur-[120px]" />
      <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-yellow-100/60 rounded-full blur-[90px]" />

      <main className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-green-400 shadow-lg flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Estilo Climático</h1>
          </div>
          
          {errorMsg && (
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium border border-red-200 animate-bounce">
              {errorMsg}
            </div>
          )}
        </header>

        {/* Main Content Grid */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
          {/* Left Column: Input */}
          <div className="h-full">
            <InputCard 
              activity={activity} 
              setActivity={setActivity} 
              onGenerate={handleGenerate}
              status={status}
            />
          </div>

          {/* Right Column: Result */}
          <div className="h-full">
            <ResultCard 
              status={status}
              suggestion={suggestion}
              imageUrl={generatedImage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;