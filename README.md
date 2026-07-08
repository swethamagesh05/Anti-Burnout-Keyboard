# AI Burnout Detection using Keystroke Dynamics

## Overview
AI Burnout Detection is a machine learning-based web application that analyzes a user's typing behavior to estimate stress levels. It collects keystroke dynamics such as typing speed, key hold time, typing delays, and backspace frequency, then predicts whether the user's stress level is Low, Medium, or High.

## Features

✔ Live Typing Analysis
✔ Real-time WPM Counter
✔ Keystroke Feature Extraction
✔ Machine Learning Stress Prediction
✔ Stress Percentage Visualization
✔ Smart Recommendations
✔ Responsive React UI

## Tech Stack

Frontend
- React
- Axios

Backend
- FastAPI
- Python

Machine Learning
- Scikit-learn
- Random Forest

Libraries
- Pandas
- NumPy
- Joblib

## Folder Structure

backend/
frontend/
models/
data/

## How to Run

Backend

python train_model.py
uvicorn app.api.main:app --reload

Frontend

npm install
npm run dev

## Future Improvements

• User authentication
• Historical stress tracking
• Charts & Analytics
• Dark/Light Mode