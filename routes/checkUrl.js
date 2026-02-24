const express = require("express");
const router = express.Router();
const analyzeURL = require("../utils/analyzer");

router.post("/check", (req, res) => {
  const { url } = req.body;

  // 1️⃣ Check if URL exists
  if (!url || typeof url !== "string") {
    return res.status(400).json({
      error: "URL is required and must be a valid string."
    });
  }

  // 2️⃣ Analyze URL
  const result = analyzeURL(url);

  // 3️⃣ If analyzer returned error → send 400
  if (result.error) {
    return res.status(400).json({
      error: result.error
    });
  }

  // 4️⃣ Otherwise send analysis result
  res.status(200).json(result);
});

module.exports = router;