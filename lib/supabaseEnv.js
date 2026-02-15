export function normalizeSupabaseUrl(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value.trim().replace(/\/+$/, '');
}

export function isValidSupabaseUrl(value) {
  const normalized = normalizeSupabaseUrl(value);

  if (!normalized) {
    return false;
  }

  try {
    const url = new URL(normalized);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}