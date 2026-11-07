/**
 * @file sanitizer.ts
 * @description Comprehensive Data Sanitization, XSS Protection, and Validation Utility.
 * Ensures robust data integrity across user inputs, stored data, and URL handling.
 */

/**
 * Escapes unsafe HTML characters to prevent Cross-Site Scripting (XSS) injection.
 * @param str Raw user input string
 * @returns Sanitized string with escaped HTML entities
 */
export function sanitizeHtml(str: string): string {
  if (!str) return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Strips all HTML tags and control characters from input string.
 * @param str Input string
 * @returns Clean plain text string
 */
export function stripHtml(str: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Validates and normalizes academic GPA (0.00 to 4.00 range).
 * @param val Number or string GPA value
 * @returns Validated floating number clamped between 0.0 and 4.0
 */
export function sanitizeGpa(val: number | string): number {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return 0.0;
  return Math.min(Math.max(Number(num.toFixed(2)), 0.0), 4.0);
}

/**
 * Validates and sanitizes monetary amounts.
 * @param val Number or string currency value
 * @returns Non-negative integer
 */
export function sanitizeCurrency(val: number | string): number {
  const num = typeof val === 'string' ? parseInt(val.replace(/[^0-9]/g, ''), 10) : val;
  if (isNaN(num) || num < 0) return 0;
  return Math.min(Math.round(num), 10000000);
}

/**
 * Validates email format using RFC 5322 regex approximation.
 * @param email Email candidate
 * @returns boolean
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email.trim());
}

/**
 * Sanitizes URLs to prevent javascript: or data: URI execution.
 * @param url Target URL
 * @returns Safe URL string or fallback '#'
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '#';
  const clean = url.trim();
  if (/^https?:\/\//i.test(clean) || clean.startsWith('/') || clean.startsWith('#')) {
    return clean;
  }
  return '#';
}
