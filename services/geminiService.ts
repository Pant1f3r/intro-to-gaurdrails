import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client strictly according to the guidelines
const ai = new GoogleGenAI({ apiKey });

export const checkGuardrails = async (prompt: string): Promise<{ text: string; safetyRatings: any[] }> => {
  try {
    // Using gemini-2.5-flash for fast responses on basic text tasks
    const modelId = 'gemini-2.5-flash';

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      // We explicitly request safety settings to be shown, although default is usually fine.
      // We want to see the ratings in the response metadata.
    });

    const text = response.text || "No text generated (potentially blocked by safety filters).";
    
    // Extract safety ratings if available in the candidate
    const candidate = response.candidates?.[0];
    const safetyRatings = candidate?.safetyRatings || [];

    return {
      text,
      safetyRatings
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Error communicating with AI service. Please check your API key or connection.",
      safetyRatings: []
    };
  }
};