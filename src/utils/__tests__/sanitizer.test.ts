import { describe, it, expect } from 'vitest';
import { sanitizeHtml, stripHtml, sanitizeGpa, sanitizeCurrency, isValidEmail, sanitizeUrl } from '../sanitizer';

describe('Data Sanitizer and Security', () => {
  it('escapes unsafe HTML entities to mitigate XSS injections', () => {
    const malicious = '<script>alert("xss")</script>';
    const safe = sanitizeHtml(malicious);
    expect(safe).not.toContain('<script>');
    expect(safe).toContain('&lt;script&gt;');
  });

  it('strips all HTML tags in plain text cleaner', () => {
    const richText = '<b>Important</b> <p>notice</p>';
    expect(stripHtml(richText)).toBe('Important notice');
  });

  it('clamps GPA safely between 0.0 and 4.0', () => {
    expect(sanitizeGpa(4.5)).toBe(4.0);
    expect(sanitizeGpa(-1.2)).toBe(0.0);
    expect(sanitizeGpa('3.75')).toBe(3.75);
    expect(sanitizeGpa('invalid')).toBe(0.0);
  });

  it('sanitizes currency strings and numbers', () => {
    expect(sanitizeCurrency('$12,500')).toBe(12500);
    expect(sanitizeCurrency(-500)).toBe(0);
  });

  it('validates email formats reliably', () => {
    expect(isValidEmail('student@university.edu')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('blocks unsafe javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
    expect(sanitizeUrl('https://buildyourfuture.withgoogle.com')).toBe('https://buildyourfuture.withgoogle.com');
  });
});
