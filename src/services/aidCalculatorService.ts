/**
 * @file aidCalculatorService.ts
 * @description Federal Student Aid Index (SAI) & Pell Grant estimator service.
 * Models the US Department of Education FAFSA Simplification Act calculation.
 */

export interface SaiCalculationInput {
  parentHouseholdIncome: number;
  familySize: number;
  studentSavings: number;
  parentAssets: number;
  costOfAttendance: number; // e.g. $28,000 avg public / $55,000 private
}

export interface SaiCalculationResult {
  estimatedSai: number;
  pellGrantEligibility: number; // Max ~$7,395
  subsidizedLoanEligibility: number;
  demonstratedFinancialNeed: number;
  aidGap: number;
  needCategory: 'Maximum Aid Eligible' | 'Moderate Need' | 'Self-Funded / Merit Focus';
}

export class AidCalculatorService {
  /**
   * Estimates the Student Aid Index and Federal Need.
   */
  static calculateSai(input: SaiCalculationInput): SaiCalculationResult {
    const { parentHouseholdIncome, familySize, studentSavings, parentAssets, costOfAttendance } = input;

    // Income Protection Allowance (IPA) benchmark based on family size
    const baseIpa = 30000 + (familySize - 2) * 6000;
    
    // Discretionary income calculation
    const discretionaryIncome = Math.max(0, parentHouseholdIncome - baseIpa);

    // If family income is below protection allowance, maximum federal aid applies (SAI <= 0)
    let estimatedSai = 0;
    if (discretionaryIncome === 0 && parentHouseholdIncome <= baseIpa) {
      estimatedSai = 0;
    } else {
      const parentContribution = Math.round(discretionaryIncome * 0.22 + Math.max(0, parentAssets - 10000) * 0.05);
      const studentContribution = Math.round(studentSavings * 0.20);
      const rawSai = parentContribution + studentContribution;
      estimatedSai = Math.max(-1500, Math.min(rawSai, 100000));
    }

    // Federal Pell Grant eligibility (maximum ~$7,395 for 2026-27)
    let pellGrantEligibility = 0;
    if (estimatedSai <= 0) {
      pellGrantEligibility = 7395;
    } else if (estimatedSai < 6000) {
      pellGrantEligibility = Math.round(Math.max(750, 7395 - estimatedSai * 1.1));
    }

    // Direct Subsidized Federal Loans (typically up to $3,500 - $5,500)
    const subsidizedLoanEligibility = estimatedSai < 15000 ? 4500 : 0;

    // Financial Need = Cost of Attendance (COA) - SAI
    const demonstratedFinancialNeed = Math.max(0, costOfAttendance - estimatedSai);
    const aidGap = Math.max(0, demonstratedFinancialNeed - pellGrantEligibility - subsidizedLoanEligibility);

    let needCategory: SaiCalculationResult['needCategory'] = 'Self-Funded / Merit Focus';
    if (estimatedSai <= 0) {
      needCategory = 'Maximum Aid Eligible';
    } else if (estimatedSai < 12000) {
      needCategory = 'Moderate Need';
    }

    return {
      estimatedSai,
      pellGrantEligibility,
      subsidizedLoanEligibility,
      demonstratedFinancialNeed,
      aidGap,
      needCategory,
    };
  }
}
