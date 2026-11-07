import React, { useState, useEffect } from 'react';
import { 
  mockScholarships, 
  initialProfile, 
  sampleVaultDocuments, 
  initialTrackedApplications 
} from './data/scholarships';
import { 
  Scholarship, 
  UserProfile, 
  TrackedApplication, 
  VaultDocument, 
  ApplicationStatus 
} from './types';
import { Navbar } from './components/Navbar';
import { TopStatsBanner } from './components/TopStatsBanner';
import { DiscoverView } from './components/DiscoverView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { AiEssayCopilotView } from './components/AiEssayCopilotView';
import { DocumentVaultView } from './components/DocumentVaultView';
import { ComparisonView } from './components/ComparisonView';
import { ScholarshipDetailModal } from './components/ScholarshipDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { QuickApplyModal } from './components/QuickApplyModal';

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('grantly_dark_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('grantly_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Main Persistent States
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('grantly_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    const saved = localStorage.getItem('grantly_scholarships');
    return saved ? JSON.parse(saved) : mockScholarships;
  });

  const [trackedApps, setTrackedApps] = useState<Record<string, TrackedApplication>>(() => {
    const saved = localStorage.getItem('grantly_tracked');
    return saved ? JSON.parse(saved) : initialTrackedApplications;
  });

  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>(() => {
    const saved = localStorage.getItem('grantly_vault');
    return saved ? JSON.parse(saved) : sampleVaultDocuments;
  });

  const [compareIds, setCompareIds] = useState<string[]>(['sch-1', 'sch-2']);
  const [activeTab, setActiveTab] = useState<string>('discover');

  // Modals state
  const [selectedDetailScholarship, setSelectedDetailScholarship] = useState<Scholarship | null>(null);
  const [quickApplyScholarship, setQuickApplyScholarship] = useState<Scholarship | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Cross-view seed for AI Copilot
  const [essaySeed, setEssaySeed] = useState<{ prompt?: string; title?: string }>({});

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem('grantly_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('grantly_scholarships', JSON.stringify(scholarships));
  }, [scholarships]);

  useEffect(() => {
    localStorage.setItem('grantly_tracked', JSON.stringify(trackedApps));
  }, [trackedApps]);

  useEffect(() => {
    localStorage.setItem('grantly_vault', JSON.stringify(vaultDocs));
  }, [vaultDocs]);

  // Reset to default sample dataset
  const handleResetDemoData = () => {
    if (window.confirm('Reset all Grantly data to default hackathon demo profile and applications?')) {
      setProfile(initialProfile);
      setScholarships(mockScholarships);
      setTrackedApps(initialTrackedApplications);
      setVaultDocs(sampleVaultDocuments);
      setCompareIds(['sch-1', 'sch-2']);
      localStorage.clear();
    }
  };

  // Toggle Save to Pipeline Tracker
  const handleToggleTrack = (scholarship: Scholarship) => {
    setTrackedApps(prev => {
      const exists = !!prev[scholarship.id];
      if (exists) {
        const copy = { ...prev };
        delete copy[scholarship.id];
        return copy;
      } else {
        const newTracked: TrackedApplication = {
          id: `track-${Date.now()}`,
          scholarshipId: scholarship.id,
          status: 'considering',
          notes: `Discovered and saved via Grantly on ${new Date().toISOString().split('T')[0]}.`,
          dateAdded: new Date().toISOString().split('T')[0],
          checklist: [
            { id: 'c1', label: 'Verify eligibility requirements', completed: true },
            { id: 'c2', label: 'Check transcript & GPA criteria', completed: profile.gpa >= scholarship.minGpa },
            { id: 'c3', label: `Draft ${scholarship.requirements.essaysCount} required essay(s)`, completed: false },
            { id: 'c4', label: `Request ${scholarship.requirements.recommendationsCount} recommendation letters`, completed: false },
          ],
        };
        return { ...prev, [scholarship.id]: newTracked };
      }
    });
  };

  // Update Status in Tracker
  const handleUpdateTrackStatus = (scholarshipId: string, newStatus: ApplicationStatus) => {
    setTrackedApps(prev => {
      const current = prev[scholarshipId];
      if (!current) {
        // If not tracked yet, create it
        const sch = scholarships.find(s => s.id === scholarshipId);
        return {
          ...prev,
          [scholarshipId]: {
            id: `track-${Date.now()}`,
            scholarshipId,
            status: newStatus,
            notes: `Status changed to ${newStatus}.`,
            dateAdded: new Date().toISOString().split('T')[0],
            checklist: [
              { id: 'c1', label: 'Verify criteria', completed: true },
              { id: 'c2', label: 'Submit documents', completed: newStatus === 'submitted' || newStatus === 'awarded' },
            ],
          }
        };
      }
      return {
        ...prev,
        [scholarshipId]: {
          ...current,
          status: newStatus,
          dateSubmitted: newStatus === 'submitted' ? new Date().toISOString().split('T')[0] : current.dateSubmitted,
          awardedAmount: newStatus === 'awarded' ? (current.awardedAmount || scholarships.find(s => s.id === scholarshipId)?.amount || 0) : current.awardedAmount,
        }
      };
    });
  };

  // Remove tracked
  const handleRemoveTracked = (scholarshipId: string) => {
    setTrackedApps(prev => {
      const copy = { ...prev };
      delete copy[scholarshipId];
      return copy;
    });
  };

  // Toggle checklist item
  const handleToggleChecklistItem = (scholarshipId: string, checklistId: string) => {
    setTrackedApps(prev => {
      const app = prev[scholarshipId];
      if (!app) return prev;
      const updatedChecklist = app.checklist.map(item => 
        item.id === checklistId ? { ...item, completed: !item.completed } : item
      );
      return {
        ...prev,
        [scholarshipId]: {
          ...app,
          checklist: updatedChecklist,
        }
      };
    });
  };

  // Add custom scholarship
  const handleAddCustomTracked = (customData: Partial<Scholarship>, initialStatus: ApplicationStatus) => {
    const newId = `custom-${Date.now()}`;
    const customScholarship: Scholarship = {
      id: newId,
      title: customData.title || 'Independent Scholarship',
      provider: customData.provider || 'Private / Community Sponsor',
      providerLogoBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      amount: customData.amount || 5000,
      formattedAmount: customData.formattedAmount || `$${(customData.amount || 5000).toLocaleString()}`,
      isRenewable: false,
      deadline: customData.deadline || '2026-12-31',
      category: customData.category || 'Merit',
      educationLevel: ['Undergraduate'],
      minGpa: 3.0,
      eligibleMajors: ['All Majors'],
      citizenship: ['Any'],
      firstGenBonus: false,
      financialNeedBonus: false,
      description: 'Custom offline grant opportunity added by student.',
      requirements: {
        minGpa: 3.0,
        essaysCount: 1,
        recommendationsCount: 1,
        requiresTranscript: true,
        requiresFafsaOrNeed: false,
        requiresPortfolio: false,
        interviewsCount: 0,
      },
      essayPrompts: ['Personal goals and academic aspirations.'],
      acceptanceRate: 'Varies',
      effortEstimate: 'Medium (3-5 hrs)',
      websiteUrl: '#',
      featured: false,
      tags: ['Custom / Offline', 'User Added'],
      location: 'Local / Regional',
    };

    setScholarships(prev => [customScholarship, ...prev]);

    setTrackedApps(prev => ({
      ...prev,
      [newId]: {
        id: `track-${Date.now()}`,
        scholarshipId: newId,
        status: initialStatus,
        notes: 'Custom award added to tracker.',
        dateAdded: new Date().toISOString().split('T')[0],
        checklist: [
          { id: 'c1', label: 'Review sponsor guidelines', completed: false },
          { id: 'c2', label: 'Submit required documents', completed: false },
        ]
      }
    }));
  };

  // Compare Toggle
  const handleToggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 scholarships at once. Please remove one first.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  // Add Document to Vault
  const handleAddVaultDocument = (doc: VaultDocument) => {
    setVaultDocs(prev => [doc, ...prev]);
  };

  const handleRemoveVaultDocument = (id: string) => {
    setVaultDocs(prev => prev.filter(d => d.id !== id));
  };

  // Transition from Scholarship Prompt to AI Essay Copilot
  const handleStartEssayDraft = (prompt: string, title: string) => {
    setEssaySeed({ prompt, title });
    setSelectedDetailScholarship(null);
    setActiveTab('ai-copilot');
  };

  // Success from Quick Apply
  const handleQuickApplySuccess = (scholarshipId: string, confirmationReceipt: string) => {
    setTrackedApps(prev => ({
      ...prev,
      [scholarshipId]: {
        id: prev[scholarshipId]?.id || `track-${Date.now()}`,
        scholarshipId,
        status: 'submitted',
        notes: `Submitted electronically via Grantly One-Click flow. Receipt: ${confirmationReceipt}`,
        dateAdded: prev[scholarshipId]?.dateAdded || new Date().toISOString().split('T')[0],
        dateSubmitted: new Date().toISOString().split('T')[0],
        checklist: [
          { id: 'c1', label: 'Profile Verified', completed: true },
          { id: 'c2', label: 'Materials Attached from Vault', completed: true },
          { id: 'c3', label: 'Electronic Submission Transmitted', completed: true },
        ]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        trackedApps={trackedApps}
        scholarships={scholarships}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onResetData={handleResetDemoData}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        compareCount={compareIds.length}
      />

      {/* Top Stats Banner */}
      <TopStatsBanner
        profile={profile}
        trackedApps={trackedApps}
        scholarships={scholarships}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onExploreUrgent={(id) => {
          const sch = scholarships.find(s => s.id === id);
          if (sch) setSelectedDetailScholarship(sch);
        }}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'discover' && (
          <DiscoverView
            scholarships={scholarships}
            profile={profile}
            trackedApps={trackedApps}
            onSelectScholarship={(s) => setSelectedDetailScholarship(s)}
            onToggleTrack={handleToggleTrack}
            onQuickApply={(s) => setQuickApplyScholarship(s)}
            compareList={compareIds}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {activeTab === 'tracker' && (
          <ApplicationTrackerView
            trackedApps={trackedApps}
            scholarships={scholarships}
            onUpdateStatus={handleUpdateTrackStatus}
            onRemoveTracked={handleRemoveTracked}
            onToggleChecklistItem={handleToggleChecklistItem}
            onSelectScholarship={(s) => setSelectedDetailScholarship(s)}
            onAddCustomTracked={handleAddCustomTracked}
            profile={profile}
          />
        )}

        {activeTab === 'ai-copilot' && (
          <AiEssayCopilotView
            scholarships={scholarships}
            profile={profile}
            initialPrompt={essaySeed.prompt}
            initialTitle={essaySeed.title}
            onSaveToVault={(doc) => {
              const fullDoc: VaultDocument = {
                id: `doc-${Date.now()}`,
                title: doc.title || 'Essay Draft',
                type: 'essay',
                fileName: doc.fileName || 'Essay_Draft.docx',
                lastUpdated: new Date().toISOString().split('T')[0],
                fileSize: '48 KB',
                wordCount: doc.wordCount,
                status: 'ready',
                contentSnippet: doc.contentSnippet || 'AI Essay Draft saved from Copilot.',
              };
              handleAddVaultDocument(fullDoc);
            }}
          />
        )}

        {activeTab === 'vault' && (
          <DocumentVaultView
            documents={vaultDocs}
            onAddDocument={handleAddVaultDocument}
            onRemoveDocument={handleRemoveVaultDocument}
            scholarships={scholarships}
            trackedApps={trackedApps}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonView
            compareIds={compareIds}
            scholarships={scholarships}
            profile={profile}
            onRemoveFromCompare={(id) => setCompareIds(prev => prev.filter(x => x !== id))}
            onSelectScholarship={(s) => setSelectedDetailScholarship(s)}
            onQuickApply={(s) => setQuickApplyScholarship(s)}
            onBrowseMore={() => setActiveTab('discover')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">GRANTLY</span>
            <span>— Rethinking the Educational Financial Assistance Experience</span>
          </div>
          <div>
            Built with modern frontend excellence • Offline-ready with persistent LocalStorage
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ScholarshipDetailModal
        scholarship={selectedDetailScholarship}
        onClose={() => setSelectedDetailScholarship(null)}
        profile={profile}
        trackedApp={selectedDetailScholarship ? trackedApps[selectedDetailScholarship.id] : undefined}
        onUpdateTrackStatus={handleUpdateTrackStatus}
        onToggleTrack={handleToggleTrack}
        onQuickApply={(s) => {
          setSelectedDetailScholarship(null);
          setQuickApplyScholarship(s);
        }}
        onStartEssayDraft={handleStartEssayDraft}
        vaultDocs={vaultDocs}
        isComparing={selectedDetailScholarship ? compareIds.includes(selectedDetailScholarship.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      <ProfileModal
        profile={profile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={(updated) => setProfile(updated)}
      />

      <QuickApplyModal
        scholarship={quickApplyScholarship}
        profile={profile}
        vaultDocs={vaultDocs}
        isOpen={!!quickApplyScholarship}
        onClose={() => setQuickApplyScholarship(null)}
        onSuccessSubmit={handleQuickApplySuccess}
      />

    </div>
  );
};

export default App;
