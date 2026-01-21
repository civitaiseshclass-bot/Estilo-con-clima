import { GoogleGenAI, Type, Schema } from "@google/genai";
import { OutfitSuggestion, Coordinates } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Step 1: Get weather and generate text advice using gemini-3-flash-preview with Google Search.
 */
export const getWeatherAndOutfitPlan = async (
  activity: string,
  coords: Coordinates
): Promise<OutfitSuggestion> => {
  const model = "gemini-3-flash-preview";
  
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      weatherSummary: {
        type: Type.STRING,
        description: "A short summary of the current weather at the location (e.g., '22°C y Soleado'). In Spanish.",
      },
      advice: {
        type: Type.STRING,
        description: "Fashion advice for the user based on the activity and weather. Friendly tone. In Spanish.",
      },
      visualPrompt: {
        type: Type.STRING,
        description: "A highly detailed, photorealistic prompt to generate an image of the outfit without any text. Describe the clothing, colors, fabrics, and setting based on the weather.",
      },
    },
    required: ["weatherSummary", "advice", "visualPrompt"],
  };

  const prompt = `
    Context: The user is at latitude ${coords.latitude}, longitude ${coords.longitude}.
    Task: Find the current real-time weather for this specific location using Google Search.
    Then, based on the weather and the user's activity: "${activity}", suggest an outfit.
    
    Output JSON with:
    1. A short weather summary (in Spanish).
    2. Outfit advice (in Spanish).
    3. A visual prompt for an image generator (in English for better accuracy).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as OutfitSuggestion;
  } catch (error) {
    console.error("Error getting outfit plan:", error);
    throw error;
  }
};

/**
 * Step 2: Generate the image using the visual prompt from Step 1.
 * Using gemini-2.5-flash-image for speed and quality.
 */
export const generateOutfitImage = async (visualPrompt: string): Promise<string> => {
  const model = "gemini-2.5-flash-image";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: visualPrompt,
      config: {
        // No responseMimeType for image models usually, but we want the raw image data in parts
      }
    });

    // Extract base64 image from parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};