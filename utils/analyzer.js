function analyzeURL(inputUrl) {
  let score = 0;
  let reasons = [];
  let breakdown = [];

  // Always return consistent structure
  const safeReturn = (errorMessage = null) => ({
    error: errorMessage,
    score: 0,
    riskLevel: "Low",
    classification: "Safe",
    reasons: [],
    breakdown: [],
    domainInfo: {
      protocol: "",
      hostname: "",
      subdomains: 0,
      tld: "",
      urlLength: 0
    },
    analyzedAt: new Date()
  });

  if (!inputUrl || typeof inputUrl !== "string") {
    return safeReturn("Please enter a valid URL.");
  }

  inputUrl = inputUrl.trim();

  if (
    !inputUrl.startsWith("http://") &&
    !inputUrl.startsWith("https://")
  ) {
    return safeReturn(
      "Invalid URL format. Please include http:// or https://"
    );
  }

  let urlObj;

  try {
    urlObj = new URL(inputUrl);
  } catch {
    return safeReturn("Invalid URL structure.");
  }

  const hostname = urlObj.hostname.toLowerCase();
  const pathname = urlObj.pathname.toLowerCase();
  const fullUrl = urlObj.href.toLowerCase();
  const parts = hostname.split(".");
  const subdomainCount = parts.length > 2 ? parts.length - 2 : 0;

  // HTTPS
  if (urlObj.protocol !== "https:") {
    score += 25;
    reasons.push("URL is not using HTTPS (unsecured connection)");
    breakdown.push("+25 No HTTPS");
  }

  // IP address
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipPattern.test(hostname)) {
    score += 40;
    reasons.push("IP address used instead of domain name");
    breakdown.push("+40 IP Address used");
  }

  // Length
  if (fullUrl.length > 100) {
    score += 20;
    reasons.push("URL is excessively long");
    breakdown.push("+20 Excessive length");
  } else if (fullUrl.length > 75) {
    score += 10;
    reasons.push("URL is unusually long");
    breakdown.push("+10 Long URL");
  }

  // Suspicious keywords
  const suspiciousKeywords = [
    "login",
    "verify",
    "update",
    "bank",
    "secure",
    "account",
    "signin",
    "confirm",
    "password",
    "wallet",
    "support"
  ];

  suspiciousKeywords.forEach(keyword => {
    if (hostname.includes(keyword) || pathname.includes(keyword)) {
      score += 12;
      reasons.push(`Suspicious keyword detected: ${keyword}`);
      breakdown.push(`+12 Keyword: ${keyword}`);
    }
  });

  // @ symbol
  if (fullUrl.includes("@")) {
    score += 25;
    reasons.push("Contains @ symbol (possible masking)");
    breakdown.push("+25 @ Symbol used");
  }

  // Too many subdomains
  if (subdomainCount >= 3) {
    score += 15;
    reasons.push("Too many subdomains");
    breakdown.push("+15 Too many subdomains");
  }

  // Hyphens
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    score += 15;
    reasons.push("Too many hyphens in domain name");
    breakdown.push("+15 Excessive hyphens");
  }

  // Suspicious TLD
  const suspiciousTLDs = [".tk", ".ml", ".ga", ".cf", ".gq"];
  if (suspiciousTLDs.some(tld => hostname.endsWith(tld))) {
    score += 20;
    reasons.push("Suspicious top-level domain");
    breakdown.push("+20 Suspicious TLD");
  }

  let classification = "Safe";
  let riskLevel = "Low";

  if (score >= 60) {
    classification = "Dangerous";
    riskLevel = "High";
  } else if (score >= 30) {
    classification = "Suspicious";
    riskLevel = "Medium";
  }

  return {
    error: null,
    score,
    riskLevel,
    classification,
    reasons,
    breakdown,
    domainInfo: {
      protocol: urlObj.protocol,
      hostname,
      subdomains: subdomainCount,
      tld: "." + parts[parts.length - 1],
      urlLength: fullUrl.length
    },
    analyzedAt: new Date()
  };
}

module.exports = analyzeURL;