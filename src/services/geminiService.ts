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

export interface ResponseAnalysis {
  clarity: number;
  confidence: number;
  technicalAccuracy?: number;
  suggestions: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keyPoints: string[];
  improvementAreas: string[];
  strengthAreas: string[];
}

export interface InterviewProgress {
  overallPerformance: number;
  technicalCompetency: number;
  communicationSkills: number;
  confidenceLevel: number;
  learningPoints: string[];
  recommendations: string[];
}

export interface EngagementMetrics {
  responseQuality: number;
  interactionFlow: number;
  adaptability: number;
  stressManagement: number;
  problemSolvingApproach: number;
}

export class GeminiService {
  private static instance: GeminiService;
  private model = geminiClient.getGenerativeModel({ model: "gemini-2.0-flash" });
  private visionModel = geminiVisionClient.getGenerativeModel({ model: "gemini-2.0-flash" });
  private docModel = geminiDocClient.getGenerativeModel({ model: "gemini-2.0-flash" });
  private interviewHistory: ResponseAnalysis[] = [];
  private progressTracker: InterviewProgress = {
    overallPerformance: 0,
    technicalCompetency: 0,
    communicationSkills: 0,
    confidenceLevel: 0,
    learningPoints: [],
    recommendations: []
  };

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

  async analyzeResponse(response: string): Promise<ResponseAnalysis> {
    try {
      const prompt = `
        Analyze this interview response comprehensively and provide detailed feedback with these metrics:
        - Clarity (0-100): How clear and well-structured is the response?
        - Confidence (0-100): How confident does the response sound?
        - Technical Accuracy (0-100, if applicable): How technically accurate is the response?
        - Sentiment: Overall emotional tone (positive/neutral/negative)
        - Key Points: Main points made in the response
        - Improvement Areas: Specific areas that need improvement
        - Strength Areas: Areas where the response excelled
        - Suggestions: 2-3 specific suggestions for improvement

        Respond ONLY with a JSON object in this exact format:
        {
          "clarity": number,
          "confidence": number,
          "technicalAccuracy": number,
          "sentiment": "positive" | "neutral" | "negative",
          "keyPoints": string[],
          "improvementAreas": string[],
          "strengthAreas": string[],
          "suggestions": string[]
        }

        Response to analyze: "${response}"
      `;

      const result = await this.model.generateContent(prompt);
      const generatedResponse = await result.response;
      const text = generatedResponse.text();

      try {
        const cleanJson = text.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanJson);
        
        const analysis: ResponseAnalysis = {
          clarity: Math.min(100, Math.max(0, parsed.clarity)),
          confidence: Math.min(100, Math.max(0, parsed.confidence)),
          technicalAccuracy: parsed.technicalAccuracy !== undefined 
            ? Math.min(100, Math.max(0, parsed.technicalAccuracy))
            : undefined,
          sentiment: parsed.sentiment,
          keyPoints: parsed.keyPoints || [],
          improvementAreas: parsed.improvementAreas || [],
          strengthAreas: parsed.strengthAreas || [],
          suggestions: (parsed.suggestions || []).slice(0, 3)
        };

        this.interviewHistory.push(analysis);
        this.updateProgressTracker(analysis);
        
        return analysis;
      } catch (e) {
        console.error('Error parsing Gemini response:', e);
        return this.getFallbackAnalysis();
      }
    } catch (error) {
      console.error('Error analyzing response:', error);
      throw new Error('Failed to analyze response');
    }
  }

  private getFallbackAnalysis(): ResponseAnalysis {
    return {
      clarity: 75,
      confidence: 70,
      sentiment: 'neutral',
      keyPoints: ['Response recorded'],
      improvementAreas: ['Structure could be improved'],
      strengthAreas: ['Attempt was made'],
      suggestions: [
        'Consider providing more specific examples',
        'Try to structure your response more clearly'
      ]
    };
  }

  private updateProgressTracker(analysis: ResponseAnalysis) {
    const prevProgress = this.progressTracker;
    const historyLength = this.interviewHistory.length;

    // Calculate running averages
    this.progressTracker = {
      overallPerformance: (prevProgress.overallPerformance * (historyLength - 1) + analysis.clarity) / historyLength,
      technicalCompetency: analysis.technicalAccuracy 
        ? (prevProgress.technicalCompetency * (historyLength - 1) + analysis.technicalAccuracy) / historyLength
        : prevProgress.technicalCompetency,
      communicationSkills: (prevProgress.communicationSkills * (historyLength - 1) + analysis.clarity) / historyLength,
      confidenceLevel: (prevProgress.confidenceLevel * (historyLength - 1) + analysis.confidence) / historyLength,
      learningPoints: [...new Set([...prevProgress.learningPoints, ...analysis.improvementAreas])],
      recommendations: [...new Set([...prevProgress.recommendations, ...analysis.suggestions])]
    };
  }

  async getEngagementMetrics(): Promise<EngagementMetrics> {
    const recentResponses = this.interviewHistory.slice(-5);
    
    if (recentResponses.length === 0) {
      return {
        responseQuality: 0,
        interactionFlow: 0,
        adaptability: 0,
        stressManagement: 0,
        problemSolvingApproach: 0
      };
    }

    const averageClarity = recentResponses.reduce((sum, r) => sum + r.clarity, 0) / recentResponses.length;
    const averageConfidence = recentResponses.reduce((sum, r) => sum + r.confidence, 0) / recentResponses.length;
    const sentimentScore = recentResponses.reduce((sum, r) => {
      switch (r.sentiment) {
        case 'positive': return sum + 100;
        case 'neutral': return sum + 70;
        case 'negative': return sum + 40;
        default: return sum;
      }
    }, 0) / recentResponses.length;

    return {
      responseQuality: averageClarity,
      interactionFlow: (averageClarity + averageConfidence) / 2,
      adaptability: sentimentScore,
      stressManagement: averageConfidence,
      problemSolvingApproach: this.progressTracker.technicalCompetency
    };
  }

  getInterviewProgress(): InterviewProgress {
    return { ...this.progressTracker };
  }

  resetInterview() {
    this.interviewHistory = [];
    this.progressTracker = {
      overallPerformance: 0,
      technicalCompetency: 0,
      communicationSkills: 0,
      confidenceLevel: 0,
      learningPoints: [],
      recommendations: []
    };
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