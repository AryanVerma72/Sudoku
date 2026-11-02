import React, { useState } from 'react';
import { X, Settings, Vibrate, Check, HelpCircle, Download, ShieldCheck } from 'lucide-react';
import { PlayerPreferences } from '../lib/storage';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface SettingsModalProps {
  preferences: PlayerPreferences;
  onUpdatePreferences: (prefs: Partial<PlayerPreferences>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  preferences,
  onUpdatePreferences,
  onClose,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const { isInstallable, isInstalled, install } = usePWAInstall();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#1A1B1F] border border-[#E5E5E2] dark:border-[#2A2C33] p-5 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F0EE] dark:border-[#262830]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#111215] dark:text-[#F1F2F6]" />
            <h3 className="text-base font-bold text-[#141517] dark:text-[#F1F2F6]">
              Settings & Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C92A4] hover:text-[#141517] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preferences Switches */}
        <div className="space-y-3.5 my-4">
          {/* Relaxed Mode */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#141517] dark:text-[#F1F2F6]">
                Relaxed Mode
              </div>
              <div className="text-xs text-[#8C92A4] dark:text-[#646A7E]">
                Unlimited mistakes without Game Over
              </div>
            </div>
            <button
              onClick={() => onUpdatePreferences({ relaxedMode: !preferences.relaxedMode })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                preferences.relaxedMode
                  ? 'bg-[#1E3A8A] dark:bg-[#2563EB]'
                  : 'bg-[#E5E5E2] dark:bg-[#2A2C33]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  preferences.relaxedMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#141517] dark:text-[#F1F2F6]">
                Touch Haptics
              </div>
              <div className="text-xs text-[#8C92A4] dark:text-[#646A7E]">
                Android device vibration on taps
              </div>
            </div>
            <button
              onClick={() => onUpdatePreferences({ hapticsEnabled: !preferences.hapticsEnabled })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                preferences.hapticsEnabled
                  ? 'bg-[#1E3A8A] dark:bg-[#2563EB]'
                  : 'bg-[#E5E5E2] dark:bg-[#2A2C33]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  preferences.hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto Clear Notes */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#141517] dark:text-[#F1F2F6]">
                Auto-Clear Notes
              </div>
              <div className="text-xs text-[#8C92A4] dark:text-[#646A7E]">
                Remove candidate notes when digit placed
              </div>
            </div>
            <button
              onClick={() => onUpdatePreferences({ autoClearNotes: !preferences.autoClearNotes })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                preferences.autoClearNotes
                  ? 'bg-[#1E3A8A] dark:bg-[#2563EB]'
                  : 'bg-[#E5E5E2] dark:bg-[#2A2C33]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  preferences.autoClearNotes ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Highlight Matching Numbers */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#141517] dark:text-[#F1F2F6]">
                Highlight Identical Numbers
              </div>
              <div className="text-xs text-[#8C92A4] dark:text-[#646A7E]">
                Highlight all occurrences of active digit
              </div>
            </div>
            <button
              onClick={() => onUpdatePreferences({ highlightMatching: !preferences.highlightMatching })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                preferences.highlightMatching
                  ? 'bg-[#1E3A8A] dark:bg-[#2563EB]'
                  : 'bg-[#E5E5E2] dark:bg-[#2A2C33]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  preferences.highlightMatching ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Highlight Crosshairs */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#141517] dark:text-[#F1F2F6]">
                Highlight Crosshairs
              </div>
              <div className="text-xs text-[#8C92A4] dark:text-[#646A7E]">
                Subtle highlight on same row, column & box
              </div>
            </div>
            <button
              onClick={() =>
                onUpdatePreferences({ highlightCrosshairs: !preferences.highlightCrosshairs })
              }
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                preferences.highlightCrosshairs
                  ? 'bg-[#1E3A8A] dark:bg-[#2563EB]'
                  : 'bg-[#E5E5E2] dark:bg-[#2A2C33]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  preferences.highlightCrosshairs ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* PWA Install Button for Android */}
        {isInstallable && !isInstalled && (
          <div className="my-4 p-3 rounded-xl bg-[#F0FDF4] dark:bg-[#142E1B] border border-[#BBF7D0] dark:border-[#1E4D29]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#15803D] dark:text-[#4ADE80]">
                  Install ZenSudoku
                </div>
                <div className="text-[11px] text-[#166534] dark:text-[#86EFAC]">
                  Add to Android home screen for offline play
                </div>
              </div>
              <button
                onClick={install}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15803D] text-white font-medium text-xs shadow-xs active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                Install
              </button>
            </div>
          </div>
        )}

        {/* How to Play Accordion */}
        <div className="border-t border-[#F0F0EE] dark:border-[#262830] pt-3">
          <button
            onClick={() => setShowHowToPlay(!showHowToPlay)}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-[#141517] dark:text-[#F1F2F6]"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#8C92A4]" />
              Rules & Strategy Guide
            </span>
            <span>{showHowToPlay ? '▲' : '▼'}</span>
          </button>

          {showHowToPlay && (
            <div className="mt-2 text-xs text-[#4B5162] dark:text-[#CBD5E1] space-y-2 leading-relaxed bg-[#F8F8F6] dark:bg-[#121316] p-3 rounded-xl">
              <p>
                <strong>The Goal:</strong> Fill each 9×9 grid so that every row, column, and 3×3 box contains digits 1 through 9 without duplicates.
              </p>
              <p>
                <strong>Dual Input:</strong>
                <br />• <em>Cell-First:</em> Select any grid square, then tap a number on the keypad.
                <br />• <em>Digit-First:</em> Select a digit on the keypad, then rapidly tap squares to fill that digit.
              </p>
              <p>
                <strong>Pencil Notes:</strong> Tap the Notes button to pencil in possible candidates. When you place a digit, pencil notes in that row, column, and box are automatically cleaned up!
              </p>
              <p>
                <strong>100% Free & Ad-Free:</strong> ZenSudoku contains zero advertisements, zero tracking, and runs completely offline on your device.
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t border-[#F0F0EE] dark:border-[#262830]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#111215] dark:bg-[#F1F2F6] text-white dark:text-[#111215] font-semibold text-xs shadow-xs active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
