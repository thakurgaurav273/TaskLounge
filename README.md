# TaskLounge 🎤

A voice-enabled task tracker that lets you create tasks by simply speaking. Inspired by Linear, powered by AI.

## ✨ Features

- **Voice Input**: Create tasks by speaking naturally
- **Smart Parsing**: AI extracts title, priority, due dates from speech
- **Kanban Board**: Tabular view based on the status (To Do, In Progress, Done)
- **List View**: Alternative view for task management
- **Filters & Search**: Find tasks by status, priority
- **Manual Creation**: Traditional form-based task creation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- OpenAI API key (or Claude API key)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/TaskLounge.git
cd TaskLounge
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI and API keys to .env
npm run dev
```

3. **Frontend Setup**
```bash
npm install
npm run dev
```

4. **Open your browser**
```
http://localhost:5173
```

## 🔧 Environment Variables

### Backend `.env`
```env
PORT=8080
MONGO_URI= YOUR_URL
GROQ_API_KEY=YOUR_API_KEY
CLOUDINARY_API_KEY=KEY
CLOUDINARY_API_SECRET=SECRET
CLOUDINARY_CLOUD_NAME=NAME
```

## 🏗️ Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS

**Backend**
- Node.js + Express
- MongoDB + Mongoose


**Voice Processing**
- Web Speech API (speech-to-text)
- GROQ AI

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| POST | `/api/parse` | Parse voice transcript |

## 🎯 How Voice Input Works

1. Click microphone button
2. Speak: *"High priority task to review the auth PR by tomorrow evening"*
3. AI parses:
   - **Title**: Review the auth PR
   - **Priority**: High
   - **Due Date**: Tomorrow, 6:00 PM
   - **Status**: To Do
4. Review and confirm
5. Task saved!

## 🧠 Design Decisions

**Why MongoDB?**  
Flexible schema perfect for evolving task structures.

**Why Web Speech API?**  
Free, browser-native, no API costs for speech-to-text.

**Why OpenAI for parsing?**  
Excellent at understanding natural language variations like "tomorrow", "next Friday", "urgent".

**Default Status**  
All tasks default to "To Do" unless explicitly stated.

## 🔮 Future Enhancements

- Team collaboration features
- More voice commands (edit, delete by voice)
- Support for multiple languages
- Export tasks to CSV/JSON

## 📄 License

MIT License - feel free to use this project for learning!

## 🙏 Acknowledgments

- Linear for UI inspiration
- OpenAI for powerful NLP capabilities
- The open-source community

---

Built with ❤️ as a learning project
