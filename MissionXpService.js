const DIFFICULTY_MULTIPLIER = {
  facil: 0.85,
  normal: 1,
  dificil: 1.25
};

const CATEGORY_RULES = [
  { words: ["correr", "corrida", "run"], base: 12 },
  { words: ["flexao", "flexoes", "push"], base: 12 },
  { words: ["estudar", "estudo", "curso", "ler", "leitura"], base: 8 },
  { words: ["treinar", "academia", "musculacao", "exercicio"], base: 16 },
  { words: ["limpar", "arrumar", "organizar"], base: 10 },
  { words: ["trabalhar", "projeto", "programar", "codigo"], base: 16 },
  { words: ["meditar", "alongar", "respirar"], base: 8 }
];

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function extractNumberBefore(text, unitPattern) {
  const regex = new RegExp(`(\\d+(?:[,.]\\d+)?)\\s*${unitPattern}`, "i");
  const match = text.match(regex);
  return match ? Number(match[1].replace(",", ".")) : 0;
}

class MissionXpService {
  static calculate({ title = "", description = "", difficulty = "normal" }) {
    const text = normalizeText(`${title} ${description}`);
    let xp = 10;

    for (const rule of CATEGORY_RULES) {
      if (rule.words.some((word) => text.includes(word))) {
        xp = Math.max(xp, rule.base);
      }
    }

    const kilometers = extractNumberBefore(text, "km|quilometros?");
    const minutes = extractNumberBefore(text, "min|mins|minutos?");
    const hours = extractNumberBefore(text, "h|hora|horas");
    const repetitions = extractNumberBefore(text, "flexoes?|abdominais?|agachamentos?|repeticoes?|reps?");
    const pages = extractNumberBefore(text, "paginas?|pgs?");

    xp += Math.min(kilometers * 4, 40);
    xp += Math.min(minutes * 0.22, 30);
    xp += Math.min(hours * 18, 45);
    xp += Math.min(repetitions * 0.25, 35);
    xp += Math.min(pages * 0.18, 25);

    if (text.length > 90) xp += 5;
    if (text.includes("diario") || text.includes("consistencia")) xp += 4;
    if (text.includes("dificil") || text.includes("intenso") || text.includes("pesado")) xp += 8;

    const multiplier = DIFFICULTY_MULTIPLIER[difficulty] || DIFFICULTY_MULTIPLIER.normal;
    const calculated = Math.round((xp * multiplier) / 5) * 5;

    return clamp(calculated, 5, 120);
  }
}

module.exports = MissionXpService;
