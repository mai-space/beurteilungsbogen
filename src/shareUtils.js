/**
 * Encode grading state into a URL-safe base64 string.
 * @param {object} state - { name: string, grades: Record<id, number> }
 * @returns {string} base64url-encoded JSON
 */
export function encodeState(state) {
  const json = JSON.stringify(state);
  return btoa(
    encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode('0x' + p1)
    )
  );
}

/**
 * Decode a base64url string back into grading state.
 * @param {string} encoded
 * @returns {object|null}
 */
export function decodeState(encoded) {
  try {
    const json = decodeURIComponent(
      atob(encoded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Build a shareable URL containing encoded state in the hash.
 * @param {object} state
 * @returns {string}
 */
export function buildShareUrl(state) {
  const encoded = encodeState(state);
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#share=${encoded}`;
}

/**
 * Parse the current URL hash to extract shared state, if present.
 * @returns {object|null}
 */
export function parseShareUrl() {
  const hash = window.location.hash;
  const match = hash.match(/^#share=(.+)$/);
  if (!match) return null;
  return decodeState(match[1]);
}
