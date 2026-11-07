import React, { useState } from 'react';
import { 
  Kanban, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  Download, 
  ChevronDown, 
  ChevronUp,
  FileSpreadsheet
} from 'lucide-react';
import { TrackedApplication, Scholarship, ApplicationStatus, UserProfile } from '../types';
import { formatDaysRemaining } from '../utils/matchingEngine';
import { ExportService } from '../services/exportService';

interface ApplicationTrackerViewProps {
  trackedApps: Record<string, TrackedApplication>;
  scholarships: Scholarship[];
  onUpdateStatus: (scholarshipId: string, newStatus: ApplicationStatus) => void;
  onRemoveTracked: (scholarshipId: string) => void;
  onToggleChecklistItem: (scholarshipId: string, checklistId: string) => void;
  onSelectScholarship: (scholarship: Scholarship) => void;
  onAddCustomTracked: (customScholarship: Partial<Scholarship>, initialStatus: ApplicationStatus) => void;
  profile: UserProfile;
}

const COLUMNS: { id: ApplicationStatus; title: string; color: string; badgeBg: string }[] = [
  { id: 'considering', title: 'Considering', color: 'border-slate-300 dark:border-slate-700', badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  { id: 'preparing', title: 'Preparing Documents', color: 'border-blue-400 dark:border-blue-700', badgeBg: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300' },
  { id: 'submitted', title: 'Submitted', color: 'border-indigo-400 dark:border-indigo-700', badgeBg: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' },
  { id: 'interview', title: 'Interview / Review', color: 'border-amber-400 dark:border-amber-700', badgeBg: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300' },
  { id: 'awarded', title: 'Awarded & Won', color: 'border-emerald-400 dark:border-emerald-700', badgeBg: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' },
];

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  trackedApps,
  scholarships,
  onUpdateStatus,
  onRemoveTracked,
  onToggleChecklistItem,
  onSelectScholarship,
  onAddCustomTracked,
  profile,
}) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // New Custom Scholarship Form
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newAmount, setNewAmount] = useState('5000');
  const [newDeadline, setNewDeadline] = useState('2026-12-31');
  const [newCategory, setNewCategory] = useState<any>('Merit');

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const trackedList = Object.values(trackedApps);

  // Calculate totals by stage
  const getStageTotal = (status: ApplicationStatus) => {
    return trackedList
      .filter(t => t.status === status)
      .reduce((sum, t) => {
        const sch = scholarships.find(s => s.id === t.scholarshipId);
        return sum + (t.awardedAmount || sch?.amount || 0);
      }, 0);
  };

  const totalWon = getStageTotal('awarded');
  const totalInFlight = getStageTotal('preparing') + getStageTotal('submitted') + getStageTotal('interview');

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddCustomTracked({
      title: newTitle,
      provider: newProvider || 'Local / Independent Provider',
      amount: parseInt(newAmount) || 1000,
      formattedAmount: `$${parseInt(newAmount || '1000').toLocaleString()}`,
      deadline: newDeadline,
      category: newCategory,
    }, 'considering');

    setNewTitle('');
    setNewProvider('');
    setShowAddModal(false);
  };

  const handleDownloadCsv = () => {
    ExportService.exportApplicationsToCsv(trackedApps, scholarships, profile);
  };

  const statusFlow: ApplicationStatus[] = ['considering', 'preparing', 'submitted', 'interview', 'awarded'];

  const moveStatus = (scholarshipId: string, current: ApplicationStatus, direction: 'forward' | 'backward') => {
    const currentIndex = statusFlow.indexOf(current);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < statusFlow.length) {
      onUpdateStatus(scholarshipId, statusFlow[targetIndex]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" role="region" aria-label="Scholarship Application Tracker">
      
      {/* Tracker Header & Quick Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
              <Kanban className="w-5 h-5" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Unified Scholarship Pipeline
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize every stage of your aid discovery, track requirements, and monitor your funding milestones.
          </p>
        </div>

        {/* Action Buttons: Add Custom & Export */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          
          <button
            onClick={handleDownloadCsv}
            className="px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Download CSV for Excel / Google Sheets"
            aria-label="Export Aid Portfolio as CSV Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            aria-label="View Printable Aid Portfolio Report"
          >
            <Download className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            aria-label="Add custom or offline scholarship opportunity"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Custom Scholarship</span>
          </button>
        </div>
      </div>

      {/* Funding Progress Meter */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-900/60 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs">
          <div>
            <span className="text-slate-400">Total Award Target:</span>
            <span className="text-base font-extrabold text-white ml-2">${profile.targetFunding.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-emerald-400 font-semibold">Awarded:</span>
              <span className="text-sm font-bold text-white ml-1.5">${totalWon.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-indigo-300 font-semibold">In Active Review:</span>
              <span className="text-sm font-bold text-white ml-1.5">${totalInFlight.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-800 rounded-full h-2.5 overflow-hidden flex" role="progressbar" aria-valuenow={Math.round((totalWon / (profile.targetFunding || 1)) * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${Math.min((totalWon / (profile.targetFunding || 1)) * 100, 100)}%` }}
            title={`Won: $${totalWon.toLocaleString()}`}
          />
          <div 
            className="bg-indigo-500/80 h-full transition-all duration-500" 
            style={{ width: `${Math.min((totalInFlight / (profile.targetFunding || 1)) * 100, 100 - (totalWon / (profile.targetFunding || 1)) * 100)}%` }}
            title={`In Progress: $${totalInFlight.toLocaleString()}`}
          />
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = trackedList.filter(t => t.status === col.id);
          const stageTotal = getStageTotal(col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col bg-slate-100/70 dark:bg-slate-900/50 rounded-2xl p-3 border-t-4 ${col.color} border-slate-200 dark:border-slate-800 min-h-[480px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {col.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    ${stageTotal.toLocaleString()} potential
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badgeBg}`}>
                  {colApps.length}
                </span>
              </div>

              {/* Card List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colApps.length === 0 ? (
                  <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-4 text-center text-xs text-slate-400">
                    No applications here yet
                  </div>
                ) : (
                  colApps.map((tracked) => {
                    const sch = scholarships.find(s => s.id === tracked.scholarshipId);
                    if (!sch) return null;

                    const deadlineInfo = formatDaysRemaining(sch.deadline);
                    const isExpanded = !!expandedCards[tracked.id];
                    const completedTasks = tracked.checklist?.filter(c => c.completed).length || 0;
                    const totalTasks = tracked.checklist?.length || 0;

                    return (
                      <div
                        key={tracked.id}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs hover:shadow-md transition-shadow space-y-2.5 text-xs"
                      >
                        {/* Title & Provider */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                            <span className="truncate max-w-[130px] font-medium">{sch.provider}</span>
                            <span className={`font-semibold ${deadlineInfo.isUrgent ? 'text-rose-500' : ''}`}>
                              {deadlineInfo.text}
                            </span>
                          </div>
                          <h4 
                            onClick={() => onSelectScholarship(sch)}
                            className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-2"
                          >
                            {sch.title}
                          </h4>
                        </div>

                        {/* Amount & Status highlight */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            {tracked.status === 'awarded' && tracked.awardedAmount 
                              ? `$${tracked.awardedAmount.toLocaleString()}` 
                              : sch.formattedAmount}
                          </span>
                          <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {sch.category}
                          </span>
                        </div>

                        {/* Checklist progress bar */}
                        {totalTasks > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                              <span>Tasks: {completedTasks}/{totalTasks}</span>
                              <span>{Math.round((completedTasks / totalTasks) * 100)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                              <div 
                                className="bg-indigo-600 dark:bg-indigo-400 h-1 rounded-full transition-all"
                                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Interactive Checklist Expansion */}
                        {isExpanded && tracked.checklist && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                              Application Checklist:
                            </div>
                            {tracked.checklist.map((item) => (
                              <label
                                key={item.id}
                                className="flex items-start gap-2 text-[11px] cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                              >
                                <input
                                  type="checkbox"
                                  checked={item.completed}
                                  onChange={() => onToggleChecklistItem(tracked.scholarshipId, item.id)}
                                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className={item.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                                  {item.label}
                                </span>
                              </label>
                            ))}

                            {tracked.notes && (
                              <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded text-[11px] text-slate-500 dark:text-slate-400 italic">
                                Note: {tracked.notes}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Card Footer: Expand toggle, Move Left/Right, Delete */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-400">
                          
                          {/* Backward Arrow */}
                          <button
                            onClick={() => moveStatus(tracked.scholarshipId, tracked.status, 'backward')}
                            disabled={tracked.status === 'considering'}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 transition-opacity"
                            title="Move back a stage"
                            aria-label="Move application back one stage"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>

                          {/* Expand Checklist */}
                          {totalTasks > 0 && (
                            <button
                              onClick={() => toggleExpand(tracked.id)}
                              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                            >
                              <span>{isExpanded ? 'Hide' : 'Checklist'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}

                          {/* Delete from Tracker */}
                          <button
                            onClick={() => onRemoveTracked(tracked.scholarshipId)}
                            className="p-1 rounded hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Remove from Tracker"
                            aria-label="Remove opportunity from pipeline"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>

                          {/* Forward Arrow */}
                          <button
                            onClick={() => moveStatus(tracked.scholarshipId, tracked.status, 'forward')}
                            disabled={tracked.status === 'awarded'}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 transition-opacity"
                            title="Advance to next stage"
                            aria-label="Advance application to next stage"
                          >
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>

                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Scholarship Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Add Custom Scholarship"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add Offline or Custom Scholarship
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Found a local community grant, rotary scholarship, or university-specific award? Track it seamlessly alongside Grantly's curated database.
            </p>

            <form onSubmit={handleCreateCustom} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Scholarship Name *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rotary Club Youth Leadership Grant"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Provider or Sponsor</label>
                <input
                  type="text"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  placeholder="e.g. City Community Foundation"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Award Amount ($)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Merit">Merit</option>
                  <option value="Need-based">Need-based</option>
                  <option value="STEM">STEM</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Arts & Humanities">Arts & Humanities</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Add to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Report Modal */}
      {showReportModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Financial Aid Portfolio Summary"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Grantly Student Financial Aid Portfolio
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Prepared for: {profile.name} • {profile.major} ({profile.educationLevel})
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Print / Save PDF
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <span className="text-slate-500 block">Aid Target:</span>
                  <strong className="text-slate-900 dark:text-white text-sm">${profile.targetFunding.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400 block">Awarded / Won:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 text-sm">${totalWon.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Tracked Count:</span>
                  <strong className="text-slate-900 dark:text-white text-sm">{trackedList.length} applications</strong>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200">Active Applications Summary:</div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  {trackedList.map(t => {
                    const sch = scholarships.find(s => s.id === t.scholarshipId);
                    if (!sch) return null;
                    return (
                      <div key={t.id} className="p-3 flex items-center justify-between bg-white dark:bg-slate-900">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{sch.title}</div>
                          <div className="text-[11px] text-slate-500">{sch.provider} • Due: {sch.deadline}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">{sch.formattedAmount}</div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {t.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
