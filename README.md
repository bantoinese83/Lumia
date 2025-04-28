# LOMIA - Live AI Mock Interviews

LOMIA is an innovative web application that provides realistic mock interview experiences powered by AI. Using Google's Gemini API, it simulates real-world interview scenarios, offering personalized feedback and adaptive questioning based on your responses.

<div align="center">
  <img src="public/images/app-preview.jpg" alt="LOMIA Interface" width="800"/>
  <p><em>LOMIA: AI-Powered Mock Interview Platform</em></p>
</div>

## Features

- 🎯 **Customizable Interview Settings**
  - Choose interview type (Technical, Behavioral, Mixed)
  - Select experience level and industry focus
  - Customize target company style (e.g., FAANG-style interviews)
  - Set interview duration and difficulty level

- 🎤 **Interactive Voice Interface**
  - Real-time voice interaction with AI interviewer
  - Multiple AI interviewer personalities to choose from
  - Natural conversation flow with context awareness

- 📝 **Resume Analysis**
  - Upload your resume for personalized interview focus
  - AI-powered skills assessment
  - Tailored question selection based on your experience

- 🎥 **Video Integration**
  - Optional webcam support for a more immersive experience
  - Screen sharing capability for technical demonstrations
  - Professional interview environment simulation

- 💡 **Smart Feedback**
  - Real-time feedback on your responses
  - Detailed post-interview analysis
  - Improvement suggestions and focus areas

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Gemini API key from Google

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bantoinese83/Lumia.git
cd Lumia
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your API keys:
```
REACT_APP_GEMINI_API_KEY=your_api_key_here
REACT_APP_GEMINI_VISION_API_KEY=your_api_key_here
REACT_APP_GEMINI_DOC_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Usage

1. **Setup Your Interview**
   - Click the settings icon in the header
   - Configure your interview preferences
   - Optionally upload your resume for personalized questions

2. **Start the Interview**
   - Click "Start Interview" when ready
   - Ensure your microphone is enabled
   - Optionally enable your webcam

3. **During the Interview**
   - Speak naturally to answer questions
   - Use the control panel to manage audio/video settings
   - View real-time feedback and guidance

## Technologies Used

- React.js
- TypeScript
- Google Gemini API
- WebRTC for audio/video
- SCSS for styling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built using Google's Gemini API
- Inspired by real-world interview experiences
- Special thanks to the open-source community

---

For questions or support, please open an issue in the repository.
