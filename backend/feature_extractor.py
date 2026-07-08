import pandas as pd
import numpy as np

df = pd.read_csv("data/keystrokes.csv")

# Hold Time
average_hold = df["Hold_Time"].mean()
hold_variance = df["Hold_Time"].var()

# Delay Between Keys
delays = []

for i in range(1, len(df)):
    delay = df.loc[i, "Press_Time"] - df.loc[i-1, "Release_Time"]
    delays.append(delay)

average_delay = np.mean(delays) if delays else 0
delay_variance = np.var(delays) if delays else 0

# Counts
backspace_count = df["Key"].str.contains("backspace", case=False).sum()
space_count = df["Key"].str.contains("space", case=False).sum()

total_keys = len(df)

session_duration = (
    df["Release_Time"].iloc[-1] -
    df["Press_Time"].iloc[0]
)

typing_speed = (
    total_keys /
    (session_duration / 60)
)

features = {
    "TypingSpeed": round(typing_speed,2),
    "AverageHoldTime": round(average_hold,4),
    "HoldVariance": round(hold_variance,6),
    "AverageDelay": round(average_delay,4),
    "DelayVariance": round(delay_variance,6),
    "BackspaceCount": int(backspace_count),
    "SpaceCount": int(space_count),
    "TotalKeys": int(total_keys),
    "SessionDuration": round(session_duration,2)
}

print("\nExtracted Features\n")
print(features)