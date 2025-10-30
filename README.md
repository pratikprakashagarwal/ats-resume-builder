# ATS-Friendly Resume Builder

> A full-stack TypeScript application for creating ATS-optimized resumes with AI-powered content enhancement.

<!-- ## 🚀 Live Demo

- **Frontend:** [Deployed URL on Render]
- **Backend API:** [API URL on Render] -->

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Future Enhancements](#future-enhancements)

## 🎯 Overview

The ATS-Friendly Resume Builder is a modern web application designed to help job seekers create professional, ATS-compatible resumes. The application features real-time preview, AI-powered content enhancement using OpenAI, and export capabilities to both JSON (for ATS parsing) and PDF (for printing).

## ✨ Features

### Core Features

- ✅ Create and edit resume sections (Personal Info, Work Experience, Education, Skills)
- ✅ Real-time resume preview
- ✅ Export as ATS-friendly JSON
- ✅ Export as professional PDF
- ✅ Responsive Material UI design

### AI-Powered Features

- 🤖 Auto-generate professional summaries
- 🤖 Enhance work experience bullet points with metrics
- 🤖 Suggest relevant skills based on job descriptions
- 🤖 Tailor resume to specific job postings

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 18 with TypeScript
- **UI Library:** Material UI (MUI) v5
- **Form Management:** React Hook Form
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **PDF Generation:** jsPDF + html2canvas
- **Build Tool:** Vite

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express.js with TypeScript
- **ORM:** TypeORM
- **Database:** PostgreSQL 14+
- **AI Integration:** OpenAI API (GPT-3.5-turbo)
- **Validation:** Express Validator
- **Security:** Helmet, CORS

### Deployment

<!-- - **Platform:** Render -->

- **Database:** Render PostgreSQL (Free tier)
- **CI/CD:** GitHub Actions (Optional)

## 🏗️ Architecture

### System Architecture

<!-- ![Architecture Diagram](docs/architecture-diagram.png) -->

### Architecture Overview

The application follows a **three-tier architecture pattern:**

1. **Presentation Layer (React):**

   - Single Page Application (SPA)
   - Material UI components for consistent design
   - Client-side routing with React Router
   - State management using React hooks and Context API

2. **Application Layer (Express API):**

   - RESTful API endpoints
   - Business logic in service layer
   - OpenAI integration for AI features
   - Input validation and error handling

3. **Data Layer (PostgreSQL):**
   - Relational database with TypeORM
   - Entity relationships (One-to-One, One-to-Many)
   - Automatic migrations
   - Connection pooling

### Design Decisions

**Why No Authentication?**

- Focus on core resume building functionality
- Simplifies architecture for assessment timeline
- Can be added later with JWT/Passport

**Why TypeORM over Prisma?**

- Better TypeScript decorator support
- More mature for complex relationships
- Easier migration management
- Familiar SQL-like syntax

**Why Express over NestJS?**

- Simpler and faster to set up
- Less opinionated for smaller projects
- Lighter weight

**Why Material UI?**

- Production-ready components
- Excellent TypeScript support
- Built-in responsive design
- Professional aesthetics

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18.x or higher
- **PostgreSQL:** v14.x or higher
- **npm:** v9.x or higher
- **OpenAI API Key:** (Optional for AI features)

### Installation

#### 1. Clone the repository

git clone https://github.com/pratikprakashagarwal/ats-resume-builder.git
cd ats-resume-builder

#### 2. Install Backend Dependencies

cd server
npm install

#### 3. Install Frontend Dependencies

cd ../client
npm install

#### 4. Setup PostgreSQL Database

psql -U postgres
CREATE DATABASE resume_builder;
\q

#### 5. Configure Environment Variables

**Backend (`server/.env`):**
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/resume_builder
OPENAI_API_KEY=sk-proj-your-key-here
FRONTEND_URL=http://localhost:5173

**Frontend (`client/.env`):**
VITE_API_BASE_URL=http://localhost:5000/api

## ⚙️ Environment Variables

### Backend Environment Variables

| Variable         | Description                    | Required | Default                 |
| ---------------- | ------------------------------ | -------- | ----------------------- |
| `NODE_ENV`       | Environment mode               | No       | `development`           |
| `PORT`           | Server port                    | No       | `5000`                  |
| `DATABASE_URL`   | PostgreSQL connection string   | Yes      | -                       |
| `OPENAI_API_KEY` | OpenAI API key for AI features | No       | -                       |
| `FRONTEND_URL`   | Frontend URL for CORS          | No       | `http://localhost:5173` |

### Frontend Environment Variables

| Variable            | Description     | Required | Default                     |
| ------------------- | --------------- | -------- | --------------------------- |
| `VITE_API_BASE_URL` | Backend API URL | Yes      | `http://localhost:5000/api` |

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
cd server
npm run dev

**Terminal 2 - Frontend:**
cd client
npm run dev

**Access the application:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

### Production Build

**Backend:**
cd server
npm run build
npm start

**Frontend:**
cd client
npm run build
npm run preview

## 📡 API Documentation

### Resume Endpoints

| Method   | Endpoint           | Description       |
| -------- | ------------------ | ----------------- |
| `POST`   | `/api/resumes`     | Create new resume |
| `GET`    | `/api/resumes`     | Get all resumes   |
| `GET`    | `/api/resumes/:id` | Get resume by ID  |
| `PUT`    | `/api/resumes/:id` | Update resume     |
| `DELETE` | `/api/resumes/:id` | Delete resume     |

### Personal Info Endpoints

| Method | Endpoint                         | Description          |
| ------ | -------------------------------- | -------------------- |
| `PUT`  | `/api/resumes/:id/personal-info` | Update personal info |

### Work Experience Endpoints

| Method   | Endpoint                           | Description            |
| -------- | ---------------------------------- | ---------------------- |
| `POST`   | `/api/resumes/:id/work-experience` | Add work experience    |
| `PUT`    | `/api/resumes/work-experience/:id` | Update work experience |
| `DELETE` | `/api/resumes/work-experience/:id` | Delete work experience |

### AI Enhancement Endpoints

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| `POST` | `/api/ai/generate-summary` | Generate professional summary       |
| `POST` | `/api/ai/enhance-bullet`   | Enhance work experience bullet      |
| `POST` | `/api/ai/suggest-skills`   | Suggest skills from job description |
| `POST` | `/api/ai/tailor-resume`    | Analyze resume-job fit              |

## 🧪 Testing

Backend tests
cd server
npm test

Frontend tests
cd client
npm test

## 🚀 Deployment

### Deploying to Render

#### 1. Deploy PostgreSQL Database

- Create PostgreSQL instance on Render
- Copy Internal Database URL

#### 2. Deploy Backend

- Create Web Service on Render
- Connect GitHub repository
- Root Directory: `server`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Add environment variables

#### 3. Deploy Frontend

- Create Static Site on Render
- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Add environment variable: `VITE_API_BASE_URL`

## 📁 Project Structure

ats-resume-builder/
├── client/ # Frontend React application
│ ├── src/
│ │ ├── components/ # Reusable React components
│ │ │ ├── common/ # Layout, buttons, etc.
│ │ │ └── resume/ # Resume-specific components
│ │ ├── pages/ # Page components (Home, ResumeBuilder)
│ │ ├── services/ # API service layer
│ │ ├── types/ # TypeScript type definitions
│ │ ├── utils/ # Utility functions (export, etc.)
│ │ ├── App.tsx # Main app component
│ │ └── main.tsx # Entry point
│ └── package.json
│
├── server/ # Backend Express application
│ ├── src/
│ │ ├── config/ # Database, OpenAI configuration
│ │ ├── controllers/ # Request handlers
│ │ ├── entities/ # TypeORM database entities
│ │ ├── middleware/ # Validation, error handling
│ │ ├── routes/ # API route definitions
│ │ ├── services/ # Business logic layer
│ │ └── server.ts # Entry point
│ └── package.json
│

<!-- └── docs/ # Documentation
├── architecture-diagram.png
└── system-design.pdf -->

## 💡 Design Decisions

### No Authentication

Focused on core functionality per assessment requirements. Authentication can be added with JWT/Passport in production.

### TypeORM Over Prisma

Better decorator support and mature relationship handling for complex entity structures.

### AI Integration Strategy

OpenAI integration with fallback to mock responses for development/testing without API costs.

### Material UI Theme

Custom theme maintains professional appearance while being ATS-friendly (simple, readable fonts).

## 🔮 Future Enhancements

- [ ] Multi-user support with authentication
- [ ] Multiple resume templates
- [ ] Real-time collaboration
- [ ] Resume version history
- [ ] Analytics dashboard
- [ ] Integration with job boards
- [ ] Resume scoring algorithm
- [ ] Dark mode support

## 👤 Author

**Your Name**

- Email:pratikagarwal2000@gmail.com
- GitHub: https://github.com/pratikprakashagarwal
- LinkedIn: https://www.linkedin.com/in/pratikprakashagarwal/

## 🙏 Acknowledgments

- Material UI for the excellent component library
- OpenAI for AI capabilities
- Render for free hosting
