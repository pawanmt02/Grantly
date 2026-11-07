import React from 'react';
import { 
  Scale, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Send,
  Zap
} from 'lucide-react';
import { Scholarship, UserProfile } from '../types';
import { calculateMatchScore, formatDaysRemaining } from '../utils/matchingEngine';

interface ComparisonViewProps {
  compareIds: string[];
  scholarships: Scholarship[];
  profile: UserProfile;
  onRemoveFromCompare: (id: string) => void;
  onSelectScholarship: (scholarship: Scholarship) => void;
  onQuickApply: (scholarship: Scholarship) => void;
  onBrowseMore: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  compareIds,
  scholarships,
  profile,
  onRemoveFromCompare,
  onSelectScholarship,
  onQuickApply,
  onBrowseMore,
}) => {
  const selectedScholarships = compareIds
    .map(id => scholarships.find(s => s.id === id))
    .filter(Boolean) as Scholarship[];

  if (selectedScholarships.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No Scholarships in Comparison Matrix
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Click the balance scale icon on any scholarship card in "Discover" to compare funding terms, acceptance odds, and required effort side-by-side.
        </p>
        <button
          onClick={onBrowseMore}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs"
        >
          Browse Opportunities to Compare
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Comparison Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
              <Scale className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Opportunity Trade-off & ROI Matrix
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comparing <strong className="text-slate-900 dark:text-white">{selectedScholarships.length}</strong> opportunities against your profile and time budget.
          </p>
        </div>

        <button
          onClick={onBrowseMore}
          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
        >
          + Add another opportunity
        </button>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <th className="p-4 w-48 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
                Criteria
              </th>
              {selectedScholarships.map(s => (
                <th key={s.id} className="p-4 min-w-[220px] font-bold text-slate-900 dark:text-white">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold line-clamp-1">{s.title}</span>
                    <button
                      onClick={() => onRemoveFromCompare(s.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500"
                      title="Remove from matrix"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] font-normal text-slate-500 mt-0.5">{s.provider}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            
            {/* Match Score */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="p-4 font-bold text-slate-900 dark:text-white">
                Grantly Match Fit
              </td>
              {selectedScholarships.map(s => {
                const match = calculateMatchScore(s, profile);
                return (
                  <td key={s.id} className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${match.badgeColor}`}>
                      <Sparkles className="w-3 h-3" />
                      {match.score}% ({match.verdict})
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Award Amount */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="p-4 font-bold text-slate-900 dark:text-white">
                Funding Award
              </td>
              {selectedScholarships.map(s => (
                <td key={s.id} className="p-4 font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                  {s.formattedAmount}
                </td>
              ))}
            </tr>

            {/* Renewable Status */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="p-4 font-bold text-slate-900 dark:text-white">
                Multi-Year Renewal
              </td>
              {selectedScholarships.map(s => (
                <td key={s.id} className="p-4">
                  {s.isRenewable ? (
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Renewable Every Year
                    </span>
                  ) : (
                    <span className="text-slate-500">One-Time Lump Sum</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Application Deadline */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="p-4 font-bold text-slate-900 dark:text-white">
                Deadline
              </td>
              {selectedScholarships.map(s => {
                const d = formatDaysRemaining(s.deadline);
                return (
                  <td key={s.id} className="p-4">
                    <span className={`font-semibold ${d.isUrgent ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                      {s.deadline} ({d.text})
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Acceptance Difficulty */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="p-4 font-bold text-slate-900 dark:text-white">
                Acceptance Rate
              </td>
              {selectedScholarships.map(s => (
                <td key={s.id} className="p-4 font-semibold">
                  {s.acceptanceRate}
                </td>
              ))}
            </tr>

            {/* Estimated Effort */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="p-4 font-bold text-slate-900 dark:text-white">
                Effort Required
              </td>
              {selectedScholarships.map(s => (
                <td key={s.id} className="p-4">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                    {s.effortEstimate}
                  </span>
                </td>
              ))}
            </tr>

            {/* Required Essays & Letters */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="p-4 font-bold text-slate-900 dark:text-white">
                Required Submissions
              </td>
              {selectedScholarships.map(s => (
                <td key={s.id} className="p-4 space-y-1">
                  <div>• {s.requirements.essaysCount} Essays</div>
                  <div>• {s.requirements.recommendationsCount} Letters of Rec</div>
                  {s.requirements.requiresPortfolio && <div>• Creative Portfolio</div>}
                  {s.requirements.requiresFafsaOrNeed && <div>• FAFSA / Financial Aid SAR</div>}
                </td>
              ))}
            </tr>

            {/* Minimum GPA */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="p-4 font-bold text-slate-900 dark:text-white">
                Minimum GPA
              </td>
              {selectedScholarships.map(s => (
                <td key={s.id} className="p-4 font-medium">
                  {s.minGpa > 0 ? `${s.minGpa.toFixed(1)}+` : 'None required'}
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr className="bg-slate-50 dark:bg-slate-800/60">
              <td className="p-4 font-bold text-slate-900 dark:text-white">
                Action
              </td>
              {selectedScholarships.map(s => (
                <td key={s.id} className="p-4 space-y-2">
                  <button
                    onClick={() => onQuickApply(s)}
                    className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Apply Now
                  </button>
                  <button
                    onClick={() => onSelectScholarship(s)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors"
                  >
                    View Details
                  </button>
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
};
