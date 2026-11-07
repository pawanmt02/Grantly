import React from 'react';
import { 
  GraduationCap, 
  Compass, 
  Kanban, 
  Sparkles, 
  FolderLock, 
  Scale, 
  Sun, 
  Moon, 
  RotateCcw,
  DollarSign,
  Calculator
} from 'lucide-react';
import { UserProfile, TrackedApplication, Scholarship } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  trackedApps: Record<string, TrackedApplication>;
  scholarships: Scholarship[];
  onOpenProfile: () => void;
  onOpenCalculator: () => void;
  onResetData: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  compareCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  trackedApps,
  scholarships,
  onOpenProfile,
  onOpenCalculator,
  onResetData,
  darkMode,
  setDarkMode,
  compareCount,
}) => {
  const trackedList = Object.values(trackedApps);
  const totalWon = trackedList
    .filter(t => t.status === 'awarded')
    .reduce((sum, t) => {
      const sch = scholarships.find(s => s.id === t.scholarshipId);
      return sum + (t.awardedAmount || sch?.amount || 0);
    }, 0);

  const navItems = [
    { id: 'discover', label: 'Discover & Match', icon: Compass },
    { id: 'tracker', label: 'Application Tracker', icon: Kanban, badge: trackedList.length },
    { id: 'ai-copilot', label: 'AI Essay Spark', icon: Sparkles, highlight: true },
    { id: 'vault', label: 'Document Vault', icon: FolderLock },
    { id: 'compare', label: 'Compare', icon: Scale, badge: compareCount > 0 ? compareCount : undefined },
  ];

  return (
    <header 
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('discover')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 rounded-xl p-1"
              aria-label="Grantly Home - Discover Scholarships"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 dark:from-indigo-400 dark:via-purple-300 dark:to-emerald-400 bg-clip-text text-transparent">
                  GRANTLY
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Discovery & Aid Hub
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav 
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
            role="tablist"
            aria-label="Primary Platform Navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span 
                      className="ml-0.5 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      aria-label={`${item.badge} items`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="flex h-2 w-2 relative" aria-hidden="true">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Tools & Profile Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Aid Calculator Trigger */}
            <button
              onClick={onOpenCalculator}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
              title="Open FAFSA SAI & Federal Aid Estimator"
              aria-label="Federal Aid Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <span>SAI Estimator</span>
            </button>

            {/* Won Aid Chip */}
            <button 
              onClick={() => setActiveTab('tracker')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:shadow-xs transition-shadow text-left"
              title="Click to view awarded & tracked scholarships"
              aria-label={`Total won: $${totalWon.toLocaleString()} out of $${profile.targetFunding.toLocaleString()}`}
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <div className="text-xs">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  ${totalWon.toLocaleString()} Won
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-1">
                  / ${profile.targetFunding.toLocaleString()}
                </span>
              </div>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={darkMode ? 'Activate Light Theme' : 'Activate Dark Theme'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" /> : <Moon className="w-5 h-5 text-slate-600" aria-hidden="true" />}
            </button>

            {/* Profile Avatar & Editor Trigger */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-800 transition-all text-left focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
              title="Edit Student Match Profile"
              aria-label={`Student Profile: ${profile.name}, GPA ${profile.gpa.toFixed(2)}`}
            >
              <img
                src={profile.avatar}
                alt=""
                className="w-7 h-7 rounded-full object-cover border border-indigo-500/30"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-semibold leading-tight text-slate-800 dark:text-slate-200">
                  {profile.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  GPA {profile.gpa.toFixed(2)} • {profile.educationLevel}
                </div>
              </div>
            </button>

            {/* Reset Demo Data button */}
            <button
              onClick={onResetData}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden"
              title="Reset to default demo data"
              aria-label="Reset all demo data"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <nav 
        className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 text-xs overflow-x-auto"
        aria-label="Mobile Navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-md min-w-[64px] ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              aria-selected={isActive}
            >
              <Icon className="w-4 h-4 mb-0.5" aria-hidden="true" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
