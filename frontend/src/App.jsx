import { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {

  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const [stats, setStats] = useState({
    wpm: 0,
    keys: 0,
    duration: "0.0"
  });

  const [stressPercent, setStressPercent] = useState(0);

  const [recommendation, setRecommendation] = useState("");

  const startTime = useRef(null);
  const keyPressTimes = useRef({});
  const holdTimes = useRef([]);
  const delays = useRef([]);
  const previousRelease = useRef(null);
  const backspaceCount = useRef(0);

  //---------------------------------------
  // KEY DOWN
  //---------------------------------------

  const handleKeyDown = (e) => {

    if (!startTime.current)
      startTime.current = Date.now();

    keyPressTimes.current[e.key] = Date.now();

    if (previousRelease.current) {

      delays.current.push(
        (Date.now() - previousRelease.current) / 1000
      );

    }

    if (e.key === "Backspace")
      backspaceCount.current++;

  };

  //---------------------------------------
  // KEY UP
  //---------------------------------------

  const handleKeyUp = (e) => {

    const now = Date.now();

    if (keyPressTimes.current[e.key]) {

      const hold =
        (now - keyPressTimes.current[e.key]) / 1000;

      holdTimes.current.push(hold);

      delete keyPressTimes.current[e.key];

    }

    previousRelease.current = now;

  };

  //---------------------------------------
  // LIVE DASHBOARD
  //---------------------------------------

  useEffect(() => {

    if (!startTime.current) return;

    const duration =
      (Date.now() - startTime.current) / 1000;

    const words =
      text.trim().split(/\s+/).filter(Boolean).length;

    const wpm =
      duration > 0
        ? Math.round(words / (duration / 60))
        : 0;

    setStats({
      wpm,
      keys: text.length,
      duration: duration.toFixed(1)
    });

  }, [text]);

  //---------------------------------------
  // HELPER FUNCTIONS
  //---------------------------------------

  function average(arr) {

    if (arr.length === 0)
      return 0;

    return arr.reduce(
      (a, b) => a + b,
      0
    ) / arr.length;

  }

  function variance(arr) {

    if (arr.length === 0)
      return 0;

    const avg = average(arr);

    return arr.reduce(
      (a, b) => a + (b - avg) * (b - avg),
      0
    ) / arr.length;

  }

  //---------------------------------------
  // PREDICT FUNCTION
  //---------------------------------------
const handlePredict = async () => {

  if (!startTime.current) {
    alert("Please type something first!");
    return;
  }

  const sessionDuration =
    (Date.now() - startTime.current) / 1000;

  const words =
    text.trim().split(/\s+/).filter(Boolean).length;

  const typingSpeed =
    sessionDuration > 0
      ? words / (sessionDuration / 60)
      : 0;

  const payload = {

    TypingSpeed: typingSpeed,

    AverageHoldTime: average(holdTimes.current),

    HoldVariance: variance(holdTimes.current),

    AverageDelay: average(delays.current),

    DelayVariance: variance(delays.current),

    BackspaceCount: backspaceCount.current,

    SpaceCount: (text.match(/ /g) || []).length,

    TotalKeys: text.length,

    SessionDuration: sessionDuration

  };

  try {

    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      payload
    );

    const stress = response.data.stress_level;

    setResult(stress);

    setStats({
      wpm: Math.round(typingSpeed),
      keys: text.length,
      duration: sessionDuration.toFixed(1)
    });

    if (stress.includes("Low")) {

      setStressPercent(25);

      setRecommendation(
        "✅ Great job! Your typing pattern looks relaxed. Keep maintaining healthy work habits."
      );

    }

    else if (stress.includes("Medium")) {

      setStressPercent(60);

      setRecommendation(
        "⚠️ Moderate stress detected. Take a 5–10 minute break, drink water, and stretch before continuing."
      );

    }

    else {

      setStressPercent(90);

      setRecommendation(
        "🚨 High stress detected. Consider resting your eyes, taking a longer break, and avoiding continuous typing."
      );

    }

  }

  catch (err) {

    console.log(err);

    alert("Backend server is not running!");

  }

};
return (

  <div
    style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      fontFamily: "Arial, sans-serif"
    }}
  >

    <div
      style={{
        width: "900px",
        background: "#1e293b",
        borderRadius: "20px",
        padding: "35px",
        boxShadow: "0 0 25px rgba(0,0,0,0.4)"
      }}
    >

      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          marginBottom: "10px"
        }}
      >
        ⌨️ Anti Burnout Keyboard
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#cbd5e1",
          marginBottom: "30px"
        }}
      >
        Analyze your typing behaviour and estimate your stress level.
      </p>

      <textarea
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="Start typing here..."
        style={{
          width: "100%",
          resize: "none",
          padding: "18px",
          fontSize: "18px",
          borderRadius: "12px",
          border: "none",
          outline: "none",
          background: "#334155",
          color: "white",
          boxSizing: "border-box"
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "25px",
          gap: "20px"
        }}
      >

        <div
          style={{
            flex: 1,
            background: "#334155",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center"
          }}
        >
          <h3>⌨️ WPM</h3>
          <h2>{stats.wpm}</h2>
        </div>

        <div
          style={{
            flex: 1,
            background: "#334155",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center"
          }}
        >
          <h3>🔑 Keys</h3>
          <h2>{stats.keys}</h2>
        </div>

        <div
          style={{
            flex: 1,
            background: "#334155",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center"
          }}
        >
          <h3>⏱ Time</h3>
          <h2>{stats.duration}s</h2>
        </div>

      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "30px"
        }}
      >

        <button
          onClick={handlePredict}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "14px 35px",
            fontSize: "18px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Predict Stress
        </button>

      </div>

      {result && (

        <>

          <h2
            style={{
              textAlign: "center",
              marginTop: "35px"
            }}
          >
            {result}
          </h2>

          <div
            style={{
              width: "100%",
              height: "28px",
              background: "#475569",
              borderRadius: "30px",
              overflow: "hidden",
              marginTop: "20px"
            }}
          >

            <div
              style={{
                width: `${stressPercent}%`,
                height: "100%",
                background:
                  stressPercent < 40
                    ? "#22c55e"
                    : stressPercent < 75
                    ? "#f59e0b"
                    : "#ef4444",
                transition: "1s"
              }}
            />

          </div>

          <h3
            style={{
              textAlign: "center",
              marginTop: "15px"
            }}
          >
            Stress Score : {stressPercent}%
          </h3>

          <div
            style={{
              marginTop: "30px",
              background: "#334155",
              borderRadius: "15px",
              padding: "20px"
            }}
          >

            <h2>💡Recommendation</h2>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.7"
              }}
            >
              {recommendation}
            </p>

          </div>

        </>

      )}

    </div>

  </div>

);

}

export default App;