import React, { useState } from "react";
import Logo from "../assets/Logo.png";
import Client from "./Client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Copy, LogOut, Check, Code2 } from "lucide-react";
import { SidebarProps } from '../types';

const Sidebar = React.memo<SidebarProps>(({ clients, roomId }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<boolean>(false);

  const copyRoomId = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied.");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Unable to copy Room ID");
    }
  };

  const handleLeaveRoom = (): void => {
    navigate("/");
  };

  return (
    <div className="text-white h-full flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-900/80 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Code2 className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            CodeSpace
          </h2>
          <p className="text-xs text-gray-400 mt-1">Real-time collaboration</p>
        </div>
      </div>

      {/* Collaborators Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300">Collaborators</h3>
            <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400">
              {clients.length} online
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-2 min-h-0">
          {clients.map((client) => (
            <div key={client.socketId} className="transform hover:scale-105 transition-transform duration-200">
              <Client socketId={client.socketId} username={client.username} />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-white/10 space-y-3 flex-shrink-0">
        <button
          onClick={copyRoomId}
          className="w-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-purple-500/30 hover:border-purple-400/50 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Copy Room ID
            </>
          )}
        </button>

        <button
          onClick={handleLeaveRoom}
          className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-400/50 text-red-300 hover:text-red-200 px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Leave Room
        </button>
      </div>

      <div className="px-4 pb-4 flex-shrink-0">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Room ID</p>
          <code className="text-xs bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-300 font-mono">
            {roomId?.slice(0, 12)}
          </code>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;