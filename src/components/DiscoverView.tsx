import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  Scale, 
  SlidersHorizontal,
  GraduationCap,
  Zap
} from 'lucide-react';
import { Scholarship, UserProfile, Category, TrackedApplication } from '../types';
import { calculateMatchScore, formatDaysRemaining } from '../utils/matchingEngine';
import { useDebounce } from '../hooks/useDebounce';

interface DiscoverViewProps {
  scholarships: Scholarship[];
  profile: UserProfile;
  trackedApps: Record<string, TrackedApplication>;
  onSelectScholarship: (scholarship: Scholarship) => void;
  onToggleTrack: (scholarship: Scholarship) => void;
  onQuickApply: (scholarship: Scholarship) => void;
  compareList: string[];
  onToggleCompare: (scholarshipId: string) => void;
}

const CATEGORIES: Category[] = [
  'All',
  'STEM',
  'Need-based',
  'Merit',
  'Underrepresented',
  'Arts & Humanities',
  'International',
  'Leadership',
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  scholarships,
  profile,
  trackedApps,
  onSelectScholarship,
  onToggleTrack,
  compareList,
  onToggleCompare,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 250);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<'match' | 'amount' | 'deadline' | 'effort'>('match');
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);
  const [onlyRenewable, setOnlyRenewable] = useState(false);
  const [onlyEligible, setOnlyEligible] = useState(false);

  // Compute matches and filter
  const processedScholarships = useMemo(() => {
    return scholarships.map((scholarship) => {
      const matchResult = calculateMatchScore(scholarship, profile);
      const deadlineInfo = formatDaysRemaining(scholarship.deadline);
      const isTracked = !!trackedApps[scholarship.id];
      const isComparing = compareList.includes(scholarship.id);
      return {
        ...scholarship,
        matchResult,
        deadlineInfo,
        isTracked,
        isComparing,
      };
    });
  }, [scholarships, profile, trackedApps, compareList]);

  const filteredScholarships = useMemo(() => {
    return processedScholarships
      .filter((s) => {
        // Debounced search query
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.toLowerCase();
          const matchesTitle = s.title.toLowerCase().includes(q);
          const matchesProvider = s.provider.toLowerCase().includes(q);
          const matchesTags = s.tags.some((t) => t.toLowerCase().includes(q));
          const matchesMajors = s.eligibleMajors.some((m) => m.toLowerCase().includes(q));
          if (!matchesTitle && !matchesProvider && !matchesTags && !matchesMajors) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && s.category !== selectedCategory) {
          return false;
        }

        // Min Match Filter
        if (s.matchResult.score < minMatchFilter) {
          return false;
        }

        // Renewable filter
        if (onlyRenewable && !s.isRenewable) {
          return false;
        }

        // Only fully eligible filter
        if (onlyEligible && s.matchResult.score < 70) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return b.matchResult.score - a.matchResult.score;
        }
        if (sortBy === 'amount') {
          return b.amount - a.amount;
        }
        if (sortBy === 'deadline') {
          return a.deadlineInfo.days - b.deadlineInfo.days;
        }
        if (sortBy === 'effort') {
          const effortRank = { 'Low (1-2 hrs)': 1, 'Medium (3-5 hrs)': 2, 'High (6+ hrs)': 3 };
          return effortRank[a.effortEstimate] - effortRank[b.effortEstimate];
        }
        return 0;
      });
  }, [processedScholarships, debouncedSearch, selectedCategory, sortBy, minMatchFilter, onlyRenewable, onlyEligible]);

  const topMatchCount = processedScholarships.filter((s) => s.matchResult.score >= 80).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" role="region" aria-label="Scholarship Discovery Directory">
      
      {/* Live Accessibility Status Announcer for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        Showing {filteredScholarships.length} scholarships matching your search criteria.
      </div>

      {/* AI Recommendation Highlight Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-200/60 dark:border-indigo-800/60 rounded-2xl p-5 sm:p-6 backdrop-blur-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Intelligent Profile Analysis
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {topMatchCount} High-Affinity Matches Found
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
              Curated for {profile.major} • {profile.educationLevel}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Grantly’s live eligibility engine mapped your GPA ({profile.gpa.toFixed(2)}) and {profile.firstGen ? 'First-Gen' : 'Academic'} background against 50+ institutional guidelines to eliminate blind applications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button 
            onClick={() => setMinMatchFilter(minMatchFilter === 80 ? 0 : 80)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
              minMatchFilter === 80 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-slate-700'
            }`}
            aria-pressed={minMatchFilter === 80}
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            {minMatchFilter === 80 ? 'Showing 80%+ Only (Click to Clear)' : 'Filter 80%+ Matches Only'}
          </button>
        </div>
      </div>

      {/* Search & Comprehensive Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4" role="search">
        
        {/* Top Search Input & Sort Row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by scholarship name, provider, keyword, or major (e.g. 'Google', 'STEM', 'Design')..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              aria-label="Search scholarships"
            />
            {searchInput && (
              <button 
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search input"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              aria-label="Sort scholarships by criteria"
            >
              <option value="match">Match Score (Highest)</option>
              <option value="amount">Award Amount ($$$ to $)</option>
              <option value="deadline">Approaching Deadline</option>
              <option value="effort">Application Effort (Lowest)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Filter by Category">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Toggle checkboxes & summary info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200">
              <input
                type="checkbox"
                checked={onlyRenewable}
                onChange={(e) => setOnlyRenewable(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Renewable Multi-Year Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200">
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Eligible & High Match (70%+)</span>
            </label>
          </div>

          <div className="font-medium text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{filteredScholarships.length}</strong> of {scholarships.length} opportunities
          </div>
        </div>
      </div>

      {/* Scholarship Cards Grid */}
      {filteredScholarships.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" aria-hidden="true" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Matching Scholarships Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your search keywords, lowering the match threshold, or resetting the category filter.
          </p>
          <button
            onClick={() => {
              setSearchInput('');
              setSelectedCategory('All');
              setMinMatchFilter(0);
              setOnlyRenewable(false);
              setOnlyEligible(false);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition-colors inline-block"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScholarships.map((s) => {
            const matchScore = s.matchResult.score;
            return (
              <div
                key={s.id}
                className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Top Card Header */}
                <div className="p-5 space-y-3">
                  
                  {/* Provider & Match Pill */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${s.providerLogoBg} flex items-center justify-center text-white text-xs font-bold shadow-xs`} aria-hidden="true">
                        {s.provider.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                          {s.provider}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {s.location}
                        </div>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div 
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${s.matchResult.badgeColor}`}
                      title={`Match calculated based on GPA, major, first-gen and citizenship`}
                      aria-label={`${matchScore}% Match Score, ${s.matchResult.verdict}`}
                    >
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{matchScore}% Match</span>
                    </div>
                  </div>

                  {/* Scholarship Title */}
                  <h3 
                    onClick={() => onSelectScholarship(s)}
                    className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2"
                  >
                    {s.title}
                  </h3>

                  {/* Award Amount & Renewable Status */}
                  <div className="flex items-baseline justify-between py-1 border-y border-slate-100 dark:border-slate-800/80">
                    <div>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {s.formattedAmount}
                      </span>
                      {s.isRenewable && (
                        <span className="ml-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          (Renewable)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Acceptance: <strong className="text-slate-700 dark:text-slate-300">{s.acceptanceRate}</strong>
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>

                  {/* Requirements & Criteria Quick Strip */}
                  <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center justify-between">
                      <span>Minimum GPA:</span>
                      <strong className={`font-semibold ${profile.gpa >= s.minGpa ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                        {s.minGpa > 0 ? `${s.minGpa.toFixed(1)}+ (You: ${profile.gpa.toFixed(2)})` : 'None required'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Application Effort:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{s.effortEstimate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Required Items:</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {s.requirements.essaysCount} {s.requirements.essaysCount === 1 ? 'Essay' : 'Essays'} • {s.requirements.recommendationsCount} Recs {s.requirements.requiresPortfolio ? '• Portfolio' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {s.category}
                    </span>
                    {s.tags.slice(0, 2).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Footer Actions */}
                <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  
                  {/* Deadline with urgency styling */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className={`w-3.5 h-3.5 ${s.deadlineInfo.isUrgent ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} aria-hidden="true" />
                    <span className={`font-semibold ${s.deadlineInfo.isUrgent ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {s.deadlineInfo.text}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    
                    {/* Compare Checkbox */}
                    <button
                      onClick={() => onToggleCompare(s.id)}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        s.isComparing 
                          ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300' 
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700'
                      }`}
                      title={s.isComparing ? 'Remove from Compare' : 'Add to Comparison'}
                      aria-label={s.isComparing ? `Remove ${s.title} from comparison` : `Add ${s.title} to comparison`}
                    >
                      <Scale className="w-4 h-4" aria-hidden="true" />
                    </button>

                    {/* Bookmark / Track Toggle */}
                    <button
                      onClick={() => onToggleTrack(s)}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        s.isTracked 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' 
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700'
                      }`}
                      title={s.isTracked ? 'Tracked in Pipeline' : 'Save to Pipeline'}
                      aria-label={s.isTracked ? `Remove ${s.title} from tracker` : `Save ${s.title} to tracker`}
                    >
                      {s.isTracked ? <BookmarkCheck className="w-4 h-4" aria-hidden="true" /> : <Bookmark className="w-4 h-4" aria-hidden="true" />}
                    </button>

                    {/* Quick View / Apply */}
                    <button
                      onClick={() => onSelectScholarship(s)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                      aria-label={`Explore details for ${s.title}`}
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
