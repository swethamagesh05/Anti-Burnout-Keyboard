import joblib
import pandas as pd
import numpy as np

# Load model
model = joblib.load("models/stress_model.pkl")

# Read keystroke data
df = pd.read_csv("data/keystrokes.csv")

# ----------------------------
# Feature Extraction
# ----------------------------

average_hold = df["Hold_Time"].mean()
hold_variance = df["Hold_Time"].var()

delays = []

for i in range(1, len(df)):
    delay = df.loc[i, "Press_Time"] - df.loc[i-1, "Release_Time"]
    delays.append(delay)

average_delay = np.mean(delays) if delays else 0
delay_variance = np.var(delays) if delays else 0

backspace_count = df["Key"].str.contains("backspace", case=False).sum()
space_count = df["Key"].str.contains("space", case=False).sum()

total_keys = len(df)

session_duration = (
    df["Release_Time"].iloc[-1] -
    df["Press_Time"].iloc[0]
)

typing_speed = total_keys / (session_duration / 60)

sample = [[
    float(typing_speed),
    float(average_hold),
    float(hold_variance),
    float(average_delay),
    float(delay_variance),
    int(backspace_count),
    int(space_count),
    int(total_keys),
    float(session_duration)
]]

prediction = model.predict(sample)[0]

labels = {
    0: "😊 Low Stress",
    1: "😐 Medium Stress",
    2: "😫 High Stress"
}

print("\n===============================")
print("Stress Prediction")
print("===============================")
print(labels[prediction])