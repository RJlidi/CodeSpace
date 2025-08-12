import React, { useState } from "react";
import { Code2, Users, Sparkles, ArrowRight, Copy, Check } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ErrorState } from "../types";

const HomePage: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<ErrorState>({ username: false, roomId: false });
  const [copied, setCopied] = useState<boolean>(false);
  const navigate = useNavigate();

  const generateRoomId = () => {
    setRoomId(uuidv4());
    toast.success("Room ID generated");
    navigator.clipboard.writeText(uuidv4());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinRoom = (e?: React.FormEvent): void => {
    e?.preventDefault();
    const newError = {
      username: username.trim().length === 0,
      roomId: roomId.trim().length === 0,
    };
    if (!username || !roomId) {
      toast.error("Please enter all the fields.");
      setError(newError);
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: { username },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      joinRoom();
    }
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Join <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">CodeSpace</span>
            </h1>
            <p className="text-gray-300 text-sm">Collaborate in real-time with your team</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter your username"
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white/10 ${error.username
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-white/20 hover:border-white/30 focus:ring-purple-500/50'
                    }`}
                />
                {error.username && (
                  <p className="text-red-400 text-xs mt-1 animate-pulse">Username cannot be empty!</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Room ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter room ID"
                  className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white/10 ${error.roomId
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-white/20 hover:border-white/30 focus:ring-purple-500/50'
                    }`}
                />
                {roomId && (
                  <button
                    type="button"
                    onClick={copyRoomId}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                    )}
                  </button>
                )}
                {error.roomId && (
                  <p className="text-red-400 text-xs mt-1 animate-pulse">Room ID cannot be empty!</p>
                )}
              </div>
            </div>

            <button
              onClick={joinRoom}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Join Room</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          <button
            type="button"
            onClick={generateRoomId}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Create New Room
          </button>

          {copied && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
              <p className="text-green-400 text-sm text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Room ID copied to clipboard!
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Secure • Real-time • Collaborative
        </p>
      </div>
    </div>
  );
};

export default HomePage;