import React, { useState } from 'react';
import { X, Play, Copy, Check, ShieldCheck, Terminal, Smartphone, HelpCircle } from 'lucide-react';

interface PlayStorePublishModalProps {
  onClose: () => void;
}

export const PlayStorePublishModal: React.FC<PlayStorePublishModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const bubblewrapCommand = `npm install -g @bubblewrap/cli
bubblewrap init --manifest="${window.location.origin}/manifest.json"
bubblewrap build`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bubblewrapCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none animate-fade-in">
      <div className="w-full max-w-md max-h-[88vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] p-5 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F0EE] dark:border-[#262830]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#EBF7EE] dark:bg-[#142E1B] text-[#15803D] dark:text-[#4ADE80]">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#141517] dark:text-[#F1F2F6]">
                Google Play Store Publishing
              </h3>
              <p className="text-[11px] text-[#8C92A4] dark:text-[#646A7E]">
                Turn this lightweight game into an Android APK / AAB
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C92A4] hover:text-[#141517] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Banner */}
        <div className="my-3 p-3 rounded-xl bg-[#F8F8F6] dark:bg-[#121316] border border-[#E5E5E2] dark:border-[#262830] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#141517] dark:text-[#F1F2F6]">
            <Smartphone className="w-4 h-4 text-[#2563EB]" />
            <span>Ready for Trusted Web Activity (TWA)</span>
          </div>
          <p className="text-xs text-[#4B5162] dark:text-[#CBD5E1] leading-relaxed">
            Google officially supports publishing web applications as native Android apps using <strong>Trusted Web Activities (TWA)</strong>. The manifest, app icons, and offline assets are already configured in this app.
          </p>
        </div>

        {/* Direct Download Card for ZenSudoku.apk */}
        <div className="my-3 p-3.5 rounded-xl bg-[#EFF6FF] dark:bg-[#1E293B] border border-[#BFDBFE] dark:border-[#334155]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-[#1E40AF] dark:text-[#93C5FD]">
                Download Direct Android APK
              </div>
              <div className="text-[11px] text-[#1E3A8A] dark:text-[#BFDBFE]">
                Signed ZenSudoku.apk for direct phone install (2.5 MB)
              </div>
            </div>
            <a
              href="/ZenSudoku.apk"
              download="ZenSudoku.apk"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold shadow-xs active:scale-95 shrink-0 hover:bg-[#1D4ED8] transition-colors"
            >
              <span>Download APK</span>
            </a>
          </div>
          <p className="text-[10px] text-[#1E3A8A] dark:text-[#BFDBFE] mt-1.5">
            Signed with v1, v2 &amp; v3 signature schemes. Ready to install on any Android device!
          </p>
        </div>

        {/* Direct Download Banner for Android Studio */}
        <div className="my-3 p-3.5 rounded-xl bg-[#EBF7EE] dark:bg-[#142E1B] border border-[#BBF7D0] dark:border-[#1E4D29]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-[#15803D] dark:text-[#4ADE80]">
                Download Android Studio Project (.zip)
              </div>
              <div className="text-[11px] text-[#166534] dark:text-[#86EFAC]">
                Ready-to-compile project with offline assets (0.78 MB)
              </div>
            </div>
            <a
              href="/ZenSudoku-Android-Project.zip"
              download="ZenSudoku-Android-Project.zip"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#15803D] text-white text-xs font-semibold shadow-xs active:scale-95 shrink-0 hover:bg-[#166534] transition-colors"
            >
              <span>Download</span>
            </a>
          </div>
          <p className="text-[10px] text-[#166534] dark:text-[#86EFAC] mt-1.5">
            Open in Android Studio and click <strong>Build &gt; Build APK(s)</strong> to generate your APK in seconds!
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-3 my-3 text-xs text-[#4B5162] dark:text-[#CBD5E1]">
          <div>
            <div className="font-bold text-[#141517] dark:text-[#F1F2F6] mb-1">
              Step 1: Install & Run Bubblewrap (Google's Official CLI)
            </div>
            <p className="mb-2 leading-relaxed">
              Open your terminal or command prompt and run the following commands to generate your Google Play Android App Bundle (.aab):
            </p>

            <div className="relative p-2.5 rounded-lg bg-[#111215] text-[#E2E8F0] font-mono text-[11px] leading-relaxed">
              <pre className="whitespace-pre-wrap">{bubblewrapCommand}</pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Copy commands"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <div className="font-bold text-[#141517] dark:text-[#F1F2F6] mb-1">
              Step 2: Digital Asset Links (No Browser URL Bar)
            </div>
            <p className="leading-relaxed">
              A pre-configured template is located in <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">public/.well-known/assetlinks.json</code>. Update the SHA-256 fingerprint with your Play Store upload key to make the app run in 100% full-screen without a browser bar.
            </p>
          </div>

          <div>
            <div className="font-bold text-[#141517] dark:text-[#F1F2F6] mb-1">
              Step 3: Upload to Google Play Console
            </div>
            <p className="leading-relaxed">
              Upload the generated <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">app-release-bundle.aab</code> file into your Google Play Console under <em>Production</em> or <em>Internal Testing</em>.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#EFF6FF] dark:bg-[#1E293B] border border-[#BFDBFE] dark:border-[#334155]">
            <div className="flex items-center gap-1.5 font-bold text-[#1E40AF] dark:text-[#93C5FD] mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Small Size & Instant Performance</span>
            </div>
            <p className="text-[11px] text-[#1E3A8A] dark:text-[#BFDBFE] leading-tight">
              Because this app uses optimized zero-dependency vector assets, your downloaded Android package size will be tiny (under ~2 MB to 3 MB), ensuring near-instant downloads for players.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t border-[#F0F0EE] dark:border-[#262830]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#111215] dark:bg-[#F1F2F6] text-white dark:text-[#111215] font-semibold text-xs shadow-xs active:scale-95 transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
