import React, { useState } from 'react';
import { Copy, Check, Sparkles, X, Terminal, BookOpen, Layers } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'english' | 'telugu'>('english');

  if (!isOpen) return null;

  const englishPrompt = `Build a high-performance, modern, and production-ready "Student PG & Room Finder" web application (e.g., CampusNest) designed specifically to solve the frustrating student housing search near top colleges and universities.

### Core Problems to Solve:
1. Students struggle with inaccurate distance claims from college gates, hidden food charges, fake photos, curfew restrictions, and inflated security deposits.
2. PG owners need direct student leads without paying heavy broker cuts, with monetization through promoted/featured campus listings.

### Required Features:
1. College-Centric Proximity Search:
   - Search by university/college (e.g., JNTU, IIIT, Osmania, IIT, BITS Pilani, Christ Univ) or student localities.
   - Show exact walking distance in meters and walking time (e.g., "450m from Gate 2 · 6 min walk").
   - Filter by distance radius (<500m, <1km, <2km, <5km).

2. Transparent Pricing & Sharing Breakdown:
   - Monthly rent filter (₹4,000 to ₹25,000+)
   - Clear sharing types: Single Room, 2-Sharing, 3-Sharing, 4-Sharing.
   - Explicit Security Deposit amount and notice period (15 days / 30 days) to prevent deposit disputes.

3. Student Food & Dining Intelligence:
   - Daily meal availability (Breakfast, Lunch, Dinner, Evening Tea).
   - Cuisine filter: South Indian, North Indian, or Combined.
   - Veg vs. Non-Veg schedule (e.g., Weekly 2x Sunday Biryani) + sample daily food timetable.

4. Essential Student Amenities & House Rules:
   - Tested Wi-Fi speed (e.g., 150 Mbps fiber).
   - AC vs. Non-AC options.
   - Power backup (generator), RO purified water, washing machine, study desk, CCTV, biometric entry.
   - Curfew rules (Strict time e.g., 10:30 PM vs. No Curfew biometric access).

5. Verified Owner Connect & Visit Scheduler:
   - Direct Call button and 1-click WhatsApp inquiry with pre-filled room details.
   - Free In-Person Visit scheduler (Date & time slot booking).
   - Zero brokerage guarantee.

6. Verified Student Reviews:
   - Sub-ratings for Food quality, Wi-Fi speed, Cleanliness, and Safety/Warden behavior.
   - Pros & Cons list and stay duration tags.

7. Interactive Campus Map & Comparison Matrix:
   - Interactive visual map with distance rings from the campus gate.
   - Side-by-side comparison for up to 3 properties.
   - Student Monthly Expense Calculator (Rent + Food + AC Electricity).

8. Business Model for PG Owners:
   - "List Your PG" onboarding wizard.
   - Monetization tiers: Basic Free, Featured Campus Pro (₹499/mo), and Campus Sponsor (₹1,499/mo) with lead tracking dashboard.

Design: Warm, modern editorial design with clean typography, unboxed metadata, high accessibility, fast responsive layout, and mobile-friendly touch targets.`;

  const teluguExplanation = `ఈ క్రింది ప్రాంప్ట్‌ను కాపీ చేసి గూగుల్ AI Studio లో నేరుగా పేస్ట్ చేయవచ్చు:

✨ ప్రాంప్ట్ లో పొందుపరిచిన ముఖ్య అంశాలు:
1. కాలేజ్ వారీగా దూరం (College Proximity): గేట్ నుండి ఎన్ని మీటర్లు & ఎన్ని నిమిషాల నడక అనేది స్పష్టంగా తెలుస్తుంది.
2. రెంటల్ & డిపాజిట్ క్లారిటీ: Single, 2-Sharing, 3-Sharing రేట్లు మరియు సెక్యూరిటీ డిపాజిట్ వివరాలు.
3. భోజన వివరాలు (Food details): సౌత్ / నార్త్ ఇండియన్ భోజనం, ఎన్ని పూటలు, నాన్-వెజ్ ఏ రోజుల్లో ఉంటుంది.
4. వై-ఫై & ఏసీ (Wi-Fi & AC): విద్యార్థులకు కావలసిన హై-స్పీడ్ ఇంటర్నెట్ (Mbps) & పవర్ బ్యాకప్.
5. ఓనర్ డైరెక్ట్ కాంటాక్ట్: బ్రోకర్లు లేకుండా డైరెక్ట్ కాల్ & వాట్సాప్ మెసేజ్ సౌకర్యం.
6. బిజినెస్ మోడల్: PG ఓనర్లు తమ హాస్టల్ ను లిస్ట్ చేయడానికి మరియు ప్రమోట్ చేసుకోవడానికి సబ్‌స్క్రిప్షన్ ప్లాన్స్ (₹499, ₹1,499/నెల).

ఈ అప్లికేషన్ లో ఈ ఫీచర్లన్నీ ఇప్పటికే పూర్తిగా పనిచేసేలా బిల్డ్ చేయబడ్డాయి!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(englishPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">AI Studio Master Prompt</h3>
              <p className="text-xs text-slate-400">Copy & paste this prompt directly into Google AI Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-4">
          <button
            onClick={() => setActiveTab('english')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'english'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            AI Studio System Prompt (English)
          </button>
          <button
            onClick={() => setActiveTab('telugu')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'telugu'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            వివరణ & సూచనలు (Telugu Guide)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'english' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Optimized prompt for building a complete Student PG platform</span>
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">~450 words</span>
              </div>
              <div className="relative">
                <pre className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed select-all">
                  {englishPrompt}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                మీరు అడిగినట్లుగా: <strong>&ldquo;Ee idea ki prompt ivvu nenu ai studio lo paste cheyyadaniki&rdquo;</strong> — ఈ అప్లికేషన్‌ను పూర్తిగా లైవ్‌గా తయారు చేయడంతో పాటు, మీ భవిష్యత్ ప్రాజెక్ట్‌లకు ఉపయోగపడేలా ఈ పూర్తి ప్రాంప్ట్ కూడా సిద్ధం చేయబడింది.
              </div>
              <div className="whitespace-pre-line text-xs font-sans text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {teluguExplanation}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Ready-to-run prompt with data architecture & monetization specs</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Prompt Copied!' : 'Copy Master Prompt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
