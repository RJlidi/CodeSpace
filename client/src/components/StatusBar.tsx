import React from "react";
import { Menu, X, Code2, Users, Wifi, WifiOff } from "lucide-react";
import { StatusBarProps } from "../types";

const StatusBar: React.FC<StatusBarProps> = ({
  showSidebar,
  onToggleSidebar,
  roomId,
  clientCount,
  isConnected,
  reconnectAttempts
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 h-12 bg-black/20 backdrop-blur-sm border-b border-white/10 z-50 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-white hover:text-purple-400 transition-colors cursor-pointer p-2 hover:bg-white/10 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSidebar();
          }}
        >
          {showSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-white">
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-medium">Room:</span>
            <code className="text-xs bg-white/10 px-2 py-1 rounded text-purple-300">
              {roomId?.slice(0, 8)}
            </code>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Users className="w-4 h-4" />
            <span className="text-sm">{clientCount}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isConnected ? (
          <div className="flex items-center gap-2 text-green-400">
            <Wifi className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Connected</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        ) : reconnectAttempts > 0 ? (
          <div className="flex items-center gap-2 text-yellow-400">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span className="text-xs hidden sm:inline">Reconnecting ({reconnectAttempts}/10)</span>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-400">
            <WifiOff className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Disconnected</span>
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;