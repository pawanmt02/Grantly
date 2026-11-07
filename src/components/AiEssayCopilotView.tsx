import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Wand2, 
  Copy, 
  Check, 
  BookmarkPlus, 
  BookOpen, 
  Layers, 
  Feather, 
  Clock, 
  CheckCircle2,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { Scholarship, UserProfile, VaultDocument } from '../types';

interface AiEssayCopilotViewProps {
  scholarships: Scholarship[];
  profile: UserProfile;
  initialPrompt?: string;
  initialTitle?: string;
  onSaveToVault: (doc: Partial<VaultDocument>) => void;
}

export const AiEssayCopilotView: React.FC<AiEssayCopilotViewProps> = ({
  scholarships,
  profile,
  initialPrompt,
  initialTitle,
  onSaveToVault,
}) => {
  const [selectedScholarshipTitle, setSelectedScholarshipTitle] = useState(
    initialTitle || scholarships[0]?.title || 'Generation Google Scholarship'
  );
  const [promptText, setPromptText] = useState(
    initialPrompt || scholarships[0]?.essayPrompts[0] || 'Describe an example of how you have exhibited leadership and contributed to a more inclusive STEM community.'
  );

  const [essayContent, setEssayContent] = useState(
    `Growing up in an underserved neighborhood, technology wasn't just a career pathway for me—it was a lifeline. When our school’s budget cuts eliminated introductory computer science electives, I refused to let our curiosity stall. I organized an after-school coding club in our local public library using donated, refurbished laptops.\n\nOver twelve months, what began with four students grew into a thirty-member cohort learning Python and web accessibility principles. We built community tools, including an interactive multilingual resource directory for non-English speaking families navigating municipal social services.\n\nThis scholarship would not merely subsidize my tuition; it empowers me to complete my Computer Science degree debt-free, allowing me to mentor the next generation of underrepresented innovators and build technology that leaves nobody behind.`
  );

  const [selectedTone, setSelectedTone] = useState<'inspiring' | 'scholarly' | 'leadership' | 'resilience'>('inspiring');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [targetWordCount, setTargetWordCount] = useState<number>(500);

  // Word & character stats
  const words = essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0;
  const characters = essayContent.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  // Switch prompt based on scholarship selection
  const handleScholarshipChange = (title: string) => {
    setSelectedScholarshipTitle(title);
    const sch = scholarships.find(s => s.title === title);
    if (sch && sch.essayPrompts.length > 0) {
      setPromptText(sch.essayPrompts[0]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(essayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveVault = () => {
    onSaveToVault({
      title: `Essay Draft: ${selectedScholarshipTitle.substring(0, 30)}...`,
      type: 'essay',
      fileName: `Essay_${profile.name.replace(/\s+/g, '_')}_Draft.docx`,
      wordCount: words,
      status: 'ready',
      contentSnippet: essayContent.substring(0, 140) + '...',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Spark Hook generator based on tone & profile
  const sampleHooks = [
    {
      tone: 'Inspiring & Personal',
      hook: `"The hum of our desktop fan at 2 AM was my soundtrack for learning recursion while the rest of our household slept."`,
    },
    {
      tone: 'Leadership & Community',
      hook: `"True leadership in technology isn’t measured by the code you ship alone, but by how many doors you hold open for others behind you."`,
    },
    {
      tone: 'Academic Resilience',
      hook: `"As a first-generation student studying ${profile.major}, every theorem mastered is a generational milestone for my family."`,
    },
  ];

  const applyBlueprint = (section: string) => {
    let addition = '';
    if (section === 'hook') {
      addition = `\n\n[Opening Hook]: While others saw a computer as a gaming console, I saw a canvas capable of dismantling barriers.`;
    } else if (section === 'obstacle') {
      addition = `\n\n[Challenge Overcome]: Navigating university without hereditary financial literacy required balancing full-time coursework with two campus jobs.`;
    } else if (section === 'impact') {
      addition = `\n\n[Action & Community Impact]: Rather than viewing adversity as a deficit, I channeled this grit into leading workshops that reached over 120 peers.`;
    } else if (section === 'vision') {
      addition = `\n\n[Future Vision & Goal]: Armed with this educational grant, my mission is to pioneer ethical AI systems that reflect diverse human experiences.`;
    }
    setEssayContent(prev => prev + addition);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 border border-purple-800/40 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/30 text-purple-200 border border-purple-400/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              AI Scholarship Essay Studio
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Turn Your Authentic Story Into Compelling Financial Aid Essays
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-2xl">
            Stuck on scholarship prompts? Generate structured narrative outlines, refine voice and tone, and avoid cliché phrases that cause admissions fatigue.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSaveVault}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-all shadow-xs"
          >
            {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <BookmarkPlus className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved to Vault!' : 'Save Draft to Vault'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Prompt Selector & Outline Blueprint */}
        <div className="space-y-5">
          
          {/* Target Scholarship Selection */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Target Scholarship
            </label>
            <select
              value={selectedScholarshipTitle}
              onChange={(e) => handleScholarshipChange(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5"
            >
              {scholarships.map(s => (
                <option key={s.id} value={s.title}>
                  {s.title} ({s.formattedAmount})
                </option>
              ))}
            </select>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Active Prompt:
              </label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                rows={3}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 italic"
              />
            </div>
          </div>

          {/* Narrative Blueprint Buttons */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                1-Click Structural Blueprint
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Inject recommended scholarship storytelling blocks into your draft:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => applyBlueprint('hook')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-800 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">1. The Catalyst Hook</span>
                  <span className="text-[10px] text-slate-400">Captivates the selection committee in 2 lines</span>
                </div>
                <span className="text-indigo-600 font-bold">+</span>
              </button>

              <button
                onClick={() => applyBlueprint('obstacle')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-800 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">2. The Friction & Grit</span>
                  <span className="text-[10px] text-slate-400">Shows emotional maturity & problem solving</span>
                </div>
                <span className="text-indigo-600 font-bold">+</span>
              </button>

              <button
                onClick={() => applyBlueprint('impact')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-800 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">3. Quantifiable Impact</span>
                  <span className="text-[10px] text-slate-400">Specific numbers & community elevation</span>
                </div>
                <span className="text-indigo-600 font-bold">+</span>
              </button>

              <button
                onClick={() => applyBlueprint('vision')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-800 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">4. Scalable Vision</span>
                  <span className="text-[10px] text-slate-400">Connects donor's mission to your future</span>
                </div>
                <span className="text-indigo-600 font-bold">+</span>
              </button>
            </div>
          </div>

          {/* Spark Hooks Box */}
          <div className="bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                Tailored Narrative Sparkers
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              {sampleHooks.map((h, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">{h.tone}</span>
                  <p className="text-slate-700 dark:text-slate-300 italic text-[11px]">{h.hook}</p>
                  <button
                    onClick={() => setEssayContent(prev => h.hook.replace(/^"|"$/g, '') + '\n\n' + prev)}
                    className="text-[10px] text-indigo-600 font-semibold hover:underline"
                  >
                    Use as Opening Hook →
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 2 Columns: Main Essay Editor & Live Analysis */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Editor Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
            
            {/* Editor Toolbar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* Tone Selection */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Tone:</span>
                {(['inspiring', 'scholarly', 'leadership', 'resilience'] as const).map(tone => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      selectedTone === tone
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>

              {/* Word Count Indicator & Copy Button */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{readingTimeMinutes} min read</span>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

            </div>

            {/* Textarea */}
            <div className="p-4 sm:p-6 flex-1">
              <textarea
                value={essayContent}
                onChange={(e) => setEssayContent(e.target.value)}
                placeholder="Draft your authentic story here or use the blueprint sections to build a draft..."
                rows={16}
                className="w-full text-sm leading-relaxed text-slate-800 dark:text-slate-200 bg-transparent border-0 focus:outline-hidden resize-none font-sans"
              />
            </div>

            {/* Word Count Progress Bar */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {words} Words / {characters} Characters
                </span>
                <span className="text-slate-400">
                  Target: {targetWordCount} words
                </span>
              </div>

              <div className="w-48 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full transition-all ${
                    words > targetWordCount ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min((words / targetWordCount) * 100, 100)}%` }}
                />
              </div>
            </div>

          </div>

          {/* Committee Rubric Check & Insights */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Admissions Review Rubric Checklist
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-800 dark:text-slate-200">Personal Authenticity</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Avoid generic statements; highlights real hardships and specific leadership outcomes.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-800 dark:text-slate-200">Demonstrated Alignment</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Directly addresses how the award fits your educational goals and financial realities.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-800 dark:text-slate-200">Clarity & Pacing</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Flows seamlessly from problem to resolution without passive voice or clichés.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
