# AI Money Mentor

A full-stack AI-powered financial advisor web application specifically designed for Indians, built with FastAPI backend and React frontend.

## Features

### 🤖 AI Chat Assistant
- WhatsApp-style chat interface
- Powered by Groq's Llama 3.3 70B model
- Quick suggestion chips for common queries
- Real-time typing indicators

### 🔥 FIRE Calculator
- Calculate your Financial Independence, Retire Early number
- Interactive sliders and inputs for age, expenses, savings, SIP, returns
- Visual growth chart using Recharts
- AI-generated personalized action plans
- Indian currency formatting (lakhs, crores)

### 💰 Money Health Score
- Step-by-step 5-question assessment
- Visual score gauge with color coding
- Detailed breakdown across 5 dimensions:
  - Emergency Fund
  - Insurance Coverage
  - Investment Habits
  - Debt Health
  - Tax Planning
- AI-powered personalized improvement tips

### 📊 Tax Wizard
- Compare Old vs New tax regimes
- Complete deduction calculations (80C, 80D, HRA, NPS)
- Side-by-side comparison cards
- Visual bar chart comparison
- AI explanations for recommendations

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Groq API** - Llama 3.3 70B model for AI responses
- **Python-dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library
- **Lucide React** - Icon library
- **Axios** - HTTP client

## Project Structure

```
ai-money-mentor/
├── backend/
│   ├── main.py              # FastAPI application with all endpoints
│   ├── knowledge.py         # Indian finance knowledge base
│   └── .env                 # Environment variables
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Chat.jsx     # WhatsApp-style chat interface
    │   │   ├── FireCalculator.jsx  # FIRE calculator with charts
    │   │   ├── MoneyHealthScore.jsx  # Health score assessment
    │   │   └── TaxWizard.jsx  # Tax regime comparison
    │   ├── App.jsx          # Main app with navigation
    │   ├── main.jsx         # React entry point
    │   └── index.css        # Tailwind styles
    ├── package.json         # Dependencies
    └── tailwind.config.js   # Tailwind configuration
```

## Quick Start

### 🚀 One-Click Launch (Windows)

1. Double-click `start.bat` to launch both backend and frontend automatically
2. The application will open in your browser at `http://localhost:5173`
3. Use `stop.bat` to stop all servers

### Manual Setup

If you prefer to set up manually:

#### Prerequisites
- Node.js 18+
- Python 3.8+
- Groq API key

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

6. Start the backend server:
```bash
uvicorn main:app --reload
```

The backend will be running on `http://localhost:8000`

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## API Endpoints

### POST `/ask`
Ask financial questions to the AI mentor.
- **Body**: `{ question: string, user_context?: string }`
- **Response**: `{ answer: string }`

### POST `/health-score`
Calculate financial health score.
- **Body**: Health score assessment data
- **Response**: `{ score: number, breakdown: object, tips: string[] }`

### POST `/tax-wizard`
Compare tax regimes.
- **Body**: Tax calculation parameters
- **Response**: `{ old_regime: object, new_regime: object, recommended: string, savings: number, explanation: string }`

### POST `/fire-plan`
Generate FIRE plan with AI action plan.
- **Body**: FIRE calculation parameters
- **Response**: `{ fire_number: number, years_to_fire: number, retirement_age: number, corpus_at_fire: number, action_plan: string }`

## Features in Detail

### Design System
- **Dark Theme**: Navy blue primary (#0f0e17), card background (#1a1a2e), accent color (#e94560)
- **Responsive**: Mobile-first design with desktop enhancements
- **Animations**: Smooth transitions and micro-interactions
- **Typography**: Clean, modern font hierarchy

### Indian Finance Features
- **Tax Slabs**: FY 2024-25 old and new regime calculations
- **Deductions**: Complete 80C, 80D, HRA, NPS calculations
- **Currency Formatting**: Indian numbering system (lakhs, crores)
- **Regulation Compliance**: Latest Indian tax laws and financial rules

### AI Integration
- **Context-Aware**: Uses comprehensive Indian finance knowledge base
- **Personalized**: Tailors advice based on user input
- **Explanations**: Clear, actionable financial guidance
- **Safety**: Includes disclaimer about professional consultation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This application provides AI-generated financial information and should not be considered as professional financial advice. Please consult with a certified financial planner for major financial decisions.

## Support

For issues and questions, please open an issue on the GitHub repository.
