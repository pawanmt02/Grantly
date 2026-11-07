import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Send, 
  CheckCircle2, 
  FileCheck, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  GraduationCap,
  Download
} from 'lucide-react';
import { Scholarship, UserProfile, VaultDocument } from '../types';

interface QuickApplyModalProps {
  scholarship: Scholarship | null;
  profile: UserProfile;
  vaultDocs: VaultDocument[];
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmit: (scholarshipId: string, confirmationReceipt: string) => void;
}

export const QuickApplyModal: React.FC<QuickApplyModalProps> = ({
  scholarship,
  profile,
  vaultDocs,
  isOpen,
  onClose,
  onSuccessSubmit,
}) => {
  if (!isOpen || !scholarship) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState('');

  const triggerConfettiCelebration = () => {
    // Multi-stage confetti blast
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#10B981', '#F59E0B', '#8B5CF6'],
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);
  };

  const handleFinalSubmit = () => {
    const randomReceipt = `GRANTLY-${scholarship.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmissionReceipt(randomReceipt);
    setStep(3);
    triggerConfettiCelebration();
    onSuccessSubmit(scholarship.id, randomReceipt);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Streamlined Digital Application
              </span>
              <h2 className="text-lg font-bold text-white line-clamp-1">
                {scholarship.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 3 && (
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1.5 font-bold ${step === 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">1</span>
              <span>Verify Applicant Profile</span>
            </div>
            <div className="w-6 h-0.5 bg-slate-300 dark:bg-slate-700" />
            <div className={`flex items-center gap-1.5 font-bold ${step === 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">2</span>
              <span>Attached Materials</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* STEP 1: VERIFY PROFILE DATA */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 space-y-2">
                <div className="font-bold text-indigo-950 dark:text-indigo-200">
                  Pre-Populated Verified Credentials
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  <div>• Name: <strong>{profile.name}</strong></div>
                  <div>• Email: <strong>{profile.email}</strong></div>
                  <div>• GPA: <strong>{profile.gpa.toFixed(2)} / 4.00</strong></div>
                  <div>• Level: <strong>{profile.educationLevel}</strong></div>
                  <div>• Major: <strong>{profile.major}</strong></div>
                  <div>• First-Gen: <strong>{profile.firstGen ? 'Yes (Verified)' : 'No'}</strong></div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  Award Summary:
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total Grant:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                    {scholarship.formattedAmount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Terms:</span>
                  <span>{scholarship.isRenewable ? 'Renewable Academic Year Funding' : 'One-time direct disbursement'}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <span>Continue to Attached Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AUTO-ATTACHED VAULT DOCUMENTS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-slate-600 dark:text-slate-300">
                Grantly automatically bundled your verified documents from your Vault matching {scholarship.provider} requirements:
              </div>

              <div className="space-y-2">
                {vaultDocs.slice(0, 4).map((doc) => (
                  <div 
                    key={doc.id}
                    className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{doc.title}</div>
                        <div className="text-[10px] text-slate-500">{doc.fileName} • {doc.fileSize}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60">
                      Auto-Attached
                    </span>
                  </div>
                ))}
              </div>

              <label className="flex items-start gap-2 pt-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-[11px] leading-tight">
                  I certify that all academic records and identity details provided are accurate and authorize electronic verification with {scholarship.provider}.
                </span>
              </label>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Back
                </button>

                <button
                  disabled={!agreementChecked}
                  onClick={handleFinalSubmit}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600 hover:opacity-95 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-40 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Application Now</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUBMITTED SUCCESS & RECEIPT */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Application Successfully Transmitted!
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Your complete packet has been dispatched to <strong>{scholarship.provider}</strong>. Status in your Grantly Pipeline has been updated to <em>Submitted</em>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Confirmation ID:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{submissionReceipt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Award In Review:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{scholarship.formattedAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Decision:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Within 3-4 Weeks</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md"
                >
                  Done & View in Tracker
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
