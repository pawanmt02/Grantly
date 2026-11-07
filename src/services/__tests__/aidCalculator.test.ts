import { describe, it, expect } from 'vitest';
import { AidCalculatorService } from '../aidCalculatorService';

describe('AidCalculatorService', () => {
  it('identifies maximum aid eligibility for low income households', () => {
    const result = AidCalculatorService.calculateSai({
      parentHouseholdIncome: 25000,
      familySize: 4,
      studentSavings: 500,
      parentAssets: 1000,
      costOfAttendance: 28000,
    });

    expect(result.estimatedSai).toBeLessThanOrEqual(0);
    expect(result.pellGrantEligibility).toBe(7395);
    expect(result.needCategory).toBe('Maximum Aid Eligible');
    expect(result.aidGap).toBeGreaterThan(0);
  });

  it('calculates moderate need for middle-income students', () => {
    const result = AidCalculatorService.calculateSai({
      parentHouseholdIncome: 75000,
      familySize: 4,
      studentSavings: 2000,
      parentAssets: 25000,
      costOfAttendance: 35000,
    });

    expect(result.estimatedSai).toBeGreaterThan(0);
    expect(result.demonstratedFinancialNeed).toBeGreaterThan(0);
  });
});
