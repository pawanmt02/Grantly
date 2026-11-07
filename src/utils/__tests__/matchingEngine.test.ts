import { describe, it, expect } from 'vitest';
import { calculateMatchScore, formatDaysRemaining } from '../matchingEngine';
import { mockScholarships, initialProfile } from '../../data/scholarships';

describe('Matching Engine', () => {
  it('calculates higher match score for students meeting all criteria', () => {
    const googleScholarship = mockScholarships[0]; // CS Undergraduate
    const result = calculateMatchScore(googleScholarship, initialProfile);

    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.verdict).toBe('Exceptional Match');
    expect(result.breakdown.length).toBeGreaterThan(0);
  });

  it('correctly handles GPA under minimum cutoff', () => {
    const goldwater = mockScholarships.find(s => s.minGpa >= 3.7)!;
    const lowGpaProfile = { ...initialProfile, gpa: 2.5 };
    const result = calculateMatchScore(goldwater, lowGpaProfile);

    const gpaBreakdown = result.breakdown.find(b => b.factor.includes('GPA'));
    expect(gpaBreakdown?.matched).toBe(false);
  });

  it('awards bonus points for first-generation students on eligible scholarships', () => {
    const dellScholarship = mockScholarships.find(s => s.id === 'sch-5')!;
    const firstGenProfile = { ...initialProfile, firstGen: true };
    const nonFirstGenProfile = { ...initialProfile, firstGen: false };

    const scoreFirstGen = calculateMatchScore(dellScholarship, firstGenProfile).score;
    const scoreNonFirstGen = calculateMatchScore(dellScholarship, nonFirstGenProfile).score;

    expect(scoreFirstGen).toBeGreaterThanOrEqual(scoreNonFirstGen);
  });
});

describe('formatDaysRemaining', () => {
  it('correctly labels imminent deadlines', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const result = formatDaysRemaining(dateStr);
    expect(result.isUrgent).toBe(true);
  });
});
