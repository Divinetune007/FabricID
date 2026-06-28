import { v4 as uuidv4 } from "uuid";

// Simulated AI fabric analysis - in production, this would call Claude Vision API / Google Vision API
// The analysis generates realistic textile properties from image data

const WEAVE_PATTERNS = [
  "Plain Weave", "Twill Weave", "Satin Weave", "Basket Weave",
  "Herringbone", "Dobby Weave", "Jacquard", "Leno Weave",
];

const FABRIC_TYPES = [
  "Cotton", "Silk", "Polyester", "Linen", "Wool",
  "Denim", "Chiffon", "Velvet", "Muslin", "Khadi",
];

const TEXTURE_PROFILES = [
  "Smooth & Fine", "Medium Texture", "Coarse & Rugged",
  "Silky & Lustrous", "Crisp & Structured", "Soft & Brushed",
];

function generateColorProfile(imageData) {
  const palettes = [
    { dominant: "#2C3E50", secondary: "#E74C3C", accent: "#F39C12", name: "Deep Navy & Crimson" },
    { dominant: "#1ABC9C", secondary: "#3498DB", accent: "#E8DAEF", name: "Teal & Azure" },
    { dominant: "#D4A574", secondary: "#8B4513", accent: "#F5DEB3", name: "Natural Earth Tones" },
    { dominant: "#C0392B", secondary: "#2980B9", accent: "#F1C40F", name: "Vibrant Traditional" },
    { dominant: "#27AE60", secondary: "#2ECC71", accent: "#F39C12", name: "Forest & Gold" },
    { dominant: "#8E44AD", secondary: "#3498DB", accent: "#1ABC9C", name: "Royal Purple & Blue" },
    { dominant: "#E67E22", secondary: "#D35400", accent: "#FDE3A7", name: "Warm Sunset" },
    { dominant: "#2C3E50", secondary: "#BDC3C7", accent: "#ECF0F1", name: "Classic Monochrome" },
  ];
  const hash = imageData ? imageData.length : Math.floor(Math.random() * palettes.length);
  return palettes[hash % palettes.length];
}

function generateHash(input) {
  let hash = 0;
  const str = typeof input === "string" ? input : JSON.stringify(input);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function analyzeFabricImages(images, manufacturerInfo) {
  const hash = generateHash(manufacturerInfo.companyName + Date.now());

  const weavePattern = WEAVE_PATTERNS[hash % WEAVE_PATTERNS.length];
  const fabricType = FABRIC_TYPES[(hash + 3) % FABRIC_TYPES.length];
  const textureProfile = TEXTURE_PROFILES[(hash + 5) % TEXTURE_PROFILES.length];
  const colorProfile = generateColorProfile(images[0]?.name);

  const threadCount = 80 + (hash % 200);
  const gsmWeight = 100 + (hash % 300);
  const qualityScore = 70 + (hash % 30);

  const fabricId = `FID-${uuidv4().slice(0, 8).toUpperCase()}`;

  const fingerprint = generateFingerprint(weavePattern, fabricType, threadCount, colorProfile);

  return {
    fabricId,
    fingerprint,
    analysis: {
      weavePattern,
      fabricType,
      textureProfile,
      colorProfile,
      threadCount,
      gsmWeight,
      qualityScore,
      fiberComposition: generateFiberComposition(fabricType),
      durabilityRating: Math.min(5, 3 + (hash % 3)),
      colorfastness: Math.min(5, 3 + ((hash + 1) % 3)),
    },
    timestamp: new Date().toISOString(),
    status: "verified",
  };
}

function generateFiberComposition(fabricType) {
  const compositions = {
    Cotton: [{ fiber: "Cotton", percentage: 100 }],
    Silk: [{ fiber: "Silk", percentage: 95 }, { fiber: "Nylon", percentage: 5 }],
    Polyester: [{ fiber: "Polyester", percentage: 80 }, { fiber: "Cotton", percentage: 20 }],
    Linen: [{ fiber: "Linen", percentage: 100 }],
    Wool: [{ fiber: "Wool", percentage: 90 }, { fiber: "Polyester", percentage: 10 }],
    Denim: [{ fiber: "Cotton", percentage: 98 }, { fiber: "Elastane", percentage: 2 }],
    Chiffon: [{ fiber: "Polyester", percentage: 100 }],
    Velvet: [{ fiber: "Silk", percentage: 60 }, { fiber: "Cotton", percentage: 40 }],
    Muslin: [{ fiber: "Cotton", percentage: 100 }],
    Khadi: [{ fiber: "Cotton", percentage: 85 }, { fiber: "Silk", percentage: 15 }],
  };
  return compositions[fabricType] || [{ fiber: "Cotton", percentage: 100 }];
}

function generateFingerprint(weave, type, threadCount, colorProfile) {
  const data = `${weave}-${type}-${threadCount}-${colorProfile.name}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(16, "0").slice(0, 16);
  return hex.match(/.{4}/g).join("-").toUpperCase();
}

export function compareFabrics(originalAnalysis, scannedData) {
  if (!originalAnalysis || !scannedData) return { matchScore: 0, details: [] };

  const checks = [];
  let totalScore = 0;
  let maxScore = 0;

  // Weave pattern match
  const weaveMatch = originalAnalysis.weavePattern === scannedData.weavePattern;
  checks.push({ name: "Weave Pattern", match: weaveMatch, weight: 25 });
  totalScore += weaveMatch ? 25 : 0;
  maxScore += 25;

  // Fabric type match
  const typeMatch = originalAnalysis.fabricType === scannedData.fabricType;
  checks.push({ name: "Fabric Type", match: typeMatch, weight: 25 });
  totalScore += typeMatch ? 25 : 0;
  maxScore += 25;

  // Thread count similarity
  const threadDiff = Math.abs(originalAnalysis.threadCount - scannedData.threadCount);
  const threadScore = Math.max(0, 25 - threadDiff * 0.5);
  checks.push({ name: "Thread Count", match: threadScore > 15, weight: 25, score: threadScore });
  totalScore += threadScore;
  maxScore += 25;

  // Color profile match
  const colorMatch = originalAnalysis.colorProfile?.name === scannedData.colorProfile?.name;
  checks.push({ name: "Color Profile", match: colorMatch, weight: 25 });
  totalScore += colorMatch ? 25 : 0;
  maxScore += 25;

  return {
    matchScore: Math.round((totalScore / maxScore) * 100),
    details: checks,
    isAuthentic: totalScore / maxScore >= 0.7,
  };
}
