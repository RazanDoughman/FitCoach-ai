# FitCoach AI

## Overview
**FitCoach AI** is a web-based fitness application that helps users discover, plan, and track personalized workouts. It combines a modern interface with an intelligent backend to deliver a seamless fitness management experience. The platform enables exercise exploration, workout scheduling, and session tracking — all backed by a robust database and secure authentication system.

---

## Features Overview
- **User Authentication:** Secure login and registration with session-based management using NextAuth and Supabase.  
- **Exercise Library:** Browse, search, and filter exercises by body part, target muscle, or equipment.  
- **Workout Templates:** Create, edit, and save custom workout plans with defined sets, reps, and rest times.  
- **Workout Scheduler:** Schedule and view workouts in a calendar format with color-coded events.  
- **AI Workout Suggestions:** Automatically generate personalized workout plans tailored to the user’s fitness goals, training history, and available equipment using machine learning and external API data.
 

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS, ShadCN UI |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | NextAuth.js (Credentials Provider) |
| **Deployment** | Vercel (Frontend & API), Supabase (Database) |

---

## Setup Instructions

### 1. Clone the Repository

git clone https://github.com/RazanDoughman/FitCoach-ai.git  
cd FitCoach-ai

### 2. Install Dependencies

Install all required project dependencies using npm:

**npm install**

#### This command sets up all core packages, including:

- Next.js for frontend rendering and API routes
- Prisma for database ORM and migrations
- NextAuth for authentication
- Tailwind CSS and ShadCN UI for styling and components
- Supabase client for database interaction

### 3. Configure Environment Variables

Before running the project, create a .env file in the root directory.

| Variables | Service |
|-------|-------------|
| Supabase (DATABASE_URL)| Connection string for the database.
| Supabase (SUPABASE_URL) | Base URL for connecting to the Supabase project. |
| Supabase(SUPABASE_ANON_KEY) | Publicly available API key for Supabase services. |
| NextAuth (NEXTAUTH_URL) |Base URL for the application |
| NextAuth (NEXTAUTH_SECRET) | A secret key used by NextAuth.js for session management and encryption. Must be a long, random string. |


### 4. Run Database Migrations
**npx prisma migrate deploy**

### 5. Start the Development Server
**npm run dev**

## Visit the application at http://localhost:3000.

---

## Environment Variables & API Keys Needed With Their Services

| Variables | Service |
|-------|-------------|
| Supabase (DATABASE_URL)| Connection string for the database.
| Supabase (SUPABASE_URL) | Base URL for connecting to the Supabase project. |
| Supabase(SUPABASE_ANON_KEY) | Publicly available API key for Supabase services. |
| NextAuth (NEXTAUTH_URL) |Base URL for the application |
| NextAuth (NEXTAUTH_SECRET) | A secret key used by NextAuth.js for session management and encryption. Must be a long, random string. |


---
