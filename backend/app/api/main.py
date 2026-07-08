from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model = joblib.load("models/stress_model.pkl")


class TypingFeatures(BaseModel):
    TypingSpeed: float
    AverageHoldTime: float
    HoldVariance: float
    AverageDelay: float
    DelayVariance: float
    BackspaceCount: int
    SpaceCount: int
    TotalKeys: int
    SessionDuration: float


@app.get("/")
def home():
    return {
        "project": "AI Anti Burnout Keyboard",
        "status": "Running"
    }


@app.post("/predict")
def predict(data: TypingFeatures):

    sample = [[
        data.TypingSpeed,
        data.AverageHoldTime,
        data.HoldVariance,
        data.AverageDelay,
        data.DelayVariance,
        data.BackspaceCount,
        data.SpaceCount,
        data.TotalKeys,
        data.SessionDuration
    ]]

    prediction = model.predict(sample)[0]

    labels = {
        0: "Low Stress 😊",
        1: "Medium Stress 😐",
        2: "High Stress 😫"
    }

    return {
        "stress_level": labels[prediction]
    }