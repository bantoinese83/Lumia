# LOMIA - Live AI Mock Interviews

<div align="center">
  <img src="public/images/app-preview.jpg" alt="LOMIA Interface" width="800"/>
  <p><em>Next-Generation AI-Powered Mock Interview Platform</em></p>

  [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
  [![Gemini API](https://img.shields.io/badge/Gemini%20API-0.21.0-green.svg)](https://ai.google.dev/)
</div>

## Overview

LOMIA is a sophisticated web application that leverages Google's Gemini API to deliver realistic mock interview experiences. It combines advanced AI capabilities with real-time audio/video interaction to create an immersive interview environment that adapts to each candidate's responses and background.

### Key Features

#### 🎯 Advanced Interview Customization
- Dynamic interview type selection (Technical/Behavioral/Mixed)
- Industry-specific focus areas and experience levels
- Company-specific interview style simulation
- Configurable duration and difficulty settings
- Multi-language support with 30+ languages

#### 🎤 Real-time Voice Interaction
- WebRTC-based audio streaming
- Low-latency voice processing
- Context-aware conversation management
- Multiple AI interviewer personalities

#### 📝 AI-Powered Resume Analysis
- PDF document processing
- Skill extraction and assessment
- Experience-based question tailoring
- Automated focus area recommendations

#### 🎥 Video Integration
- WebRTC video streaming
- Screen sharing for technical interviews
- Configurable video quality settings
- Fallback mechanisms for low bandwidth

#### 💡 Intelligent Feedback System
- Real-time response analysis
- Performance metrics tracking
- Detailed post-interview reports
- Actionable improvement suggestions

## Technical Architecture

### Frontend Stack
- **Framework**: React 18.3.1 with TypeScript
- **State Management**: Context API + Custom Hooks
- **Styling**: SCSS Modules + CSS-in-JS
- **Audio Processing**: Web Audio API + Custom Worklets
- **Video Handling**: WebRTC + MediaStream API

### Key Dependencies
\`\`\`json
{
  "react": "^18.3.1",
  "typescript": "^5.6.3",
  "@google/generative-ai": "^0.21.0",
  "eventemitter3": "^5.0.1",
  "classnames": "^2.5.1",
  "sass": "^1.80.6"
}
\`\`\`

## Development Setup

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0 or yarn >= 1.22.0
- Google Cloud Platform account with Gemini API access

### Environment Setup

1. **Clone and Install**
   \`\`\`bash
   git clone https://github.com/bantoinese83/Lumia.git
   cd Lumia
   npm install
   \`\`\`

2. **Environment Configuration**
   Create a \`.env\` file in the project root:
   \`\`\`env
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   REACT_APP_GEMINI_VISION_API_KEY=your_api_key_here
   REACT_APP_GEMINI_DOC_API_KEY=your_api_key_here
   \`\`\`

3. **Development Server**
   \`\`\`bash
   # Standard development server
   npm start

   # HTTPS development server (recommended for WebRTC)
   npm run start-https
   \`\`\`

### Development Workflow

1. **Code Style**
   - ESLint configuration for TypeScript
   - Prettier for code formatting
   - Husky for pre-commit hooks

2. **Testing**
   \`\`\`bash
   # Run unit tests
   npm test

   # Run tests in watch mode
   npm test -- --watch
   \`\`\`

3. **Building**
   \`\`\`bash
   # Production build
   npm run build
   \`\`\`

## API Integration

### Gemini API Configuration

The application uses three separate Gemini API endpoints:
- Core API for interview logic
- Vision API for video analysis
- Document API for resume processing

Example configuration:
\`\`\`typescript
const geminiClient = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);
const model = geminiClient.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp"
});
\`\`\`

### WebRTC Implementation

Audio/video streaming is handled through custom WebRTC implementations:
\`\`\`typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 16000
  }
});
\`\`\`

## Deployment

### Production Build
1. Create production build:
   \`\`\`bash
   npm run build
   \`\`\`

2. Deploy to Google Cloud Platform:
   \`\`\`bash
   gcloud app deploy
   \`\`\`

### Infrastructure Requirements
- Node.js runtime environment
- WebSocket support
- HTTPS configuration
- Adequate memory for audio processing (min 512MB)

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Submit a pull request

Please ensure your PR:
- Follows the existing code style
- Includes appropriate tests
- Updates documentation as needed
- Describes the changes made

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

- 📝 [Open an issue](https://github.com/bantoinese83/Lumia/issues)
- 📧 Contact the maintainers
- 📚 Check our [Wiki](https://github.com/bantoinese83/Lumia/wiki)

---

<div align="center">
  <sub>Built with ❤️ by the LOMIA team</sub>
</div>
