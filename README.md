# IdleWheels - Premium Luxury Car Rental Platform

IdleWheels is a full-stack car rental application designed for high-end vehicle sharing. It features a sleek glassmorphic UI, a robust owner portal, and an intelligent chatbot assistant.

## ✨ Features
- **Premium UI**: Modern glassmorphic design with Framer Motion animations.
- **Smart Chatbot**: Integrated AI assistant with local database fallback for fleet queries.
- **Owner Dashboard**: Comprehensive management tools for car owners to track bookings and performance.
- **Advanced Maps**: Interactive map integration for vehicle location discovery.
- **Identity Verification**: Secure Aadhaar and DL verification system for trust and safety.

## 🛠️ Technology Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Vite.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT, Google OAuth.
- **Storage**: Cloudinary (for vehicle media).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/satyasaishivakoviri/project.git
   ```
2. Install dependencies for both client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables in `server/.env`.
4. Run the development environment:
   ```bash
   # Terminal 1
   cd client && npm run dev
   # Terminal 2
   cd server && node server.js
   ```

---
© 2024 IdleWheels Team. All rights reserved.
