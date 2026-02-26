const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const STOP_WORDS = new Set([
  "i", "im", "i'm", "have", "having", "am", "is", "are", "was", "were", "been",
  "the", "a", "an", "and", "or", "to", "for", "from", "in", "on", "at", "of",
  "with", "without", "my", "me", "it", "this", "that", "these", "those", "very",
  "long", "hours", "hour", "days", "day", "weeks", "week", "months", "month"
]);

const REGION_PROFILES = [
  {
    key: "head",
    triggers: ["head", "headache", "temple", "skull", "left side head", "right side head"],
    positive: ["migraine", "headache", "cluster", "tension", "sinusitis", "epilepsy", "stroke", "brain", "neurologic"],
    negative: ["back", "lumbar", "spine", "knee", "hip", "shoulder", "renal", "kidney"]
  },
  {
    key: "abdomen",
    triggers: ["abdomen", "abdominal", "stomach", "belly", "lower abdomen"],
    positive: ["appendicitis", "gastritis", "ulcer", "crohn", "colitis", "pancreatitis", "gall", "intestinal", "gerd"],
    negative: ["headache", "migraine", "back pain", "lumbar"]
  },
  {
    key: "chest",
    triggers: ["chest", "heart", "cardiac", "breath", "breathing", "lung"],
    positive: ["angina", "coronary", "heart", "arrhythmia", "pneumonia", "asthma", "copd", "pulmonary"],
    negative: ["appendicitis", "gastritis", "back pain"]
  },
  {
    key: "back",
    triggers: ["back", "spine", "lumbar", "lower back"],
    positive: ["lumbar", "disc", "spinal", "spondylitis", "musculoskeletal", "fibromyalgia"],
    negative: ["migraine", "appendicitis", "sinusitis"]
  }
];

const REGION_KEYWORDS = {
  head: ["head", "headache", "temple", "skull", "brain", "neurologic", "migraine"],
  abdomen: ["abdomen", "abdominal", "stomach", "belly", "appendicitis", "gastric", "intestinal", "pancreatic"],
  chest: ["chest", "heart", "cardiac", "lung", "pulmonary", "respiratory"],
  back: ["back", "lumbar", "spine", "spinal"]
};

const tokenize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token));

const normalizeText = (value = "") =>
  String(value).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const looksLikeSymptomDescription = (query = "") => {
  const normalized = String(query).toLowerCase();
  const wordCount = normalized.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount >= 5) return true;
  return /(pain|ache|fever|cough|vomit|nausea|weak|swelling|burning|dizzy|fatigue|tired|breath|breathing|symptom|feeling)/i.test(normalized);
};

const diceCoefficient = (a = "", b = "") => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  const pairs = new Map();
  for (let i = 0; i < a.length - 1; i += 1) {
    const pair = a.slice(i, i + 2);
    pairs.set(pair, (pairs.get(pair) || 0) + 1);
  }

  let intersection = 0;
  for (let i = 0; i < b.length - 1; i += 1) {
    const pair = b.slice(i, i + 2);
    const count = pairs.get(pair) || 0;
    if (count > 0) {
      pairs.set(pair, count - 1);
      intersection += 1;
    }
  }

  return (2 * intersection) / (a.length + b.length - 2);
};

const tokenOverlapScore = (source, target) => {
  const sourceTokens = tokenize(source);
  const targetTokens = tokenize(target);
  if (!sourceTokens.length || !targetTokens.length) return 0;
  const sourceSet = new Set(sourceTokens);
  const targetSet = new Set(targetTokens);
  let overlap = 0;
  sourceSet.forEach((token) => {
    if (targetSet.has(token)) overlap += 1;
  });
  return overlap / Math.max(sourceSet.size, targetSet.size);
};

const parseGeminiJson = (rawText = "") => {
  try {
    return JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const inferRegionProfile = (query) => {
  const normalized = normalizeText(query);
  return REGION_PROFILES.find((profile) =>
    profile.triggers.some((trigger) => normalized.includes(trigger))
  ) || null;
};

const regionContextScore = (query, diseaseName) => {
  const profile = inferRegionProfile(query);
  if (!profile) return 0;

  const nameNorm = normalizeText(diseaseName);
  let score = 0;

  if (profile.positive.some((token) => nameNorm.includes(token))) score += 1.5;
  if (profile.negative.some((token) => nameNorm.includes(token))) score -= 1.2;

  const asksPain = /(pain|ache)/i.test(query);
  const diseaseIsGenericPain = /(pain|ache)/i.test(nameNorm);
  if (asksPain && diseaseIsGenericPain) {
    const regionTerms = REGION_KEYWORDS[profile.key] || [];
    const hasSameRegion = regionTerms.some((term) => nameNorm.includes(term));
    if (!hasSameRegion) score -= 1.0;
  }

  return score;
};

const buildPrompt = (query) => `
You are a medical triage assistant for search suggestion only.
User symptom text may include typos and grammar errors.

Task:
1) Infer likely disease/condition names from the symptom description.
2) Return only likely conditions, not treatments.
3) Include both common and specific differential diagnoses.
4) Keep output concise.
5) Strongly prioritize anatomical context (head vs chest vs abdomen vs back).
6) Avoid unrelated generic pain conditions when a clear body region is present.

Return STRICT JSON:
{
  "normalized_query": "string",
  "conditions": ["condition 1", "condition 2", "... up to 15"]
}

User symptom text:
${query}
`.trim();

const fetchGeminiConditions = async (query) => {
  if (!GEMINI_API_KEY) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildPrompt(query) }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = parseGeminiJson(text);
    if (!parsed || !Array.isArray(parsed.conditions)) return [];

    return parsed.conditions
      .map((item) => String(item || "").trim())
      .filter(Boolean)
      .slice(0, 15);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
};

const mapAiConditionsToKnownDiseases = (query, aiConditions, diseases) => {
  if (!aiConditions.length || !diseases.length) return [];

  const usedIds = new Set();
  const ranked = [];

  aiConditions.forEach((aiName, aiRank) => {
    const aiNorm = normalizeText(aiName);
    let best = null;
    let bestScore = 0;

    diseases.forEach((disease) => {
      const diseaseName = String(disease.name || "");
      const diseaseNorm = normalizeText(diseaseName);
      if (!diseaseNorm) return;

      let score = 0;
      if (aiNorm === diseaseNorm) score = 1;
      else if (diseaseNorm.includes(aiNorm) || aiNorm.includes(diseaseNorm)) score = 0.9;
      else {
        const dice = diceCoefficient(aiNorm, diseaseNorm);
        const overlap = tokenOverlapScore(aiNorm, diseaseNorm);
        score = Math.max(dice, overlap);
      }

      const contextBoost = regionContextScore(query, diseaseName) * 0.2;
      const adjustedScore = score + contextBoost;
      if (adjustedScore > bestScore) {
        best = disease;
        bestScore = adjustedScore;
      }
    });

    if (best && bestScore >= 0.35 && !usedIds.has(String(best._id))) {
      usedIds.add(String(best._id));
      ranked.push({
        disease: best,
        score: bestScore + Math.max(0, 0.3 - aiRank * 0.01)
      });
    }
  });

  return ranked.sort((a, b) => b.score - a.score).map((item) => item.disease);
};

const localFallbackMatch = (query, diseases, limit = 25) => {
  const queryNorm = normalizeText(query);
  const queryTokens = tokenize(queryNorm);

  const scored = diseases.map((disease) => {
    const name = String(disease.name || "");
    const nameNorm = normalizeText(name);
    let score = 0;

    if (queryNorm && nameNorm.includes(queryNorm)) score += 6;
    if (queryNorm && queryNorm.includes(nameNorm)) score += 5;

    if (queryTokens.length) {
      const overlap = tokenOverlapScore(queryNorm, nameNorm);
      score += overlap * 4;
    }

    score += diceCoefficient(queryNorm, nameNorm) * 3;
    score += regionContextScore(queryNorm, name) * 2.5;
    return { disease, score };
  });

  return scored
    .filter((item) => item.score > 0.6)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.disease);
};

export const findRelatedDiseasesFromSymptoms = async (query, diseases, limit = 25) => {
  const aiConditions = await fetchGeminiConditions(query);
  const aiMapped = mapAiConditionsToKnownDiseases(query, aiConditions, diseases);

  if (aiMapped.length >= 8) {
    return aiMapped.slice(0, limit);
  }

  const fallback = localFallbackMatch(query, diseases, limit);
  const merged = new Map();
  [...aiMapped, ...fallback].forEach((disease) => {
    merged.set(String(disease._id), disease);
  });
  return [...merged.values()].slice(0, limit);
};

export { looksLikeSymptomDescription };
