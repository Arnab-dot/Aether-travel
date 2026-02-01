# 🌍 Aether - AI-Powered Group Travel Planning Platform

<div align="center">

![Aether Logo](https://img.shields.io/badge/Aether-Travel%20Together-cc5500?style=for-the-badge)

**Where Friends. Travel. Legends. Are Made.**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r182-000000?style=flat&logo=three.js)](https://threejs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.0-FF0055?style=flat)](https://www.framer.com/motion/)

[**🚀 Live Demo**](https://aether-travel-delta.vercel.app/) • [Features](#-features) • [Tech Stack](#-technology-stack) • [Installation](#-installation)

</div>

---

## 🎬 Overview

**Aether** is a cinematic, premium group travel planning platform that transforms how friends plan trips together. Using AI-powered recommendations and a stunning visual interface, Aether eliminates the chaos of group decision-making and creates legendary travel experiences.

### 🎯 The Problem We Solve

Planning trips with friends often becomes:
- 😤 Endless debates about destinations
- 📅 Conflicting schedules and budgets  
- 🤯 Analysis paralysis with too many options
- 💸 Unfair cost splitting and budget confusion

### 💡 Our Solution

Aether provides an intelligent, beautiful platform that:
- ✅ Collects individual preferences through an engaging "Vibe Check" system
- ✅ Uses AI to analyze and recommend destinations matching group preferences
- ✅ Manages budgets, logistics, and itineraries in one place
- ✅ Creates a cinematic, memorable planning experience

---

## ✨ Features

### 🏠 **Cinematic Landing Experience**
- **3D Interactive Earth Globe** - Powered by Three.js & React Three Fiber
- **Parallax Scrolling Sections** - Immersive storytelling as users scroll
- **Film Grain Overlay** - Premium cinematic aesthetic
- **Animated Destination Cards** - Beautiful hover effects and transitions
- **City Search** - Find your next destination with style

### 🔐 **Authentication System**
- **JWT-based Security** - Secure token authentication
- **Traveler/Planner Roles** - Different user types for different needs
- **Persistent Sessions** - Stay logged in across visits

### 👥 **Group Management**
- **Create Expeditions** - Generate unique squad codes for your group
- **Join Groups** - Enter a code to join your friends' trip
- **Member Management** - View all members and their preferences
- **Admin Controls** - Planners can manage group settings

### 🎯 **Vibe Check System (AI Recommendations)**
- **Travel Persona Badges** - Choose your travel style:
  - 🍽️ Culinary Specialist (Foodie)
  - 🧭 Navigator (Explorer)
  - 📸 Documentation (Photographer)
  - 🎉 Social Link (Party Person)
- **Curated Place Suggestions** - AI-powered local recommendations
- **Swipe-based Interface** - Tinder-like vibe matching
- **Sentiment Analysis** - NLP-powered preference understanding

### 💰 **Budget & Cost Management**
- **Budget Tiers** - Economy, Standard, Luxury, Flexible
- **AI Cost Optimization** - Powered by Google Gemini API
- **Member Voting** - Democratic budget decisions
- **Cost Breakdown** - Detailed expense tracking

### 📋 **Planning Modules**

#### Logistics Module
- Transportation planning
- Accommodation management
- Activity scheduling
- Real-time member updates

#### Itinerary Timeline
- Day-by-day trip planning
- Visual timeline interface
- Activity scheduling

#### Time Module
- Trip duration planning
- Date coordination
- Schedule management

#### Packing Checklist
- Customizable packing lists
- Group shared items
- Check-off functionality

### 💬 **Group Chat**
- Real-time messaging between group members
- Trip discussion and coordination
- Persistent chat history

### 🌆 **Destination Discovery**
- **Premium Destination Cards** - Beautiful imagery and descriptions
- **Domestic & International** - Indian cities and global destinations
- **AI-Powered Recommendations** - Personalized suggestions based on group preferences

---

## 🛠️ Technology Stack

### Frontend Core

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 19.2 |
| **Vite** | Build Tool | 7.1 |
| **TailwindCSS** | Styling | 4.1 |
| **Framer Motion** | Animations | 12.24 |

### 3D & Visual

| Technology | Purpose |
|------------|---------|
| **Three.js** | 3D Graphics Engine |
| **React Three Fiber** | React renderer for Three.js |
| **React Three Drei** | Useful helpers for R3F |
| **React Three Cannon** | Physics engine |
| **React Three Postprocessing** | Visual effects |

### UI Components

| Technology | Purpose |
|------------|---------|
| **Lucide React** | Icon library |
| **Axios** | HTTP client |
| **clsx** | Conditional classnames |
| **tailwind-merge** | Merge Tailwind classes |

### Backend (Separate Repository)

| Technology | Purpose |
|------------|---------|
| **Django** | Python Web Framework |
| **Django REST Framework** | API Development |
| **PostgreSQL** | Database |
| **Simple JWT** | Authentication |
| **Google Gemini API** | AI Recommendations |
| **TextBlob** | NLP & Sentiment Analysis |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Main navigation with auth
│   ├── Earth3D.jsx             # Interactive 3D globe
│   ├── VibeSwiper.jsx          # Tinder-like vibe matching
│   ├── VibeCard.jsx            # Individual vibe cards
│   ├── GroupChat.jsx           # Real-time group messaging
│   ├── UserProfileModal.jsx    # User profile management
│   ├── Marquee.jsx             # Scrolling text animation
│   ├── VideoBackground.jsx     # Video backgrounds
│   └── planning/
│       ├── BudgetModule.jsx    # Budget tier selection
│       ├── CostModule.jsx      # AI cost optimization
│       ├── LogisticsModule.jsx # Trip logistics
│       ├── ItineraryTimeline.jsx # Day-by-day planning
│       ├── TimeModule.jsx      # Schedule management
│       ├── PackingChecklist.jsx # Packing lists
│       └── MemberManagementModal.jsx # Member admin
├── pages/
│   ├── LandingPage.jsx         # Cinematic homepage (44KB!)
│   ├── Auth.jsx                # Login/Signup
│   ├── Home.jsx                # Dashboard
│   ├── CreateGroup.jsx         # Create expedition
│   ├── JoinGroup.jsx           # Join with preferences
│   ├── GroupDetails.jsx        # Group overview
│   ├── Decision.jsx            # AI recommendations
│   ├── Planning.jsx            # Trip planning hub
│   ├── Discover.jsx            # Destination discovery
│   ├── About.jsx               # About page
│   ├── Manifesto.jsx           # Brand story
│   └── TripPlan.jsx            # Trip details
├── App.jsx                     # Main app with routing
├── index.css                   # Global styles & design system
└── main.jsx                    # Entry point
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Arnab-dot/Aether-travel.git
cd Aether-travel

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000  # Backend API URL
```

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Void Black** | `#050505` | Primary background |
| **Burnt Orange** | `#cc5500` | Accent color |
| **Cream** | `#f3f2ed` | Text color |
| **Deep Black** | `#0a0a0a` | Secondary background |

### Typography

| Font | Usage |
|------|-------|
| **Playfair Display** | Headings (Serif) |
| **Outfit** | Body text (Sans-serif) |
| **Caveat** | Handwriting accents |

### Effects

- **Glass Morphism** - Translucent panels with blur
- **Film Grain** - Cinematic overlay
- **Parallax** - Depth-based scrolling
- **Micro-animations** - Hover states and transitions

---

## 🔗 API Endpoints

The frontend connects to a Django backend with these main endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register/` | POST | User registration |
| `/api/auth/login/` | POST | User login (JWT) |
| `/api/group/create/` | POST | Create travel group |
| `/api/group/join/` | POST | Join existing group |
| `/api/group/{spid}/members/` | GET | Get group members |
| `/api/group/{spid}/recommendation/` | GET | AI recommendations |
| `/api/group/{spid}/budget/` | GET/POST | Budget management |
| `/api/vibes/` | GET | Get vibe suggestions |
| `/api/chat/{spid}/` | GET/POST | Group chat |

---

## 🌐 Deployment

### Vercel 

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set Root Directory to `/`
4. Add environment variable: `VITE_API_URL`
5. Deploy!



---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Arnab** - [GitHub](https://github.com/Arnab-dot)

---

<div align="center">

**Made with ❤️ for travelers who believe the journey is better with friends**

*Friends. Travel. Legends.*

</div>
