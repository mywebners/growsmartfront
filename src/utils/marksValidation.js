export const MARK_MIN = 33;
export const MARK_MAX = 100;

export function parseMark(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

export function isMarkFieldInvalid(value) {
  if (value === "" || value == null) return false;
  const n = parseMark(value);
  return !Number.isFinite(n) || n < MARK_MIN || n > MARK_MAX;
}

export function isMarkValid(value) {
  const n = parseMark(value);
  return Number.isFinite(n) && n >= MARK_MIN && n <= MARK_MAX;
}
