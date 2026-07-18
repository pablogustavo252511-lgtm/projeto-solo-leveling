const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SAO_PAULO_OFFSET = "-03:00";

function endOfSaoPauloDay(datePart) {
  return new Date(`${datePart}T23:59:59.999${SAO_PAULO_OFFSET}`);
}

function isLegacyMidnightUtc(date) {
  return date instanceof Date
    && Number.isFinite(date.getTime())
    && date.getUTCHours() === 0
    && date.getUTCMinutes() === 0
    && date.getUTCSeconds() === 0
    && date.getUTCMilliseconds() === 0;
}

function normalizeMissionDueDate(date) {
  if (!isLegacyMidnightUtc(date)) return date;
  return endOfSaoPauloDay(date.toISOString().slice(0, 10));
}

function parseMissionDueDate(value) {
  if (!value) return endOfSaoPauloDay(new Date().toISOString().slice(0, 10));

  if (value instanceof Date) {
    return normalizeMissionDueDate(value);
  }

  const text = String(value).trim();
  if (DATE_ONLY_PATTERN.test(text)) {
    return endOfSaoPauloDay(text);
  }

  const parsed = new Date(text);
  if (!Number.isFinite(parsed.getTime())) {
    return endOfSaoPauloDay(new Date().toISOString().slice(0, 10));
  }

  return normalizeMissionDueDate(parsed);
}

function isMissionExpired(value) {
  const dueDate = parseMissionDueDate(value);
  return Number.isFinite(dueDate.getTime()) && dueDate.getTime() < Date.now();
}

module.exports = {
  parseMissionDueDate,
  isMissionExpired
};
