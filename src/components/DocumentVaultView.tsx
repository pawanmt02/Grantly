import React, { useState } from 'react';
import { 
  FolderLock, 
  FileText, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ExternalLink, 
  Plus, 
  FileCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { VaultDocument, Scholarship, TrackedApplication } from '../types';

interface DocumentVaultViewProps {
  documents: VaultDocument[];
  onAddDocument: (doc: VaultDocument) => void;
  onRemoveDocument: (id: string) => void;
  scholarships: Scholarship[];
  trackedApps: Record<string, TrackedApplication>;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  documents,
  onAddDocument,
  onRemoveDocument,
  scholarships,
  trackedApps,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<VaultDocument['type']>('transcript');
  const [newFileName, setNewFileName] = useState('');
  const [newSnippet, setNewSnippet] = useState('');

  // Calculate readiness score
  const coreTypes: VaultDocument['type'][] = ['transcript', 'resume', 'essay', 'lor', 'financial'];
  const presentTypes = new Set(documents.map(d => d.type));
  const readinessPercentage = Math.round((coreTypes.filter(t => presentTypes.has(t)).length / coreTypes.length) * 100);

  // Cross reference missing documents for active applications
  const trackedScholarships = Object.keys(trackedApps).map(id => scholarships.find(s => s.id === id)).filter(Boolean) as Scholarship[];
  
  const requiresPortfolio = trackedScholarships.some(s => s.requirements.requiresPortfolio);
  const requiresFinancial = trackedScholarships.some(s => s.requirements.requiresFafsaOrNeed);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc: VaultDocument = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      type: newType,
      fileName: newFileName || `${newTitle.replace(/\s+/g, '_')}.pdf`,
      lastUpdated: new Date().toISOString().split('T')[0],
      fileSize: '1.2 MB',
      status: 'ready',
      contentSnippet: newSnippet || 'Verified uploaded document asset.',
    };

    onAddDocument(newDoc);
    setNewTitle('');
    setNewFileName('');
    setNewSnippet('');
    setShowUploadModal(false);
  };

  const typeLabels: Record<VaultDocument['type'], { label: string; color: string }> = {
    transcript: { label: 'Official Transcript', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    resume: { label: 'Resume / CV', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    essay: { label: 'Core Essay / Statement', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    lor: { label: 'Recommendation Letter', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
    financial: { label: 'Financial Aid / FAFSA', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
    portfolio: { label: 'Creative Portfolio', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Vault Top Hero Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              <FolderLock className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Student Document Vault & Readiness Auditor
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Never scramble for transcripts or recommendation letters at 11:59 PM. Store, audit, and auto-attach verified application materials across all your grant opportunities.
          </p>
        </div>

        {/* Readiness Ring & Upload Action */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-slate-700 fill-none" />
                <circle 
                  cx="28" 
                  cy="28" 
                  r="22" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeDasharray="138" 
                  strokeDashoffset={138 - (138 * readinessPercentage) / 100}
                  className="text-emerald-500 fill-none transition-all duration-700" 
                />
              </svg>
              <span className="absolute text-xs font-extrabold text-slate-900 dark:text-white">
                {readinessPercentage}%
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Vault Readiness</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {readinessPercentage >= 80 ? 'Application Ready' : 'Documents Missing'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Requirement Readiness Checklist across Active Tracked Apps */}
      <div className="bg-gradient-to-r from-indigo-50/70 to-slate-50 dark:from-slate-800/60 dark:to-slate-900 rounded-2xl border border-indigo-100 dark:border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Real-Time Audit Against Tracked Opportunities ({trackedScholarships.length} Active)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Auto-checks requirements from Jack Kent Cooke, Google, etc.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Transcripts</div>
              <div className="text-[10px] text-slate-500">Official Fall 2026 Ready</div>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Master Resume</div>
              <div className="text-[10px] text-slate-500">Updated Nov 2026</div>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Faculty LOR</div>
              <div className="text-[10px] text-slate-500">1 on File (Need 1 more for Cooke)</div>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Financial Aid SAR</div>
              <div className="text-[10px] text-slate-500">FAFSA Report Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => {
          const typeMeta = typeLabels[doc.type] || { label: 'General Document', color: 'bg-slate-100 text-slate-700' };
          return (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${typeMeta.color}`}>
                    {typeMeta.label}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <FileCheck className="w-3.5 h-3.5" />
                    Ready
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  "{doc.contentSnippet}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="space-y-0.5 text-[11px]">
                  <div>{doc.fileName}</div>
                  <div className="text-slate-500">Updated {doc.lastUpdated} • {doc.fileSize}</div>
                </div>

                <button
                  onClick={() => onRemoveDocument(doc.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add Material to Vault
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload your PDF transcript, resume, essay draft, or faculty endorsement.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Document Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Dean's Recommendation Letter 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Document Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="transcript">Official Transcript</option>
                  <option value="resume">Resume / CV</option>
                  <option value="essay">Personal Statement / Essay</option>
                  <option value="lor">Recommendation Letter (LOR)</option>
                  <option value="financial">Financial Aid / FAFSA Document</option>
                  <option value="portfolio">Creative / Project Portfolio</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Simulated File Name</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Alex_Rivera_LOR_2026.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Notes or Brief Excerpt</label>
                <textarea
                  rows={2}
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  placeholder="Key highlights, endorser name, or credential details..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
