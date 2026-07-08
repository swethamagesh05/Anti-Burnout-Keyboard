import joblib
import pandas as pd

# Load trained model
model = joblib.load("models/stress_model.pkl")

# Load latest session
df = pd.read_csv("data/dataset.csv")

latest = df.iloc[-1]

X = latest.drop("StressLabel").values.reshape(1, -1)

prediction = model.predict(X)[0]

labels = {
    0: "Low Stress 😊",
    1: "Medium Stress 😐",
    2: "High Stress 😫"
}

print("\n==============================")
print("Predicted Stress Level")
print("==============================")

print(labels[prediction])