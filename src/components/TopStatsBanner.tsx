import React from 'react';
import { 
  Trophy, 
  Clock, 
  Send, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { UserProfile, TrackedApplication, Scholarship } from '../types';
import { formatDaysRemaining } from '../utils/matchingEngine';

interface TopStatsBannerProps {
  profile: UserProfile;
  trackedApps: Record<string, TrackedApplication>;
  scholarships: Scholarship[];
  onOpenProfile: () => void;
  onExploreUrgent: (scholarshipId: string) => void;
}

export const TopStatsBanner: React.FC<TopStatsBannerProps> = ({
  profile,
  trackedApps,
  scholarships,
  onOpenProfile,
  onExploreUrgent,
}) => {
  const trackedList = Object.values(trackedApps);
  
  const totalWon = trackedList
    .filter(t => t.status === 'awarded')
    .reduce((sum, t) => {
      const sch = scholarships.find(s => s.id === t.scholarshipId);
      return sum + (t.awardedAmount || sch?.amount || 0);
    }, 0);

  const totalInPipeline = trackedList
    .filter(t => ['considering', 'preparing', 'submitted', 'interview'].includes(t.status))
    .reduce((sum, t) => {
      const sch = scholarships.find(s => s.id === t.scholarshipId);
      return sum + (sch?.amount || 0);
    }, 0);

  const percentGoal = Math.min(Math.round((totalWon / (profile.targetFunding || 1)) * 100), 100);

  // Find most urgent deadline among scholarships
  const urgentScholarship = [...scholarships]
    .map(s => ({
      scholarship: s,
      deadlineInfo: formatDaysRemaining(s.deadline)
    }))
    .filter(item => item.deadlineInfo.days >= 0)
    .sort((a, b) => a.deadlineInfo.days - b.deadlineInfo.days)[0];

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-950 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* Top welcome + profile overview bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-indigo-800/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Adaptive Discovery Engine Active
              </span>
              <span className="text-xs text-indigo-300 hidden sm:inline">
                Personalized for {profile.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Your Scholarship & Financial Assistance Roadmap
            </h1>
          </div>

          {/* Profile Match Indicators */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              {profile.educationLevel}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
              GPA: <strong className="text-emerald-400">{profile.gpa.toFixed(2)}</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
              {profile.major}
            </span>
            {profile.firstGen && (
              <span className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200 font-medium">
                First-Gen Scholar
              </span>
            )}
            <button
              onClick={onOpenProfile}
              className="px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors flex items-center gap-1 shadow-sm"
            >
              Adjust Profile <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
          
          {/* 1. Target Progress */}
          <div className="bg-slate-900/70 backdrop-blur-xs rounded-xl p-3.5 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Financial Aid Target</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-white">
              ${profile.targetFunding.toLocaleString()}
            </div>
            <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${percentGoal}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>{percentGoal}% Funded</span>
              <span className="text-emerald-400 font-semibold">${totalWon.toLocaleString()} Won</span>
            </div>
          </div>

          {/* 2. Total In Pipeline */}
          <div className="bg-slate-900/70 backdrop-blur-xs rounded-xl p-3.5 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Potential in Pipeline</span>
              <Send className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-indigo-300">
              ${totalInPipeline.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Across <strong className="text-slate-200">{trackedList.length}</strong> active tracked opportunities
            </div>
          </div>

          {/* 3. Next Imminent Deadline */}
          <div className="bg-slate-900/70 backdrop-blur-xs rounded-xl p-3.5 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Next Approaching Deadline</span>
              <Clock className="w-4 h-4 text-rose-400" />
            </div>
            {urgentScholarship ? (
              <div>
                <div className="text-sm font-bold text-rose-300 truncate" title={urgentScholarship.scholarship.title}>
                  {urgentScholarship.scholarship.title}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {urgentScholarship.deadlineInfo.text}
                  </span>
                  <button
                    onClick={() => onExploreUrgent(urgentScholarship.scholarship.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">All applications clear!</div>
            )}
          </div>

          {/* 4. Document Readiness */}
          <div className="bg-slate-900/70 backdrop-blur-xs rounded-xl p-3.5 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Vault Readiness</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-lg sm:text-2xl font-extrabold text-emerald-400">
                83%
              </div>
              <span className="text-xs text-slate-400">Application Ready</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
              <span>5 Verified Assets</span>
              <span className="text-emerald-400 font-medium">Ready to Apply</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
