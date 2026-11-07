import React from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  GraduationCap, 
  Send, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Scale, 
  Lightbulb, 
  ShieldCheck,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Scholarship, UserProfile, TrackedApplication, VaultDocument, ApplicationStatus } from '../types';
import { calculateMatchScore, formatDaysRemaining } from '../utils/matchingEngine';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
  profile: UserProfile;
  trackedApp?: TrackedApplication;
  onUpdateTrackStatus: (scholarshipId: string, status: ApplicationStatus) => void;
  onToggleTrack: (scholarship: Scholarship) => void;
  onQuickApply: (scholarship: Scholarship) => void;
  onStartEssayDraft: (prompt: string, scholarshipTitle: string) => void;
  vaultDocs: VaultDocument[];
  isComparing: boolean;
  onToggleCompare: (id: string) => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  onClose,
  profile,
  trackedApp,
  onUpdateTrackStatus,
  onToggleTrack,
  onQuickApply,
  onStartEssayDraft,
  vaultDocs,
  isComparing,
  onToggleCompare,
}) => {
  if (!scholarship) return null;

  const matchResult = calculateMatchScore(scholarship, profile);
  const deadlineInfo = formatDaysRemaining(scholarship.deadline);
  const isTracked = !!trackedApp;

  // Audit readiness against vault
  const hasTranscript = vaultDocs.some(d => d.type === 'transcript');
  const hasResume = vaultDocs.some(d => d.type === 'resume');
  const hasEssay = vaultDocs.some(d => d.type === 'essay');
  const hasLOR = vaultDocs.some(d => d.type === 'lor');
  const hasFinancial = vaultDocs.some(d => d.type === 'financial');
  const hasPortfolio = vaultDocs.some(d => d.type === 'portfolio');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Provider and Title */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${scholarship.providerLogoBg}`} />
                <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300">
                  {scholarship.provider} • {scholarship.location}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {scholarship.category}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {scholarship.title}
              </h2>
            </div>

            {/* Award Amount & Match Score */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {scholarship.formattedAmount}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{matchResult.score}% Match ({matchResult.verdict})</span>
              </div>
            </div>

          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Application Deadline</span>
              <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {scholarship.deadline} ({deadlineInfo.text})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Acceptance Rate</span>
              <span className="font-semibold text-white mt-0.5 block">{scholarship.acceptanceRate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Estimated Effort</span>
              <span className="font-semibold text-white mt-0.5 block">{scholarship.effortEstimate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Award Type</span>
              <span className="font-semibold text-white mt-0.5 block">
                {scholarship.isRenewable ? 'Multi-Year Renewable' : 'One-Time Lump Sum'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          
          {/* 1. Transparent Match Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Transparent Match Breakdown
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Score: <strong className="text-indigo-600 dark:text-indigo-400">{matchResult.score}/100</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {matchResult.breakdown.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    item.matched 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/50 text-slate-700 dark:text-slate-200'
                      : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/50 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {item.matched ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>{item.factor}</span>
                      <span className="text-[11px] opacity-75">{item.points}/{item.maxPoints} pts</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Description & Opportunity Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              About This Opportunity
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {scholarship.description}
            </p>
          </div>

          {/* 3. Document Readiness Audit against Vault */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Document Vault Readiness Check
              </h3>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Auto-audited from your Vault
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              
              {/* Transcript */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                hasTranscript 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}>
                <span>Transcript:</span>
                <span className="font-bold">{hasTranscript ? '✓ Ready' : 'Needed'}</span>
              </div>

              {/* Essays */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                hasEssay 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              }`}>
                <span>{scholarship.requirements.essaysCount} Essays:</span>
                <span className="font-bold">{hasEssay ? 'Draft Ready' : 'Needed'}</span>
              </div>

              {/* Recommendations */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                hasLOR 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}>
                <span>{scholarship.requirements.recommendationsCount} Rec Letters:</span>
                <span className="font-bold">{hasLOR ? '✓ 1 on File' : 'Needed'}</span>
              </div>

              {/* Financial Form */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                scholarship.requirements.requiresFafsaOrNeed && !hasFinancial
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              }`}>
                <span>Financial SAR:</span>
                <span className="font-bold">{hasFinancial ? '✓ Ready' : (scholarship.requirements.requiresFafsaOrNeed ? 'Needed' : 'N/A')}</span>
              </div>

            </div>
          </div>

          {/* 4. Essay Prompts & Brainstorm with AI Button */}
          {scholarship.essayPrompts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Required Essay Prompts
              </h3>

              <div className="space-y-2">
                {scholarship.essayPrompts.map((prompt, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                        Prompt {idx + 1}
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed">
                        "{prompt}"
                      </p>
                    </div>

                    <button
                      onClick={() => onStartEssayDraft(prompt, scholarship.title)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Brainstorm with AI
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Official Website & Notes */}
          <div className="flex items-center justify-between p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300">
            <span>Verified Institutional Program</span>
            <a 
              href={scholarship.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              Visit Official Application Portal <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Compare Button */}
            <button
              onClick={() => onToggleCompare(scholarship.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                isComparing 
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isComparing ? 'In Compare Matrix' : 'Compare'}</span>
            </button>

            {/* Tracker status changer or Add to Tracker */}
            {isTracked ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">Status:</span>
                <select
                  value={trackedApp?.status || 'considering'}
                  onChange={(e) => onUpdateTrackStatus(scholarship.id, e.target.value as ApplicationStatus)}
                  className="text-xs font-semibold rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3 py-2 focus:outline-hidden"
                >
                  <option value="considering">Considering</option>
                  <option value="preparing">Preparing Documents</option>
                  <option value="submitted">Submitted</option>
                  <option value="interview">Interview Scheduled</option>
                  <option value="awarded">Awarded ($$$)</option>
                  <option value="rejected">Not Selected</option>
                </select>
              </div>
            ) : (
              <button
                onClick={() => onToggleTrack(scholarship)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Bookmark className="w-4 h-4 text-indigo-600" />
                <span>Save to Pipeline</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
            >
              Back to Discover
            </button>

            <button
              onClick={() => onQuickApply(scholarship)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-500/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Streamlined One-Click Apply</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
