import { useState, useEffect } from "react";
import "./App.css";

interface AnalysisResult {
  error: string | null;
  score: number;
  riskLevel: "Low" | "Medium" | "High";
  classification: string;
  reasons: string[];
  breakdown: string[];
  domainInfo: {
    protocol: string;
    hostname: string;
    subdomains: number;
    tld: string;
    urlLength: number;
  };
  analyzedAt: string;
}

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const checkURL = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setData(null);
    setAnimatedScore(0);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result: AnalysisResult = await response.json();
      setData(result);
    } catch (err) {
      setData({
        error: "Server connection failed.",
        score: 0,
        riskLevel: "Low",
        classification: "",
        reasons: [],
        breakdown: [],
        domainInfo: {
          protocol: "",
          hostname: "",
          subdomains: 0,
          tld: "",
          urlLength: 0,
        },
        analyzedAt: "",
      });
    }

    setLoading(false);
  };

  /* ============================= */
  /* Animate Score Bar */
  /* ============================= */

  useEffect(() => {
    if (data && !data.error) {
      let start = 0;
      const end = Math.min(data.score, 100);

      const interval = setInterval(() => {
        start += 2;
        if (start >= end) {
          start = end;
          clearInterval(interval);
        }
        setAnimatedScore(start);
      }, 15);

      return () => clearInterval(interval);
    }
  }, [data]);

  const color =
    data?.riskLevel === "High"
      ? "#ef4444"
      : data?.riskLevel === "Medium"
      ? "#f59e0b"
      : "#22c55e";

  return (
    <div className="container">
      {/* Cyber Badge */}
      <div className="cyber-badge">
        🛡 Powered by Threat Intelligence Engine v1.0
      </div>

      <h1>🔍 URL Safety Checker</h1>

      {/* Input Section */}
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter URL (include http:// or https://)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={checkURL} disabled={loading}>
          {loading ? "Scanning..." : "Check"}
        </button>
      </div>

      {/* Error Display */}
      {data?.error && (
        <div className="error-box">
          ❌ {data.error}
        </div>
      )}

      {/* Result Card */}
      {data && !data.error && (
        <div
          className={`result-card ${
            data.riskLevel === "High" ? "danger-glow" : ""
          }`}
        >
          {/* Scan Overlay */}
          {loading && <div className="scan-overlay"></div>}

          {/* Risk Bar */}
          <div className="risk-bar-container">
            <div
              className="risk-bar"
              style={{
                width: `${animatedScore}%`,
                backgroundColor: color,
              }}
            >
              {animatedScore}%
            </div>
          </div>

          <h3>Score: {data.score}</h3>
          <h3 style={{ color }}>Risk Level: {data.riskLevel}</h3>
          <h3>Classification: {data.classification}</h3>

          {/* Reasons */}
          <ul>
            {data.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>

          <hr />

          {/* Domain Info */}
          <h3>🔎 Domain Information</h3>
          <div className="info-panel">
            <p><strong>Protocol:</strong> {data.domainInfo.protocol}</p>
            <p><strong>Hostname:</strong> {data.domainInfo.hostname}</p>
            <p><strong>Subdomains:</strong> {data.domainInfo.subdomains}</p>
            <p><strong>TLD:</strong> {data.domainInfo.tld}</p>
            <p><strong>Length:</strong> {data.domainInfo.urlLength}</p>
          </div>

          <hr />

          {/* Score Breakdown */}
          <h3>📊 Score Breakdown</h3>
          <ul className="breakdown">
            {data.breakdown.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <hr />

          {/* Threat Intelligence Summary */}
          <h3>🧠 Threat Intelligence Summary</h3>
          <div className="threat-box">
            {data.riskLevel === "High" &&
              "This URL contains multiple phishing indicators including suspicious keywords, insecure protocol usage, and structural anomalies. It is strongly recommended to avoid interacting with this link."}

            {data.riskLevel === "Medium" &&
              "This URL shows characteristics that are sometimes associated with phishing attempts. Exercise caution before entering sensitive information."}

            {data.riskLevel === "Low" &&
              "No strong phishing indicators detected. However, always verify website authenticity before sharing sensitive information."}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;