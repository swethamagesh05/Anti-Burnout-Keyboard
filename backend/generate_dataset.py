import pandas as pd
import random

rows = []

for _ in range(1000):

    stress = random.choice([0, 1, 2])

    if stress == 0:      # Low Stress
        typing_speed = random.uniform(55, 90)
        hold = random.uniform(0.07, 0.11)
        delay = random.uniform(0.08, 0.22)
        backspace = random.randint(0, 2)

    elif stress == 1:    # Medium Stress
        typing_speed = random.uniform(40, 60)
        hold = random.uniform(0.10, 0.15)
        delay = random.uniform(0.20, 0.45)
        backspace = random.randint(2, 6)

    else:                # High Stress
        typing_speed = random.uniform(20, 40)
        hold = random.uniform(0.15, 0.25)
        delay = random.uniform(0.45, 0.90)
        backspace = random.randint(5, 15)

    hold_variance = round(random.uniform(0.0001, 0.006), 6)
    delay_variance = round(random.uniform(0.0005, 0.020), 6)

    spaces = random.randint(15, 80)

    total_keys = random.randint(120, 600)

    session_duration = round(
        total_keys / (typing_speed * 5 / 60),
        2
    )

    rows.append([
        round(typing_speed, 2),
        round(hold, 4),
        hold_variance,
        round(delay, 4),
        delay_variance,
        backspace,
        spaces,
        total_keys,
        session_duration,
        stress
    ])

df = pd.DataFrame(rows, columns=[
    "TypingSpeed",
    "AverageHoldTime",
    "HoldVariance",
    "AverageDelay",
    "DelayVariance",
    "BackspaceCount",
    "SpaceCount",
    "TotalKeys",
    "SessionDuration",
    "StressLabel"
])

df.to_csv("data/dataset.csv", index=False)

print("✅ Generated 1000 typing sessions successfully!")