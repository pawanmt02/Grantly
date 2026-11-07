import { Scholarship, UserProfile, MatchResult } from '../types';

export function calculateMatchScore(scholarship: Scholarship, profile: UserProfile): MatchResult {
  const breakdown: MatchResult['breakdown'] = [];
  let totalPoints = 0;
  const maxPossible = 100;

  // 1. Education Level (25 points)
  const eduMatched = scholarship.educationLevel.includes(profile.educationLevel);
  const eduPoints = eduMatched ? 25 : 0;
  breakdown.push({
    factor: 'Education Level',
    matched: eduMatched,
    points: eduPoints,
    maxPoints: 25,
    description: eduMatched 
      ? `Eligible for ${profile.educationLevel} students`
      : `Requires: ${scholarship.educationLevel.join(', ')} (You are ${profile.educationLevel})`,
  });
  totalPoints += eduPoints;

  // 2. GPA Requirement (25 points)
  const gpaMatched = profile.gpa >= scholarship.minGpa;
  let gpaPoints = 0;
  let gpaDesc = '';
  if (scholarship.minGpa === 0) {
    gpaPoints = 25;
    gpaDesc = 'No minimum GPA required';
  } else if (gpaMatched) {
    // Bonus if GPA is well above cutoff
    gpaPoints = 25;
    gpaDesc = `Your GPA (${profile.gpa.toFixed(2)}) surpasses the ${scholarship.minGpa.toFixed(2)} cutoff`;
  } else {
    // Partial points if within 0.2
    const diff = scholarship.minGpa - profile.gpa;
    if (diff <= 0.25) {
      gpaPoints = 10;
      gpaDesc = `Close to cutoff (${profile.gpa.toFixed(2)} vs ${scholarship.minGpa.toFixed(2)} min)`;
    } else {
      gpaPoints = 0;
      gpaDesc = `Below minimum GPA (${profile.gpa.toFixed(2)} vs ${scholarship.minGpa.toFixed(2)} required)`;
    }
  }
  breakdown.push({
    factor: 'Academic Record (GPA)',
    matched: gpaMatched || scholarship.minGpa === 0,
    points: gpaPoints,
    maxPoints: 25,
    description: gpaDesc,
  });
  totalPoints += gpaPoints;

  // 3. Field of Study / Major (20 points)
  const anyMajor = scholarship.eligibleMajors.includes('All Majors') || scholarship.eligibleMajors.length === 0;
  const majorMatched = anyMajor || scholarship.eligibleMajors.some(m => 
    profile.major.toLowerCase().includes(m.toLowerCase()) || 
    m.toLowerCase().includes(profile.major.toLowerCase())
  );
  const majorPoints = majorMatched ? 20 : (anyMajor ? 20 : 0);
  breakdown.push({
    factor: 'Field of Study',
    matched: majorMatched,
    points: majorPoints,
    maxPoints: 20,
    description: anyMajor 
      ? 'Open to all academic majors'
      : majorMatched 
        ? `Directly matches your field: ${profile.major}`
        : `Prefers: ${scholarship.eligibleMajors.slice(0, 3).join(', ')}`,
  });
  totalPoints += majorPoints;

  // 4. Citizenship & Residency (15 points)
  const citizenshipMatched = scholarship.citizenship.includes('Any') || 
    scholarship.citizenship.includes(profile.citizenship);
  const citizenshipPoints = citizenshipMatched ? 15 : 0;
  breakdown.push({
    factor: 'Citizenship / Residency',
    matched: citizenshipMatched,
    points: citizenshipPoints,
    maxPoints: 15,
    description: citizenshipMatched 
      ? `Qualifies under ${profile.citizenship} status` 
      : `Requires: ${scholarship.citizenship.join(', ')}`,
  });
  totalPoints += citizenshipPoints;

  // 5. Equity / Need / Background Fit (15 points)
  let equityPoints = 0;
  const equityFactors: string[] = [];
  
  if (scholarship.firstGenBonus && profile.firstGen) {
    equityPoints += 8;
    equityFactors.push('First-generation college student bonus');
  } else if (!scholarship.firstGenBonus) {
    equityPoints += 5;
  }

  if (scholarship.financialNeedBonus && profile.financialNeed === 'High') {
    equityPoints += 7;
    equityFactors.push('High demonstrated financial need alignment');
  } else if (profile.financialNeed === 'Medium') {
    equityPoints += 5;
  } else {
    equityPoints += 3;
  }

  equityPoints = Math.min(equityPoints, 15);
  breakdown.push({
    factor: 'Demographic & Financial Need Alignment',
    matched: equityPoints >= 10,
    points: equityPoints,
    maxPoints: 15,
    description: equityFactors.length > 0 
      ? equityFactors.join(' • ') 
      : 'Standard eligibility criteria applied',
  });
  totalPoints += equityPoints;

  // Normalize to 100
  const finalScore = Math.min(Math.round(totalPoints), 100);

  let verdict: MatchResult['verdict'] = 'Reach / Partial';
  let badgeColor = 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';

  if (finalScore >= 85) {
    verdict = 'Exceptional Match';
    badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
  } else if (finalScore >= 70) {
    verdict = 'Strong Match';
    badgeColor = 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60';
  } else if (finalScore >= 50) {
    verdict = 'Good Match';
    badgeColor = 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60';
  }

  return {
    score: finalScore,
    verdict,
    badgeColor,
    breakdown,
  };
}

export function formatDaysRemaining(deadlineDateStr: string): { days: number; text: string; isUrgent: boolean } {
  const deadline = new Date(deadlineDateStr);
  const today = new Date();
  
  // Set both to midnight UTC for stable date arithmetic
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { days: diffDays, text: 'Deadline Passed', isUrgent: false };
  } else if (diffDays === 0) {
    return { days: 0, text: 'Due Today!', isUrgent: true };
  } else if (diffDays === 1) {
    return { days: 1, text: 'Due Tomorrow', isUrgent: true };
  } else if (diffDays <= 7) {
    return { days: diffDays, text: `${diffDays} days left`, isUrgent: true };
  } else {
    return { days: diffDays, text: `${diffDays} days left`, isUrgent: false };
  }
}
