import React, { useState } from 'react';
import { Calculator, DollarSign, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { Modal } from './Modal';
import { AidCalculatorService, SaiCalculationResult } from '../../services/aidCalculatorService';
import { Button } from './Button';

interface AidCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AidCalculatorModal: React.FC<AidCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [householdIncome, setHouseholdIncome] = useState(48000);
  const [familySize, setFamilySize] = useState(4);
  const [studentSavings, setStudentSavings] = useState(2500);
  const [parentAssets, setParentAssets] = useState(15000);
  const [costOfAttendance, setCostOfAttendance] = useState(32000);

  const [result, setResult] = useState<SaiCalculationResult | null>(() => {
    return AidCalculatorService.calculateSai({
      parentHouseholdIncome: 48000,
      familySize: 4,
      studentSavings: 2500,
      parentAssets: 15000,
      costOfAttendance: 32000,
    });
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = AidCalculatorService.calculateSai({
      parentHouseholdIncome: Number(householdIncome),
      familySize: Number(familySize),
      studentSavings: Number(studentSavings),
      parentAssets: Number(parentAssets),
      costOfAttendance: Number(costOfAttendance),
    });
    setResult(res);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-xl"
      ariaLabel="FAFSA SAI & Federal Aid Estimator"
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Federal SAI & Aid Gap Estimator
            </div>
            <div className="text-[11px] font-normal text-slate-500">
              FAFSA Simplification Act Formula (2026-27 Model)
            </div>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-5 text-xs">
        
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Annual Household Income ($)
              </label>
              <input
                type="number"
                step="1000"
                value={householdIncome}
                onChange={(e) => setHouseholdIncome(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Household Family Size
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={familySize}
                onChange={(e) => setFamilySize(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Student Savings ($)
              </label>
              <input
                type="number"
                step="500"
                value={studentSavings}
                onChange={(e) => setStudentSavings(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Cost of Attendance ($/yr)
              </label>
              <input
                type="number"
                step="1000"
                value={costOfAttendance}
                onChange={(e) => setCostOfAttendance(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}>
              Re-Calculate Aid Gap
            </Button>
          </div>
        </form>

        {result && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-slate-800 dark:to-slate-850 border border-indigo-100 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Estimated Financial Profile
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {result.needCategory}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">Student Aid Index (SAI)</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  ${result.estimatedSai.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">Est. Federal Pell Grant</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${result.pellGrantEligibility.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 block">Remaining Aid Gap</span>
                <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                  ${result.aidGap.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              💡 <strong>Strategy Insight:</strong> You have an estimated remaining gap of <strong>${result.aidGap.toLocaleString()}</strong> after potential federal grants. Use Grantly’s discovery engine to target at least 2–3 private scholarships of $5,000–$15,000 to achieve a debt-free college journey.
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
