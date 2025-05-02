VoiceUp – Compliance & Emotion Detection

This is a full-stack web application that analyzes customer-agent conversations for emotional tone and compliance with predefined rules. It provides an interactive dashboard to visualize compliance percentages, emotion distributions and violated rules.

Features

- Display of multiple conversations
- Analyze each conversation for:
  - Emotion classification (happy, angry, neutral)
  - Compliance scoring
  - Violation summaries
- Dashboard with:
  - Compliance vs. non-compliance chart
  - Emotion distribution chart
  - Top violated rules chart
- Ability to filter emotions and reset analysis data
- Responsive UI with clean layout

Tech Stack

- Frontend: React, Vite, Recharts
- Backend: Flask, SQLAlchemy, TextBlob
- Database: PostgreSQL 

Steps to run the application:

1. Start Flask server:
- python app.py

It will run at: http://127.0.0.1:5000

2. Navigate to frontend folder:
- cd voiceup-frontend

3. Install Dependencies
- npm install

4. Start Vite server
- npm run dev

App will run at: http://localhost:5173


