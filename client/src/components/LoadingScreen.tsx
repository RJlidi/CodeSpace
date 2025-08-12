import React from "react";
import { Code2 } from "lucide-react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
          <Code2 className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div className="flex items-center justify-center gap-2 text-white">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
        </div>
        <p className="text-gray-300 mt-4">Connecting to room...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;