import React, { useState } from 'react';
import { 
  X, 
  User, 
  Sparkles, 
  GraduationCap, 
  DollarSign, 
  Save, 
  RotateCcw,
  BookOpen,
  Globe
} from 'lucide-react';
import { UserProfile, EducationLevel } from '../types';

interface ProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.name);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(profile.educationLevel);
  const [major, setMajor] = useState(profile.major);
  const [gpa, setGpa] = useState<number>(profile.gpa);
  const [citizenship, setCitizenship] = useState(profile.citizenship);
  const [firstGen, setFirstGen] = useState(profile.firstGen);
  const [financialNeed, setFinancialNeed] = useState(profile.financialNeed);
  const [targetFunding, setTargetFunding] = useState<number>(profile.targetFunding);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      name,
      educationLevel,
      major,
      gpa: Number(gpa),
      citizenship,
      firstGen,
      financialNeed,
      targetFunding: Number(targetFunding),
    });
    onClose();
  };

  // Quick Preset switcher for the hackathon evaluator!
  const loadPreset = (preset: 'cs-firstgen' | 'premed-merit' | 'arts-undergrad' | 'international-grad') => {
    if (preset === 'cs-firstgen') {
      setName('Alex Rivera');
      setEducationLevel('Undergraduate');
      setMajor('Computer Science & Data');
      setGpa(3.78);
      setCitizenship('US Citizen');
      setFirstGen(true);
      setFinancialNeed('High');
      setTargetFunding(45000);
    } else if (preset === 'premed-merit') {
      setName('Maya Patel');
      setEducationLevel('Undergraduate');
      setMajor('Bioengineering & Pre-Med');
      setGpa(3.95);
      setCitizenship('US Citizen');
      setFirstGen(false);
      setFinancialNeed('Medium');
      setTargetFunding(60000);
    } else if (preset === 'arts-undergrad') {
      setName('Jordan Taylor');
      setEducationLevel('Undergraduate');
      setMajor('Digital Media & UI/UX Design');
      setGpa(3.42);
      setCitizenship('Permanent Resident');
      setFirstGen(true);
      setFinancialNeed('High');
      setTargetFunding(35000);
    } else if (preset === 'international-grad') {
      setName('Fatima Al-Mansoor');
      setEducationLevel('Graduate');
      setMajor('Environmental Data Systems');
      setGpa(3.85);
      setCitizenship('International');
      setFirstGen(false);
      setFinancialNeed('High');
      setTargetFunding(50000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Edit Student Eligibility Profile</h2>
              <p className="text-xs text-indigo-300">
                All scholarship matches & eligibility scores recompute in real-time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Presets Bar */}
        <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-slate-800 space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Evaluator Quick-Switch Presets:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => loadPreset('cs-firstgen')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium hover:border-indigo-400"
            >
              CS First-Gen (3.78)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('premed-merit')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium hover:border-indigo-400"
            >
              Pre-Med High-GPA (3.95)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('arts-undergrad')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium hover:border-indigo-400"
            >
              Design / Arts (3.42)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('international-grad')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium hover:border-indigo-400"
            >
              International Grad (3.85)
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="High School">High School Senior</option>
                <option value="Undergraduate">Undergraduate Student</option>
                <option value="Graduate">Graduate (Master's)</option>
                <option value="PhD">Doctoral / PhD Scholar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Major / Field of Study</label>
              <input
                type="text"
                required
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Computer Science, Mechanical Eng..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Cumulative GPA (4.0 scale)</label>
              <input
                type="number"
                step="0.01"
                min="1.0"
                max="4.0"
                required
                value={gpa}
                onChange={(e) => setGpa(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Citizenship / Status</label>
              <select
                value={citizenship}
                onChange={(e) => setCitizenship(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="US Citizen">US Citizen</option>
                <option value="Permanent Resident">Permanent Resident (Green Card)</option>
                <option value="DACA">DACA / Dreamer</option>
                <option value="International">International Student</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Demonstrated Financial Need</label>
              <select
                value={financialNeed}
                onChange={(e) => setFinancialNeed(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="High">High (FAFSA SAI 0 or Low Income)</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low / Merit Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Target Financial Aid Goal ($)</label>
              <input
                type="number"
                step="1000"
                value={targetFunding}
                onChange={(e) => setTargetFunding(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200 font-semibold">
                <input
                  type="checkbox"
                  checked={firstGen}
                  onChange={(e) => setFirstGen(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>First-Generation College Student</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Apply & Recompute Matches</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
