import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_KEYS } from '../config/apiKeys';

// Initialize Gemini clients with different API keys
const geminiClient = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);
const geminiVisionClient = new GoogleGenerativeAI(API_KEYS.GEMINI_VISION_API_KEY);
const geminiDocClient = new GoogleGenerativeAI(API_KEYS.GEMINI_DOC_API_KEY);

export interface DocumentAnalysis {
  summary: string;
  keySkills: string[];
  experience: string[];
  education: string[];
  recommendations: string[];
}

export class GeminiService {
  private static instance: GeminiService;
  private model = geminiClient.getGenerativeModel({ model: "gemini-2.0-flash" });
  private visionModel = geminiVisionClient.getGenerativeModel({ model: "gemini-2.0-flash" });
  private docModel = geminiDocClient.getGenerativeModel({ model: "gemini-2.0-flash" });

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async analyzeResume(pdfFile: File): Promise<DocumentAnalysis> {
    try {
      // Convert PDF to base64
      const base64Data = await this.fileToBase64(pdfFile);
      
      // Create content parts for the model
      const contents = [
        { text: "Analyze this resume and provide a structured analysis including: summary, key skills, experience, education, and recommendations for interview focus areas." },
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: base64Data
          }
        }
      ];

      const result = await this.docModel.generateContent(contents);
      const response = await result.response;
      const text = response.text();

      // Parse the response into structured format
      return this.parseResumeAnalysis(text);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to analyze resume');
    }
  }

  async generateInterviewInsights(context: string): Promise<string> {
    try {
      const result = await this.model.generateContent([
        `Based on this interview context, provide helpful insights and suggestions: ${context}`
      ]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating interview insights:', error);
      throw new Error('Failed to generate interview insights');
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  private parseResumeAnalysis(text: string): DocumentAnalysis {
    // Implement parsing logic based on the model's output format
    // This is a simple implementation - enhance based on actual output structure
    return {
      summary: text.split('Summary:')[1]?.split('Key Skills:')[0]?.trim() || '',
      keySkills: text.split('Key Skills:')[1]?.split('Experience:')[0]?.trim().split('\n') || [],
      experience: text.split('Experience:')[1]?.split('Education:')[0]?.trim().split('\n') || [],
      education: text.split('Education:')[1]?.split('Recommendations:')[0]?.trim().split('\n') || [],
      recommendations: text.split('Recommendations:')[1]?.trim().split('\n') || [],
    };
  }
} 