// ============================================
// FILE: src/utils/urlUtils.js
// ============================================

/**
 * URL utility functions
 */

export const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Hash function using polynomial rolling hash
 * Time Complexity: O(n) where n is string length
 * @param {string} url - URL to hash
 * @returns {number} - Hash value
 */
export const hashUrl = (url) => {
  let hash = 0;
  const prime = 31;
  for (let i = 0; i < url.length; i++) {
    hash = (hash * prime + url.charCodeAt(i)) % 1000000;
  }
  return hash;
};

/**
 * Convert number to Base62 encoding
 * Time Complexity: O(log(num))
 * @param {number} num - Number to convert
 * @returns {string} - Base62 encoded string
 */
export const toBase62 = (num) => {
  if (num === 0) return BASE62[0];
  let result = '';
  while (num > 0) {
    result = BASE62[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result.padStart(6, '0');
};

/**
 * Generate short code from URL
 * @param {string} url - URL to generate code for
 * @returns {string} - Short code
 */
export const generateShortCode = (url) => {
  const hash = hashUrl(url);
  const timestamp = Date.now() % 1000000;
  const combined = (hash + timestamp) % 56800235584; // 62^6
  return toBase62(combined);
};

/**
 * Validate custom code format - Enhanced version
 * @param {string} code - Custom code to validate
 * @returns {boolean} - True if valid
 */
export const isValidCustomCode = (code) => {
  // Allow: 3 to 20 characters
  // Allow: letters (a-z, A-Z), numbers (0-9), hyphens (-), underscores (_)
  // Must start and end with letter or number (no hyphens/underscores at ends)
  return /^[a-zA-Z0-9][a-zA-Z0-9_-]{1,38}[a-zA-Z0-9]$/.test(code);
};

/**
 * Check if URL is expired
 * @param {object} url - URL object with expiresAt property
 * @returns {boolean} - True if expired
 */
export const isExpired = (url) => {
  if (!url.expiresAt) return false;
  return new Date() > new Date(url.expiresAt);
};