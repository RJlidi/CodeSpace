import React from "react";
import { LANGUAGE_VERSIONS } from "../constants";
import { Code, ChevronDown } from "lucide-react";
import { LanguageSelectorProps } from '../types';

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = React.memo<LanguageSelectorProps>(({ language, onLanguageChange }) => {
  return (
    <div className="mt-4 flex justify-start pl-6">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-3 rounded-xl shadow-lg max-w-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300 whitespace-nowrap">
            <Code className="w-3 h-3 text-purple-400" />
            Language:
          </div>
          <div className="relative flex-1 min-w-0">
            <select
              value={language}
              id="languages"
              onChange={(e) => onLanguageChange(e.target.value)}
              className="block w-full p-2 bg-white/5 text-gray-100 border border-white/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 hover:border-white/30 transition-all duration-300 appearance-none cursor-pointer pr-8 text-sm"
            >
              {languages.map(([language, version]) => (
                <option key={language} value={language} className="bg-slate-800 text-gray-100">
                  {language} ({version})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
});

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector;