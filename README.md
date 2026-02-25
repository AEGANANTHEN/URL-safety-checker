#URL Safety Checker

A full-stack cybersecurity web application that analyzes URLs and detects potential phishing indicators using rule-based threat detection techniques.

This project is designed to:
- Teach safe browsing habits
- Introduce URL analysis basics
- Demonstrate beginner-level threat detection logic
- Provide a practical understanding of malicious URL patterns

---

##Features

- URL format validation
- HTTPS detection
- IP address detection
- Suspicious keyword detection (login, verify, bank, update, secure, account, etc.)
- Excessive hyphen detection
- URL length analysis
- Subdomain analysis
- Risk scoring system
- Risk classification:
  - Safe
  - Suspicious
  - Dangerous
- Domain information panel
- Score breakdown explanation
- Threat intelligence summary
- Animated risk visualization (Frontend)

---

## Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Custom CSS
- Fetch API

### Backend
- Node.js
- Express.js
- CORS Middleware
  
# Project Structure
URL-safety-checker/
│
├── server.js
├── routes/
│ └── checkUrl.js
├── utils/
│ └── analyzer.js
│
└── url-safety-frontend/
├── src/
├── public/
├── package.json

# Requirements
To run this project locally, the user must have:

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- Git (optional but recommended)

Download Node.js:
https://nodejs.org/

Verify installation:
node -v
npm -v

#  Risk Scoring Logic

The analyzer checks:

- Insecure HTTP protocol
- IP-based URLs
- Suspicious phishing keywords
- Excessive hyphen usage
- URL length anomalies
- Subdomain manipulation patterns

### Risk Levels

| Score Range | Risk Level |
|-------------|------------|
| 0 – 30      | Low (Safe) |
| 31 – 60     | Medium (Suspicious) |
| 61+         | High (Dangerous) |


#  Disclaimer
This project is for educational purposes only.
It demonstrates basic rule-based URL analysis and is not a replacement for professional cybersecurity tools.
