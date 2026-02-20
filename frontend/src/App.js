// Final App.js for AI Intelligent Excuse Generator
// Includes: Excuse Generator, Chat UI, PDF Download, Save/Delete Favorites, History, Emergency Text, Apology Generator, Proof Screenshots

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const excuseBank = {
  school: [
    "Sorry, I had a fever and couldn't make it to class.",
    "My alarm didn't go off and I missed the bus.",
    "I had a doctor's appointment that ran late.",
    "There was a family emergency I had to attend to.",
    "My internet was down and I couldn't join the online session."
  ],
  work: [
    "My internet went down during an important client call.",
    "I had a sudden migraine and couldn't focus at all.",
    "My car broke down on the way to the office.",
    "There was a power outage at my place all morning.",
    "I had a conflicting urgent meeting that came up last minute."
  ],
  family: [
    "There was a sudden medical emergency in the family.",
    "I had to take care of a sick relative unexpectedly.",
    "Our water pipe burst and we had to deal with repairs.",
    "I had to pick up someone from the hospital.",
    "A family matter came up that needed immediate attention."
  ],
  social: [
    "Something urgent came up and I couldn't attend the event.",
    "I wasn't feeling well and didn't want to spread anything.",
    "My plans fell through at the last minute, so sorry!",
    "I had a prior commitment I completely forgot about.",
    "I got stuck in traffic and it was too late to come."
  ]
};

function App() {
  const [scenario, setScenario] = useState("school");
  const [excuse, setExcuse] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedExcuses, setSavedExcuses] = useState(() => {
    const data = localStorage.getItem("savedExcuses");
    return data ? JSON.parse(data) : [];
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const historyData = localStorage.getItem("excuseHistory");
    if (historyData) setHistory(JSON.parse(historyData));
  }, []);

  const generateExcuse = () => {
    setExcuse("");
    setReply("");
    setLoading(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const excuses = excuseBank[scenario] || ["Something unexpected happened."];
      const newExcuse = excuses[Math.floor(Math.random() * excuses.length)];
      setExcuse(newExcuse);
      setLoading(false);

      const timestamp = new Date().toLocaleString();
      const newHistory = [...history, { excuse: newExcuse, time: timestamp }];
      setHistory(newHistory);
      localStorage.setItem("excuseHistory", JSON.stringify(newHistory));

      setTimeout(() => {
        const replies = [
          "No problem, take care!",
          "Hope you feel better soon!",
          "Alright, let me know if you need anything.",
          "Totally understand, don't worry about it."
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        setReply(randomReply);
      }, 2000);
    }, 1000);
  };

  const saveExcuse = () => {
    if (!excuse || savedExcuses.includes(excuse)) return;
    const updated = [...savedExcuses, excuse];
    setSavedExcuses(updated);
    localStorage.setItem("savedExcuses", JSON.stringify(updated));
  };

  const deleteExcuse = (ex) => {
    const updated = savedExcuses.filter(item => item !== ex);
    setSavedExcuses(updated);
    localStorage.setItem("savedExcuses", JSON.stringify(updated));
  };

  const downloadChat = () => {
    const chatElement = document.getElementById("chatBox");
    html2canvas(chatElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save("excuse_chat.pdf");
    });
  };

  const generateApology = () => {
    const apologies = [
      "I'm really sorry for the inconvenience caused.",
      "Please forgive me, it wasn't intentional.",
      "I truly apologize for what happened."
    ];
    const message = apologies[Math.floor(Math.random() * apologies.length)];
    alert("🗣 Apology Generated (Text/Voice):\n" + message);
  };

  const triggerEmergencyText = () => {
    alert("🚨 Emergency message sent: 'Sorry, I have to leave urgently!'");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🎭 AI Intelligent Excuse Generator</h1>

      <label>Scenario:</label>
      <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
        <option value="school">📘 School</option>
        <option value="work">💼 Work</option>
        <option value="family">👪 Family</option>
        <option value="social">🎉 Social Event</option>
      </select>

      <br /><br />
      <button onClick={generateExcuse} disabled={loading}>
        {loading ? "⏳ Generating..." : "🎬 Generate Excuse"}
      </button>
      <button onClick={generateApology} style={{ marginLeft: '10px' }}>🙏 Apology</button>
      <button onClick={triggerEmergencyText} style={{ marginLeft: '10px' }}>🚨 Emergency</button>

      <br /><br />

      {excuse && (
        <div id="chatBox" style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          width: "300px",
          background: "#f9f9f9",
          marginTop: "20px",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)"
        }}>
          <div style={{ textAlign: "right", fontSize: "12px", color: "#888" }}>You</div>
          <div style={{
            background: "#daf8cb",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "10px",
            marginLeft: "auto",
            maxWidth: "80%",
            fontSize: "14px"
          }}>{excuse}</div>

          {reply && (
            <>
              <div style={{ textAlign: "left", fontSize: "12px", color: "#888" }}>Friend</div>
              <div style={{
                background: "#ffffff",
                padding: "10px",
                borderRadius: "10px",
                marginRight: "auto",
                maxWidth: "80%",
                fontSize: "14px",
                border: "1px solid #ddd"
              }}>{reply}</div>
            </>
          )}

          <button onClick={downloadChat} style={{ marginTop: "10px" }}>📥 Download Chat</button>
          <button onClick={saveExcuse} style={{ marginLeft: "10px", backgroundColor: "#ff4757", color: "white" }}>❤️ Save Excuse</button>
        </div>
      )}

      {savedExcuses.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>❤️ Saved Excuses</h3>
          <ul style={{ paddingLeft: "20px" }}>
            {savedExcuses.map((ex, i) => (
              <li key={i}>
                {ex}
                <button onClick={() => deleteExcuse(ex)} style={{ marginLeft: "10px", color: "red" }}>🗑</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>📜 Excuse History</h3>
          <ul>
            {history.map((h, i) => (
              <li key={i}>{h.time} — {h.excuse}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
