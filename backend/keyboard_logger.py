from pynput import keyboard
import csv
import os
import time

# Create data folder
os.makedirs("data", exist_ok=True)

csv_file = "data/keystrokes.csv"

session_start = time.time()

# Create a fresh CSV every run
with open(csv_file, "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow([
        "Key",
        "Press_Time",
        "Release_Time",
        "Hold_Time"
    ])

# Dictionary to store press time
pressed_keys = {}

# When a key is pressed
def on_press(key):
    try:
        pressed_keys[key] = time.time()
    except:
        pass

# When a key is released
def on_release(key):

    release_time = time.time()

    if key in pressed_keys:

        press_time = pressed_keys[key]

        hold_time = release_time - press_time

        with open(csv_file, "a", newline="") as file:
            writer = csv.writer(file)

            writer.writerow([
                str(key),
                round(press_time,6),
                round(release_time,6),
                round(hold_time,6)
            ])

        print(
            f"{key} | Hold Time = {hold_time:.3f} sec"
        )

        del pressed_keys[key]

    # Stop on ESC
    # Stop on ESC
    if key == keyboard.Key.esc:
        session_end = time.time()
        print(f"\nSession Duration: {session_end - session_start:.2f} seconds")
        print("Keyboard Logger Stopped.")
        return False

print("="*50)
print("Research Grade Keyboard Logger Started")
print("Type something...")
print("Press ESC to Stop")
print("="*50)

with keyboard.Listener(
        on_press=on_press,
        on_release=on_release
) as listener:
    listener.join()